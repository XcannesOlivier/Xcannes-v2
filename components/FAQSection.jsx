import { useState, useEffect } from "react";

const faqItems = [
  {
    question: "Qu’est-ce que la crypto-monnaie XCANNES (XCS) ?",
    answer: "La crypto-monnaie XCS est une monnaie numérique sécurisée par la blockchain, permettant des transactions décentralisées et sans intermédiaire."
  },
  {
    question: "Sur quelle blockchain est basée cette crypto-monnaie ?",
    answer: "Le jeton XCS est basé sur le XRP Ledger (XRPL), conçu pour des transactions rapides, économiques et sécurisées."
  },
  {
    question: "Comment puis-je acheter ces tokens ?",
    answer: "Cliquez sur “Buy Now” sur notre site. Vous serez redirigé vers une plateforme dédiée acceptant crypto, carte et autres méthodes de paiement."
  },
  {
    question: "Quelle est l’utilité principale de cette crypto-monnaie ?",
    answer: "XCS incarne l’identité numérique et financière de Cannes. Moyen de paiement moderne, sécurisé et intégré dans l’économie locale."
  },
  {
    question: "Y a-t-il une quantité limitée de tokens ?",
    answer: "Oui, le jeton XCANNES possède une offre strictement limitée à 2 006 400 unités, garantissant ainsi sa rareté."
  },
  {
    question: "Le projet est-il conforme aux réglementations ?",
    answer: "Oui, nous respectons les réglementations KYC/AML et veillons à être en conformité avec les lois en vigueur."
  },
  {
    question: "Où puis-je stocker mes tokens en toute sécurité ?",
    answer: "Sur des portefeuilles compatibles XRPL : Xaman (Xumm), Gatehub, Ledger, etc."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const section = document.querySelector(".faq-animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("visible");
          }
        });
      },
      { threshold: 0.4 }
    );

    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative faq-animate border border-white border-opacity-40 font-montserrat font-[300] w-full max-w-6xl mx-auto  text-white pb-20 px-6 mt-0 pt-5 rounded-3xl"
      style={{ backgroundColor: "#202320" }}
    >
      {/* Superposition sombre */}
      <div className="absolute inset-0 bg-black/35 #202320 z-0 rounded-3xl" />

      {/* Contenu FAQ */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-orbitron font-[500] text-center mb-10"
        style={{ color: '#16b303' }}
        >
          FAQ - Questions Fréquentes
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              onClick={() => toggle(index)}
              className={`bg-black/30 rounded-xl border border-white/20 shadow-md cursor-pointer transition-all duration-300 overflow-hidden ${
                openIndex === index ? "ring-1 ring-xcannes-green" : ""
              }`}
            >
              <div className="flex justify-between items-center pt-2 pb-2">
                <h3
                  className={`text-base text-sm md:text-lg font-[400] transition-all ${
                    openIndex === index ? "underline text-xcannes-green" : "text-FAQ"
                  }`}
                >
                  {item.question}
                </h3>

                <div
                  className={`transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-90 text-xcannes-green" : "rotate-0"
                  }`}
                >
                  ▶
                </div>
              </div>

              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-white font-[300]">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
