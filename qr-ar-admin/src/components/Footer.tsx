import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">QR AR Admin</h3>
            <p className="text-gray-400 text-sm mb-2">
              Management platform for augmented reality experiences
            </p>
            <p className="text-gray-400 text-sm">
              Transforming digital interaction through AR
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Admin Panel
                </a>
              </li>
              <li>
                <a
                  href="/experiences"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@qr-ar-admin.com
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} QR AR Admin. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
