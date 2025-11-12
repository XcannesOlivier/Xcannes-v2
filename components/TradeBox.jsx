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
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  const simulatedBalance = { XCS: 5000, XRP: 1000 };

  // Récupère les infos de la paire sélectionnée
  useEffect(() => {
    const b = getBookIdFromPair(pair);
    setBook(b);
    // Simuler un prix estimé pour les ordres market
    setEstimatedPrice(0.00001);
  }, [pair]);

  const getTotal = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return "0.00";
    const currentPrice = orderType === "market" ? estimatedPrice : price;
    return (val * currentPrice).toFixed(6);
  };

  const setPercent = (pct) => {
    const base = pair.split("/")[0];
    const balance = mode === "BUY" ? simulatedBalance.XRP : simulatedBalance[base];
    const val = ((balance * pct) / 100).toFixed(2);
    setAmount(val);
  };

  const handleOrder = () => {
    if (!pair) {
      console.warn("❌ Aucune paire sélectionnée");
      return;
    }

    const taker_gets =
      mode === "BUY"
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

    const taker_pays =
      mode === "BUY"
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

    console.log("📦 TX payload :", offerCreatePayload);
    alert("Transaction prête ! Connectez votre wallet pour signer.");
  };

  const base = pair.split("/")[0];
  const counter = pair.split("/")[1];
  const isBuyMode = mode === "BUY";

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-orbitron font-bold text-white">
            Trade {base}
          </h2>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMode("BUY")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                isBuyMode
                  ? "bg-xcannes-green text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setMode("SELL")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                !isBuyMode
                  ? "bg-red-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Order Type Tabs */}
        <div className="flex gap-2">
          {[
            { value: "market", label: "Market", icon: "⚡" },
            { value: "limit", label: "Limit", icon: "🎯" },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setOrderType(type.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                orderType === type.value
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        
        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">
              Amount ({base})
            </label>
            <span className="text-xs text-white/40">
              Balance: <span className="text-white font-semibold">
                {mode === "BUY" ? simulatedBalance.XRP : simulatedBalance[base]} {mode === "BUY" ? counter : base}
              </span>
            </span>
          </div>
          <TokenAmountInput value={amount} onChange={setAmount} token={base} />
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              onClick={() => setPercent(pct)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-xcannes-green/40 rounded-lg text-xs font-medium text-white transition-all"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Price Input (Limit only) */}
        {orderType === "limit" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/60">
                Price ({counter})
              </label>
              <span className="text-xs text-xcannes-green">
                Market: {estimatedPrice?.toFixed(6)}
              </span>
            </div>
            <TokenAmountInput value={price} onChange={setPrice} token={counter} />
          </div>
        )}

        {/* Market Price Info (Market only) */}
        {orderType === "market" && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="text-lg">ℹ️</span>
              <span>
                Market orders execute at the best available price: ~{estimatedPrice?.toFixed(6)} {counter}
              </span>
            </div>
          </div>
        )}

        {/* Summary Box */}
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Order Type</span>
            <span className="text-white font-semibold capitalize">{orderType}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Amount</span>
            <span className="text-white font-semibold">
              {amount || "0.00"} {base}
            </span>
          </div>
          {orderType === "limit" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Price</span>
              <span className="text-white font-semibold">
                {price} {counter}
              </span>
            </div>
          )}
          <div className="h-px bg-white/10 my-2"></div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Total</span>
            <span className={`text-lg font-bold font-orbitron ${isBuyMode ? "text-xcannes-green" : "text-red-400"}`}>
              {getTotal()} {counter}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleOrder}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            isBuyMode
              ? "bg-xcannes-green hover:bg-xcannes-green/90 text-black disabled:bg-xcannes-green/40"
              : "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-500/40"
          } disabled:cursor-not-allowed`}
        >
          {isBuyMode ? `Buy ${base}` : `Sell ${base}`}
        </button>

        {/* Info Footer */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            Connect your wallet to execute trades
          </p>
        </div>
      </div>
    </div>
  );
}
