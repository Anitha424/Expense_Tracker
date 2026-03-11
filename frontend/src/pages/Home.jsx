import { useNavigate } from 'react-router-dom';
import { Code, Shield, Zap, Github, Mail, Linkedin, Phone } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CodeReview
            </span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/analysis')}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              Analysis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

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
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Expense Tracker
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Track your income, manage expenses, and analyze spending patterns easily.
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
              onClick={() => navigate('/analysis')}
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
            <FeatureCard
              icon={<Code className="w-12 h-12" />}
              title="Smart Analysis"
              description="Detect syntax issues and code smells instantly."
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="Security Checks"
              description="Identify vulnerabilities and risky patterns."
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Fast Feedback"
              description="Get quick insights and execution results."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl p-12">
            <h2 className="text-3xl font-bold mb-3 text-center">Get in Touch</h2>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-1">Ezhilan V</h3>
              <p className="text-cyan-400 text-sm mb-2">B.E Electronics & Communication</p>
              <p className="text-slate-300 font-semibold">Full Stack Developer | MERN Developer</p>
            </div>

            {/* Contact Links */}
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="tel:+918807257258"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
                title="Phone"
              >
                <Phone size={24} />
              </a>
              <a
                href="mailto:hello@example.com"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
                title="Email"
              >
                <Mail size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-200"
                title="GitHub"
              >
                <Github size={24} />
              </a>
            </div>

            <p className="text-sm text-slate-400 text-center">
              📧 hello@codereviews.dev | 📞 +91 8807257258
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

export default Home;
