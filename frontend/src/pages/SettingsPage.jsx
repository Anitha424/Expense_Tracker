import AppShell from '../layouts/AppShell';

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Manage your account and preferences">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-slate-100">Platform Settings</h2>
        <p className="mt-2 text-sm text-slate-300">
          Theme preferences, notification controls, and profile settings can be expanded here.
        </p>
      </section>
    </AppShell>
  );
}

export default SettingsPage;
