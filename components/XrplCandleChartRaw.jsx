"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const PAIRS = {
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChartFinal = ({ pair = "XCS/RLUSD" }) => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderChart = async () => {
      try {
        const res = await axios.get(`https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`);
        const data = res.data.map(item => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        if (!chartRef.current) return;

        // Reset si déjà un chart existant
        chartRef.current.innerHTML = "";

        const chart = createChart(chartRef.current, {
          width: chartRef.current.clientWidth,
          height: 400,
          layout: { background: { color: "#000" }, textColor: "#fff" },
          grid: {
            vertLines: { color: "#2B2B43" },
            horzLines: { color: "#363C4E" },
          },
          timeScale: { borderColor: "#485c7b" },
          priceScale: { borderColor: "#485c7b" },
        });

        chartInstanceRef.current = chart;

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(data);

        // resize dynamique
        const observer = new ResizeObserver(() => {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        });
        observer.observe(chartRef.current);

        return () => observer.disconnect();
      } catch (err) {
        console.error("📉 Erreur chargement données chart :", err);
      }
    };

    fetchAndRenderChart();
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

export default XrplCandleChartFinal;
