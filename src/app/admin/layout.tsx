import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // If not logged in at all, send to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Ensure current user is explicitly in the allowed admins list
  const userEmail = user.emailAddresses[0]?.emailAddress;
  const allowedEmails = [
    "admin@yourdomain.com",
    "lundinuth@gmail.com"
  ];

  if (!allowedEmails.includes(userEmail)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">Your email ({userEmail}) is not authorized for Admin access.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col lg:pl-[260px] overflow-hidden">
        <main className="flex-1 w-full max-w-full p-4 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}