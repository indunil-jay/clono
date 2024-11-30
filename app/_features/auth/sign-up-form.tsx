"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/app/_components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";

import { useRegister } from "@/app/_features/auth/hooks/use-register";
import { signUpFormSchema } from "@/validation-schemas/auth/sign-up.schema";
import { Button } from "@/app/_components/ui/button";

export const SignUpForm = () => {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutate } = useRegister();

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    mutate({ json: values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="alex martin"
                  disabled={false}
                  {...field}
                />
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
              <FormLabel>Enter your email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="alexmartin@gmail.com"
                  disabled={false}
                  {...field}
                />
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
              <FormLabel>Enter Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={false}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={false} size={"lg"}>
          Register
        </Button>
      </form>
    </Form>
  );
};
