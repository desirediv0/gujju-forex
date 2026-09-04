import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/admin/SidebarNav";
import { ADMIN_COOKIE, getAdminUsername, verifyAdminToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const authed = await verifyAdminToken(token);

  if (!authed) {
    redirect("/admin/login");
  }

  const username = await getAdminUsername(token);
  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 z-30 border-b border-white/8 bg-ink-2/80 backdrop-blur-xl lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:flex lg:h-full lg:flex-col lg:items-stretch lg:justify-start lg:px-6 lg:py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/logo-sm.png"
              alt="Gujju Forex"
              width={48}
              height={42}
              className="h-8 w-auto"
            />
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-white">
                Gujju<span className="text-gold-300">Forex</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                Admin panel
              </p>
            </div>
          </Link>
          <SidebarNav username={username} />
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
