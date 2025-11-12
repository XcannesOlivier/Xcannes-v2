"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";
import TokenAmountInput from "./TokenAmountInput";

export default function TradingPanel({ pair }) {
  // TradeBox states
  const [mode, setMode] = useState("BUY");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0.00001);
  const [book, setBook] = useState(null);
  const simulatedBalance = 1000;

  // OrderBook & History states
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch book info
  useEffect(() => {
    const b = getBookIdFromPair(pair);
    setBook(b);
  }, [pair]);

  // Fetch OrderBook
  const fetchOrderbook = async () => {
    const client = new Client("wss://xrplcluster.com");
    try {
      await client.connect();
      const bookData = getBookIdFromPair(pair);
      if (!bookData) return;

      const res = await client.request({
        command: "book_offers",
        taker_gets: bookData.taker_gets,
        taker_pays: bookData.taker_pays,
        limit: 10,
      });

      const offers = res.result.offers || [];
      const getAmount = (value) =>
        typeof value === "object"
          ? parseFloat(value.value)
          : parseFloat(value) / 1_000_000;

      const parsed = offers.map((offer) => {
        const amt = getAmount(offer.TakerGets);
        const tot = getAmount(offer.TakerPays);
        const prc = amt > 0 ? tot / amt : 0;
        return { price: prc, amount: amt, total: tot };
      });

      setAsks(parsed.slice(0, 5));
      setBids(parsed.slice().reverse().slice(0, 5));
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
      const bookData = getBookIdFromPair(pair);
      if (!bookData?.taker_gets?.issuer) return;

      const res = await client.request({
        command: "account_tx",
        account: bookData.taker_gets.issuer,
        ledger_index_min: "validated",
        ledger_index_max: "validated",
        limit: 50,
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
          const prc = gets > 0 ? pays / gets : null;

          return {
            price: prc,
            amount: gets,
            taker: bookData.taker_gets.currency,
            executed_time: new Date(tx.tx.date * 1000 + 946684800000),
            type: Math.random() > 0.5 ? "buy" : "sell",
          };
        })
        .filter((t) => t.price);

      setHistory(parsed.slice(0, 10));
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

  // TradeBox functions
  const getTotal = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return "0.00";
    return (val * price).toFixed(6);
  };

  const setPercent = (pct) => {
    const val = ((simulatedBalance * pct) / 100).toFixed(2);
    setAmount(val);
  };

  const handleOrder = () => {
    console.log("Order simulated:", { mode, orderType, amount, price, pair });
  };

  const base = pair.split("/")[0];
  const counter = pair.split("/")[1];
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
          Trading Panel
        </h2>
        <p className="text-xs text-white/40 mt-1">
          Place orders & view market data
        </p>
      </div>

      {/* Main Grid: 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* COLONNE 1 : TradeBox */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
            Place Order
          </h3>

          {/* BUY/SELL Toggle */}
          <div className="flex gap-2 mb-4">
            {["BUY", "SELL"].map((opt) => (
              <button
                key={opt}
                onClick={() => setMode(opt)}
                className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                  mode === opt
                    ? "bg-xcannes-green text-white"
                    : opt === "BUY"
                    ? "bg-xcannes-green/20 text-xcannes-green hover:bg-xcannes-green/30"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {opt === "BUY" ? "Buy" : "Sell"} {base}
              </button>
            ))}
          </div>

          {/* Market/Limit */}
          <div className="flex gap-2 mb-4">
            {["market", "limit"].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-3 py-1 rounded text-xs border font-semibold transition-all ${
                  orderType === type
                    ? "bg-xcannes-green text-white border-xcannes-green"
                    : "border-white/10 hover:border-white/20 text-white/60"
                }`}
              >
                {type === "market" ? "Market" : "Limit"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="block mb-1 text-xs text-white/60">
              Amount ({base})
            </label>
            <TokenAmountInput
              value={amount}
              onChange={setAmount}
              token={base}
            />
          </div>

          {/* Percentage buttons */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setPercent(pct)}
                className="px-2 py-1 border border-white/10 rounded hover:bg-xcannes-green hover:text-black transition-all text-xs"
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Price (if limit) */}
          {orderType === "limit" && (
            <div className="mb-3">
              <label className="block mb-1 text-xs text-white/60">
                Price ({counter})
              </label>
              <TokenAmountInput
                value={price}
                onChange={setPrice}
                token={counter}
              />
            </div>
          )}

          {/* Total */}
          <p className="text-xs text-white/60 mb-3">
            Total:{" "}
            <span className="text-xcannes-green font-semibold">
              {getTotal()} {counter}
            </span>
          </p>

          {/* Submit Button */}
          <button
            onClick={handleOrder}
            className="bg-xcannes-green hover:scale-105 transition text-white px-4 py-2 rounded text-sm font-semibold w-full"
          >
            Place {mode} Order
          </button>
        </div>

        {/* COLONNE 2 : OrderBook */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
            Order Book
          </h3>

          {/* Headers */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-white/40 font-medium">
            <div>Price</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Total</div>
          </div>

          {/* ASKS */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-1 rounded-full bg-red-500"></div>
              <span className="text-xs font-semibold text-red-400">SELLS</span>
            </div>
            <div className="space-y-0.5">
              {asks.slice(0, 5).map((order, idx) => {
                const depthPercent = (order.amount / maxAskAmount) * 100;
                return (
                  <div key={idx} className="relative">
                    <div
                      className="absolute inset-y-0 right-0 bg-red-500/10"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <div className="relative grid grid-cols-3 gap-2 py-0.5 text-xs">
                      <div className="text-red-400 font-semibold">
                        {order.price?.toFixed(6)}
                      </div>
                      <div className="text-white/70 text-right">
                        {order.amount?.toFixed(2)}
                      </div>
                      <div className="text-white/50 text-right">
                        {order.total?.toFixed(4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spread */}
          <div className="my-2 py-1 text-center border-y border-white/5">
            <span className="text-xs text-white/40">
              Spread:{" "}
              {asks[0] && bids[0]
                ? (asks[0].price - bids[0].price).toFixed(6)
                : "-"}
            </span>
          </div>

          {/* BIDS */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-1 rounded-full bg-xcannes-green"></div>
              <span className="text-xs font-semibold text-xcannes-green">
                BUYS
              </span>
            </div>
            <div className="space-y-0.5">
              {bids.slice(0, 5).map((order, idx) => {
                const depthPercent = (order.amount / maxBidAmount) * 100;
                return (
                  <div key={idx} className="relative">
                    <div
                      className="absolute inset-y-0 right-0 bg-xcannes-green/10"
                      style={{ width: `${depthPercent}%` }}
                    />
                    <div className="relative grid grid-cols-3 gap-2 py-0.5 text-xs">
                      <div className="text-xcannes-green font-semibold">
                        {order.price?.toFixed(6)}
                      </div>
                      <div className="text-white/70 text-right">
                        {order.amount?.toFixed(2)}
                      </div>
                      <div className="text-white/50 text-right">
                        {order.total?.toFixed(4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLONNE 3 : Trade History */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
            Recent Trades
          </h3>

          {/* Headers */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-white/40 font-medium">
            <div>Price</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Time</div>
          </div>

          {/* Trade List */}
          <div className="space-y-1 max-h-[350px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">
                No recent trades
              </p>
            ) : (
              history.map((tx, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 gap-2 py-1.5 hover:bg-white/5 rounded transition-colors"
                >
                  <div
                    className={`text-xs font-semibold ${
                      tx.type === "buy" ? "text-xcannes-green" : "text-red-400"
                    }`}
                  >
                    {tx.price?.toFixed(6)}
                  </div>
                  <div className="text-xs text-white/70 text-right">
                    {tx.amount?.toFixed(2)}
                  </div>
                  <div className="text-xs text-white/50 text-right">
                    {tx.executed_time.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
