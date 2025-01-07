import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetUsersQueryKey,
  useCreateUser,
} from "./http/generated/users/users";

const createUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;

export function CreateUser() {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const { mutateAsync: createUser } = useCreateUser();

  const onSubmit = async (data: CreateUserSchema) => {
    await createUser({ data: { name: data.name } });
    await queryClient.invalidateQueries({
      queryKey: getGetUsersQueryKey(),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Create User</h1>
      <div>
        <input {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <button type="submit">Create</button>
    </form>
  );
}
