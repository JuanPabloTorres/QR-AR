"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Iconos SVG modernos
  const HomeIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
      />
    </svg>
  );

  const ExperiencesIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Cubo 3D isométrico para representar AR/3D */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 2l6 4v8l-6 4-6-4V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 2v12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m6 6 6 4 6-4"
      />
      {/* Elementos AR - puntos de tracking */}
      <circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="4" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );

  const NewExperienceIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );

  const navItems = [
    { href: "/", label: "Home", exact: true, icon: HomeIcon },
    {
      href: "/experiences",
      label: "Experiences",
      exact: false,
      icon: ExperiencesIcon,
    },
    {
      href: "/experiences/new",
      label: "New Experience",
      exact: true,
      icon: NewExperienceIcon,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo y marca */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    viewBox="0 0 40 40"
                    className="w-full h-full fill-current text-blue-600 dark:text-blue-400"
                  >
                    {/* QR Code squares */}
                    <rect x="2" y="2" width="6" height="6" rx="1" />
                    <rect x="32" y="2" width="6" height="6" rx="1" />
                    <rect x="2" y="32" width="6" height="6" rx="1" />

                    {/* Inner squares */}
                    <rect x="4" y="4" width="2" height="2" />
                    <rect x="34" y="4" width="2" height="2" />
                    <rect x="4" y="34" width="2" height="2" />

                    {/* QR pattern dots */}
                    <circle cx="14" cy="6" r="1" />
                    <circle cx="18" cy="6" r="1" />
                    <circle cx="22" cy="6" r="1" />
                    <circle cx="26" cy="6" r="1" />

                    <circle cx="6" cy="14" r="1" />
                    <circle cx="6" cy="18" r="1" />
                    <circle cx="6" cy="22" r="1" />
                    <circle cx="6" cy="26" r="1" />

                    {/* AR cube in center */}
                    <g transform="translate(16, 16)">
                      <path
                        d="M0,0 L4,-2 L8,0 L8,4 L4,6 L0,4 Z"
                        opacity="0.8"
                      />
                      <path d="M0,0 L0,4 L4,6 L4,2 Z" opacity="0.6" />
                      <path d="M4,2 L8,0 L8,4 L4,6 Z" opacity="0.9" />
                    </g>
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  QR-AR
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                    isActive(item.href, item.exact)
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 dark:text-blue-400 shadow-lg shadow-blue-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/10 dark:hover:bg-white/5"
                  }`}
                >
                  {isActive(item.href, item.exact) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl animate-pulse"></div>
                  )}
                  <IconComponent />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}

            {/* Toggle de tema */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 group"
              aria-expanded={isMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-300"></div>

              {/* Animated hamburger icon */}
              <div className="relative w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 transform ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 transform ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-darker border-t border-white/10">
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 ${
                    isActive(item.href, item.exact)
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 dark:text-blue-400 shadow-lg shadow-blue-500/25"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/10 dark:hover:bg-white/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    animationDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                    animation: isMenuOpen
                      ? "slideIn 0.3s ease-out forwards"
                      : "",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                        isActive(item.href, item.exact)
                          ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg shadow-blue-500/25"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <IconComponent />
                    </div>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}

            {/* Theme toggle on mobile */}
            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Tema
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
