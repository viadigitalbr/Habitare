import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://redehabitare.org.br',
  output: 'static',
  redirects: { '/quero-ser-membro-saude-mental': { destination: '/seja-membro', status: 301 } },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
});
