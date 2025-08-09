import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { getGetUsersQueryKey, useCreateUser } from "./http/generated/user/user";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;

export function CreateUser() {
  const queryClient = useQueryClient();
  const { mutateAsync: createUser } = useCreateUser();

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserSchema) => {
    console.log(data);
    await createUser({ data }).then(async () => {
      await queryClient.invalidateQueries({
        queryKey: getGetUsersQueryKey(),
      });
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1>Create User</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button>Criar</Button>
      </form>
    </Form>
  );
}
