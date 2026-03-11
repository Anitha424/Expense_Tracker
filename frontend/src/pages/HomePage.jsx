import { useNavigate } from 'react-router-dom';
import { Code, Shield, Zap, Github, Mail, Linkedin } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Code Review &
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Bug Detection Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Detect syntax errors, vulnerabilities, and code quality issues quickly. Improve your code with powerful automated analysis and actionable feedback.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/analysis')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Code size={20} />
              Start Analyzing
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border-2 border-cyan-400/50 rounded-lg font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Powerful Features for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quality Code</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 h-full hover:border-cyan-400/50 transition-all duration-300">
                <Code className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Smart Analysis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Detect code smells, syntax issues, and maintainability problems instantly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 h-full hover:border-cyan-400/50 transition-all duration-300">
                <Shield className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Security Checks</h3>
                <p className="text-slate-400 leading-relaxed">
                  Identify risky patterns, vulnerabilities, and unsafe code before deployment.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 h-full hover:border-cyan-400/50 transition-all duration-300">
                <Zap className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Fast Feedback</h3>
                <p className="text-slate-400 leading-relaxed">
                  Get quick insights and execution results to improve your code quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Get in Touch</h2>
            <p className="text-slate-300 mb-8">
              Full-Stack Developer | MERN Developer
            </p>

            {/* Contact Links */}
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:hello@example.com"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <Mail size={24} />
              </a>
            </div>

            <p className="text-sm text-slate-500">
              📧 hello@codereviews.dev | 🔗 GitHub | 💼 LinkedIn
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500">
        <p>&copy; 2026 Code Review & Bug Detection Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default HomePage;
