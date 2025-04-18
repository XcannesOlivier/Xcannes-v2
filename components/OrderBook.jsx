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
      if (!book) return console.warn("❌ Paire inconnue");

      const res = await client.request({
        command: "book_offers",
        taker_gets: book.taker_gets,
        taker_pays: book.taker_pays,
        limit: 20,
      });

      const offers = res.result.offers;

      const getAmount = (value) => {
        if (typeof value === "object") return parseFloat(value.value);
        return parseFloat(value) / 1_000_000;
      };

      const parsed = offers.map((offer) => {
        const amount = getAmount(offer.TakerGets);
        const total = getAmount(offer.TakerPays);
        const price = total / amount;
        return { price, amount };
      });

      // 👉 La logique XRPL c’est : taker_gets = ce que le vendeur donne
      // Donc ASK = vendeurs (offres existantes)
      // BID = inverse (on inverse l’ordre pour cohérence visuelle)
      setAsks(parsed.slice(0, 10));
      setBids(parsed.slice().reverse().slice(0, 10));

      await client.disconnect();
    } catch (err) {
      console.error("❌ Erreur WebSocket Orderbook:", err);
      client.disconnect();
    }
  };

  useEffect(() => {
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 15000); // auto-refresh 15s
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div
      className="grid grid-cols-2 gap-4 text-sm bg-black p-4 rounded border font-montserrat font-[300]"
      style={{ borderColor: "rgba(174 175 174)" }}
    >
      <div>
        <h2 className="text-xcannes-red font-[500] mb-2">Ventes (Ask)</h2>
        <ul className="space-y-1">
          {asks.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-red-500">{order.price.toFixed(6)}</span>
              <span className="text-gray-300">{order.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xcannes-green font-[500] mb-2">Achats (Bid)</h2>
        <ul className="space-y-1">
          {bids.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-green-500">{order.price.toFixed(6)}</span>
              <span className="text-gray-300">{order.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
