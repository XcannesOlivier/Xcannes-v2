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

        console.log("📊 Données formatées :", data);

        if (!chartRef.current) return;

        chartRef.current.innerHTML = ""; // reset du conteneur

        setTimeout(() => {
          const width = chartRef.current.clientWidth;
          console.log("📐 Largeur détectée:", width);

          const chart = createChart(chartRef.current, {
            width,
            height: 400,
            layout: {
              background: { color: "#485c7b"},
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

          const observer = new ResizeObserver(() => {
            chart.applyOptions({ width: chartRef.current.clientWidth });
          });
          observer.observe(chartRef.current);

          // Clean-up à la destruction du composant
          return () => observer.disconnect();

        }, 50); // petit délai pour que le conteneur ait sa taille réelle
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

export default XrplCandleChartRaw;

