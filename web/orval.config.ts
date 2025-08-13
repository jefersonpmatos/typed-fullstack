import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "../server/swagger.json",
    output: {
      clean: true,
      target: "./src/api/generated/api.ts",
      mode: "tags",
      httpClient: "fetch",
      client: "react-query",
      baseUrl: "http://localhost:3333",
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
