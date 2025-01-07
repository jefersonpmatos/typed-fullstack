import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { routes } from "./routes";
import { writeFile } from "fs/promises";
import { resolve } from "path";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
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

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(routes);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port 3333! 🚀");
});

app.ready().then(() => {
  const spec = app.swagger();

  writeFile(
    resolve(__dirname, "swagger.json"),
    JSON.stringify(spec, null, 2),
    "utf-8"
  );
});
