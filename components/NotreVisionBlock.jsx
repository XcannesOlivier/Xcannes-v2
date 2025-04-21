import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NotreVisionBlock() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section
      id="vision"
      className="relative w-screen text-white font-sans py-24 px-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/img/ui/backgrounddolleuro1.png')",
      }}
    >
      <div
        className="max-w-4xl mx-auto text-center z-10 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/img/ui/backgroundvision1.png')" }}
      >
        <h2
          className="text-5xl font-orbitron font-extrabold text-xcannes-green mb-4 drop-shadow-[0_2px_8px_rgba(22,179,3,0.3)]"
          data-aos="fade-up"
        >
          Notre vision
        </h2>
        <p className="text-xl font-medium text-white mb-10" data-aos="fade-up" data-aos-delay="100">
          Construire la communauté décentralisée la plus innovante du Web3 européen
        </p>

        <div className="space-y-12 text-left bg-black/20 backdrop-blur-[1px] p-8 rounded-2xl border border-white/50 shadow-2xl">

          {/* Pourquoi Xcannes */}
          <div className="space-y-2" data-aos="fade-up">
            <h3 className="text-2xl font-semibold text-xcannes-green">Pourquoi Xcannes ?</h3>
            <p>
              Avec Xcannes, nous ne créons pas une crypto : nous lançons un mouvement... Cannes a le rayonnement. Xcannes lui propose son projet.
            </p>
          </div>
          <section className="flex justify-center items-center max-h-[28vh] relative">
          <div className="relative">
   
   <img
  src="/assets/img/ui/biglogoXcannes.png"
  alt="Logo XCannes"
  className="h-[30rem] sm:h-[55rem] md:h-[55rem]"
/>

</div>
</section>



          {/* Pyramide */}
          <div className="text-center text-lg font-semibold text-gray-100 space-y-3 leading-tight mt-10" data-aos="fade-up">
            {[ ["XCANNES", "Connectée", "L’Avenir"],
               ["Numérique", "& la Nouvelle"],
               ["Énergie", "Souveraine"] ].map((row, i) => (
              <div key={i} className="flex justify-center gap-3 sm:gap-6">
                {row.map((item, j) => (
                  <div key={j} className="transform perspective-1000 rotate-x-6">{item}</div>
                ))}
              </div>
            ))}
            <div className="mt-2 italic text-sm text-gray-400">
              Xcannes – Un mouvement local pour un impact global
            </div>
          </div>

          {/* Levier */}
          <div className="space-y-2" data-aos="fade-left">
            <h3 className="text-2xl font-semibold text-xcannes-green">Un levier local, une puissance globale</h3>
            <p>
              XCS n’est pas juste un token... Une crypto ancrée localement, mais ouverte sur le monde.
            </p>
          </div>

          {/* Piliers */}
          <div className="space-y-2" data-aos="fade-right">
            <h3 className="text-2xl font-semibold text-xcannes-green">Nos piliers</h3>
            <ul className="space-y-1 text-gray-200">
              {[ ["Liberté", "Reprendre le contrôle de notre avenir"],
                 ["Innovation", "Créer des usages concrets, utiles"],
                 ["Clarté", "Une gouvernance transparente"],
                 ["Vision", "Locale, mais ambitieuse"] ].map(([title, desc], i) => (
                <li key={i}>
                  <strong>{title}</strong>
                  <span className="ml-4">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div data-aos="fade-up">
            <p className="text-lg">C’est une vision. Une communauté. Un futur.</p>
            <p className="text-xcannes-green font-bold text-xl">
              Et cette vision est déjà en marche.
            </p>
          </div>

          {/* Bouton */}
          <div className="flex justify-center mt-10" data-aos="zoom-in">
          <a
  href="/assets/docs/livre-blanc.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="px-6 py-3 rounded-xl bg-black text-white/80 font-[300] text-sm border border-black transition duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
>
  📄 Consulter le Livre Blanc
</a>

           
          </div>

          <p className="text-xs text-center text-gray-400 mt-8">
            * Suivez-nous sur les réseaux sociaux, vous pouvez aussi consulter le Livre Blanc.
          </p>
        </div>
      </div>

      {/* Glow animation keyframes */}
      <style jsx>{`
        @keyframes xcannesGlow {
          0%, 100% {
            filter: drop-shadow(0 0 6px #16b303);
          }
          50% {
            filter: drop-shadow(0 0 12px #0a08a9);
          }
        }
      `}</style>
    </section>
  );
}
