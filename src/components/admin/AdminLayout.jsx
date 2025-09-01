"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  CreditCard,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ShieldCheck,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Pending Tutors", href: "/admin/pending-teachers", icon: UserCheck },
  // { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Student Queries", href: "/admin/student-queries", icon: MessageSquare },
]

const AdminLayout = ({ children, studentData = null, apiBaseUrl = "" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    window.location.href = "/login"
  }

  const navItems = navigation.map((n) => ({
    id: n.name.toLowerCase().replace(/\s+/g, "-"),
    label: n.name,
    href: n.href,
    icon: <n.icon className="h-5 w-5 flex-shrink-0" />,
  }))

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#313D6A]/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar
          - mobile: fixed sliding overlay
          - lg+: part of layout and sticky
          - xl: collapsed (icon-only) and expands on hover
      */}
      <aside
        className={`fixed left-0 top-0 z-50
                    w-64 h-full bg-white transform transition-all duration-300 ease-in-out shadow-xl
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:h-screen lg:shadow-none
                    group xl:w-20 xl:group-hover:w-64 overflow-hidden`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5BB07] flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-[#313D6A]" />
                </div>
                {/* Title: hide on xl collapsed (we use opacity for smoothness) */}
                <div className="transition-all duration-200 xl:opacity-0 xl:group-hover:opacity-100 xl:ml-0">
                  <h1 className="text-lg font-bold text-[#313D6A]">Admin Portal</h1>
                  <p className="text-xs text-slate-500">Management System</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-[#313D6A] w-full rounded-lg p-4 mt-6 border border-white/10 shadow">
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  {studentData?.profile_picture ? (
                    <AvatarImage
                      src={`${apiBaseUrl}${studentData.profile_picture}`}
                      alt={studentData?.student_name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="bg-white text-[#313D6A] text-lg font-bold">
                      <ShieldCheck className="h-6 w-6 text-[#313D6A]" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="transition-all duration-200 xl:opacity-0 xl:group-hover:opacity-100">
                  <h3 className="font-semibold text-white text-lg">{studentData?.student_name || "Admin"}</h3>
                  <p className="text-white/80 text-sm font-medium">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nav area */}
          <nav className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-1 mt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                    data-active={isActive}
                    className={`w-full flex items-center rounded-lg py-3 px-3 gap-x-3 transition-colors justify-start cursor-pointer hover:bg-[#313D6A]/10 hover:text-[#313D6A] hover:border-[#313D6A]
                      ${isActive ? "bg-[#313D6A]/20 text-[#313D6A] border border-[#313D6A] font-medium" : "text-slate-700"}
                    `}
                  >
                    {/* icon */}
                    <span className="flex items-center justify-center w-6">{item.icon}</span>

                    {/* label - hide on xl collapsed */}
                    <span className="ml-3 flex-1 text-left transition-all duration-200 xl:opacity-0 xl:group-hover:opacity-100">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-slate-100/10">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-slate-700 bg-red-50 hover:bg-red-100 rounded-lg py-3"
            >
              <LogOut className="h-4 w-4 mr-3 text-red-600" />
              <span className="font-medium text-red-700 transition-all duration-200 xl:opacity-0 xl:group-hover:opacity-100">
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content column */}
      <div className={`flex-1 flex flex-col min-w-0 transition-transform duration-250 ease-in-out ${sidebarOpen ? "mobile-nudge" : ""}`}>
        {/* Header (sticky inside main column). It will nudge on mobile when `mobile-nudge` class is present */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <div className="flex h-20 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center justify-between gap-x-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {navigation.find((item) => item.href === pathname)?.name || "Admin Dashboard"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage your platform efficiently</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-slate-50 border-slate-200 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                  />
                </div>

                <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 rounded-lg">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#F5BB07] rounded-full" />
                </Button>

                <Avatar className="h-10 w-10 border-2 border-[#F5BB07]">
                  <AvatarFallback className="bg-[#313D6A] text-white font-semibold">AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-8 overflow-y-auto">
          <div className="h-full px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export default AdminLayout
