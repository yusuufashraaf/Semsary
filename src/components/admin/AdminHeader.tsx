// === PERFORMANCE-OPTIMIZED INTERSECTION OBSERVER IMPLEMENTATION ===
// Replace: src/components/admin/AdminHeader.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@store/admin/adminStore";
import { Button } from "@components/ui/Button";
import { cn } from "@utils/classNames";
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode, notifications } = useUIStore();
  const [isSticky, setIsSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Refs for Intersection Observer
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const unreadCount = notifications.filter((n) => !n.autoClose).length;

  // Intersection Observer setup for 70% scroll detection
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsSticky(!entry.isIntersecting);
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleProfileClick = () => {
    navigate('/profile/home');
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <>
      {/* Invisible Sentinel Element - positioned at 70% of viewport height */}
      <div
        ref={sentinelRef}
        className="absolute pointer-events-none"
        style={{ 
          top: '70vh', 
          height: '1px', 
          width: '1px',
          zIndex: -1
        }}
        aria-hidden="true"
      />

      {/* Main Header - Becomes Sticky */}
      <header 
        className={cn(
          "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-all duration-300",
          isSticky && "fixed top-0 left-0 right-0 z-50 shadow-lg"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Semsary Admin
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              icon={
                darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )
              }
            >
              {darkMode ? "Light" : "Dark"}
            </Button>

            {/* User Profile Menu */}
            <div className="relative profile-menu-container">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Admin User</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Admin User
                      </p>
                    </div>
                    
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      <span>View Profile</span>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    <button
                      onClick={() => {
                        navigate('/logout');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content jump when header becomes fixed */}
      {isSticky && <div style={{ height: '72px' }} />}
    </>
  );
};