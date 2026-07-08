// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always'
  },
  image: {
    domains: [
      'wordpress-1252676-6537812.cloudwaysapps.com',
      'images.unsplash.com'
    ]
  }
});
