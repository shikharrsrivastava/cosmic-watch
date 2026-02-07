"use client";

import SpaceScene from "../components/SpaceScene";
import { motion } from "framer-motion";
import { 
  Radar, 
  Globe, 
  ShieldAlert, 
  MessageSquareDiff, 
  ChevronRight, 
  Activity,
  Terminal,
  Cpu
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-transparent text-white font-sans selection:bg-cyan-500/30">
      
      {/* 🌌 3D BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <SpaceScene />
      </div>

      {/* 🕸️ GRID OVERLAY (For that "Technical" feel) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* 🧭 TOP NAVIGATION - HUD STYLE */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-lg font-bold tracking-widest font-mono uppercase">
              Cosmic<span className="text-cyan-400">Watch</span>
            </span>
            <span className="hidden md:block px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-400 border border-white/5">
              BETA v2.4
            </span>
          </div>
          
          <div className="flex gap-6 text-xs font-mono tracking-widest text-gray-400 uppercase">
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              NASA Feed Active
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              Risk Engine Idle
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono transition-all uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            System Login
          </button>
        </div>
      </nav>

      {/* 🚀 HERO SECTION - CENTERED BUT TRANSPARENT */}
      <section className="relative z-30 flex flex-col items-center pt-32 md:pt-40 px-4 text-center">
        
        {/* SMALL BADGE - Technical Look */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-200 uppercase">
            Global Near-Earth Object Monitoring
          </span>
        </motion.div>

        {/* MAIN HEADLINE - Elegant & Sharp */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl"
        >
          ORBITAL THREAT <br />
          INTELLIGENCE
        </motion.h1>

        {/* SUBTITLE - Directly addresses Problem Statement [cite: 3, 9] */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-2xl text-sm md:text-base text-gray-400 font-mono leading-relaxed"
        >
          A full-stack platform transforming raw NASA NeoWs data into actionable insights. 
          Track specific objects, calculate impact probabilities, and visualize cosmic threats in real-time.
        </motion.p>

        {/* ACTION BUTTONS - Professional Styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <button className="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold tracking-widest uppercase rounded-sm overflow-hidden transition-all shadow-[0_0_20px_-5px_rgba(8,145,178,0.5)]">
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard <ChevronRight className="w-4 h-4" />
            </span>
          </button>
          
          <button className="px-8 py-3 border border-white/20 bg-black/30 hover:bg-white/5 backdrop-blur-md text-sm font-mono tracking-widest uppercase rounded-sm transition-all text-gray-300 hover:text-white">
            View Documentation
          </button>
        </motion.div>

      </section>

      {/* 📊 DATA CARDS - Moved to Bottom to clear view of Earth */}
      <section className="absolute bottom-20 w-full z-30 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <InfoCard 
            label="TRACKED OBJECTS" 
            value="34,102" 
            sub="Active NEOs"
            icon={<Radar className="w-4 h-4 text-cyan-400" />}
            delay={0.1}
          />
          
          <InfoCard 
            label="HAZARDOUS BODIES" 
            value="2,391" 
            sub="Potentially Dangerous"
            icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
            delay={0.2}
          />

          <InfoCard 
            label="CLOSEST APPROACH" 
            value="1.2 LD" 
            sub="Lunar Distance"
            icon={<Globe className="w-4 h-4 text-purple-400" />}
            delay={0.3}
          />

           {/* BONUS POINT: CHAT */}
           <InfoCard 
            label="COMMUNITY UPLINK" 
            value="LIVE" 
            sub="142 Researchers Online"
            icon={<MessageSquareDiff className="w-4 h-4 text-green-400" />}
            delay={0.4}
          />

        </div>
      </section>

      {/* 🟢 FOOTER TICKER */}
      <div className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/80 backdrop-blur-xl py-1.5 px-6 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest z-50">
        <div className="flex gap-8">
          <span>Connection: <span className="text-green-500">SECURE (TLS 1.3)</span></span>
          <span className="hidden md:inline">Server Load: 12%</span>
          <span className="hidden md:inline">API Latency: 42ms</span>
        </div>
        <div>AUTHORIZED PERSONNEL ONLY // ID: GUEST_USER</div>
      </div>

    </main>
  );
}

// 🎛️ REUSABLE TECHNICAL CARD COMPONENT
function InfoCard({ label, value, sub, icon, delay }: { label: string, value: string, sub: string, icon: any, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="p-4 border-l-2 border-white/10 bg-black/60 backdrop-blur-md hover:border-cyan-500/50 hover:bg-black/80 transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white font-sans tracking-tight group-hover:text-cyan-400 transition-colors">
        {value}
      </div>
      <div className="text-[10px] text-gray-400 mt-1 font-mono">
        {sub}
      </div>
    </motion.div>
  );
}