import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";

export default function Contact() {
  const router = useRouter();
  const from = router.query.from === "dex" ? "dex" : ""; // "dex" ou ""

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, captchaToken }),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Contactez-nous</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <textarea
            name="message"
            placeholder="Votre message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          <ReCAPTCHA
            sitekey="6LfNwCQrAAAAAFsILt0hClQ5kZVYyKwngXMP0EPF"
            onChange={(token) => setCaptchaToken(token)}
          />
          <button
            type="submit"
            disabled={!captchaToken || status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {status === "loading" ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-green-600 mt-4">Message envoyé avec succès !</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Erreur lors de l’envoi. Réessayez.</p>
        )}

        {/* 👇 Retour vers index ou dex */}
        <p className="mt-6 text-center">
          <a href={`/${from}`} className="text-sm underline text-blue-600">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}
