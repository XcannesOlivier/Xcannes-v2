"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

export default function XrplCandleChartTest() {
  const chartRef = useRef();

  useEffect(() => {
    let chart;

    const fetchAndRenderChart = async () => {
      try {
        const res = await axios.get(
          "https://data.xrplf.org/v1/iou/exchanges/XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000?interval=1m&limit=100"
        );

        const data = res.data.map(item => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        if (!chartRef.current) return;

        chart = createChart(chartRef.current, {
          width: 800,
          height: 400,
        });

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(data);
      } catch (err) {
        console.error("Erreur chargement données :", err);
      }
    };

    fetchAndRenderChart();

    return () => {
      if (chart) chart.remove();
    };
  }, []);

  return <div ref={chartRef}></div>;
}
