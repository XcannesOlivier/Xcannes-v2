import { createContext, useContext, useEffect, useState } from "react";

// ⚠️ Assure-toi que le SDK est bien chargé via _document.js
// <script src="https://xumm.app/assets/cdn/xumm.min.js"></script>

const xumm = typeof window !== "undefined" ? new window.Xumm("ff05c0a0-0067-4284-947d-2c99548b2d18") : null;

const XummContext = createContext();

export const XummProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const updateWallet = (account) => {
    if (account) {
      setWallet(account);
      setIsConnected(true);
      sessionStorage.setItem("xumm_wallet", account);
    } else {
      setWallet("");
      setIsConnected(false);
      sessionStorage.removeItem("xumm_wallet");
    }
  };

  const connect = () => xumm?.authorize();
  const disconnect = () => xumm?.logout();

  const checkSession = async () => {
    try {
      const acc = await xumm.user.account;
      updateWallet(acc);
    } catch {
      updateWallet(null);
    }
  };

  useEffect(() => {
    if (!xumm) return;

    xumm.on("ready", checkSession);
    xumm.on("success", checkSession);
    xumm.on("logout", () => updateWallet(null));

    if (sessionStorage.getItem("xumm_wallet")) {
      checkSession();
    }

    return () => {
      xumm.removeAllListeners();
    };
  }, []);

  return (
    <XummContext.Provider value={{ wallet, isConnected, connect, disconnect }}>
      {children}
    </XummContext.Provider>
  );
};

export const useXumm = () => useContext(XummContext);
