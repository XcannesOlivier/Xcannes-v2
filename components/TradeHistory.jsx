import { useEffect, useState } from "react";
import axios from "axios";

export default function TradeHistory({ pair }) {
  const [history, setHistory] = useState([]);

  const PAIRS = {
    "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
    "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
    "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
    "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=5m&limit=20
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Erreur historique des transactions :", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div
      className="mt-8 bg-black p-4 border border-white border-opacity-40 rounded text-sm font-montserrat font-[300]"
    
    >
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
              <td className="font-[200]">{parseFloat(tx.amount).toFixed(2)} {tx.taker}</td>
              <td className="font-[300]">{new Date(tx.executed_time).toLocaleTimeString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}