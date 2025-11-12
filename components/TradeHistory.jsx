"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function TradeHistory({ pair }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTradeHistory = async () => {
    const client = new Client("wss://s1.ripple.com");

    try {
      setLoading(true);
      await client.connect();
      const book = getBookIdFromPair(pair);
      if (!book?.taker_gets?.issuer) {
        console.warn("Paire invalide :", pair);
        setLoading(false);
        return;
      }

      const res = await client.request({
        command: "account_tx",
        account: book.taker_gets.issuer,
        ledger_index_min: "validated",
        ledger_index_max: "validated",
        limit: 100,
      });

      const getAmount = (val) =>
        typeof val === "object" ? parseFloat(val.value) : parseFloat(val) / 1_000_000;

      const parsed = res.result.transactions
        .filter((tx) => tx.tx.TransactionType === "OfferCreate")
        .map((tx) => {
          const gets = getAmount(tx.tx.TakerGets);
          const pays = getAmount(tx.tx.TakerPays);
          const price = gets > 0 ? pays / gets : null;

          return {
            price,
            amount: gets,
            taker: book.taker_gets.currency,
            executed_time: new Date(tx.tx.date * 1000 + 946684800000),
            type: Math.random() > 0.5 ? "buy" : "sell", // Simulation type
          };
        })
        .filter((t) => t.price);

      setHistory(parsed.slice(0, 20));
      setLoading(false);
    } catch (err) {
      console.error("Erreur historique (XRPL) :", err);
      setLoading(false);
    } finally {
      if (client.isConnected()) await client.disconnect();
    }
  };

  useEffect(() => {
    fetchTradeHistory();
    const interval = setInterval(fetchTradeHistory, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white/60 text-sm">Chargement de l'historique...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-orbitron font-bold text-white">Trade History</h2>
        <p className="text-xs text-white/40 mt-1">Recent transactions</p>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-white/5 text-xs text-white/40 font-medium">
        <div className="text-left">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Time</div>
        <div className="text-right">Type</div>
      </div>

      {/* Content */}
      <div className="divide-y divide-white/5">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-white/40 text-sm">Aucune transaction récente</p>
          </div>
        ) : (
          history.map((tx, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              {/* Price */}
              <div className="text-sm font-semibold text-white">
                {tx.price?.toFixed(6)}
              </div>

              {/* Amount */}
              <div className="text-sm text-white/80 text-right">
                {tx.amount?.toFixed(2)}
                <span className="text-white/40 ml-1 text-xs">{tx.taker}</span>
              </div>

              {/* Time */}
              <div className="text-xs text-white/60 text-right">
                {tx.executed_time.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>

              {/* Type */}
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    tx.type === "buy"
                      ? "bg-xcannes-green/20 text-xcannes-green"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {tx.type === "buy" ? "Buy" : "Sell"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/40">
          Showing {history.length} recent trades
        </p>
        <button className="text-xs text-xcannes-green hover:text-xcannes-green/80 transition-colors font-medium">
          View All →
        </button>
      </div>
    </div>
  );
}
