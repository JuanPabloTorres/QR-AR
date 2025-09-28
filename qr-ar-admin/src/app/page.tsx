import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Background con gradientes animados */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-600/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-600/20 via-purple-600/10 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-16 pb-20 text-center relative overflow-hidden">
          {/* Floating particles around the hero */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/30 rounded-full animate-float-sparkle"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-purple-500/40 rounded-full animate-float-sparkle delay-500"></div>
            <div className="absolute top-40 left-1/4 w-5 h-5 bg-pink-500/30 rounded-full animate-float-sparkle delay-1000"></div>
            <div className="absolute top-24 right-1/3 w-2 h-2 bg-blue-400/50 rounded-full animate-float-sparkle delay-1500"></div>
            <div className="absolute top-36 left-3/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float-sparkle delay-2000"></div>
          </div>

          <div className="animate-text-reveal">
            {/* Interactive 3D Title */}
            <div className="relative group cursor-pointer hover-holographic mb-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="relative inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-1000 group-hover:scale-110 animate-subtle-glow">
                  QR-AR
                  {/* Holographic overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1500 blur-sm animate-gentle-breathe"></div>
                  {/* Floating AR elements around title */}
                  <div className="absolute -top-4 -left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-blue-500 animate-spin-slow"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2l6 3.5v7L12 16l-6-3.5v-7L12 2z"
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                    <svg
                      className="w-4 h-4 text-purple-500 animate-pulse-soft"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2 5h5l-4 3 1.5 5L12 13l-4.5 2L9 10l-4-3h5l2-5z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-400">
                    <svg
                      className="w-5 h-5 text-pink-500 animate-wiggle"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.42 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.42 1z" />
                    </svg>
                  </div>
                </span>
                <br />
              </h1>

              {/* Interactive typing cursor effect */}
              <div className="flex justify-center items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 opacity-40 animate-gentle-breathe"></div>
                <div className="ml-2 text-blue-500 opacity-50 text-2xl animate-cursor-fade">
                  ▌
                </div>
              </div>
            </div>

            {/* Enhanced description with animations */}
            <div className="relative">
              <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-text-reveal hover-float transition-all duration-300 delay-300">
                Advanced platform to create and manage next-generation{" "}
                <span className="relative text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-500 cursor-pointer group">
                  Augmented Reality
                  {/* Interactive underline */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                  {/* Floating AR icon */}
                  <div className="absolute -top-2 -right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-purple-500 animate-bounce-soft"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2l6 3.5v7L12 16l-6-3.5v-7L12 2z"
                        opacity="0.7"
                      />
                    </svg>
                  </div>
                </span>{" "}
                experiences
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Manage Experiences */}
            <Link href="/experiences" className="group animate-slideIn">
              <div className="glass h-full p-8 rounded-3xl transition-all duration-500 group-hover:scale-105 border border-white/20 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400 hover-float">
                      <svg
                        className="w-12 h-12 animate-float"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {/* AR Holographic Cube */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 2l6 3.5v7L12 16l-6-3.5v-7L12 2z"
                          className="animate-pulse-soft"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 2v14M6 5.5l6 3.5 6-3.5M12 9l6-3.5M12 9l-6-3.5"
                          opacity="0.7"
                        />
                        {/* Floating particles around the cube */}
                        <circle
                          cx="4"
                          cy="8"
                          r="1"
                          fill="currentColor"
                          opacity="0.6"
                          className="animate-bounce-soft"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.3;1;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="20"
                          cy="6"
                          r="0.8"
                          fill="currentColor"
                          opacity="0.5"
                          className="animate-float"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.2;0.8;0.2"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="18"
                          cy="14"
                          r="1.2"
                          fill="currentColor"
                          opacity="0.4"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.1;0.6;0.1"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="5"
                          cy="16"
                          r="0.6"
                          fill="currentColor"
                          opacity="0.7"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.4;1;0.4"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* Holographic scan lines */}
                        <path
                          stroke="currentColor"
                          strokeWidth="0.5"
                          d="M6 7h12M6 9h12M6 11h12"
                          opacity="0.3"
                          className="animate-spin-slow"
                        />
                      </svg>
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-soft"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Experience Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      Manage your AR content: immersive videos, realistic 3D
                      models and advanced interactive experiences
                    </p>
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>Explore content</span>
                      <svg
                        className="w-5 h-5 animate-bounce-soft group-hover:animate-pulse-soft"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Create New */}
            <Link
              href="/experiences/new"
              className="group animate-slideIn [animation-delay:200ms]"
            >
              <div className="glass h-full p-8 rounded-3xl transition-all duration-500 group-hover:scale-105 border border-white/20 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300 text-green-600 dark:text-green-400 hover-wiggle">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {/* Magic Wand */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 21l4-4M7 17l-4 4M14 3l1.5 1.5M16.5 4.5L21 9"
                          className="animate-pulse-soft"
                        />
                        {/* Wand handle */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 3l4.5 4.5"
                        />
                        {/* Magic stars and sparkles */}
                        <path
                          stroke="currentColor"
                          strokeWidth="1"
                          d="M5 8l1-2 1 2-2 1 2 1-1 2-1-2 2-1-2-1z"
                          fill="currentColor"
                          opacity="0.8"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 6 9;360 6 9"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </path>
                        <path
                          stroke="currentColor"
                          strokeWidth="0.8"
                          d="M15 12l0.5-1 0.5 1-1 0.5 1 0.5-0.5 1-0.5-1 1-0.5-1-0.5z"
                          fill="currentColor"
                          opacity="0.6"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="360 15.5 12.5;0 15.5 12.5"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        </path>
                        <path
                          stroke="currentColor"
                          strokeWidth="0.6"
                          d="M10 4l0.3-0.7 0.3 0.7-0.7 0.3 0.7 0.3-0.3 0.7-0.3-0.7 0.7-0.3-0.7-0.3z"
                          fill="currentColor"
                          opacity="0.7"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 10.3 4.3;360 10.3 4.3"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </path>
                        {/* Floating magic particles */}
                        <circle
                          cx="8"
                          cy="15"
                          r="1"
                          fill="currentColor"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.2;0.8;0.2"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0 0;0 -3;0 0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="12"
                          cy="18"
                          r="0.8"
                          fill="currentColor"
                          opacity="0.4"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.1;0.7;0.1"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0 0;-2 -4;0 0"
                            dur="2.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle
                          cx="17"
                          cy="16"
                          r="1.2"
                          fill="currentColor"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.3;1;0.3"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="0 0;2 -2;0 0"
                            dur="1.8s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-soft"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Create Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      Create unique AR experiences with our intuitive editor and
                      professional tools
                    </p>
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>Start creation</span>
                      <svg
                        className="w-5 h-5 animate-wiggle group-hover:animate-bounce-soft"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pb-20">
          <div className="glass rounded-3xl p-8 sm:p-12 border border-white/20 max-w-4xl mx-auto animate-fadeIn [animation-delay:400ms]">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              System Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl font-bold text-blue-600 dark:text-purple-400 hover-float">
                    <svg
                      className="w-10 h-10 mx-auto animate-spin-slow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Infinity symbol with AR elements */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5c-1.5 0-2.8-.7-3.6-1.8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.5 12c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c1.5 0 2.8.7 3.6 1.8"
                      />
                      {/* Connecting nodes */}
                      <circle
                        cx="6"
                        cy="12"
                        r="1.5"
                        fill="currentColor"
                        opacity="0.8"
                        className="animate-pulse-soft"
                      />
                      <circle
                        cx="18"
                        cy="12"
                        r="1.5"
                        fill="currentColor"
                        opacity="0.8"
                        className="animate-pulse-soft"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="1"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      {/* Floating experience bubbles */}
                      <circle
                        cx="4"
                        cy="8"
                        r="0.8"
                        fill="currentColor"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.2;0.8;0.2"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;1 -2;0 0"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="20"
                        cy="16"
                        r="1"
                        fill="currentColor"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.1;0.7;0.1"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;-1 -3;0 0"
                          dur="2.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="12"
                        cy="5"
                        r="0.6"
                        fill="currentColor"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.3;1;0.3"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;2 1;0 0"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-soft"></div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Unlimited Experiences
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  No limits on your creativity
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl text-green-600 dark:text-emerald-400 hover-pulse">
                    <svg
                      className="w-10 h-10 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Central device/hub */}
                      <rect
                        x="10"
                        y="10"
                        width="4"
                        height="4"
                        rx="1"
                        strokeWidth="2"
                        fill="currentColor"
                        opacity="0.8"
                      />
                      {/* Connected devices around */}
                      <circle
                        cx="6"
                        cy="6"
                        r="2"
                        strokeWidth="1.5"
                        className="animate-pulse-soft"
                      />
                      <circle
                        cx="18"
                        cy="6"
                        r="2"
                        strokeWidth="1.5"
                        className="animate-pulse-soft"
                      />
                      <circle
                        cx="6"
                        cy="18"
                        r="2"
                        strokeWidth="1.5"
                        className="animate-pulse-soft"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="2"
                        strokeWidth="1.5"
                        className="animate-pulse-soft"
                      />
                      {/* Connection lines with animation */}
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M8 8l2 2M16 8l-2 2M8 16l2-2M16 16l-2 2"
                        className="animate-pulse-soft"
                        opacity="0.7"
                      />
                      {/* Signal waves */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M12 3c3 0 5.5 2.5 5.5 5.5M12 3c-3 0-5.5 2.5-5.5 5.5"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.2;0.8;0.2"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M12 21c3 0 5.5-2.5 5.5-5.5M12 21c-3 0-5.5-2.5-5.5-5.5"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.8;0.2;0.8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </path>
                      {/* Data flow particles */}
                      <circle
                        cx="9"
                        cy="9"
                        r="0.5"
                        fill="currentColor"
                        opacity="0.6"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;6 6;0 0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;1;0.3"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-soft"></div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Fully Responsive
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Optimized for any device
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-4">
                  <div className="text-4xl text-yellow-600 dark:text-orange-400 hover-bounce">
                    <svg
                      className="w-10 h-10 mx-auto animate-bounce-soft"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Rocket body */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 2l2 7-2 1-2-1 2-7z"
                        fill="currentColor"
                        opacity="0.8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 9l4 0v4l-2 2-2-2v-4z"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      {/* Rocket fins */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 13l-2 2v2l2-2M14 13l2 2v2l-2-2"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      {/* Flame/exhaust */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 15l1 3 1-3M10 16l2 2 2-2"
                        opacity="0.8"
                        className="animate-pulse-soft"
                      />
                      {/* Speed lines and particles */}
                      <path
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M6 8l2 1M6 12l3 0M6 16l2-1"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.2;0.8;0.2"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        d="M18 8l-2 1M18 12l-3 0M18 16l-2-1"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.8;0.2;0.8"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </path>
                      {/* Trailing particles */}
                      <circle
                        cx="8"
                        cy="10"
                        r="0.5"
                        fill="currentColor"
                        opacity="0.4"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;-3 2;0 0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.1;0.7;0.1"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="16"
                        cy="14"
                        r="0.6"
                        fill="currentColor"
                        opacity="0.5"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          values="0 0;3 -1;0 0"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.2;0.8;0.2"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="12"
                        cy="20"
                        r="0.8"
                        fill="currentColor"
                        opacity="0.6"
                        className="animate-pulse-soft"
                      />
                    </svg>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse-soft"></div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Extreme Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Smooth real-time experiences
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
