import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const pieData = [
  {
    name: "Team",
    value: 25,
    color: "#21618C",
    icon: "🔒",
    desc: "Verrouillé 12 mois + déblocage progressif"
  },
  {
    name: "Trésorerie",
    value: 30,
    color: "#1E8449",
    icon: "💰",
    desc: "Marketing, partenariats, innovation"
  },
  {
    name: "Communauté",
    value: 20,
    color: "#D68910",
    icon: "🤝",
    desc: "Favorise l’adoption et la croissance"
  },
  {
    name: "Liquidité",
    value: 25,
    color: "#922B21",
    icon: "💧",
    desc: "Injectés directement sur le DEX & CEX"
  }
];

export default function Tokenomics() {
  const sectionRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`max-w-5xl mx-auto px-4 py-16 scroll-animate ${
        visible ? "visible" : ""
      }`}
    >
      {/* 🔷 HEADER */}
      <h2 className="text-4xl font-bold text-center mb-6 text-xrdoge-green">Tokenomics</h2>
      <p className="text-center text-white mb-12 max-w-2xl mx-auto text-lg">
        Découvrez la répartition, le plan de vesting et les données clés du token XCS.
      </p>

      {/* 🥧 CAMEMBERT */}
      <div className="flex flex-col items-center justify-center mb-10">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              isAnimationActive={true}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    transformOrigin: "center"
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white text-black rounded shadow p-2 text-sm font-semibold">
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

      {/* 📄 TABLEAU EXPLICATIF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {pieData.map((item, index) => (
          <div
            key={index}
            className="bg-white/90 text-black p-4 rounded shadow hover:scale-[1.02] transition"
          >
            <h3 className="text-lg font-bold mb-1">
              {item.icon} {item.name} ({item.value}%)
            </h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mb-16">
  <a
    href="/whitepaper"
    className="inline-block bg-xrdoge-green text-black font-bold py-2 px-6 rounded-full hover:bg-xrdoge-blue-100 hover:text-white transition"
  >
    📖 Lire le Livre Blanc
  </a>
</div>


      {/* 📊 STATS SIMPLES (mock) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-16">
        <div className="bg-white/90 p-6 rounded text-black">
          <h4 className="text-xl font-bold">💎 2 006 400</h4>
          <p className="text-sm">XCS en circulation</p>
        </div>
        <div className="bg-white/90 p-6 rounded text-black">
          <h4 className="text-xl font-bold">+18 000</h4>
          <p className="text-sm">Détenteurs</p>
        </div>
        <div className="bg-white/90 p-6 rounded text-black">
          <h4 className="text-xl font-bold">XRPL</h4>
          <p className="text-sm">Blockchain</p>
        </div>
      </div>

      {/* 🕒 PLAN DE VESTING */}
      <div className="bg-white/90 text-black p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-2xl font-bold mb-4">Plan de vesting XCS</h3>
        <div className="space-y-2 text-sm">
          <p>🔒 Team (25%) : 12 mois verrouillés puis 12 mois de libération progressive</p>
          <p>💰 Trésorerie (30%) : Allocation continue selon les besoins projet</p>
          <p>🤝 Communauté (20%) : Disponible dès le lancement</p>
          <p>💧 Liquidité (25%) : Injectée directement sur DEX/CEX au lancement</p>
        </div>
      </div>
    </section>
  );
}
