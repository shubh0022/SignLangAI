// Central API configuration
// In production (Vercel), VITE_API_URL points to the Railway backend.
// In local dev, it's empty so Vite's proxy handles /api and /ws routes.
export const API_BASE = import.meta.env.VITE_API_URL || ''
