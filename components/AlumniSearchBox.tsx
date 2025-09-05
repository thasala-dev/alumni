"use client";

import { useState, useEffect } from "react";

interface AlumniProfile {
  id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  profile_image_url?: string;
  programname?: string;
  admit_year?: number;
  current_company?: string;
  current_position?: string;
  current_province?: string;
}

export default function AlumniSearchBox() {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("/api/alumniProfile");
        if (response.ok) {
          const data = await response.json();
          setAlumni(data);
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const results =
    query.trim() === "" || loading
      ? []
      : alumni
          .filter((a) => {
            const fullName = `${a.first_name} ${a.last_name}`;
            const searchQuery = query.toLowerCase();

            return (
              fullName.toLowerCase().includes(searchQuery) ||
              (a.nickname && a.nickname.toLowerCase().includes(searchQuery)) ||
              (a.programname &&
                a.programname.toLowerCase().includes(searchQuery)) ||
              (a.current_company &&
                a.current_company.toLowerCase().includes(searchQuery)) ||
              (a.current_position &&
                a.current_position.toLowerCase().includes(searchQuery)) ||
              (a.current_province &&
                a.current_province.toLowerCase().includes(searchQuery)) ||
              (a.admit_year && String(a.admit_year).includes(searchQuery))
            );
          })
          .slice(0, 10); // จำกัดผลลัพธ์ไม่เกิน 10 รายการ

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShow(true);
        }}
        placeholder={loading ? "กำลังโหลด..." : "ค้นหาศิษย์เก่า..."}
        disabled={loading}
        className="rounded-full px-4 py-1.5 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B214] w-full disabled:opacity-50"
      />
      {show && !loading && (
        <div className="absolute left-0 mt-2 w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
          {results.length > 0 ? (
            results.map((alumniProfile) => (
              <a
                key={alumniProfile.id}
                href={`/dashboard/alumni/${alumniProfile.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#81B214]/10 dark:hover:bg-neutral-800 transition text-gray-800 dark:text-gray-100"
                onClick={() => setShow(false)}
              >
                <img
                  src={
                    alumniProfile.profile_image_url || "/placeholder-user.jpg"
                  }
                  alt={`${alumniProfile.first_name} ${alumniProfile.last_name}`}
                  className="h-8 w-8 rounded-full object-cover border border-[#81B214]"
                />
                <div>
                  <div className="font-medium">
                    {alumniProfile.first_name} {alumniProfile.last_name}
                    {alumniProfile.nickname && (
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {" "}
                        ({alumniProfile.nickname})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {alumniProfile.programname &&
                      `${alumniProfile.programname}`}
                    {alumniProfile.admit_year &&
                      ` • รุ่น ${alumniProfile.admit_year}`}
                    {alumniProfile.current_company && (
                      <div className="truncate max-w-64">
                        {alumniProfile.current_position} •{" "}
                        {alumniProfile.current_company}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))
          ) : query.trim() !== "" ? (
            <div className="px-4 py-6 text-center text-gray-400 text-sm select-none">
              ไม่พบศิษย์เก่าตามคำค้นหา "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
