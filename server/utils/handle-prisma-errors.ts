import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: unknown, reply: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return reply.status(409).send({
          message: "Dados já existem (violação de restrição única)",
          code: error.code,
        });
      case "P2025":
        return reply.status(404).send({
          message: "Registro não encontrado",
          code: error.code,
        });
      case "P2003":
        return reply.status(409).send({
          message: "Violação de chave estrangeira",
          code: error.code,
        });
      default:
        return reply.status(400).send({
          message: "Erro de validação de dados",
          code: error.code,
        });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return reply.status(400).send({
      message: "Dados inválidos fornecidos",
      code: "VALIDATION_ERROR",
    });
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return reply.status(500).send({
      message: "Erro interno do banco de dados",
      code: "DATABASE_ERROR",
    });
  } else {
    return reply.status(500).send({
      message: "Erro interno do servidor",
      code: "INTERNAL_ERROR",
    });
  }
};
