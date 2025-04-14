// Fireworks.jsx
import { useEffect, useState } from "react";

export default function Fireworks() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const count = 20;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="w-2 h-2 bg-yellow-300 rounded-full absolute animate-firework"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
