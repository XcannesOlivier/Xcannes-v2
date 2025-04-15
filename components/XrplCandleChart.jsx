"use client";

import React, { useEffect, useRef } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";

const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChartRaw = ({ pair = "XCS/XRP" }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const fetchAndRenderChart = async () => {
      const apiURL = `https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`;
      console.log("📡 API:", apiURL);

      try {
        const res = await axios.get(apiURL);
        const data = res.data.map((item) => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        console.log("✅ Données formatées :", data);

        chartContainerRef.current.innerHTML = ""; // reset si re-render

        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { color: "#000000" },
            textColor: "#ffffff",
          },
          grid: {
            vertLines: { color: "#2B2B43" },
            horzLines: { color: "#363C4E" },
          },
          timeScale: {
            borderColor: "#485c7b",
          },
          priceScale: {
            borderColor: "#485c7b",
          },
        });

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(data);

        const handleResize = () => {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      } catch (err) {
        console.error("❌ Erreur API chart :", err);
      }
    };

    fetchAndRenderChart();
  }, [pair]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
      style={{ height: "400px", border: "1px solid #444", borderRadius: "10px", backgroundColor: "#000" }}
    />
  );
};

export default XrplCandleChartRaw;

