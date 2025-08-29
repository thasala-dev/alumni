"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return (
    <div
      className="h-12 w-12 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 dark:bg-gray-800/10 dark:border-gray-700/20 dark:hover:bg-gray-700/20 flex items-center justify-center rounded-full cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={32}
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="#f0b100"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <circle cx={12} cy={32} r={6}>
              <animate
                fill="freeze"
                attributeName="cy"
                dur="0.6s"
                values="32;12"
              ></animate>
            </circle>
            <g>
              <path
                strokeDasharray={2}
                strokeDashoffset={2}
                d="M12 19v1M19 12h1M12 5v-1M5 12h-1"
              >
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin="0.7s"
                  dur="0.2s"
                  values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
                ></animate>
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.7s"
                  dur="0.2s"
                  values="2;0"
                ></animate>
              </path>
              <path
                strokeDasharray={2}
                strokeDashoffset={2}
                d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"
              >
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin="0.9s"
                  dur="0.2s"
                  values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
                ></animate>
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.9s"
                  dur="0.2s"
                  values="2;0"
                ></animate>
              </path>
              <animateTransform
                attributeName="transform"
                dur="30s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              ></animateTransform>
            </g>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={32}
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="#2563eb"
            strokeDasharray={4}
            strokeDashoffset={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
          >
            <path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5">
              <animate
                id="SVGjUNXVaqx"
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.7s;SVGjUNXVaqx.begin+6s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGjUNXVaqx.begin+2s;SVGjUNXVaqx.begin+4s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGjUNXVaqx.begin+1.2s;SVGjUNXVaqx.begin+3.2s;SVGjUNXVaqx.begin+5.2s"
                dur="0.4s"
                values="0;4"
              ></animate>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGjUNXVaqx.begin+1.8s"
                to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"
              ></set>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGjUNXVaqx.begin+3.8s"
                to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"
              ></set>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGjUNXVaqx.begin+5.8s"
                to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"
              ></set>
            </path>
            <path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5">
              <animate
                id="SVGO88gQckN"
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="1.1s;SVGO88gQckN.begin+6s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGO88gQckN.begin+2s;SVGO88gQckN.begin+4s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGO88gQckN.begin+1.2s;SVGO88gQckN.begin+3.2s;SVGO88gQckN.begin+5.2s"
                dur="0.4s"
                values="0;4"
              ></animate>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGO88gQckN.begin+1.8s"
                to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"
              ></set>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGO88gQckN.begin+3.8s"
                to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"
              ></set>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGO88gQckN.begin+5.8s"
                to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"
              ></set>
            </path>
            <path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5">
              <animate
                id="SVGPXuakc7A"
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="2s;SVGPXuakc7A.begin+6s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGPXuakc7A.begin+2s"
                dur="0.4s"
                values="4;0"
              ></animate>
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="SVGPXuakc7A.begin+1.2s;SVGPXuakc7A.begin+3.2s"
                dur="0.4s"
                values="0;4"
              ></animate>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGPXuakc7A.begin+1.8s"
                to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"
              ></set>
              <set
                fill="freeze"
                attributeName="d"
                begin="SVGPXuakc7A.begin+5.8s"
                to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"
              ></set>
            </path>
          </g>
          <path
            fill="none"
            stroke="#2563eb"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            transform="translate(0 22)"
          >
            <animateMotion
              fill="freeze"
              calcMode="linear"
              dur="0.6s"
              path="M0 0v-22"
            ></animateMotion>
          </path>
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
