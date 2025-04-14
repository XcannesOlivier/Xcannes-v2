import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { XummProvider } from "../context/XummContext"; // ✅ ajout du provider

function App({ Component, pageProps }) {
  return (
    <XummProvider>
      <Component {...pageProps} />
    </XummProvider>
  );
}

export default appWithTranslation(App, nextI18NextConfig); // ✅ conserve la trad
