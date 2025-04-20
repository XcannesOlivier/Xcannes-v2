import Head from 'next/head'
import MegaChartUltimate from '../components/MegaChartUltimate'

export default function Home() {
  return (
    <>
      <Head>
        <title>Mega Crypto Chart</title>
      </Head>
      <main className="bg-black min-h-screen text-white p-4">
        <h1 className="text-2xl font-bold mb-4">XRP/RLUSD - Mega Chart</h1>
        <MegaChartUltimate pair="XRP/RLUSD" />
      </main>
    </>
  );
}