'use client';
import React from 'react';
import { Car, ShieldCheck, Clock, MapPin, Info, ChevronDown } from 'lucide-react';

interface QuickStatsHeaderProps {
  customerName: string;
  onBookNow: () => void;
}

export function QuickStatsHeader({ customerName, onBookNow }: QuickStatsHeaderProps) {
  return (
    <>
      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          minHeight: '320px',
          background: 'linear-gradient(135deg, #7a1a17 0%, #aa2d29 28%, #1e2236 65%, #0d0f1a 100%)',
        }}
      >
        {/* Subtle radial glow behind the text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 20% 50%, rgba(170,45,41,0.35) 0%, transparent 70%)',
          }}
        />

        {/* Fine diagonal line texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
          }}
        />

        {/* Decorative circle accents */}
        <div
          className="absolute -right-16 -top-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        />
        <div
          className="absolute -right-6 -bottom-20 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 py-12 gap-5">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8c97a] animate-pulse" />
            VIP Luxury Transfer
          </span>

          {/* Heading */}
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight flex flex-col">
              <span>Welcome,</span>
              <span style={{ color: '#e8c97a' }}>{customerName}</span>
            </h1>
            <p className="mt-2.5 text-slate-300 text-sm md:text-base font-medium max-w-md leading-relaxed">
              Your executive chauffeur is one booking away. Reserve your luxury ride in 4 quick steps.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              id="hero-book-now-btn"
              onClick={onBookNow}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e8c97a 0%, #d4a843 100%)',
                color: '#1e2236',
                boxShadow: '0 4px 24px rgba(232,201,122,0.35)',
              }}
            >
              Book Your Transfer
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            <span className="text-slate-400 text-xs font-medium">
              ✦ Instant confirmation · No hidden fees
            </span>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#aa2d29]/10 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4 text-[#aa2d29]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Fleet</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">4 Vehicle Classes</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Chauffeurs</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">Professional &amp; Vetted</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Support</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">24 / 7 Available</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Coverage</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">Airports — TRNC</p>
          </div>
        </div>
      </div>

      {/* ── TIP BANNER ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 rounded-2xl text-white">
        <Info className="w-4 h-4 text-[#aa2d29] shrink-0" />
        <p className="text-xs font-medium text-slate-300">
          <span className="text-white font-semibold">Tip: </span>
          Book at least <span className="text-white font-semibold">2 hours</span> before your desired pick-up time to guarantee vehicle availability. For airport pickups, we track your flight in real time.
        </p>
      </div>
    </>
  );
}
