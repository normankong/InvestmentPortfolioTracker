/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import apiHelper from "../api/apiHelper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StockChart({ data, symbol, name }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    (async () => {

      let list = (data) ?  data : await apiHelper.getQuote(symbol);
      let labels = list.history.map((item) => item.date);
      let prices = list.history.map((item) => item.close);
      const chartData = {
        labels,
        datasets: [
          {
            label: symbol,
            data: prices,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
      setChartData(chartData);
    })();
  }, [data, symbol]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: (name) ,
        text: name,
      },
    },
  };

  return chartData ? <Line options={options} data={chartData} /> : <>Loading</>;
}
