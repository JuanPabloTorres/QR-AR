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
        <section className="pt-16 pb-20 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-shimmer">
                QR-AR
              </span>
              <br />
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Advanced platform to create and manage next-generation{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                Augmented Reality
              </span>{" "}
              experiences
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/experiences"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 min-w-[200px]"
              >
                <span className="relative z-10">View Experiences</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href="/experiences/new"
                className="group glass px-8 py-4 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-blue-500/50 min-w-[200px]"
              >
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Create Experience
                </span>
              </Link>
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
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      🎯
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
                        className="w-5 h-5"
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
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      ✨
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
                        className="w-5 h-5"
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ∞
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
                  <div className="text-4xl">📱</div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
                  <div className="text-4xl">⚡</div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} QR-AR - Advanced Augmented Reality
            Technology
          </p>
        </footer>
      </div>
    </div>
  );
}
