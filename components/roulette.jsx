// 🎰 FICHIER ROULETTE.JSX — COMPLÈTEMENT RECONSTRUIT ET FONCTIONNEL
import { useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";

const numbers = Array.from({ length: 37 }, (_, i) => i);
const getColor = (n) => {
  if (n === 0) return "green";
  const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return reds.includes(n) ? "red" : "black";
};

const getGainMultiplier = (bet, value) => {
  const topLine = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const midLine = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const botLine = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
  if (typeof bet === "number" && bet === value) return 36;
  if (["1st12", "2nd12", "3rd12", "2to1-top", "2to1-mid", "2to1-bot"].includes(bet)) return 3;
  if (["pair", "impair", "rouge", "noir", "manque", "passe"].includes(bet)) return 2;
  return 0;
};

const spinSound = new Howl({ src: ["/sounds/spin.mp3"] });
const winSound = new Howl({ src: ["/sounds/win.mp3"] });

export default function Roulette() {
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [bet, setBet] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const spinRoulette = () => {
    if (spinning || !bet || selectedAmount === 0) return;
    setSpinning(true);
    setResult(null);
    spinSound.play();

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const value = numbers[randomIndex];
    const color = getColor(value);
    const fullSpins = 10 * 360;
    const anglePerSlot = 360 / 37;
    const targetAngle = fullSpins + (360 - randomIndex * anglePerSlot);
    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      const topLine = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
      const midLine = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
      const botLine = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

      const didWin =
        (bet === "pair" && value % 2 === 0 && value !== 0) ||
        (bet === "impair" && value % 2 === 1) ||
        (bet === "rouge" && color === "red") ||
        (bet === "noir" && color === "black") ||
        (bet === "manque" && value >= 1 && value <= 18) ||
        (bet === "passe" && value >= 19 && value <= 36) ||
        (bet === "1st12" && value >= 1 && value <= 12) ||
        (bet === "2nd12" && value >= 13 && value <= 24) ||
        (bet === "3rd12" && value >= 25 && value <= 36) ||
        (bet === "2to1-top" && topLine.includes(value)) ||
        (bet === "2to1-mid" && midLine.includes(value)) ||
        (bet === "2to1-bot" && botLine.includes(value)) ||
        (value === bet);

      setResult({ value, color, win: didWin });
      setSpinning(false);
      winSound.play();
    }, 4000);
  };

  const addJeton = (amount) => {
    if (spinning) return;
    setSelectedAmount((prev) => prev + amount);
  };

  const resetBet = () => {
    if (spinning) return;
    setSelectedAmount(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#111827] to-black text-white px-4 pt-28 pb-20 flex flex-col items-center justify-center text-center">
      <div className="bg-white/5 w-full max-w-4xl px-4 flex flex-col items-center justify-center relative overflow-hidden">

        <h1 className="text-3xl font-orbitron font-[500] text-xcannes-green mb-4">🎡 Roulette Xcannes</h1>

        {/* Curseur/flèche */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-yellow-300" />
        </div>


{/* ROULETTE SVG CENTRÉE */}
<div className="relative w-[360px] h-[360px] mx-auto mb-6">
  <svg viewBox="0 0 200 200" className="absolute top-0 left-0 w-full h-full z-0">
    <circle cx="100" cy="100" r="94" fill="#6a4a2e" />
    <circle cx="100" cy="100" r="90" fill="#7d522f" stroke="#3b240f" strokeWidth="2" />
    <circle cx="100" cy="100" r="88" fill="#3d2a1a" />
  </svg>

  {/* ROUE TOURNANTE */}
  <motion.svg

    viewBox="0 0 200 200"
    className="absolute top-[40px] left-[40px] w-[280px] h-[280px] -translate-x-0 -translate-y-0 z-10"
    animate={{ rotate: rotation }}
    transition={{ duration: 4, ease: "easeInOut" }}
  >
    <defs>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>

    <circle cx="100" cy="100" r="80" fill="#000000" />

    {[0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6,
      27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
      16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
      7, 28, 12, 35, 3, 26].map((n, i, arr) => {
      const angle = 360 / arr.length;
      const startAngle = angle * i;
      const endAngle = startAngle + angle;
      const x1 = 100 + 100 * Math.cos((Math.PI / 180) * startAngle);
      const y1 = 100 + 100 * Math.sin((Math.PI / 180) * startAngle);
      const x2 = 100 + 100 * Math.cos((Math.PI / 180) * endAngle);
      const y2 = 100 + 100 * Math.sin((Math.PI / 180) * endAngle);
      const largeArc = angle > 180 ? 1 : 0;

      const color = n === 0 ? "#4e8f4a" : getColor(n) === "red" ? "#a9302c" : "#1e1e1e";
      const midAngle = (startAngle + endAngle) / 2;
      const labelX = 100 + 87 * Math.cos((Math.PI / 180) * midAngle);
      const labelY = 100 + 87 * Math.sin((Math.PI / 180) * midAngle);

      return (
        <g key={n}>
          <path
            d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc} 1 ${x2},${y2} Z`}
            fill={color}
            stroke="#000"
            strokeWidth="1.5"
            className={result?.value === n ? "animate-pulse shadow-[0_0_10px_yellow]" : ""}
          />
          <text
            x={labelX}
            y={labelY}
            transform={`rotate(${midAngle + 90}, ${labelX}, ${labelY})`}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontWeight="bold"
            fill="white"
          >
            {n}
          </text>
        </g>
      );
    })}

    <circle cx="100" cy="100" r="72" fill="none" stroke="#c2a06c" strokeWidth="4" />

    <circle cx="100" cy="100" r="30" fill="#623e2a" stroke="#2b1a12" strokeWidth="3" />
    <circle cx="100" cy="100" r="34" fill="none" stroke="#cfa45b" strokeWidth="4" />
    <motion.circle
      cx="100"
      cy="100"
      r="30"
      fill="url(#shine)"
      animate={{ rotate: [0, 360] }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      transform="rotate(0 100 100)"
    />
    <g stroke="#d4af37" strokeWidth="3" strokeLinecap="round">
      <line x1="100" y1="60" x2="100" y2="85" />
      <line x1="100" y1="115" x2="100" y2="140" />
      <line x1="60" y1="100" x2="85" y2="100" />
      <line x1="115" y1="100" x2="140" y2="100" />
    </g>
    {[{x:100, y:60}, {x:100, y:140}, {x:60, y:100}, {x:140, y:100}].map((pos, i) => (
      <circle key={i} cx={pos.x} cy={pos.y} r="4" fill="#f5d97f" stroke="#8b6d2c" strokeWidth="1" />
    ))}
    <circle cx="100" cy="100" r="8" fill="#f5d97f" stroke="#8b6d2c" strokeWidth="2" />
  </motion.svg>
  {/* BILLE ANIMÉE */}
<motion.div
  className="absolute w-3 h-3 bg-white rounded-full shadow-md z-20"
  animate={{ rotate: spinning ? 1440 : 0 }}
  transition={{ duration: 4, ease: "easeInOut" }}
  style={{
    
    top: "90%",
    left: "50%",
    transform: "translate(-60%, -100%)  rotate(${rotation}deg) translateY(-90px)", // recentre la bille puis la pousse sur le rayon
    transformOrigin: "center -142px ", // centre de rotation
    transition: "transform 0.5s ease-out"
  }}
/>

</div>


<div className="space-y-[2px] mt-6">
  {/* topBar */}
  <div className="flex flex-wrap justify-center gap-[1px] bg-white p-[1px]">
    {["manque", "pair", "rouge", "noir", "impair", "passe"].map((val) => {
      const labelMap = {
        manque: "1 to 18",
        pair: "Even",
        rouge: "🔴",
        noir: "⚫",
        impair: "Odd",
        passe: "19 to 36",
      };
      const isSelected = bet === val;
      const base = "text-sm font-bold text-white border border-white hover:brightness-110 transition duration-200 ease-in-out";
      const bg = val === "rouge" ? "bg-red-600" : val === "noir" ? "bg-black" : "bg-green-600";
      const shape = ["rouge", "noir"].includes(val) ? "w-10 h-10 text-xl rounded-full flex items-center justify-center" : "px-3 py-2 flex-1";
      const ring = isSelected ? " ring-2 ring-yellow-300" : "";
      return (
        <button
          key={val}
          onClick={() => setBet(val)}
          className={`${base} ${bg} ${shape}${ring}`}
        >
          {labelMap[val]}
        </button>
      );
    })}
  </div>

  {/* tableau principal + zéro */}
  <div className="flex gap-[1px] bg-white p-[1px]">
    {/* zéro */}
    <button
      onClick={() => setBet(0)}
      className="w-12 h-[148px] text-sm font-bold border border-white bg-green-600 text-white flex items-center justify-center"
    >
      0
    </button>
    {/* grille */}
    <div className="flex">
      {Array.from({ length: 12 }).map((_, col) => (
        <div key={col} className="flex flex-col">
          {[2, 1, 0].map((row) => {
            const num = 3 * col + row + 1;
            return (
              <button
                key={num}
                onClick={() => setBet(num)}
                className={`w-12 h-12 text-sm font-bold border border-white flex items-center justify-center rounded-none
                  ${getColor(num) === "red" ? "bg-red-600" : getColor(num) === "black" ? "bg-black" : "bg-green-600"}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      ))}
    </div>
    {/* 2 to 1 */}
    <div className="flex flex-col justify-between">
      {["2to1-top", "2to1-mid", "2to1-bot"].map((val, i) => (
        <button
          key={val}
          onClick={() => setBet(val)}
          className="w-12 h-12 bg-green-600 text-white text-xs font-bold border border-white"
        >
          2 to 1
        </button>
      ))}
    </div>
  </div>

  {/* 1st 12 / 2nd 12 / 3rd 12 */}
  <div className="flex gap-[1px] bg-white p-[1px] mt-1">
    {["1st12", "2nd12", "3rd12"].map((val, i) => (
      <button
        key={val}
        onClick={() => setBet(val)}
        className={`flex-1 px-3 py-2 text-sm font-bold text-white bg-green-600 border border-white hover:brightness-110 transition duration-200 ease-in-out
          ${bet === val ? "ring-2 ring-yellow-300" : ""}`}
      >
        {i + 1}st 12
      </button>
    ))}
  </div>
</div>

        {/* Jetons */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 5, 10, 25, 50].map((j) => (
            <button
              key={j}
              onClick={() => addJeton(j)}
              className="w-10 h-10 rounded-full bg-white text-black font-bold shadow hover:scale-110 transition"
            >
              {j}
            </button>
          ))}
        </div>

        {/* Mise actuelle + reset */}
        <p className="text-sm text-white mt-3">
          Mise actuelle : <span className="font-bold text-xcannes-yellow">{selectedAmount} jeton{selectedAmount > 1 ? "s" : ""}</span>
        </p>
        <button onClick={resetBet} className="text-xs text-white/60 underline mb-2">
          Réinitialiser la mise
        </button>

        {/* Lancer */}
        <button
          onClick={spinRoulette}
          disabled={spinning || !bet || selectedAmount === 0}
          className="px-6 py-2 bg-xcannes-green text-black font-[500] rounded-full hover:bg-xcannes-blue hover:text-white transition transform hover:scale-105 disabled:opacity-50 shadow"
        >
          {spinning ? "...Lancement..." : "🎯 Tourner la roue"}
        </button>

        {/* Résultat */}
        {result && (
          <div className={`text-xl font-bold mt-4 ${
            result.color === "red"
              ? "text-red-500"
              : result.color === "black"
              ? "text-white"
              : "text-green-400"
          }`}>
            Résultat : {result.value} — {result.color.toUpperCase()}<br />
            {result.win ? `✅ Gagné ! +${getGainMultiplier(bet, result.value)}x` : "❌ Perdu !"}
          </div>
        )}

        <p className="text-xs mt-6 text-white/40 italic">* Grille complète, bille, flèche et multiplicateurs inclus ✨</p>
      </div>
    </main>
  );
}