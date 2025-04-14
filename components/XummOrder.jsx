import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "qrcode.react";

export default function XummOrder({ amount, mode = "BUY" }) {
  const [payload, setPayload] = useState(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const destinationWallet = "rXXXXXXXXXXXXXXXXXXXXXXXX"; // ⚠️ Ton wallet de réception ici

  const sendOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/xumm/order", {
        destination: destinationWallet,
        amount,
        orderType: mode
      });
      setPayload(res.data);

      // 📱 Si sur mobile, redirige automatiquement vers Xumm App
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.location.href = res.data.next.always;
      }
    } catch (err) {
      console.error("Erreur payload:", err);
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
        ws.close();
      }
    };

    return () => ws.close();
  }, [payload]);

  return (
    <div className="space-y-4 text-center">
      <button
        onClick={sendOrder}
        disabled={loading}
        className="w-full bg-xcannes-green text-white font-medium py-2 rounded hover:bg-xcannes-green hover:text-white"
      >
        {loading ? "Génération..." : mode === "BUY" ? "Acheter avec XUMM" : "Vendre avec XUMM"}
      </button>

      {payload && !signed && (
        <div>
          <p className="text-sm text-gray-300">Scannez pour signer avec XUMM :</p>
          <QRCode value={payload.refs.qr_raw} size={180} />
        </div>
      )}

      {signed && (
        <p className="text-green-400 font-bold">Transaction signée ✅</p>
      )}
    </div>
  );
}
