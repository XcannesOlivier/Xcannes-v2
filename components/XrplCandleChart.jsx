"use client";

import React, { useEffect, useState } from "react";
import { Chart } from "lightweight-charts-react-wrapper";
import axios from "axios";

const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChart = ({ pair = "XCS/XRP" }) => {
  const [ohlcData, setOhlcData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`
        );

        const formatted = res.data.map((item) => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        setOhlcData(formatted);
      } catch (err) {
        console.error("Erreur OHLC XRPL :", err);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 15000);
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div className="w-full h-[400px] bg-black border border-white border-opacity-20 rounded">
      <Chart candlestickSeries={[{ data: ohlcData }]} autoWidth height={400} />
    </div>
  );
};

export default XrplCandleChart;
