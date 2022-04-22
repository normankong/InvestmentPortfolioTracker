/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import SimpleTable from "../components/SimpleTable";
import apiHelper from "../api/apiHelper";
import Spinner from "../components/Spinner";

export default function StockTable({ symbol }) {

  const [list, setList] = useState([]);
  
  useEffect(() => {

    const fetchData = async () => {
      console.log("Fetching data");
      let json = await apiHelper.getQuote(symbol);
      if (!json.sentiment){
        setTimeout(fetchData , 1000);
        return;
      }

      let sentiment = json.sentiment;
      let list = [];
      for (let i = 0 ; i < mapping.length; i++){
        list.push({ key : capitalizeWords(mapping[i]), value : sentiment[mapping[i]]});
      }
      setList(list);
    };

    fetchData();

  }, [symbol]);

  if (list.length === 0) return <Spinner/>

  return <SimpleTable list={list} />;
}

let mapping = [];
mapping.push("comment");
mapping.push("neutral");
mapping.push("negative");
mapping.push("mixed");
mapping.push("positive");

function capitalizeWords(word) {
  let arr = word.split(" ")
  return arr.map(element => {
    return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase()
  }).join(" ");
}