import { clsx, type ClassValue } from "clsx";
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
