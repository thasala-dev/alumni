"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, formatThaiDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactDatePicker from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker-dark.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: string;
  min?: string;
  max?: string;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({
  date,
  min,
  max,
  onDateChange,
  className,
}: DatePickerProps) {
  // Convert min/max strings to Date objects
  const minDate = min ? new Date(min) : undefined;
  const maxDate = max ? new Date(max) : undefined;
  const selectedDate = date ? new Date(date) : null;

  // Custom render for header to show Buddhist Era with dark mode support
  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const currentYear = date.getFullYear();
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // Generate year options with Buddhist Era
    const years = [];
    const startYear = currentYear - 50;
    const endYear = currentYear + 10;
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return (
      <div className="flex items-center justify-between px-2 py-1 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
        >
          ‹
        </button>

        <div className="flex items-center space-x-2">
          <select
            value={date.getMonth()}
            onChange={({ target: { value } }) => changeMonth(parseInt(value))}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {months.map((month, index) => (
              <option
                key={month}
                value={index}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {month}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {year + 543}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full", !date && "text-muted-foreground", className)}
        >
          {date ? formatThaiDate(date) : <span>เลือกวันที่</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-white dark:bg-gray-800">
          <ReactDatePicker
            selected={selectedDate}
            onChange={(date) => onDateChange(date ?? undefined)}
            minDate={minDate}
            maxDate={maxDate}
            locale={th}
            inline
            dateFormat="dd/MM/yyyy"
            renderCustomHeader={renderCustomHeader}
            fixedHeight
            showPopperArrow={false}
            calendarClassName="bg-white dark:bg-gray-800 border-0 text-gray-900 dark:text-gray-100"
            dayClassName={(date) =>
              "text-sm hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full text-gray-900 dark:text-gray-100 hover:text-blue-900 dark:hover:text-blue-100"
            }
            weekDayClassName={() =>
              "text-gray-700 dark:text-gray-300 text-xs font-medium"
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
