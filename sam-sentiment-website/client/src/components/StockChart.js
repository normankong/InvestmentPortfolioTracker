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
import Spinner from "../components/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StockChart({ symbol }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      console.log("Fetching data");
      let json = await apiHelper.getQuote(symbol);
      if (!json.daily){
        setTimeout(fetchData , 1000);
        return;
      }

      let dailyList = json.daily["Time Series (Daily)"];
      let labels = [];
      let prices = [];
      for (let item in dailyList){
        labels.push(item);
        prices.push(dailyList[item]["4. close"]);
      }

      // let labels = list.history.map((item) => item.date);
      // let prices = list.history.map((item) => item.close);
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
    };

    fetchData();

  }, [symbol]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "N/A"
      },
    },
  };

  if (chartData === null) return <Spinner/>

  return chartData ? <Line options={options} data={chartData} /> : <>Loading</>;
}
