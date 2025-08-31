// เปรียบเทียบเวลาปัจจุบันแบบ human readable (เช่น เมื่อสักครู่, 5 นาทีที่แล้ว, 3 ชั่วโมงที่แล้ว, 4 วันที่แล้ว)
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "เมื่อสักครู่";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} วันที่แล้ว`;
}
import { clsx, type ClassValue } from "clsx";
import { Bot, Briefcase, Calendar, Folder, Quote } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AdmitYear(year: number) {
  return year + 1 - 2550;
}

// Format date without leading zeros (e.g., 8/5/2568 instead of 08/05/2568)
export function formatThaiDate(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear() + 543;

  // เดือนภาษาไทยแบบย่อ
  const thaiMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  return `${day} ${thaiMonths[month]} ${year}`;
}

export const discussionCategory = [
  {
    id: "1",
    name: "ทั่วไป",
    icon: Folder,
    color: "text-blue-600",
    description: "หัวข้อสนทนาทั่วไปสำหรับศิษย์เก่า",
  },
  {
    id: "2",
    name: "หางาน",
    icon: Briefcase,
    color: "text-emerald-600",
    description: "แชร์ข้อมูลการหางานและโอกาสทางอาชีพ",
  },
  {
    id: "3",
    name: "เทคโนโลยี",
    icon: Bot,
    color: "text-yellow-600",
    description: "อัปเดตเทคโนโลยีและแนวโน้มใหม่ๆ",
  },
  {
    id: "4",
    name: "กิจกรรม",
    icon: Calendar,
    color: "text-pink-600",
    description: "ประชาสัมพันธ์กิจกรรมและงานสังสรรค์",
  },
  {
    id: "5",
    name: "คำถาม-คำตอบ",
    icon: Quote,
    color: "text-rose-600",
    description: "ถาม-ตอบปัญหาต่างๆ",
  },
];
