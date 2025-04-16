import { useState } from "react";
import TokenAmountInput from "./TokenAmountInput";
import XummOrder from "./XummOrder";

export default function TradeBox({ pair = "XCS/XRP" }) {
  const [mode, setMode] = useState("BUY");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0.000006);

  const simulatedBalance = 1000;

  const getTotal = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return "0.00";
    return (val * price).toFixed(6);
  };

  const setPercent = (pct) => {
    const val = ((simulatedBalance * pct) / 100).toFixed(2);
    setAmount(val);
  };

  return (
    <div
    className="bg-black border border-white border-opacity-40 rounded-xl p-4 text-white w-full font-montserrat font-[300]"

    >
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-[500] text-xcannes-green">Trade XCS</h2>
        <div className="flex gap-2">
          {["BUY", "SELL"].map((opt) => (
            <button
              key={opt}
              onClick={() => setMode(opt)}
              className={`px-4 py-1 rounded text-sm border font-[500] ${
                mode === opt ? "bg-xcannes-green text-white border-xcannes-green" : "bg-xcannes-red border-xcannes-red"
              }`}
            >
              {opt === "BUY" ? "Acheter" : "Echanger"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setOrderType("market")}
          className={`px-3 py-1 rounded text-sm border border-white border-opacity-30 font-[500] ${
            orderType === "market" ? "bg-xcannes-green text-white border-xcannes-green" : "border-white"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType("limit")}
          className={`px-3 py-1 rounded text-sm border border-white border-opacity/30 font-[500] ${
            orderType === "limit" ? "bg-xcannes-green text-white border-xcannes-green" : "border-white"
          }`}
        >
          Limit
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-[400]">Montant :</label>
        <TokenAmountInput value={amount} onChange={setAmount} token="XCS" />
      </div>

      <div className="flex gap-2 mb-4">
        {[25, 50, 75, 100].map((pct) => (
          <button
            key={pct}
            onClick={() => setPercent(pct)}
            className="px-3 py-1 border border-white border-opacity-30 rounded hover:bg-xcannes-green hover:text-black text-sm font-[400]"
          >
            {pct}%
          </button>
        ))}
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <label className="block mb-1 text-sm font-[400]">Prix :</label>
          <TokenAmountInput value={price} onChange={setPrice} token="XRP" />
        </div>
      )}

      <p className="text-sm text-gray-300 mb-4 font-[400]">
        Total à payer : <span className="text-xcannes-green font-[500]">{getTotal()} XRP</span>
      </p>

      <XummOrder amount={amount} mode={mode} />
    </div>
  );
}
