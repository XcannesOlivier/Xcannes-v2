import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NotreVisionBlock() {
  const { t } = useTranslation("common");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const pillars = [
    {
      icon: "💼",
      title: t("vision_mission_title"),
      text: t("vision_mission_text"),
    },
    {
      icon: "🌍",
      title: t("vision_local_title"),
      text: t("vision_local_text"),
    },
    {
      icon: "🧬",
      title: t("vision_innovation_title"),
      text: t("vision_innovation_text"),
    },
    {
      icon: "⚖️",
      title: t("vision_transparency_title"),
      text: t("vision_transparency_text"),
    },
  ];

  return (
    <section
      id="vision"
      className="relative w-screen text-white py-24 px-6 bg-xcannes-background"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-sm uppercase tracking-widest text-xcannes-green mb-3 font-light">
            {t("vision_badge")}
          </p>
          <h2
            className="text-4xl md:text-5xl font-orbitron font-bold mb-8 bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent"
            style={{
              textShadow:
                "0 0 10px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            {t("vision_title")}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            {t("vision_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-xcannes-green/40 transition-all duration-300 hover:bg-black/40"
            >
              {/* Emoji en arrière-plan */}
              <div
                className="absolute -top-4 -right-4 text-[120px] opacity-15 group-hover:opacity-20 transition-opacity duration-300 select-none pointer-events-none"
                style={{ filter: "brightness(0.6) contrast(1.1)" }}
              >
                {pillar.icon}
              </div>

              {/* Contenu au premier plan */}
              <div className="relative z-10">
                <h3 className="text-xl font-orbitron font-semibold text-white mb-2 group-hover:text-xcannes-green transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          data-aos="fade-up"
        >
          <p className="text-white/80 mb-6 text-lg font-light">
            {t("vision_cta_text")}
          </p>
          <a
            href="/whitepaper"
            className="inline-block px-8 py-3 bg-xcannes-green/10 hover:bg-xcannes-green/20 border border-xcannes-green/30 hover:border-xcannes-green text-white rounded-lg transition-all duration-300 font-medium"
          >
            📓 {t("vision_cta_button")}
          </a>
        </div>

        <div className="text-center mt-12" data-aos="fade-up">
          <p className="text-sm text-white/40 italic">
            XRP Ledger × Cannes × Web3 Innovation
          </p>
        </div>
      </div>
    </section>
  );
}
