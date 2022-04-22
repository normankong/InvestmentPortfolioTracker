import apiConfig from "./apiConfig";

const getHeader = () => {
  var myHeaders = new Headers();
  myHeaders.set("Content-Type", "application/json");
  return myHeaders;
};

class ApiHelper {
  getQuote = async (symbol) => {
    let list = await this.fetch(apiConfig.stocks.quote + symbol, {
      method: "GET",
      headers: getHeader(),
    });

    return list;
  };

  searchSymbol = async (symbol) => {
    let list = await this.fetch(apiConfig.stocks.search + symbol, {
      method: "GET",
      headers: getHeader(),
    });
    return list;
  };

  fetch = async (url, options) => {
    // console.log(`Request  : ${url}`);
    // console.log(`Options  : ${JSON.stringify(options)}`);
    // debugger;
    const response = await fetch(url, options);
    // let json = {};
    const json = await response.json();
    // console.log(`Response :`);
    // console.table(json);
    return json;
  };
}

let apiHelper = new ApiHelper();

export default apiHelper;
