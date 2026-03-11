function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 h-full hover:border-cyan-400/50 transition-all duration-300">
        <div className="text-cyan-400 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
