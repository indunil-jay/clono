import { UserButton } from "@/app/_components/features/auth/user-button";
import { MobileSidebar } from "@/app/_components/features/dashboard/mobile-sidebar";

export const HeaderNavbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between ">
      <div className="hidden flex-col  lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your projects and task here{" "}
        </p>
      </div>

      {/* mobile view */}
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
