import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function XummOrder({ amount, mode = "BUY" }) {
  const [payload, setPayload] = useState(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const destinationWallet = process.env.NEXT_PUBLIC_DESTINATION_WALLET;

  const sendOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      console.warn("Montant invalide");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/xumm/order", {
        destination: destinationWallet,
        amount,
        orderType: mode,
      });
      setPayload(res.data);
      console.log("Transaction créée !");

      // 📱 Si sur mobile, redirige automatiquement vers Xumm App
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.location.href = res.data.next.always;
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erreur payload:", err);
      }
      console.error("Erreur lors de la création de la transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!payload?.uuid) return;

    const ws = new WebSocket(`wss://payload.xumm.dev/${payload.uuid}`);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.signed === true) {
        setSigned(true);
        console.log("Transaction signée avec succès !");
        ws.close();
      }
    };

    ws.onerror = () => {
      console.error("Erreur de connexion au serveur XUMM");
    };

    return () => ws.close();
  }, [payload]);

  return (
    <div className="space-y-4 text-center">
      <button
        onClick={sendOrder}
        disabled={loading}
        className="w-full bg-xcannes-green text-white font-medium py-2 rounded hover:bg-xcannes-green hover:text-white"
        aria-label={mode === "BUY" ? "Acheter avec XUMM" : "Vendre avec XUMM"}
      >
        {loading
          ? "Génération..."
          : mode === "BUY"
          ? "Acheter avec XUMM"
          : "Vendre avec XUMM"}
      </button>

      {payload && !signed && (
        <div>
          <p className="text-sm text-gray-300">
            Scannez pour signer avec XUMM :
          </p>
          <QRCodeSVG value={payload.refs.qr_raw} size={180} />
        </div>
      )}

      {signed && (
        <p className="text-green-400 font-semibold">
          Transaction signée avec succès
        </p>
      )}
    </div>
  );
}
