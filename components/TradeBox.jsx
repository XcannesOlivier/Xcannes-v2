"use client";

import { useState, useEffect } from "react";
import TokenAmountInput from "./TokenAmountInput";
import { getBookIdFromPair } from "../utils/xrpl";

export default function TradeBox({ pair = "XCS/XRP" }) {
  const [mode, setMode] = useState("BUY"); // "BUY" ou "SELL"
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0.00001);
  const [book, setBook] = useState(null);

  const simulatedBalance = 1000;

  // 🧠 Récupère les infos de la paire sélectionnée
  useEffect(() => {
    const b = getBookIdFromPair(pair);
    setBook(b);
  }, [pair]);

  const getTotal = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return "0.00";
    return (val * price).toFixed(6);
  };

  const setPercent = (pct) => {
    const val = ((simulatedBalance * pct) / 100).toFixed(2);
    setAmount(val);
  };

  const handleSubmit = () => {
    if (!book) {
      console.warn("❌ Aucune paire sélectionnée");
      return;
    }

    const taker_gets = mode === "BUY"
      ? {
          currency: book.taker_pays.currency,
          issuer: book.taker_pays.issuer,
          value: (amount * price).toFixed(6),
        }
      : {
          currency: book.taker_gets.currency,
          issuer: book.taker_gets.issuer,
          value: parseFloat(amount).toFixed(6),
        };

    const taker_pays = mode === "BUY"
      ? {
          currency: book.taker_gets.currency,
          issuer: book.taker_gets.issuer,
          value: parseFloat(amount).toFixed(6),
        }
      : {
          currency: book.taker_pays.currency,
          issuer: book.taker_pays.issuer,
          value: (amount * price).toFixed(6),
        };

    const offerCreatePayload = {
      TransactionType: "OfferCreate",
      TakerGets: taker_gets,
      TakerPays: taker_pays,
    };

    console.log("📦 TX payload à signer :", offerCreatePayload);
    alert("💡 Transaction générée en console. (simu)");
  };

  const base = pair.split("/")[0];
  const counter = pair.split("/")[1];

  return (
    <div className="bg-black border border-white border-opacity-40 rounded-xl p-4 text-white w-full font-montserrat font-[300]">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-orbitron font-[500] text-xcannes-green">Trade {base}</h2>
        <div className="flex gap-2">
          {["BUY", "SELL"].map((opt) => (
            <button
              key={opt}
              onClick={() => setMode(opt)}
              className={`px-4 py-1 rounded text-sm border font-montserrat font-[500] ${
                mode === opt
                  ? "bg-xcannes-green text-white border-xcannes-green"
                  : "bg-xcannes-red border-xcannes-red"
              }`}
            >
              {opt === "BUY" ? `Acheter ${base}` : `Vendre ${base}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {["market", "limit"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`px-3 py-1 rounded text-sm border font-[500] ${
              orderType === type
                ? "bg-xcannes-green text-white border-xcannes-green"
                : "border-white border-opacity-30"
            }`}
          >
            {type === "market" ? "Market" : "Limit"}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-[400]">Montant ({base}) :</label>
        <TokenAmountInput value={amount} onChange={setAmount} token={base} />
      </div>

      <div className="flex gap-2 mb-4">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            onClick={() => setPercent(pct)}
            className="px-3 py-1 border border-white border-opacity-30 rounded hover:bg-xcannes-green hover:text-black text-sm font-[400]"
          >
            {pct}%
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <label className="block mb-1 text-sm font-[400]">Prix ({counter}) :</label>
          <TokenAmountInput value={price} onChange={setPrice} token={counter} />
        </div>
      )}

      <p className="text-sm text-gray-300 mb-4 font-[400]">
        Total à payer : <span className="text-xcannes-green font-[500]">{getTotal()} {counter}</span>
      </p>

      <button
        onClick={handleSubmit}
        className="bg-xcannes-green hover:bg-green-200 transition text-white px-4 py-2 rounded text-sm font-[500] w-full"
      >
        🔁 Simuler l'ordre
      </button>
    </div>
  );
}
