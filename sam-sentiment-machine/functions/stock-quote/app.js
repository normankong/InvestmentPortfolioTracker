const fetch = require('node-fetch');
const TABLE_NAME = process.env.TABLE_NAME;
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;
/**
 * A Lambda function that returns a static string
 */

exports.handler = async (event) => {

  console.log(event);

  let symbol = event.Message;
  let url = `https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${symbol}&datatype=json`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
      "X-RapidAPI-Key": ALPHAVANTAGE_API_KEY
    },
  });
  const data = await response.json();

  console.log(data);

  return data;
};
