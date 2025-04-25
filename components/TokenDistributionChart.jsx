"use client";

import { useEffect, useState } from "react";
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

// Hook pour détecter si on est sur mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function TokenDistributionChart() {
  const isMobile = useIsMobile();

  const labelOffsets = {
    desktop: {
      Team: { x: 25, y: -10 },
      Trésorerie: { x: -30, y: 10 },
      Communauté: { x: 20, y: 25 },
      Liquidité: { x: -20, y: 25 },
    },
    mobile: {
      Team: { x: 10, y: -5 },
      Trésorerie: { x: 10, y: -20 },
      Communauté: { x: 12, y: 15 },
      Liquidité: { x: -12, y: 15 },
    },
  };
  

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    let x = cx + radius * Math.cos(-midAngle * RADIAN);
    let y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    const { name, color } = data[index];
    const offsets = isMobile ? labelOffsets.mobile : labelOffsets.desktop;
    const offset = offsets[name] || { x: 0, y: 0 };
  
    x += offset.x;
    y += offset.y;
  
    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: isMobile ? "10px" : "14px",
          fontFamily: "Montserrat",
          fontWeight: 500,
        }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  

  return (
    <section
      className="w-screen bg-cover bg-center bg-no-repeat mt-0 text-white pb-15 pt-10 px-6 font-montserrat font-[300]"
      style={{
        backgroundImage: "url('/assets/img/ui/backgroundNotreVision1.png')",
        backgroundColor: "#202320",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black border-[1.5px] border-opacity-40 border-white rounded-xl shadow-lg p-6">
        <div className="bg-[#202320] text-black rounded-xl shadow-lg p-6 mb-10">
          <h2
            className="text-3xl font-orbitron font-[500] text-center mb-10"
            style={{ color: "#16b303" }}
          >
            Répartition des tokens XCS
          </h2>

          <div className="flex flex-col items-center justify-center mb-10">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 30 : 80}
                  outerRadius={isMobile ? 800 : 120}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
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
