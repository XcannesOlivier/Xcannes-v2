"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const PAIRS = {
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChartRaw = ({ pair = "XCS/RLUSD" }) => {
  const chartRef = useRef();

  useEffect(() => {
    const apiURL = `https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`;
    console.log("🎯 API:", apiURL);

    const renderChart = async () => {
      try {
        const res = await axios.get(apiURL);
        const data = res.data.map((item) => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        console.log("📊 Data:", data);

        if (chartRef.current) {
          chartRef.current.innerHTML = ""; // reset chart before re-render

          setTimeout(() => {
            const chart = createChart(chartRef.current, {
              width: chartRef.current.clientWidth,
              height: 400,
              layout: {
                background: { color: "#000" },
                textColor: "#fff"
              },
              grid: {
                vertLines: { color: "#2B2B43" },
                horzLines: { color: "#363C4E" }
              },
              timeScale: { borderColor: "#485c7b" },
              priceScale: { borderColor: "#485c7b" }
            });

            const candleSeries = chart.addCandlestickSeries();
            candleSeries.setData(data);
          }, 100); // petit délai pour éviter le canvas ghost
        }
      } catch (err) {
        console.error("Erreur fetch chart :", err);
      }
    };

    renderChart();
  }, [pair]);

  return (
    <div
      ref={chartRef}
      style={{
        height: "400px",
        backgroundColor: "#000",
        border: "1px solid #444",
        borderRadius: "10px"
      }}
    />
  );
};

export default XrplCandleChartRaw;
