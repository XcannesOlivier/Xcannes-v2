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
      className="relative w-screen text-white font-sans py-0 px-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/img/ui/backgrounddolleuro1.png')",
      }}
    >
      <div
        className="max-w-4xl mx-auto text-center z-10 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/img/ui/backgroundvision1.png')" }}
      >
        <h2 className="text-5xl font-orbitron font-extrabold text-xcannes-green mb-4 drop-shadow-[0_2px_8px_rgba(22,179,3,0.3)]">
          Notre vision
        </h2>
        <p className="text-xl font-medium text-gray-300 mb-10">
          Construire la communauté décentralisée la plus innovante du Web3 européen
        </p>

        <div className="space-y-12 text-left bg-black/20 backdrop-blur-[1px] p-8 rounded-2xl border border-white/50 shadow-2xl">
          {/* Pourquoi Xcannes */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-xcannes-green">Pourquoi Xcannes ?</h3>
            <p>
              Avec Xcannes, nous ne créons pas une crypto : nous lançons un mouvement... Cannes a le rayonnement. Xcannes lui propose son projet.
            </p>
          </div>

          {/* Logo */}
          <section className="flex justify-center items-center max-h-[28vh] relative">
            <div className="relative">
              <img
                src="/assets/img/ui/biglogoXcannes.png"
                alt="Logo XCannes"
                className="h-[25rem] sm:h-[40rem] md:h-[45rem]"
              />
            </div>
          </section>

          {/* Pyramide Stable */}
          <div className="text-center text-lg font-semibold text-gray-300 space-y-3 leading-tight mt-10">
            {[ ["XCANNES", "Connectée", "L’Avenir"],
               ["Numérique", "& la Nouvelle"],
               ["Énergie", "Souveraine"] ].map((row, i) => (
              <div key={i} className="flex justify-center gap-3 sm:gap-6">
                {row.map((item, j) => (
                  <div key={j}>{item}</div>
                ))}
              </div>
            ))}
            <div className="mt-2 italic text-sm text-gray-400">
              Xcannes – Un mouvement local pour un impact global
            </div>
          </div>

          {/* Levier */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-xcannes-green">Un levier local, une puissance globale</h3>
            <p>
              XCS n’est pas juste un token... Une crypto ancrée localement, mais ouverte sur le monde.
            </p>
          </div>

          {/* Piliers */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-xcannes-green">Nos piliers</h3>
            <ul className="space-y-1 text-gray-300">
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
          <div>
            <p className="text-lg">C’est une vision. Une communauté. Un futur.</p>
            <p className="text-xcannes-green font-bold text-xl">
              Et cette vision est déjà en marche.
            </p>
          </div>

          {/* Bouton */}
          <div className="flex justify-center mt-10">
            <a
              href="/assets/docs/livre-blanc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-black text-white/80 font-[300] text-sm border border-black transition duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
            >
              📄 Consulter le Livre Blanc
            </a>
          </div>
          <div className="flex justify-center gap-4 mt-6">
  {[
    { name: "Twitter", icon: "twitter.png", url: "#" },
    { name: "YouTube", icon: "youtube.png", url: "#" },
    { name: "Instagram", icon: "instagram.png", url: "#" },
    { name: "TikTok", icon: "tictoc.png", url: "#" },
    { name: "Facebook", icon: "facebook.png", url: "#" },
  ].map((s) => (
    <a
      key={s.name}
      href={s.url}
      target="_blank"
      rel="noreferrer"
      className="transition-transform transform hover:scale-125"
    >
      <img
        src={`/assets/img/socials/${s.icon}`}
        alt={s.name}
        className="w-10 h-10"
      />
    </a>
  ))}
</div>


          <p className="text-xs text-center text-gray-400 mt-8">
            * Suivez-nous sur les réseaux sociaux, vous pouvez aussi consulter le Livre Blanc.
          </p>
        </div>
      </div>
    </section>
  );
}

