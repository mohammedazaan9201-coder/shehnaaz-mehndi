import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex flex-col sm:flex-row min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-5 sm:p-8 bg-mehndi-50/30">{children}</div>
    </div>
  );
}
