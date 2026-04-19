"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, ClipboardList, CreditCard,
  HelpCircle, Menu, X, Bell, Search, ChevronRight, LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
  { icon: FolderOpen,      label: "Projects",     href: "/project" },
  { icon: ClipboardList,   label: "Surveys",      href: "/surveys" },
  { icon: CreditCard,      label: "Subscription", href: "/subscription" },
  { icon: HelpCircle,      label: "Help",         href: "/help" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Space Satisfaction Survey completed", time: "2h ago", unread: true },
  { id: 2, text: "John K. counted Conference Room A",   time: "4h ago", unread: true },
  { id: 3, text: "New floor added: 2nd Floor",          time: "Yesterday", unread: false },
];

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* ── Mobile Drawer Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-border transition-all duration-300",
          "w-64 lg:w-64 xl:w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border shrink-0">
          <Logo size="sm" showText />
          <button
            className="ml-auto lg:hidden text-text-muted hover:text-text"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-body transition-all group",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                <Icon size={18} className={active ? "text-white" : "text-text-muted group-hover:text-text"} />
                <span>{label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-white/60" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer group"
            onClick={() => router.push("/settings")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              {mockUser.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text truncate">{mockUser.name}</p>
              <p className="text-xs text-text-muted truncate">{mockUser.role}</p>
            </div>
            <LogOut size={15} className="text-text-muted group-hover:text-text shrink-0 transition-colors" />
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Topbar ── */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-text-muted hover:text-text"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1 text-sm text-text-muted font-body">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-border" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-text transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-text font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Global search */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-primary/40 bg-surface-2 px-3 py-1.5 overflow-hidden"
                  >
                    <Search size={14} className="text-text-muted shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => { setSearchOpen(false); setSearchQuery(""); }}
                      placeholder="Search…"
                      className="text-sm text-text bg-transparent outline-none font-body w-full placeholder:text-text-muted/60"
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSearchOpen(true)}
                    className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
                  >
                    <Search size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden"
                    onClick={() => setNotifOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-text">Notifications</p>
                      <span className="text-xs text-text-muted">{unreadCount} unread</span>
                    </div>
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div key={n.id} className={cn("flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-2 transition-colors cursor-pointer", n.unread && "bg-primary/3")}>
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.unread ? "bg-accent" : "bg-border")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text font-body leading-snug">{n.text}</p>
                          <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <button
              onClick={() => router.push("/settings")}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
            >
              {mockUser.name.split(" ").map((n) => n[0]).join("")}
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
