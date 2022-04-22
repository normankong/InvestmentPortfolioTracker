
const config = {
  stocks: {
    search: process.env.REACT_APP_SEARCH_API_URL,
    quote : process.env.REACT_APP_REQUEST_URL + "/"
    // quote : `/mock/quote.json?symbol=`
  },
};

export default config;
