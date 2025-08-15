"use client";
import { useState, useRef, useEffect } from "react";

export default function NavbarAccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
  return (
    <div className="flex items-center gap-2 relative" ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2 group focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img
          src="/placeholder-user.jpg"
          alt="User"
          className="h-9 w-9 rounded-full border-2 border-blue-200 dark:border-blue-700 object-cover group-hover:ring-2 group-hover:ring-blue-400 transition"
        />
        <span className="hidden md:inline text-gray-800 dark:text-gray-100 font-semibold text-sm">
          บัญชีของฉัน
        </span>
        <svg
          className="ml-1 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
          <a
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 transition text-sm"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            การตั้งค่าบัญชี
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 transition text-sm"
          >
            <svg
              className="h-5 w-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5z" />
            </svg>
            หน้าหลัก
          </a>
          <a
            href="/auth/login"
            className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 transition text-sm"
          >
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path d="M3 12h4" />
            </svg>
            ออกจากระบบ
          </a>
        </div>
      )}
    </div>
  );
}
