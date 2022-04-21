import apiConfig from "./apiConfig";

const getHeader = () => {
  var myHeaders = new Headers();
  myHeaders.set("Accept", "application/json");
  myHeaders.set("Content-Type", "application/json");
  myHeaders.set("Cache-Control", "no-cache");
  return myHeaders;
};

class ApiHelper {
  getFeatures = async () => {
    let list = await this.fetch(apiConfig.feature.list, {
        method: 'GET',
        headers: getHeader()
    });
    return list;
  };

  getRecommendation = async () => {
    let list = await this.fetch(apiConfig.feature.recommendation, {
      method: "GET",
      headers: getHeader(),
    });
    return list;
  };

  getQuote = async (symbol) => {
    let list = await this.fetch(apiConfig.stocks.quote + symbol, {
      method: "GET",
      headers: getHeader(),
    });
    return list;
  };

  getPortfolio = async (token) => {
    let list = await this.fetch(apiConfig.stocks.portfolio, {
      method: "GET",
      headers: getHeader(token),
    });
    return list;
  };

  getETFInfo = async () => {
    let list = await this.fetch(apiConfig.stocks.etfInfo, {
      method: "GET",
      headers: getHeader(),
    });
    return list;
  }

  searchSymbol = async (symbol) => {
    let list = await this.fetch(apiConfig.stocks.search + symbol, {
      method: "GET",
      headers: getHeader(),
    });
    return list;
  }

  postTransaction = async (token, txnObject) => {
    let result = await this.fetch(apiConfig.stocks.portfolio, {
      method: "POST",
      headers: getHeader(token),
      body: JSON.stringify(txnObject),
    });
    return result;
  };

  fetch = async (url, options) => {
    // console.log(`Request  : ${url}`);
    // console.log(`Options  : ${JSON.stringify(options)}`);
    const response = await fetch(url, options);
    const json = await response.json();
    // console.log(`Response :`);
    // console.table(json);
    return json;
  };
}

let apiHelper = new ApiHelper();

export default apiHelper;
