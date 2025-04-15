"use client";

import React, { useEffect, useState } from "react";
import { Chart } from "lightweight-charts-react-wrapper";
import axios from "axios";

const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChart = ({ pair = "XCS/XRP" }) => {
  const [ohlcData, setOhlcData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const apiURL = `https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`;
      console.log("🧠 Composant monté - pair =", pair);
      console.log("📡 URL API :", apiURL);

      try {
        const res = await axios.get(apiURL);
        console.log("✅ Données reçues :", res.data);

        const formatted = res.data.map((item) => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        console.log("📊 Données formatées :", formatted);
        setOhlcData(formatted);
      } catch (err) {
        console.error("❌ Erreur OHLC XRPL :", err);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div
      className="w-full relative"
      style={{
        height: "400px",
        backgroundColor: "#000",
        border: "1px solid #444",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    >
      {ohlcData.length > 0 ? (
        <Chart
          key={pair}
          candlestickSeries={[{ data: ohlcData }]}
          autoWidth
          height={400}
        />
      ) : (
        <div className="text-gray-400 text-center py-16">
          Aucune donnée disponible pour cette paire actuellement.
        </div>
      )}
    </div>
  );
};

export default XrplCandleChart;
