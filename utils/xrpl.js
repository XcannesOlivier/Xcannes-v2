// utils/xrpl.js

export function getBookIdFromPair(pair) {
  if (!pair || typeof pair !== "string") return null;

  const parts = pair.split("/");
  if (parts.length !== 2) return null;

  const [base, counter] = parts;

  const ISSUERS = {
    XCS: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
    USD: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
    EUR: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
    RLUSD: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
  };

  const format = (symbol) => {
    if (symbol === "XRP") return { currency: "XRP" };
    const issuer = ISSUERS[symbol];
    if (!issuer) return null;
    return { currency: symbol, issuer };
  };

  const taker_gets = format(base);
  const taker_pays = format(counter);

  if (!taker_gets || !taker_pays) return null;

  const url = `${taker_gets.issuer || "XRP"}_${taker_gets.currency}/${taker_pays.issuer || "XRP"}_${taker_pays.currency}`;

  return {
    taker_gets,
    taker_pays,
    url,
  };
}
