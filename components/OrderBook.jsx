"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function OrderBook({ pair }) {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  const fetchOrderbook = async () => {
    const client = new Client("wss://s1.ripple.com");
    try {
      await client.connect();

      const book = getBookIdFromPair(pair);
      if (!book) {
        console.warn("❌ Paire inconnue :", pair);
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
        typeof value === "object" ? parseFloat(value.value) : parseFloat(value) / 1_000_000;

      const parsed = offers.map((offer) => {
        const amount = getAmount(offer.TakerGets);
        const total = getAmount(offer.TakerPays);
        const price = amount > 0 ? total / amount : 0;
        return { price, amount };
      });

      setAsks(parsed.slice(0, 10));
      setBids(parsed.slice().reverse().slice(0, 10));
    } catch (err) {
      console.error("❌ Erreur fetch orderbook :", err);
    } finally {
      // Toujours fermer la connexion
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

  return (
    <div
      className="grid grid-cols-2 gap-4 text-sm bg-black p-4 rounded border border-white/40 font-montserrat font-[300]"
    >
      {/* VENTES (ASKS) */}
      <div>
        <h2 className="text-xcannes-red font-[500] mb-2">Ventes (Ask)</h2>
        <ul className="space-y-1">
          {asks.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-xcannes-red font-[500]">{order.price?.toFixed(6)}</span>
              <span className="text-white">{order.amount?.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ACHATS (BIDS) */}
      <div>
        <h2 className="text-xcannes-green font-[500] mb-2">Achats (Bid)</h2>
        <ul className="space-y-1">
          {bids.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-xcannes-green font-[500]">{order.price?.toFixed(6)}</span>
              <span className="text-white">{order.amount?.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
