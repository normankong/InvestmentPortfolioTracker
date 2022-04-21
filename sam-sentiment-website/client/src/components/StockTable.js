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
      if (json.quote === null){
        setTimeout(fetchData , 1000);
        return;
      }

      let quote = json.quote["Global Quote"];
      let list = [];
      for (let i = 0 ; i < mapping.length; i++){
        list.push({ key : capitalizeWords(mapping[i].substr(4, mapping[i].length-1)), value : quote[mapping[i]]});
      }
      setList(list);
    };

    fetchData();

  }, [symbol]);

  if (list === null) return <Spinner/>

  return <SimpleTable list={list} />;
}

let mapping = [];
mapping.push("01. symbol");
mapping.push("02. open");
mapping.push("03. high");
mapping.push("04. low");
mapping.push("08. previous close");

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function capitalizeWords(word) {
  let arr = word.split(" ")
  return arr.map(element => {
    return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase()
  }).join(" ");
}
