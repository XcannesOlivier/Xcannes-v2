"use client";

import { useEffect, useState, useRef } from "react";

export default function PriceTicker({ pairs = [], fixed = false }) {
  const [pricesData, setPricesData] = useState([]);
  const tickerRef = useRef(null);

  // Simuler des données de prix avec mini historique pour sparkline
  useEffect(() => {
    const generateMockData = () => {
      return pairs.map((pair) => {
        const basePrice = Math.random() * 10;
        const change = (Math.random() - 0.5) * 20;
        const sparklineData = Array.from(
          { length: 10 },
          () => basePrice + (Math.random() - 0.5) * basePrice * 0.1
        );

        return {
          pair,
          price: basePrice.toFixed(6),
          change: change.toFixed(2),
          sparkline: sparklineData,
          isPositive: change >= 0,
        };
      });
    };

    setPricesData(generateMockData());

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      setPricesData(generateMockData());
    }, 30000);

    return () => clearInterval(interval);
  }, [pairs]);

  // Mini sparkline SVG
  const Sparkline = ({ data, isPositive }) => {
    if (!data || data.length === 0) return null;

    const width = 40;
    const height = 20;
    const padding = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y =
          height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#16b303" : "#dc2626"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      className={`w-full backdrop-blur-xl overflow-hidden ${
        fixed
          ? "fixed top-16 left-0 border-b border-white/5 z-40"
          : "border-y border-white/5"
      }`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="relative h-16 flex items-center py-4">
        <div
          ref={tickerRef}
          className="flex items-center gap-8 animate-scroll-left whitespace-nowrap"
          style={{
            animation: "scroll-left 60s linear infinite",
          }}
        >
          {/* Dupliquer pour un défilement continu */}
          {[...pricesData, ...pricesData, ...pricesData].map((item, index) => (
            <div
              key={`${item.pair}-${index}`}
              className="flex items-center gap-3 px-6 py-2"
            >
              <Sparkline data={item.sparkline} isPositive={item.isPositive} />
              <div className="flex items-center gap-2">
                <span className="text-white/80 font-semibold text-base">
                  {item.pair}
                </span>
                <span className="text-white text-base font-medium">
                  {item.price}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    item.isPositive ? "text-xcannes-green" : "text-red-500"
                  }`}
                >
                  {item.isPositive ? "+" : ""}
                  {item.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
