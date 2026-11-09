import { Navbar } from "@/components/navbar";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        user={{
          name: user.name,
          username: user.username ?? user.email.split("@")[0],
          points: user.points,
          avatarColor: user.avatarColor,
        }}
      />
      <main className="flex-1 flex flex-col bg-white">{children}</main>
    </div>
  );
}
