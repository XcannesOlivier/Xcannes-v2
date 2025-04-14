import Head from "next/head";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";

export default function MXGA() {
  return (
    <>
      <Head>
        <title>Notre Vision - Xcannes</title>
      </Head>

      <Header />

      <main className="font-montserrat font-[300]">
        <section
          className="relative bg-cover bg-center bg-no-repeat text-white py-24 px-6"
          style={{
            backgroundImage: "url('/assets/img/ui/backgroundNotreVision.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Superposition sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/30 z-0" />
          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <h1 className="text-5xl font-orbitron font-[500] text-xrdoge-green mb-4 drop-shadow-1g">
              ✨ Notre Vision
            </h1>
            <h2 className="text-xl font-[400] text-white mb-10">
              X.C.A.N.N.E.S — Xcannes Connecte l’Avenir Numérique & la Nouvelle Énergie Souveraine
            </h2>

            <div className="space-y-12 text-left bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/10">
              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">Pourquoi Xcannes ?</h3>
                <p>
                  Cannes mérite plus qu’une crypto de passage. Cette ville est un symbole mondial d’excellence, de culture, de rayonnement. Elle a tout pour devenir la première ville Web3 d’Europe.
                </p>
                <p className="mt-2">
                  Mais surtout, parce que nous croyons à une énergie locale, indépendante et visionnaire : une énergie souveraine.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">X.C.A.N.N.E.S, c’est...</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  <li><strong>X</strong> — Xcannes</li>
                  <li><strong>C</strong> — Connecte</li>
                  <li><strong>A</strong> — l’Avenir</li>
                  <li><strong>N</strong> — Numérique</li>
                  <li><strong>N</strong> — & la Nouvelle</li>
                  <li><strong>E</strong> — Énergie</li>
                  <li><strong>S</strong> — Souveraine</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">Une crypto locale, une puissance globale</h3>
                <p>
                  XCS n’est pas juste un token. C’est un levier économique, un outil de souveraineté numérique, une monnaie décentralisée pensée pour et par le territoire.
                </p>
                <p className="mt-2">
                  Elle permet aux citoyens, commerçants, artistes, développeurs, de participer à une nouvelle économie locale basée sur la transparence, la vitesse et la confiance du XRPL.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">Nos valeurs</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  <li><strong>Liberté</strong> — Reprendre le contrôle de nos outils, de notre économie, de notre futur.</li>
                  <li><strong>Clarté</strong> — Dans la gestion, la distribution, les objectifs.</li>
                  <li><strong>Innovation</strong> — Au service du réel, pas du buzz.</li>
                  <li><strong>Ancrage local</strong> — Mais vision internationale.</li>
                  <li><strong>Indépendance</strong> — Technologique, économique, politique.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">Nouvelle Énergie = Nouvelle Vision</h3>
                <p>
                  En écho à la vision de ceux qui veulent réconcilier technologie et territoire, XCS se positionne comme le moteur numérique d’un élan plus large : celui d’un avenir souverain, respectueux, ambitieux.
                </p>
                <p className="mt-2">
                  Nous ne promettons pas un monde magique. Mais nous construisons les outils d’un futur concret, où la communauté est au cœur de l’économie, et où le code remplace l’arbitraire.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-[500] text-xrdoge-green mb-2">Et demain ?</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  <li>Un token utilisé dans les commerces de la ville</li>
                  <li>Une communauté locale et internationale connectée</li>
                  <li>Des partenariats solides avec les acteurs économiques et culturels</li>
                  <li>Une voix unique dans le paysage crypto européen</li>
                </ul>
              </div>

              <div className="text-center space-y-1 mt-6">
                <p>XCANNES, ce n’est pas un mirage.</p>
                <p>C’est une base. Un projet. Une vision.</p>
                <p className="text-xrdoge-green font-[500]">Et cette vision est déjà en marche.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterPro />
    </>
  );
}