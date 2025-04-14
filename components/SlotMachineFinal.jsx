import { useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import Reel from "./Reel"; // avec halo & sons par rouleau
import Fireworks from "./Fireworks";

const symbols = ["💎", "🌴", "🐉", "🪙", "👑", "👜"];

export default function SlotMachineFinal() {
  const [finalSymbols, setFinalSymbols] = useState(["", "", ""]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [finishedCount, setFinishedCount] = useState(0);

  const spinSound = new Howl({ src: ["/sounds/spin.mp3"] });
  const winSound = new Howl({ src: ["/sounds/win.mp3"] });
  const loseSound = new Howl({ src: ["/sounds/lose.mp3"] });

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult("");
    setFinishedCount(0);
    spinSound.play();

    const chosen = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
    setFinalSymbols(chosen);
  };

  const handleReelEnd = () => {
    setFinishedCount((prev) => {
      const updated = prev + 1;
      if (updated === 3) {
        setSpinning(false);

        const isJackpot = finalSymbols.every((s) => s === finalSymbols[0]);
        if (isJackpot) {
          winSound.play();
          setResult("🎉 JACKPOT !");
        } else {
          loseSound.play();
          setResult("🙃 Raté, réessaie !");
        }
      }
      return updated;
    });
  };

  const isJackpot = result.includes("JACKPOT");

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[900px] aspect-[9/13] rounded-xl shadow-2xl overflow-hidden mx-auto">
        {/* 🎞️ Fond vidéo */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/videos/slotsmachine.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 🎆 JACKPOT Fireworks */}
        {isJackpot && <Fireworks />}

        {/* 🎰 Reels animés */}
        <motion.div
          className="absolute top-[39.5%] left-[27.5%] -translate-x-1/2 -translate-y-1/2 flex justify-center gap-1 sm:gap-1 md:gap-1 lg:gap-3 space-x-1 z-10"
          animate={
            isJackpot
              ? { scale: [1, 1.1, 1], rotate: [0, 1.5, -1.5, 0] }
              : {}
          }
          transition={{ duration: 0.5 }}
        >
          {finalSymbols.map((symbol, i) => (
            <Reel
              key={i}
              stopSymbol={symbol}
              spinning={spinning}
              jackpot={isJackpot}
              delay={i * 300}
              isLast={i === finalSymbols.length - 1}
              onSpinEnd={handleReelEnd}
            />
          ))}
        </motion.div>

       
        <motion.div
  className="absolute bottom-[31%] left-[35%] -translate-x-1/2 z-20"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.5 }}
>
  <div className="relative flex items-center justify-center">
    {/* ✨ Glow animé en boucle (quand pas spinning) */}
    {!spinning && (
      <motion.div
        className="absolute w-full h-full  blur-5xl z-[-1]"
        initial={{ scale: 1 }}
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle,rgb(255, 255, 255), transparent 99%)",
        }}
      />
    )}

    {/* 💥 Flash onClick (uniquement au clic) */}
    {!spinning && (
      <motion.div
        className="absolute w-full h-full rounded-xl  z-[-1] pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileTap={{ opacity: 1, scale: 1.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle,rgb(255, 255, 255), transparent 20%)",
        }}
      />
    )}

    {/* 🎯 Bouton SPIN */}
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={spin}
      disabled={spinning}
      className="
        w-[clamp(140px,28vw,270px)]
        h-[clamp(50px,8vw,82px)]
        text-[clamp(1rem,2.5vw,1.4rem)]
        text-white font-bold 
        border-1 
        hover:brightness-110
        transition
      "
    >
      {spinning ? "" : ""}
    </motion.button>
  </div>
</motion.div>

       

  

          

          {result && (
            <p
            className={`mt-4 text-sm font-semibold text-center transition duration-300 ${
              isJackpot ? "text-yellow-400 animate-pulse" : "text-white/80"
            }`}
          >
            {result}
          </p>
          
          )}
        </div>
     
    </main>
  );
}


