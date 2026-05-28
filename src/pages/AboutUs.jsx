
import { ShieldCheck, Cpu, Building2,  } from 'lucide-react';

export const AboutUs = () => {
  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-cobalt/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-coral/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mb-24">
          <p className="text-brand-cobalt text-xs font-bold tracking-[0.25em] uppercase mb-4">
            The Sovereign Network
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Architecting the future of real estate deployment.
          </h1>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            We build the secure cloud infrastructure and verification engines that connect elite property portfolios with discerning clients globally.
          </p>
        </section>

        {/* STATS MATRIX BLOCK */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-28 border-y border-white/5 py-12 bg-white/[0.01] backdrop-blur-sm rounded-3xl px-6 md:px-12">
          <div className="text-center md:text-left">
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">100%</p>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mt-2">Verified Agents</p>
          </div>
          <div className="text-center md:text-left border-l border-white/5 pl-0 md:pl-8">
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">₦50B+</p>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mt-2">Asset Value Managed</p>
          </div>
          <div className="text-center md:text-left border-l border-white/5 pl-0 md:pl-8">
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">2.4ms</p>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mt-2">Search Pipeline Latency</p>
          </div>
          <div className="text-center md:text-left border-l border-white/5 pl-0 md:pl-8">
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Zero</p>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mt-2">Unvetted Listings</p>
          </div>
        </section>

        {/* CORE OPERATING PILLARS */}
        <section className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Our Ecosystem Standards</h2>
            <p className="text-slate-400 text-sm mt-3">Engineered to eliminate friction, spoofing, and asymmetry from luxury asset management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative group hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-cobalt/10 border border-brand-cobalt/20 flex items-center justify-center text-brand-cobalt mb-6">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Institutional Trust</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every agency on our platform passes rigorous Corporate Affairs Commission (CAC) checks and administrative background clearings before dynamic deployment.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative group hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-coral/10 border border-brand-coral/20 flex items-center justify-center text-brand-coral mb-6">
                <Cpu size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Chromatic Engine tech</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our infrastructure empowers approved agencies with premium branding suites, automatically mapping corporate assets across dynamically generated user documentation.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl relative group hover:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
                <Building2 size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Premium Portfolios Only</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We strictly curate our catalog to capture executive residential enclaves, luxury penthouses, and elite commercial spaces within key geographic hubs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};