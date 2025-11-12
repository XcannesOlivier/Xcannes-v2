"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function OrderBookWithHistory({ pair }) {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch OrderBook
  const fetchOrderbook = async () => {
    const client = new Client("wss://xrplcluster.com");
    try {
      await client.connect();
      const book = getBookIdFromPair(pair);
      if (!book) return;

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
      console.error("Erreur orderbook:", err);
      setLoading(false);
    } finally {
      if (client.isConnected()) await client.disconnect();
    }
  };

  // Fetch Trade History
  const fetchTradeHistory = async () => {
    const client = new Client("wss://s1.ripple.com");
    try {
      await client.connect();
      const book = getBookIdFromPair(pair);
      if (!book?.taker_gets?.issuer) return;

      const res = await client.request({
        command: "account_tx",
        account: book.taker_gets.issuer,
        ledger_index_min: "validated",
        ledger_index_max: "validated",
        limit: 100,
      });

      const getAmount = (val) =>
        typeof val === "object"
          ? parseFloat(val.value)
          : parseFloat(val) / 1_000_000;

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
            type: Math.random() > 0.5 ? "buy" : "sell",
          };
        })
        .filter((t) => t.price);

      setHistory(parsed.slice(0, 20));
    } catch (err) {
      console.error("Erreur history:", err);
    } finally {
      if (client.isConnected()) await client.disconnect();
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrderbook();
    fetchTradeHistory();
    const interval = setInterval(() => {
      fetchOrderbook();
      fetchTradeHistory();
    }, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  const maxAskAmount = Math.max(...asks.map((a) => a.amount || 0), 1);
  const maxBidAmount = Math.max(...bids.map((b) => b.amount || 0), 1);

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white/60 text-sm">Chargement...</p>
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
          Market Data
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Live order book & recent trades
        </p>
      </div>

      {/* Contenu : OrderBook + Trade History côte à côte */}
      <div className="grid md:grid-cols-2 divide-x divide-white/10">
        {/* ORDER BOOK */}
        <div>
          {/* Header OrderBook */}
          <div className="px-4 py-3 bg-white/5">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Order Book
            </h3>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-white/5 text-xs text-white/40 font-medium">
            <div className="text-left">Price</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Total</div>
          </div>

          {/* ASKS */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Sells
              </span>
            </div>
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {asks.map((order, idx) => {
                const depthPercent = (order.amount / maxAskAmount) * 100;
                return (
                  <div key={idx} className="relative group">
                    <div
                      className="absolute inset-y-0 right-0 bg-red-500/10 transition-all group-hover:bg-red-500/20"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <div className="relative grid grid-cols-3 gap-2 py-1 text-xs">
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

          {/* BIDS */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-xcannes-green"></div>
              <span className="text-xs font-semibold text-xcannes-green uppercase tracking-wider">
                Buys
              </span>
            </div>
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {bids.map((order, idx) => {
                const depthPercent = (order.amount / maxBidAmount) * 100;
                return (
                  <div key={idx} className="relative group">
                    <div
                      className="absolute inset-y-0 right-0 bg-xcannes-green/10 transition-all group-hover:bg-xcannes-green/20"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <div className="relative grid grid-cols-3 gap-2 py-1 text-xs">
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

          {/* Spread */}
          <div className="px-4 py-2 border-t border-white/5 bg-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Spread:</span>
              <span className="text-white font-semibold">
                {asks[0] && bids[0]
                  ? (asks[0].price - bids[0].price).toFixed(6)
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* TRADE HISTORY */}
        <div>
          {/* Header Trade History */}
          <div className="px-4 py-3 bg-white/5">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Trade History
            </h3>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-white/5 text-xs text-white/40 font-medium">
            <div className="text-left">Price</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Time</div>
            <div className="text-right">Type</div>
          </div>

          {/* Trade List */}
          <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/40 text-sm">No recent trades</p>
              </div>
            ) : (
              history.map((tx, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <div className="text-xs font-semibold text-white">
                    {tx.price?.toFixed(6)}
                  </div>
                  <div className="text-xs text-white/80 text-right">
                    {tx.amount?.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/60 text-right">
                    {tx.executed_time.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${
                        tx.type === "buy"
                          ? "bg-xcannes-green/20 text-xcannes-green"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {tx.type === "buy" ? "B" : "S"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
