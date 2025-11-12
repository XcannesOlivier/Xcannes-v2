"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function OrderBook({ pair }) {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderbook = async () => {
    const client = new Client("wss://xrplcluster.com");
    try {
      await client.connect();

      const book = getBookIdFromPair(pair);
      if (!book) {
        console.warn("Paire inconnue :", pair);
        return;
      }

      const res = await client.request({
        command: "book_offers",
        taker_gets: book.taker_gets,
        taker_pays: book.taker_pays,
        limit: 20,
      });

      const offers = res.result.offers || [];

      const getAmount = (value) =>
        typeof value === "object"
          ? parseFloat(value.value)
          : parseFloat(value) / 1_000_000;

      const parsed = offers.map((offer) => {
        const amount = getAmount(offer.TakerGets);
        const total = getAmount(offer.TakerPays);
        const price = amount > 0 ? total / amount : 0;
        return { price, amount, total };
      });

      setAsks(parsed.slice(0, 10));
      setBids(parsed.slice().reverse().slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.error("Erreur fetch orderbook :", err);
      setLoading(false);
    } finally {
      if (client.isConnected()) {
        await client.disconnect();
      }
    }
  };

  useEffect(() => {
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  // Calcul des max pour les barres de profondeur
  const maxAskAmount = Math.max(...asks.map((a) => a.amount || 0), 1);
  const maxBidAmount = Math.max(...bids.map((b) => b.amount || 0), 1);

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white/60 text-sm">
              Chargement de l'order book...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-orbitron font-bold text-white">
          Order Book
        </h2>
        <p className="text-xs text-white/40 mt-1">Live market depth</p>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-white/5 text-xs text-white/40 font-medium">
        <div className="text-left">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 divide-x divide-white/10">
        {/* ASKS (Ventes - Rouge) */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Sell Orders
            </span>
          </div>

          <div className="space-y-1">
            {asks.map((order, idx) => {
              const depthPercent = (order.amount / maxAskAmount) * 100;
              return (
                <div key={idx} className="relative group">
                  {/* Barre de profondeur */}
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/10 transition-all duration-300 group-hover:bg-red-500/20"
                    style={{ width: `${depthPercent}%` }}
                  />

                  {/* Données */}
                  <div className="relative grid grid-cols-3 gap-2 py-1.5 text-xs">
                    <div className="text-red-400 font-semibold">
                      {order.price?.toFixed(6)}
                    </div>
                    <div className="text-white/80 text-right">
                      {order.amount?.toFixed(2)}
                    </div>
                    <div className="text-white/60 text-right">
                      {order.total?.toFixed(4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BIDS (Achats - Vert) */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-xcannes-green"></div>
            <span className="text-xs font-semibold text-xcannes-green uppercase tracking-wider">
              Buy Orders
            </span>
          </div>

          <div className="space-y-1">
            {bids.map((order, idx) => {
              const depthPercent = (order.amount / maxBidAmount) * 100;
              return (
                <div key={idx} className="relative group">
                  {/* Barre de profondeur */}
                  <div
                    className="absolute inset-y-0 right-0 bg-xcannes-green/10 transition-all duration-300 group-hover:bg-xcannes-green/20"
                    style={{ width: `${depthPercent}%` }}
                  />

                  {/* Données */}
                  <div className="relative grid grid-cols-3 gap-2 py-1.5 text-xs">
                    <div className="text-xcannes-green font-semibold">
                      {order.price?.toFixed(6)}
                    </div>
                    <div className="text-white/80 text-right">
                      {order.amount?.toFixed(2)}
                    </div>
                    <div className="text-white/60 text-right">
                      {order.total?.toFixed(4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Best Ask</p>
          <p className="text-sm font-semibold text-red-400">
            {asks[0]?.price?.toFixed(6) || "-"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Best Bid</p>
          <p className="text-sm font-semibold text-xcannes-green">
            {bids[0]?.price?.toFixed(6) || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
