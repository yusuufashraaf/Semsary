import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCsAgentUIStore,
  useCsAgentNotifications,
} from "@store/cs-agent/csAgentStore";
import { useAppSelector } from "@store/hook";
import { cn } from "@utils/classNames";
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";

export const CsAgentHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useCsAgentUIStore();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useCsAgentNotifications();
  const { user } = useAppSelector((state) => state.Authslice);

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/cs-agent" || path === "/cs-agent/dashboard")
      return "Dashboard";
    if (path === "/cs-agent/properties") return "Property Task Queue";
    if (path.startsWith("/cs-agent/properties/"))
      return "Property Verification";
    if (path === "/cs-agent/verifications") return "Verification History";
    if (path === "/cs-agent/performance") return "Performance Analytics";
    if (path === "/cs-agent/profile") return "Profile Settings";
    return "CS Agent Portal";
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search for:", searchQuery);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
      <div className="px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Page Title & Breadcrumb */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome back, {user?.first_name || "Agent"}
              </p>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, assignments..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                title="Notifications"
              >
                {unreadNotificationsCount > 0 ? (
                  <>
                    <BellAlertIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadNotificationsCount}
                    </span>
                  </>
                ) : (
                  <BellIcon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={cn(
                            "border-b border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700",
                            !notif.read && "bg-teal-50/50 dark:bg-teal-900/20"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {notif.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {notif.timestamp &&
                                  new Date(
                                    notif.timestamp
                                  ).toLocaleTimeString()}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="ml-2 h-2 w-2 rounded-full bg-teal-500" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                      >
                        Mark all as read
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => navigate("/cs-agent/profile")}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative ml-3">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.first_name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 lg:block">
                  {user?.first_name} {user?.last_name}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/cs-agent/profile")}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
