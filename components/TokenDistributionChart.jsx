"use client";

import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  {
    name: "Team",
    value: 25,
    color: "#930606",
    icon: "🔒",
    desc: "Verrouillé 12 mois + déblocage progressif",
  },
  {
    name: "Trésorerie",
    value: 30,
    color: "#16b303",
    icon: "💰",
    desc: "Marketing, partenariats, innovation",
  },
  {
    name: "Communauté",
    value: 20,
    color: "#e3ca06",
    icon: "🤝",
    desc: "Favorise l’adoption et la croissance",
  },
  {
    name: "Liquidité",
    value: 25,
    color: "#0695d9",
    icon: "💧",
    desc: "Injectés directement sur le DEX & CEX",
  },
];

export default function TokenDistributionChart() {
  return (
    <section
      className="w-screen bg-cover bg-center bg-no-repeat text-white py-20 px-6 font-montserrat font-[300]"
      style={{
        backgroundImage: "url('/assets/img/ui/backgroundNotreVision1.png')",
        backgroundColor: "#202320",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black border-[1.5px] border-opacity-40 border-white rounded-xl shadow-lg p-6">
        {/* Bloc graphique */}
        <div className="bg-[#202320] text-black rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-3xl font-orbitron font-[500] text-center mb-10" style={{ color: "#16b303" }}>
            Répartition des tokens XCS
          </h2>

          <div className="flex flex-col items-center justify-center mb-10">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="70%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  isAnimationActive={true}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
                    const radius = isMobile
                      ? innerRadius + (outerRadius - innerRadius) * 0.4
                      : innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        style={{ fontSize: isMobile ? "10px" : "12px" }}
                      >
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  labelLine={false}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                      style={{
                        transition: "transform 0.3s ease-in-out",
                        transformOrigin: "center",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-[#202320] text-white rounded shadow p-2 text-sm font-semibold border-[0.5px] border-opacity-80 border-white">
                          {item.icon} {item.name} — {item.value}%<br />
                          <span className="text-xs font-normal">{item.desc}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Détail sous forme de cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-[#202320] text-white p-4 rounded shadow hover:scale-[1.02] transition"
            >
              <h3 className="text-lg font-[500] mb-1">
                {item.icon} {item.name} ({item.value}%)
              </h3>
              <p className="text-sm text-white font-[300]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
