export const getBookIdFromPair = (pair) => {
  const mapping = {
    "XCS/XRP": {
      url: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
      taker_gets: {
        currency: "XCS",
        issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
      },
      taker_pays: { currency: "XRP" },
    },
    "XCS/USD": {
      url: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
      taker_gets: {
        currency: "XCS",
        issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
      },
      taker_pays: {
        currency: "USD",
        issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
      },
    },
    "XCS/EUR": {
      url: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
      taker_gets: {
        currency: "XCS",
        issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
      },
      taker_pays: {
        currency: "EUR",
        issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
      },
    },
    "XCS/RLUSD": {
      url: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
      taker_gets: {
        currency: "XCS",
        issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
      },
      taker_pays: {
        currency: "524C555344000000000000000000000000000000",
        issuer: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
      },
    },
    "XRP/RLUSD": {
      url: "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
      taker_gets: { currency: "XRP" },
      taker_pays: {
        currency: "524C555344000000000000000000000000000000",
        issuer: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
      },
    },
  };

  return mapping[pair] || null;
};
