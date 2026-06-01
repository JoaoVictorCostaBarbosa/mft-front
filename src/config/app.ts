export const appConfig = {
  name: "myFitTracker",
  shortName: "MFT",
  description:
    "Plataforma para controle de treinos, métricas corporais e evolução física.",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
} as const;
