export default function AsideMenuItems() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-20 self-start h-fit">
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 12l9-9 9 9-1.5 1.5L12 5.5 4.5 13.5z" />
          </svg>
          หน้าหลัก
        </a>
        <a
          href="/dashboard/alumni"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm6 6a4 4 0 0 0-3-3.87" />
          </svg>
          ศิษย์เก่า
        </a>
        <a
          href="/dashboard/map"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          แผนที่
        </a>
        <a
          href="/dashboard/news"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M16 3v4M8 3v4" />
          </svg>
          ข่าวสาร
        </a>
        <a
          href="/dashboard/discussion"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          เว็บบอร์ด
        </a>
        <div className="border-t border-gray-200 dark:border-neutral-800 my-4" />
        <a
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-neutral-800 font-medium transition"
        >
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          การตั้งค่า
        </a>
      </nav>
    </aside>
  );
}
