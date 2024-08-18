import axios from "axios";

// Fetch exchange rate from USD to INR
export const getExchangeRate = async () => {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    return response.data.rates.INR; // This returns the USD to INR exchange rate
  } catch (error) {
    console.error("Failed to fetch exchange rate", error);
    return 1; // Default to 1 if there's an error
  }
};

// Convert USD to INR
export const convertToINR = (amountUSD, exchangeRate) => {
  return amountUSD * exchangeRate;
};

// Format number as currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};
