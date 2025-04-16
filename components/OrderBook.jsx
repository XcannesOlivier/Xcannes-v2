import { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket"; // Utilisation du hook WebSocket

const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
};

const OrderBook = ({ pair }) => {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  // Callback pour gérer les messages WebSocket
  const handleWebSocketMessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data.type === "transaction" && data.engine_result === "tesSUCCESS") {
        // Logique pour filtrer les ordres
        const orders = data.orders || [];
        const _asks = orders.filter((o) => o.taker === "XCS").slice(0, 10);
        const _bids = orders.filter((o) => o.taker === "XRP").slice(0, 10);
        
        setAsks(_asks);
        setBids(_bids);
      }
    } catch (err) {
      console.warn("Erreur dans le flux WebSocket:", err);
    }
  };

  // Utilisation du hook WebSocket
  useWebSocket("wss://s2.ripple.com", handleWebSocketMessage);

  return (
    <div className="grid grid-cols-2 gap-4 text-sm bg-black p-4 rounded border font-montserrat font-[300]">
      <div>
        <h2 className="text-xcannes-red font-[500] mb-2">Ventes (Ask)</h2>
        <ul className="space-y-1">
          {asks.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-red-500">{parseFloat(order.price).toFixed(6)}</span>
              <span className="text-gray-300">{parseFloat(order.amount).toFixed(2)} XCS</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xcannes-green font-[500] mb-2">Achats (Bid)</h2>
        <ul className="space-y-1">
          {bids.map((order, idx) => (
            <li key={idx} className="flex justify-between">
              <span className="text-green-500">{parseFloat(order.price).toFixed(6)}</span>
              <span className="text-gray-300">{parseFloat(order.amount).toFixed(2)} XRP</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderBook;
