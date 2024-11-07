"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./_components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <AlertTriangle />

      <p className="text-muted-foreground text-sm">Something went wrong</p>

      <Button variant={"secondary"} asChild>
        <Link href={"/"}>Back to home</Link>
      </Button>
    </div>
  );
}
