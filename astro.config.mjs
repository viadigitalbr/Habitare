import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://redehabitare.org.br',
  output: 'static',
  redirects: { '/quero-ser-membro-saude-mental': { destination: '/seja-membro', status: 301 } },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  vite: { server: { proxy: { '/api/pedidos-livro': 'http://127.0.0.1:4322' } } },
});
