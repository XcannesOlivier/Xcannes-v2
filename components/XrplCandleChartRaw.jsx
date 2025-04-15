"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const PAIRS = {
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"
};

const XrplCandleChartRaw = ({ pair = "XCS/RLUSD" }) => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    let chart = null;
    let observer = null;

    const fetchAndRenderChart = async () => {
      try {
        const res = await axios.get(`https://data.xrplf.org/v1/iou/exchanges/${PAIRS[pair]}?interval=1m&limit=100`);
        let data = res.data.map(item => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        console.log("📊 Données formatées :", data);

        // fallback si données vides
        if (data.length === 0 || data.every(d => d.open === d.close && d.high === d.low)) {
          console.warn("🧪 Données vides ou plates – fallback mock");
          data = [
            { time: 1713180000, open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
            { time: 1713180600, open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
            { time: 1713181200, open: 0.53, high: 0.58, low: 0.52, close: 0.56 },
          ];
        }

        if (!chartRef.current) return;
        chartRef.current.innerHTML = "";

        setTimeout(() => {
          const width = chartRef.current.clientWidth;
          console.log("📐 Largeur détectée:", width);

          chart = createChart(chartRef.current, {
            width,
            height: 400,
            layout: {
              background: { color: "#000" },
              textColor: "#fff"
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

          chartInstanceRef.current = chart;

          const candleSeries = chart.addCandlestickSeries();
          candleSeries.setData(data);

          observer = new ResizeObserver(() => {
            chart.applyOptions({ width: chartRef.current.clientWidth });
          });
          observer.observe(chartRef.current);
        }, 50);
      } catch (err) {
        console.error("📉 Erreur chargement données chart :", err);
      }
    };

    fetchAndRenderChart();

    return () => {
      if (observer) observer.disconnect();
      if (chart) chart.remove();
    };
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
