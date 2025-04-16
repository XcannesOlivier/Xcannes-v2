import { useState, useEffect } from 'react';
import axios from 'axios';

// Assumes you have PAIRS defined elsewhere
const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
  "XRP/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
};

/**
 * Custom hook to fetch market data for a specific trading pair.
 * @param {string} pair - The trading pair to fetch data for.
 * @returns {Object} - The market data.
 */
const useMarketData = (pair) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://data.xrplf.org/v1/iou/market_data/${PAIRS[pair]}?interval=5m`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching market data", error);
      }
    };

    if (pair) fetchData();
  }, [pair]);

  return data;
};

export default useMarketData;
