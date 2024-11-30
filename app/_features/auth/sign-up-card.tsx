import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { SignUpForm } from "@/app/_features/auth/sign-up-form";
import { FcGoogle } from "react-icons/fc";

export const SingUpCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-blue-700">Tearms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4">
        <SignUpForm />
      </CardContent>

      <div className="px-7 ">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          className="w-full"
          disabled={false}
          size={"lg"}
          variant={"secondary"}
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button
          className="w-full"
          disabled={false}
          size={"lg"}
          variant={"secondary"}
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7 ">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account ?{" "}
          <Link href={"/sign-in"} className="text-blue-700">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
