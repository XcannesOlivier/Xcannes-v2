"use client";

import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function TradeHistory({ pair }) {
  const [history, setHistory] = useState([]);

  const fetchTradeHistory = async () => {
    const client = new Client("wss://s1.ripple.com");

    try {
      await client.connect();
      const book = getBookIdFromPair(pair);
      if (!book?.taker_gets?.issuer) return console.warn("❌ Paire invalide :", pair);

      const res = await client.request({
        command: "account_tx",
        account: book.taker_gets.issuer,
        ledger_index_min: -10000,
        ledger_index_max: -1,
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
            executed_time: new Date(tx.tx.date * 1000 + 946684800000), // Ripple epoch
          };
        })
        .filter((t) => t.price); // Nettoyage

      setHistory(parsed.slice(0, 10));
    } catch (err) {
      console.error("❌ Erreur historique (XRPL) :", err);
    } finally {
      if (client.isConnected()) await client.disconnect();
    }
  };

  useEffect(() => {
    fetchTradeHistory();
    const interval = setInterval(fetchTradeHistory, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div className="mt-8 bg-black p-4 border border-white border-opacity-40 rounded text-sm font-montserrat font-[300]">
      <h2 className="text-white text-lg font-[500] mb-2">Historique des transactions</h2>
      <table className="w-full text-left text-white">
        <thead>
          <tr className="text-gray-300 border-b border-white border-opacity-30 text-sm">
            <th>Prix</th>
            <th>Montant</th>
            <th>Heure</th>
          </tr>
        </thead>
        <tbody>
          {history.map((tx, idx) => (
            <tr key={idx} className="border-b border-white border-opacity-20 text-sm">
              <td className="text-xcannes-green font-[500]">{tx.price?.toFixed(6)}</td>
              <td className="font-[200]">{tx.amount?.toFixed(2)} {tx.taker}</td>
              <td className="font-[300]">{tx.executed_time.toLocaleTimeString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
