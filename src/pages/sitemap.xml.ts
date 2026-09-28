import type { APIRoute } from 'astro';
import { support, paths } from '../data/site';
export const GET: APIRoute = ({ site }) => {
  const routes = ['/', paths.sobre, paths.atendimento, paths.apoio, ...support.map(item => `/${item.slug}`)];
  const entries = [...new Set(routes)].map(path => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
