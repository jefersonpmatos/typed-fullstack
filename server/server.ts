import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { prisma } from "./lib/database";
import { routes } from "./routes";

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin:
    process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "TYPED FULL STACK API",
      description: "A typed full-stack API with Fastify, Prisma and SQLite",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Development server",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

// Health check endpoint
app.get("/health", async (req, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", timestamp: new Date().toISOString() };
  } catch (error) {
    reply.status(503);
    return { status: "error", message: "Database connection failed" };
  }
});

app.register(routes);

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Starting graceful shutdown...");

  try {
    await app.close();
    await prisma.$disconnect();
    console.log("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
    console.log(`🚀 HTTP server running on http://${host}:${port}`);
    console.log(`📚 Documentation available at http://${host}:${port}/docs`);

    // Generate swagger.json file
    app.ready().then(() => {
      const spec = app.swagger();
      writeFile(
        resolve(__dirname, "..", "swagger.json"),
        JSON.stringify(spec, null, 2),
        "utf-8"
      ).then(() => {
        console.log("📄 Swagger JSON generated");
      });
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
