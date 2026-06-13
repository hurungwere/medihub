/**
 * Live API base URL — reads from env var, falls back to production URL.
 * Set API_BASE in .env.local to override.
 */
export const API_BASE =
  process.env.API_BASE ?? 'https://cravecart.co.zw/app'
