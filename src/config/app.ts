export const appConfig = {
  name: "myFitTracker",
  shortName: "MFT",
  description:
    "Plataforma para controle de treinos, métricas corporais e evolução física.",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;
