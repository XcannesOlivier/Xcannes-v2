import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NotreVisionBlock() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const pillars = [
    {
      icon: "🎯",
      title: "Mission",
      text: "Créer un écosystème crypto accessible, transparent et centré sur l'utilisateur"
    },
    {
      icon: "🌍",
      title: "Local & Global",
      text: "Ancrée à Cannes, ouverte sur le monde grâce à la technologie XRP Ledger"
    },
    {
      icon: "⚡",
      title: "Innovation",
      text: "Des solutions DeFi simples et performantes pour tous"
    },
    {
      icon: "🔒",
      title: "Transparence",
      text: "Une gouvernance claire, un tokenomics équitable, une communauté forte"
    }
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
            Our Vision
          </p>
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Construire le futur de la finance
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            XCANNES connecte l'innovation blockchain à l'économie réelle,<br/>
            en créant un pont entre tradition et disruption.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-xcannes-green/40 transition-all duration-300 hover:bg-black/40"
            >
              <div className="text-4xl mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2 group-hover:text-xcannes-green transition-colors">
                {pillar.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        <div 
          className="text-center bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          data-aos="fade-up"
        >
          <p className="text-white/80 mb-6 text-lg font-light">
            Découvrez notre stratégie complète et notre roadmap
          </p>
          <a
            href="/whitepaper"
            className="inline-block px-8 py-3 bg-xcannes-green/10 hover:bg-xcannes-green/20 border border-xcannes-green/30 hover:border-xcannes-green text-white rounded-lg transition-all duration-300 font-medium"
          >
            �� Lire le Whitepaper
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
