import { useState, useEffect } from "react";
import { useMarketData } from "../hooks/useMarketData"; // Utilisation du hook de données de marché

const TradeHistory = ({ pair }) => {
  const [history, setHistory] = useState([]);
  const marketData = useMarketData(pair); // récupération des données de marché via le hook

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`https://data.xrplf.org/v1/iou/exchanges/${pair}?interval=5m&limit=20`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Erreur historique des transactions :", err);
      }
    };

    if (pair) fetchHistory();
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
          {history.slice(0, 10).map((tx, idx) => (
            <tr key={idx} className="border-b border-white border-opacity-20 text-sm">
              <td className="text-xcannes-green font-[500]">{parseFloat(tx.price).toFixed(6)}</td>
              <td className="font-[200]">{parseFloat(tx.amount).toFixed(2)} XCS</td>
              <td className="font-[300]">{new Date(tx.executed_time).toLocaleTimeString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeHistory;
