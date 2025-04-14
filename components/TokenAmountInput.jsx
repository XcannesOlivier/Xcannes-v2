import { useState } from "react";

export default function TokenAmountInput({ value, onChange, max, placeholder = "0.00", token = "XCS" }) {
  const [localValue, setLocalValue] = useState(value || "");

  const handleInput = (e) => {
    const raw = e.target.value.replace(",", ".").replace(/[^0-9.]/g, "");
    if (raw.split(".").length > 2) return; // une seule virgule
    if (raw.length > 0 && isNaN(Number(raw))) return;

    setLocalValue(raw);
    if (onChange) onChange(raw);
  };

  return (
    <div
  className="flex items-center gap-2 border border-white border-opacity-30 rounded px-4 py-2 bg-black/30"
   
>

      <input
        className="bg-transparent text-white w-full outline-none text-xl"
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={localValue}
        onChange={handleInput}
      />
      <span className="ml-2 text-xcannes-green font-bold">{token}</span>
    </div>
  );
}
