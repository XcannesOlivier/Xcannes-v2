import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const defaultSymbols = ["💎", "🌴", "🐉", "🪙", "👑", "👜"];

export default function Reel({
  stopSymbol,
  spinning,
  jackpot = false,
  delay = 0,
  symbols = defaultSymbols,
  onSpinEnd = () => {},
}) {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [symbolList, setSymbolList] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const reelWidth = containerWidth * 0.3;
  const aspectRatio = 2 / 3;

  useEffect(() => {
    const generated = Array.from({ length: 30 }, () =>
      symbols[Math.floor(Math.random() * symbols.length)]
    );
    setSymbolList(generated);
  }, [spinning]);

  useEffect(() => {
    if (spinning) {
      controls
        .start({
          y: ["0%", "-100%"],
          transition: {
            duration: 1.2,
            ease: "easeIn",
            repeat: 1,
            delay: delay / 1000,
          },
        })
        .then(() =>
          controls.start({
            y: ["0%", "-100%"],
            transition: {
              duration: 0.4,
              ease: "linear",
              repeat: 8,
            },
          })
        )
        .then(() =>
          controls.start({
            y: ["0%", "-100%"],
            transition: {
              duration: 2.5,
              ease: "easeOut",
            },
          })
        )
        .then(() => {
          onSpinEnd();
        });
    } else {
      controls.stop();

      setSymbolList((prev) => {
        const updated = [...prev.slice(0, 29), stopSymbol];
        return updated;
      });

      controls.start({
        y: "-100%",
        transition: {
          duration: 2,
          ease: "easeOut",
        },
      }).then(() => {
        onSpinEnd();
      });
    }
  }, [spinning]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center transition-all duration-700 ease-in-out"
      style={{
        width: `${reelWidth}px`,
        height: `${reelWidth * aspectRatio}px`,
        backgroundColor: "#000",
        borderRadius: "1rem",
        boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
      }}
    >
      <motion.div className="flex flex-col w-full h-full" animate={controls}>
        {symbolList.map((symbol, i) => (
          <div
            key={i}
            className="aspect-square w-full flex items-center justify-center text-white"
            style={{
              fontSize: `${reelWidth * 0.5}px`,
              color: jackpot ? "#facc15" : "white",
              textShadow: jackpot ? "0 0 10px gold" : "none",
              animation: jackpot ? "pulse 1.5s infinite" : "none",
            }}
          >
            {symbol || "❓"}
          </div>
        ))}
           </motion.div>
    </div>
  );
}
