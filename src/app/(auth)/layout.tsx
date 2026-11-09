export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2545] to-[#13315C]">
      {children}
    </div>
  );
}
