export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        myFitTracker
      </h1>

      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Plataforma em desenvolvimento para controle de treinos, métricas
        corporais e evolução física.
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        Backend em Rust • Frontend em Next.js
      </p>

      <span className="mt-8 rounded-full border border-zinc-300 px-4 py-1 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        Em construção
      </span>
    </main>
  );
}
