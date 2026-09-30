import { createBookHandler } from '../server/book-orders.mjs';

// Standalone Vercel Node function; the Astro site remains static.
export default { fetch: createBookHandler() };
