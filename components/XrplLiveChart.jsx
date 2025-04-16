"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const XrplLiveChart = () => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#000" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: {
        borderColor: "#555",
      },
      priceScale: {
        borderColor: "#555",
      },
    });

    chartInstance.current = chart;

    candleSeries.current = chart.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#e70707",
      borderVisible: false,
      wickUpColor: "#16b303",
      wickDownColor: "#e70707",
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchCandle = async () => {
      try {
        const res = await axios.get(
          "https://data.xrplf.org/v1/iou/ticker_data/XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000?interval=1h"
        );
        const raw = res.data?.[0];
        if (!raw) return;

        const candle = {
          time: Math.floor(new Date(raw.date_to).getTime() / 1000),
          open: parseFloat(raw.first),
          high: parseFloat(raw.high),
          low: parseFloat(raw.low),
          close: parseFloat(raw.last),
        };
        console.log("📊 Candle:", candle);
        candleSeries.current.update(candle);
      } catch (e) {
        console.warn("⚠️ Erreur chargement données XRP/RLUSD :", e);
      }
    };

    fetchCandle(); // premier appel immédiat
    intervalRef.current = setInterval(fetchCandle, 60000); // toutes les minutes

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px", border: "2px dashed green" }}
    ></div>
  );
};

export default XrplLiveChart;
