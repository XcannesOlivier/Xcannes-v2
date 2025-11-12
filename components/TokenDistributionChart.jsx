"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  {
    name: "Team & Advisors",
    value: 25,
    color: "#dc2626",
    icon: "🔒",
    desc: "Locked 12 months with progressive vesting",
    amount: "25M XCS"
  },
  {
    name: "Treasury",
    value: 30,
    color: "#10b981",
    icon: "��",
    desc: "Marketing, partnerships, development",
    amount: "30M XCS"
  },
  {
    name: "Community",
    value: 20,
    color: "#fbbf24",
    icon: "🤝",
    desc: "Airdrops, rewards, ecosystem growth",
    amount: "20M XCS"
  },
  {
    name: "Liquidity",
    value: 25,
    color: "#3b82f6",
    icon: "💧",
    desc: "DEX & CEX liquidity pools",
    amount: "25M XCS"
  },
];

export default function TokenDistributionChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold text-white">{item.name}</span>
          </div>
          <div className="text-xcannes-green font-bold text-xl mb-1">
            {item.value}% · {item.amount}
          </div>
          <div className="text-white/60 text-sm">{item.desc}</div>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-96 flex items-center justify-center">
            <div className="text-white/40">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-xcannes-green/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-xcannes-green mb-3 font-light">
            Tokenomics
          </p>
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
            Token Distribution
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Total Supply: <span className="text-xcannes-green font-semibold">100,000,000 XCS</span>
          </p>
        </div>

        {/* Chart & Stats Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Chart Container */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md aspect-square relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="65%"
                    innerRadius="40%"
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl font-orbitron font-bold text-white">100M</div>
                  <div className="text-sm text-white/60">Total Supply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="group bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:bg-black/40"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-orbitron font-semibold text-white group-hover:text-xcannes-green transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-lg font-bold text-white">{item.value}%</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{item.desc}</p>
                    <p className="text-xcannes-green font-semibold">{item.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { label: "Token Standard", value: "XRPL Native", icon: "⚙️" },
            { label: "Vesting Period", value: "12-24 Months", icon: "📅" },
            { label: "Initial Circulation", value: "45M XCS", icon: "🔄" }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-xcannes-green/40 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-sm text-white/60 mb-2">{stat.label}</div>
              <div className="text-xl font-orbitron font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
