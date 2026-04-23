"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, ClipboardList, Users,
  Bell, Search, Settings, CreditCard, HelpCircle, LogOut, ChevronDown,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Logo } from "@/components/ui/Logo";
import { mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
  { icon: FolderOpen,      label: "Projects",     href: "/project" },
  { icon: ClipboardList,   label: "Surveys",      href: "/surveys" },
  { icon: Users,           label: "Members",      href: "/team" },
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

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;
  const initials = mockUser.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 flex items-center gap-2 px-4 py-0 border-b border-border bg-surface/95 backdrop-blur-sm shrink-0 h-14">
        {/* Logo */}
        <Link href="/dashboard" className="shrink-0 mr-2">
          <Logo size="sm" showText />
        </Link>

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1 hidden md:block" />

        {/* Nav tabs */}
        <nav className="hidden md:flex items-stretch gap-0 flex-1 self-stretch">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-2 px-4 text-sm font-medium font-body transition-all border-b-2",
                  active
                    ? "text-primary border-primary"
                    : "text-text-muted border-transparent hover:text-text hover:border-border"
                )}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Language selector */}
          <LanguageSelector />

          {/* Global search */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-open"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
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
                  key="search-closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSearchOpen(true)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
                >
                  <Search size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
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
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-text">Notifications</p>
                      <span className="text-xs text-text-muted">{unreadCount} unread</span>
                    </div>
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div key={n.id}
                        className={cn("flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-2 transition-colors cursor-pointer", n.unread && "bg-primary/[0.03]")}>
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.unread ? "bg-accent" : "bg-border")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text font-body leading-snug">{n.text}</p>
                          <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-surface-2 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {initials}
              </div>
              <ChevronDown size={13} className={cn("text-text-muted transition-transform", profileOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-surface shadow-xl z-50 overflow-hidden py-1"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text truncate">{mockUser.name}</p>
                      <p className="text-xs text-text-muted truncate">{mockUser.email}</p>
                    </div>
                    {/* Menu items */}
                    {[
                      { icon: Settings,    label: "Settings",     href: "/settings" },
                      { icon: CreditCard,  label: "Subscription", href: "/subscription" },
                      { icon: HelpCircle,  label: "Help",         href: "/help" },
                    ].map(({ icon: Icon, label, href }) => (
                      <button key={href}
                        onClick={() => { router.push(href); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors font-body">
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-border mt-1">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-body">
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
