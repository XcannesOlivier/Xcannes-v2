import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Envoi en cours...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, token: captchaToken }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Message envoyé !");
      setForm({ name: "", email: "", message: "" });
      setCaptchaToken(null);
    } else {
      setStatus("❌ Erreur : " + data.message);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-12 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-xcannes-green">Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          className="w-full p-3 bg-[#1c1c1c] border border-gray-700 rounded"
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          className="w-full p-3 bg-[#1c1c1c] border border-gray-700 rounded"
          onChange={handleChange}
          value={form.email}
          required
        />
        <textarea
          name="message"
          placeholder="Votre message"
          className="w-full p-3 h-32 bg-[#1c1c1c] border border-gray-700 rounded"
          onChange={handleChange}
          value={form.message}
          required
        />
        <ReCAPTCHA
          sitekey="6LfNwCQrAAAAAFsILt0hClQ5kZVYyKwngXMP0EPF"
          onChange={(token) => setCaptchaToken(token)}
        />
        <button
          type="submit"
          className="bg-xcannes-green hover:bg-xcannes-blue-light text-black font-semibold px-6 py-3 rounded transition"
          disabled={!captchaToken}
        >
          Envoyer
        </button>
        <p className="text-sm mt-2 text-gray-400">{status}</p>

        {/* 👇 Retour au site */}
<p className="mt-6 text-center">
  <a href="/" className="text-sm underline text-blue-600">
    ← Retour au site
  </a>
</p>
      </form>
    </section>
  );
}
