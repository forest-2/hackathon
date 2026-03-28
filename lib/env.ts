export const env = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  // Supabase — uncomment and set env vars when needed
  // supabase: {
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  //   anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  //   serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  // },
} as const;
