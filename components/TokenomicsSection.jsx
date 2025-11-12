"use client";

import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Distribution XCS - 2,006,400 Total Supply
const distributionData = [
  {
    name: "Liquidity Pools",
    value: 25,
    amount: "501,600", // 25% de 2,006,400
    color: "#059669", // Vert plus doux (au lieu de #10b981)
    icon: "💧",
    description: "DEX & CEX market depth",
    details:
      "Ensures deep liquidity across major exchanges for seamless trading",
    vesting: "Unlocked",
  },
  {
    name: "Treasury Reserve",
    value: 30,
    amount: "601,920", // 30% de 2,006,400
    color: "#2563eb", // Bleu plus doux (au lieu de #3b82f6)
    icon: "🏛",
    description: "Strategic development fund",
    details: "Marketing, partnerships, ecosystem growth and innovation",
    vesting: "Controlled",
  },
  {
    name: "Team & Advisors",
    value: 25,
    amount: "501,600", // 25% de 2,006,400
    color: "#7c3aed", // Violet plus doux (au lieu de #8b5cf6)
    icon: "👤",
    description: "Core contributors",
    details: "24-month vesting with 6-month cliff",
    vesting: "Locked 24M",
  },
  {
    name: "Community Growth",
    value: 20,
    amount: "401,280", // 20% de 2,006,400
    color: "#d97706", // Orange plus doux (au lieu de #f59e0b)
    icon: "🌐",
    description: "Ecosystem rewards",
    details: "Airdrops, staking rewards, and community incentives",
    vesting: "Progressive",
  },
];

const metrics = [
  {
    label: "Total Supply",
    value: "2,006,400",
    suffix: "XCS",
    color: "text-white/90",
  },
  {
    label: "Circulating",
    value: "501,600",
    suffix: "XCS",
    color: "text-white/90",
  },
  {
    label: "Market Cap",
    value: "TBA",
    suffix: "",
    color: "text-white/90",
  },
  {
    label: "Blockchain",
    value: "XRPL",
    suffix: "",
    color: "text-white/90",
  },
];

export default function TokenomicsSection() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true); // Affiche immédiatement au lieu d'attendre l'IntersectionObserver
    console.log("� TokenomicsSection mounted and visible");
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-2xl min-w-[280px]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{data.icon}</span>
            <div className="flex-1">
              <div className="font-orbitron font-bold text-white text-base">
                {data.name}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">
                {data.vesting}
              </div>
            </div>
          </div>
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-white/60">Allocation</span>
              <span className="text-xl font-orbitron font-bold text-xcannes-green">
                {data.value}%
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-white/60">Amount</span>
              <span className="text-sm font-semibold text-white">
                {data.amount} XCS
              </span>
            </div>
            <div className="text-xs text-white/50 mt-2 pt-2 border-t border-white/5">
              {data.details}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`relative py-32 px-6 overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-xcannes-green/5 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-xcannes-green/10 border border-xcannes-green/20 rounded-full px-6 py-2.5 mb-6">
            <div className="w-2 h-2 bg-xcannes-green rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-xcannes-green uppercase tracking-widest">
              Tokenomics
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold text-white/90 mb-6 leading-tight">
            Token Distribution
          </h2>

          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Transparent allocation model designed for sustainable growth,
            <br className="hidden sm:block" />
            long-term value creation, and ecosystem prosperity
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Chart Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Blur effects plus doux en arrière-plan */}
                <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-600/30 rounded-full" />
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/30 rounded-full" />
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-violet-600/30 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-amber-600/30 rounded-full" />
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      innerRadius="60%"
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={isVisible ? 0 : 1000}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={
                            activeIndex === null || activeIndex === index
                              ? 0.9
                              : 0.3
                          }
                          style={{
                            filter:
                              activeIndex === index
                                ? "brightness(1.1) saturate(0.9)"
                                : "saturate(0.85)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-orbitron font-bold text-white/90 mb-1">
                      2,006,400
                    </div>
                    <div className="text-sm text-white/40 uppercase tracking-wider font-medium">
                      Total Supply
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Cards */}
          <div className="order-1 lg:order-2 space-y-4">
            {distributionData.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`group relative bg-black/30 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                  activeIndex === index
                    ? "border-white/30 bg-black/50 scale-[1.02] shadow-2xl shadow-xcannes-green/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Vesting Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20">
                    {item.vesting}
                  </div>
                </div>

                <div className="flex items-start gap-4 pr-24">
                  <div
                    className="text-4xl transition-transform group-hover:scale-110 duration-300"
                    style={{ filter: "brightness(0.4) contrast(1.2)" }}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-white/20 group-hover:ring-4 transition-all"
                        style={{ backgroundColor: item.color }}
                      />
                      <h3 className="text-lg font-orbitron font-bold text-white/90">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-orbitron font-bold text-white/90">
                        {item.value}%
                      </span>
                      <span className="text-sm text-white/40">
                        · {item.amount} XCS
                      </span>
                    </div>

                    <p className="text-sm text-white/60 leading-relaxed mb-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-white/40">{item.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="group bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-xcannes-green/40 hover:bg-black/30 transition-all duration-500"
              style={{
                transitionDelay: isVisible ? `${i * 100}ms` : "0ms",
              }}
            >
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
                {metric.label}
              </div>
              <div className="flex items-baseline gap-2">
                <div
                  className={`text-3xl md:text-4xl font-orbitron font-bold ${metric.color}`}
                >
                  {metric.value}
                </div>
                {metric.suffix && (
                  <div className="text-base text-white/50 font-semibold">
                    {metric.suffix}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-black/40 via-xcannes-green/5 to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-orbitron font-bold text-white/90 mb-3">
            Learn More About XCS Economics
          </h3>
          <p className="text-white/50 mb-6 max-w-2xl mx-auto">
            Discover our complete tokenomics model, vesting schedules, and
            long-term sustainability strategy in our comprehensive whitepaper.
          </p>
          <a
            href="/whitepaper"
            className="inline-flex items-center gap-3 bg-xcannes-green hover:bg-xcannes-green/90 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-xcannes-green/20"
          >
            <span className="text-xl">📓</span>
            <span>Read Full Whitepaper</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
