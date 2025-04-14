import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import QRCode from "qrcode.react";
import axios from "axios";
import FooterPro from "../components/FooterPro";

export default function Donate() {
  const [xummPayload, setXummPayload] = useState(null);
  const [signed, setSigned] = useState(false);

  const createPayload = async () => {
    try {
      const res = await axios.post("/api/xumm/create-donation-payload", {
        amount: "100",
        destination: "rYourDonationWalletHere"
      });
      setXummPayload(res.data);
    } catch (err) {
      console.error("Erreur payload XUMM:", err);
    }
  };

  useEffect(() => {
    if (xummPayload?.uuid) {
      const ws = new WebSocket(`wss://payload.xumm.dev/${xummPayload.uuid}`);
      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.signed === true) {
          setSigned(true);
          ws.close();
        }
      };
      return () => ws.close();
    }
  }, [xummPayload]);

  return (
    <>
      <Head>
        <title>Faire un Don - Xcannes</title>
      </Head>

      <Header />

      <main className="max-w-xl mx-auto px-4 pt-28 pb-10 text-center">

        <h1 className="text-3xl font-bold text-xcannes-green mb-6">Soutenez XRdoge</h1>
        <p className="text-gray-300 mb-6">
          En faisant un don, vous soutenez un projet communautaire basé sur l’innovation, la transparence et la passion.
        </p>

        {!xummPayload && (
          <button
            onClick={createPayload}
            className="bg-xcannes-green text-black font-bold px-6 py-3 rounded-full hover:bg-xrdoge-blue-100 hover:text-white"
          >
            Faire un don avec XUMM
          </button>
        )}

        {xummPayload && !signed && (
          <div className="mt-6">
            <p className="mb-2 text-gray-300">Scannez avec XUMM :</p>
            <QRCode value={xummPayload.refs.qr_png} size={180} />
            <p className="text-xs mt-2 text-gray-500">UUID: {xummPayload.uuid}</p>
          </div>
        )}

        {signed && (
          <div className="mt-6 text-green-400 font-semibold">
            Merci pour votre soutien ! Don signé avec succès.
          </div>
        )}
      </main>

      <FooterPro />
    </>
  );
}
