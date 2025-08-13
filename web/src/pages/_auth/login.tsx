import { useLoginUser } from "@/api/generated/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { sleep } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { setUser } = useAuth();

  const { mutateAsync: loginUser } = useLoginUser();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await loginUser({ data });
    if (!res.accessToken) {
      return toast.info("Invalid credentials");
    }

    setUser(res.user);
    localStorage.setItem("access_token", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));

    toast.success("Welcome");

    await sleep(1);

    navigate({ to: search.redirect || "/", replace: true });
  };

  return (
    <div>
      {search.redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Login</Button>
        </form>
      </Form>
    </div>
  );
}
