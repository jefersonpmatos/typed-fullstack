import fastify from "fastify";

async function runTests() {
  const app = fastify();
  const res = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: {
      email: "teste@email.com",
      name: "Teste Teste",
      password: "senha123",
    },
  });

  console.log(res.statusCode);
  console.log(res.json());
}

runTests();
