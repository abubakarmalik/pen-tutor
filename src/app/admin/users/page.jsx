"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Eye,
  UsersIcon,
  GraduationCap,
  UserCheck,
  Shield,
  MapPin,
  Calendar,
  Mail,
  User,
  Filter,
} from "lucide-react"
import api from "@/lib/api"

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin-portal/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setUsers(response.data.data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const usersCount = users.length

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "#313D6A"
      case "teacher":
        return "#F5BB07"
      case "student":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "teacher":
        return <GraduationCap className="h-4 w-4" />
      case "student":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getUserAvatar = (user) => {
    const initials =
      `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`.toUpperCase() ||
      user.username?.charAt(0).toUpperCase() ||
      "U"
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
        style={{ backgroundColor: getRoleBadgeColor(user.role) }}
      >
        {initials}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#313D6A] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UsersIcon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Users Management</h1>
                <p className="text-blue-100 mt-1 text-sm">Manage and monitor all platform users</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none w-full sm:w-auto cursor-pointer"
                >
                  <option value="all" className="text-gray-900">
                    All Roles
                  </option>
                  <option value="admin" className="text-gray-900">
                    Admin
                  </option>
                  <option value="teacher" className="text-gray-900">
                    Teacher
                  </option>
                  <option value="student" className="text-gray-900">
                    Student
                  </option>
                  <option value="user" className="text-gray-900">
                    User
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#313D6A] mb-1">{usersCount}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                </div>
                <div className="bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] p-2 sm:p-3 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 bg-gradient-to-r from-[#313D6A]/10 to-[#4A5A8A]/10 h-2 rounded-full">
                <div className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] h-2 rounded-full w-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#F5BB07] mb-1">
                    {users.filter((u) => u.role === "teacher").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Teachers</p>
                </div>
                <div className="bg-gradient-to-br from-[#F5BB07] to-[#E6A800] p-2 sm:p-3 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 bg-[#F5BB07]/10 h-2 rounded-full">
                <div
                  className="bg-gradient-to-r from-[#F5BB07] to-[#E6A800] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${usersCount ? (users.filter((u) => u.role === "teacher").length / usersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                    {users.filter((u) => u.role === "student").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Students</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 sm:p-3 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 bg-emerald-100 h-2 rounded-full">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${usersCount ? (users.filter((u) => u.role === "student").length / usersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Admins</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 sm:p-3 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 bg-purple-100 h-2 rounded-full">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${usersCount ? (users.filter((u) => u.role === "admin").length / usersCount) * 100 : 0}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#313D6A] p-2 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">All Users</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-[#313D6A] text-white border-[#313D6A]">
                {filteredUsers.length} Total
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Desktop / Tablet table (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">User</th>
                    <th className="text-left py-4 px-4 font-semibold">Contact</th>
                    <th className="text-left py-4 px-4 font-semibold">Role</th>
                    <th className="text-left py-4 px-4 font-semibold">Location</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Joined</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="py-4 px-4 w-56">
                        <div className="flex items-center gap-3">
                          {getUserAvatar(user)}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.first_name || user.last_name
                                ? `${user.first_name} ${user.last_name}`.trim()
                                : "No Name"}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                              <User className="h-3 w-3" />@{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 w-56">
                        <div className="flex items-center gap-2 text-gray-700 truncate">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className="flex items-center gap-1 text-white font-medium"
                          style={{
                            backgroundColor: getRoleBadgeColor(user.role),
                          }}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate">
                            {user.city && user.country ? `${user.city}, ${user.country}` : "Not specified"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={user.is_verified ? "default" : "secondary"}
                          className={`flex items-center gap-1 ${
                            user.is_verified
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          <UserCheck className="h-3 w-3" />
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-[#313D6A] hover:text-white transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list (smaller screens) */}
            <div className="md:hidden p-4 space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm p-3 flex flex-col gap-2 border border-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      {getUserAvatar(user)}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`.trim()
                            : "No Name"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="text-xs font-medium px-2 py-1" style={{ backgroundColor: getRoleBadgeColor(user.role) }}>
                        {user.role}
                      </Badge>
                      <Button variant="ghost" size="sm" className="hover:bg-[#313D6A] hover:text-white transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600 truncate">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{user.city && user.country ? `${user.city}, ${user.country}` : "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center text-sm text-gray-500">No users found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
