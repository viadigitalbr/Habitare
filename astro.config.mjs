import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://redehabitare.org.br',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
});
