import fCookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fjwt, { FastifyJWT, JWT } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { routes } from "./routes";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}
type UserPayload = {
  id: string;
  email: string;
  name: string;
};
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
  }
}

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "TYPED FULL STACK",
      description: "Description",
      version: "0.1.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(import("@scalar/fastify-api-reference"), {
  routePrefix: "/docs",
  configuration: {
    title: "TYPED FULL STACK API",
  },
});

app.register(fjwt, { secret: "supersecretcode-CHANGE_THIS-USE_ENV_FILE" });
app.addHook("preHandler", (req, res, next) => {
  req.jwt = app.jwt;
  return next();
});
app.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }
    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);

app.register(routes);

app.listen({ port: 3333 }).then(() => {
  console.log("✅ HTTP server running on http://localhost:3333");
});

app.ready().then(() => {
  const spec = app.swagger();
  writeFile(
    resolve(__dirname, "swagger.json"),
    JSON.stringify(spec, null, 2),
    "utf-8"
  ).then(() => {
    console.log("✅ Swagger file generated");
    console.log("✅ Documentation available on http://localhost:3333/docs");
  });
});
