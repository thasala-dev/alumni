"use client";

import { useState, useRef } from "react";

const mockAlumni = [
  {
    id: 1,
    name: "เภสัชกร สมชาย ใจดี",
    major: "เภสัชศาสตร์",
    year: 2018,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "เภสัชกร สมหญิง เก่งมาก",
    major: "เภสัชศาสตร์",
    year: 2017,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "เภสัชกร อนันต์ รักเรียน",
    major: "เภสัชศาสตร์",
    year: 2019,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "เภสัชกร ปิยะพร สายใจ",
    major: "เภสัชศาสตร์",
    year: 2016,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "เภสัชกร ธีรศักดิ์ ทองดี",
    major: "เภสัชศาสตร์",
    year: 2020,
    avatar: "/placeholder-user.jpg",
  },
];

export default function AlumniSearchBox() {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results =
    query.trim() === ""
      ? []
      : mockAlumni.filter(
          (a) =>
            a.name.includes(query) ||
            a.major.includes(query) ||
            String(a.year).includes(query)
        );

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShow(true);
        }}
        // onFocus={() => setShow(true)}
        // onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder="ค้นหาศิษย์เก่า..."
        className="rounded-full px-4 py-1.5 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B214] w-full"
        aria-label="ค้นหาศิษย์เก่า"
        autoComplete="off"
      />
      {show && (
        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
          {results.length > 0 ? (
            results.map((alumni) => (
              <a
                key={alumni.id}
                href={`/dashboard/alumni?id=${alumni.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 transition text-gray-800 dark:text-gray-100"
              >
                <img
                  src={alumni.avatar}
                  alt={alumni.name}
                  className="h-8 w-8 rounded-full object-cover border border-[#81B214]"
                />
                <div>
                  <div className="font-medium">{alumni.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {alumni.major} • {alumni.year}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-400 text-sm select-none">
              ไม่พบศิษย์เก่าตามคำค้นหา
            </div>
          )}
        </div>
      )}
    </div>
  );
}
