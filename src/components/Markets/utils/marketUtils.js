export const getCompanyName = (symbol) => {
  const companies = {
    "RELIANCE.BSE": "Reliance Industries Ltd.",
    "TCS.BSE": "Tata Consultancy Services Ltd.",
    "HDFCBANK.BSE": "HDFC Bank Ltd.",
    "INFY.BSE": "Infosys Ltd.",
    "HINDUNILVR.BSE": "Hindustan Unilever Ltd.",
    "ICICIBANK.BSE": "ICICI Bank Ltd.",
    "SBIN.BSE": "State Bank of India",
    "BHARTIARTL.BSE": "Bharti Airtel Ltd.",
    "WIPRO.BSE": "Wipro Ltd.",
    "HCLTECH.BSE": "HCL Technologies Ltd.",
  };
  return companies[symbol] || symbol;
};

export const generateMockHistoricalData = (currentPrice, days) => {
  const data = [];
  let price = currentPrice;

  for (let i = days; i > 0; i--) {
    price = price + (Math.random() * 50 - 25);
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  data.push({
    date: new Date().toISOString().split("T")[0],
    price: parseFloat(currentPrice.toFixed(2)),
  });

  return data;
};
