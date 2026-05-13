import AppHeader from "@/components/AppHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
