import Link from "next/link";
import { Logo } from "../_components/custom/logo";
import { UserButton } from "../_features/auth/user-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[72px]">
          <Link href={"/"}>
            <Logo />
          </Link>
          <UserButton />
        </nav>
        <div className="fle flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
