"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Bell,
  Settings,
  PieChart,
  BarChart3,
  Activity,
  Calendar,
  Menu,
  X,
  Home,
  Inbox,
  Search,
} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const data = localStorage.getItem("supabase.auth.token");
      const parsedData = data ? JSON.parse(data) :null
      const session = parsedData?.access_token || null;
      const userData = parsedData?.user || null;
      setUser(userData)

      if(!session){
        router.push("/auth/login");
      }
      else {
        setLoading(false)
      }
    }
    getUser();
  }, [router]);

  async function handleLogout() {
    const response = axios.post('/api/auth/logout', {
      headers: {
        'content-type': 'application/json'
      }
    })

    if ((await response).status === 200) {
      localStorage.removeItem("supabase.auth.token");
      router.push("/auth/login");
    }
  }

  const stats = [
    {
      name: "Projects",
      value: "12",
      change: "+3",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Active Tasks",
      value: "34",
      change: "+7",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Completed",
      value: "28",
      change: "+12",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Pending",
      value: "6",
      change: "-2",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const recentActivities = [
    { name: "Project Alpha", action: "Updated", time: "2 hours ago" },
    { name: "Team Meeting", action: "Scheduled", time: "Yesterday" },
    { name: "Dashboard UI", action: "Completed", time: "2 days ago" },
    { name: "New Feature", action: "Started", time: "3 days ago" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black bg-opacity-30 backdrop-blur-md">
        <button onClick={() => setMenuOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="relative">
          <Bell size={24} />
          {notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notifications}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl font-bold">Menu</div>
            <button onClick={() => setMenuOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-1 mb-8">
            <button
              onClick={() => {
                setActivePage("overview");
                setMenuOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "overview"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Home size={20} className="mr-3" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => {
                setActivePage("analytics");
                setMenuOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "analytics"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <BarChart3 size={20} className="mr-3" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => {
                setActivePage("activity");
                setMenuOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "activity"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Activity size={20} className="mr-3" />
              <span>Activity</span>
            </button>
            <button
              onClick={() => {
                setActivePage("calendar");
                setMenuOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "calendar"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Calendar size={20} className="mr-3" />
              <span>Calendar</span>
            </button>
          </div>

          <div className="mt-auto">
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <User size={20} />
                </div>
                <div>
                  {/* @ts-ignore */}
                  {user?.email && (
                    <div className="font-medium truncate max-w-xs">
                      {/* @ts-ignore */}

                      {user.email}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">Pro Account</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 rounded-lg"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-black bg-opacity-30 backdrop-blur-md p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <PieChart size={20} />
            </div>
            <div className="text-xl font-bold">Dashboard</div>
          </div>

          <div className="flex flex-col space-y-1 mb-8">
            <button
              onClick={() => setActivePage("overview")}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "overview"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Home size={20} className="mr-3" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActivePage("analytics")}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "analytics"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <BarChart3 size={20} className="mr-3" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActivePage("activity")}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "activity"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Activity size={20} className="mr-3" />
              <span>Activity</span>
            </button>
            <button
              onClick={() => setActivePage("calendar")}
              className={`flex items-center p-3 rounded-lg ${
                activePage === "calendar"
                  ? "bg-indigo-600"
                  : "hover:bg-gray-800"
              }`}
            >
              <Calendar size={20} className="mr-3" />
              <span>Calendar</span>
            </button>
          </div>

          <div className="mt-auto">
            <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <User size={20} />
                </div>
                <div>
                  {/* @ts-ignore */}
                  {user?.email && (
                    <div className="font-medium truncate max-w-xs">
                      {/* @ts-ignore */}
                      {user.email}
                    </div>
                  )}
                  <div className="text-sm text-gray-400">Pro Account</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 rounded-lg"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 bg-opacity-40 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Inbox size={20} />
                <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  2
                </div>
              </button>
              <button className="relative">
                <Bell size={20} />
                {notifications > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications}
                  </div>
                )}
              </button>
              <button>
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {/* @ts-ignore */}
                Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
                !
              </h2>
              <p className="text-gray-400">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-black bg-opacity-30 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-400">{stat.name}</h3>
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      {index === 0 ? (
                        <PieChart size={18} />
                      ) : index === 1 ? (
                        <Activity size={18} />
                      ) : index === 2 ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div
                    className={`text-sm ${
                      stat.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {stat.change} from last week
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 bg-opacity-40 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                        {activity.action === "Updated" ? (
                          <RefreshCw size={18} className="text-blue-400" />
                        ) : activity.action === "Scheduled" ? (
                          <Calendar size={18} className="text-purple-400" />
                        ) : activity.action === "Completed" ? (
                          <CheckCircle size={18} className="text-green-400" />
                        ) : (
                          <Play size={18} className="text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-gray-400">
                          {activity.action}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  View All Activities
                </button>
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4">Projects Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800 bg-opacity-40 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Project Alpha</h4>
                    <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    Frontend Development
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>65% Complete</span>
                    <span>Deadline: 2 weeks</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 bg-opacity-40 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Project Beta</h4>
                    <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    Backend API Development
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>100% Complete</span>
                    <span>Finished: 3 days ago</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  View All Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* @ts-ignore */
function CheckCircle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

/* @ts-ignore */
function RefreshCw(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

 /* @ts-ignore */
function Play(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

/* @ts-ignore */
function Clock(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
