import fCookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fjwt, { JWT } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import fastify, { FastifyInstance } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { authenticate } from "./middlewares/authenticate";
import { routes } from "./routes";

// Tipagem dos dados do usuário no JWT
type UserPayload = {
  id: string;
  email: string;
  name: string;
};

// Extensões dos módulos Fastify
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    user?: UserPayload;
  }
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
  }
}

// Constantes para segredos e configurações
const JWT_SECRET =
  process.env.JWT_SECRET || "supersecretcode-CHANGE_THIS-USE_ENV_FILE";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "some-secret-key";
const PORT = Number(process.env.PORT) || 3333;
const CORS_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

async function buildServer(): Promise<FastifyInstance> {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Plugins
  await app.register(fastifyCors, { origin: CORS_ORIGINS });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "TYPED FULL STACK",
        description: "Description",
        version: "0.1.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/docs",
    configuration: {
      title: "TYPED FULL STACK API",
    },
  });

  await app.register(fjwt, { secret: JWT_SECRET });

  // Expõe app.jwt no request para facilitar uso
  app.addHook("preHandler", (req, _reply, done) => {
    req.jwt = app.jwt;
    done();
  });

  await app.register(fCookie, { secret: COOKIE_SECRET, hook: "preHandler" });

  // Middleware para autenticação JWT baseado em cookie
  app.decorate("authenticate", authenticate);

  // Registrar rotas
  await app.register(routes);

  return app;
}

async function start() {
  try {
    const app = await buildServer();

    await app.listen({ port: PORT });

    console.log(`✅ HTTP server running on http://localhost:${PORT}`);

    const spec = app.swagger();
    await writeFile(
      resolve(__dirname, "swagger.json"),
      JSON.stringify(spec, null, 2),
      "utf-8"
    );

    console.log("✅ Swagger file generated");
    console.log(`✅ Documentation available on http://localhost:${PORT}/docs`);
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
}

start();
