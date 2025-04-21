import { useState } from 'react';

export default function VisionBlock() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <section className="relative w-screen overflow-hidden text-white pt-10 mt-2 font-montserrat font-[300]">
      <img
        src="/assets/img/ui/dragoncouple.png"
        alt="Vision Xcannes"
        className="w-full h-auto max-h-[100vh] object-cover object-center brightness-75"
      />

      {/* Bandeau + spotlight */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6 z-10"
        onMouseMove={handleMouseMove}
      >
        <div
          className="relative w-full max-w-5xl px-8 py-10 text-center bg-black/30 backdrop-blur-[1px] border border-white/10 shadow-xl rounded-2xl overflow-hidden"
          style={{
            clipPath: 'polygon(0 0, 100% 8%, 100% 100%, 0% 92%)',
          }}
        >
          {/* Spot lumineux */}
          <div
            className="absolute w-96 h-96 bg-white/5 rounded-full pointer-events-none blur-2xl"
            style={{
              top: mousePos.y - 200,
              left: mousePos.x - 200,
            }}
          />

          {/* Contenu */}
          <h3 className="text-xl sm:text-2xl md:text-3xl text-xcannes-green font-orbitron font-[500] mb-4 drop-shadow-[0_1px_6px_rgba(22,179,3,0.5)] text-center leading-tight">
  <span className="whitespace-normal inline-block">
    <img
      src="/assets/img/ui/navHeadergreen.png"
      alt="Logo XCannes"
      className="h-[1.6em] w-auto align-[0.125em] inline -mr-[0.4rem] brightness-110 saturate-150 text-center -mb-[0.6em] -mr-[0.3em]"
    />
    Cannes Connecte l’Avenir Numérique & la Nouvelle Énergie Souveraine
  </span>
</h3>



          <p className="text-base md:text-lg text-gray-200 mb-6">
            Propulser Cannes dans l’économie numérique avec une technologie
            <span className="text-xcannes-green font-semibold"> rapide</span>,
            <span className="text-xcannes-green font-semibold"> éthique</span> et
            <span className="text-xcannes-green font-semibold"> décentralisée</span>.
          </p>

          <button className="bg-xcannes-green hover:bg-xcannes-green font-[500] text-white hover:text-white transition px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-md hover:shadow-xl hover:scale-105 duration-300 w-full sm:w-auto">
  Rejoignez la communauté ici
</button>

        </div>
      </div>

      {/* Slogan */}
      <div className="absolute bottom-2 w-full text-center text-[0.7rem] text-white/40 italic z-10 tracking-wide font-light">
        * Léro, le héros qui brille sous les projecteurs… et surveille les coulisses.
      </div>
    </section>
  );
}

