# YostratO — Headless Landing Page (Astro + WordPress)

A modern, ultra-fast landing page for **YostratO** built with **Astro** (SSG) and integrated with **WordPress** as a Headless CMS. Ready for deployment on **Cloudflare Pages**.

## Architecture & Integrations

All site content is fully editable from the WordPress admin panel and delivered to Astro via the REST API:
* **Dynamic Repeater Fields:** Users can add an arbitrary number of 50-50 sections (text + image) in WordPress, set their order, layouts (image on the left/right), visual variants, and select images directly from the WordPress media library.
* **WP Media Library & Astro Image:** Images are selected via the native WordPress media uploader and automatically optimized to WebP format in Astro (generating responsive images with fractional file sizes).
* **Automatic Deployments (Webhooks):** Saving, trashing, or restoring a page in WordPress automatically sends a deploy webhook to Cloudflare Pages, triggering an instant rebuild of the production site.
* **Global Settings Panel:** A dedicated **YostratO Settings** tab in the WordPress sidebar configures the live production site URL and the Cloudflare deploy webhook URL.
* **Rank Math SEO Integration:** Meta tags and page titles are fetched directly from the Rank Math SEO plugin schema.
* **Headless Redirects:** Direct visitor traffic to the traditional WordPress frontend is automatically redirected to the Astro website URL (retaining preview parameters).

## Astro Project Structure

```
src/
  layouts/
    BaseLayout.astro     – Base HTML template (fonts, scripts, meta tags)
    Layout.astro         – Main layout (SEO handling via Rank Math, logo, fonts)
  components/
    Header.astro         – Header navigation with mobile drawer (a11y optimized, CLS protection)
    Hero.astro           – Hero section fetching copy and CTA links from WordPress
    ServiceBlock.astro   – Flexible 50-50 blocks with Astro `<Image>` optimization
    Testimonials.astro   – Client reviews carousel with correct ARIA tab roles
    CallToAction.astro   – Contact band fetching phone and email from WordPress
    Footer.astro         – Optimized 4-column footer with compliant color contrast ratios
  pages/
    [...slug].astro      – Dynamic router fetching pages on-the-fly from WordPress
    blog/
      index.astro        – Blog post archive page from WordPress
      [slug].astro       – Single blog post template
  styles/
    global.css           – Design tokens, CSS variables, and layout system styles
```

## Local Development

### 1. Clone & Install
```bash
git clone https://github.com/WiktorGabryszak/yostrato-landing.git
cd yostrato-landing
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root directory and specify the WordPress API endpoint:
```env
WORDPRESS_API_URL=https://wordpress-1252676-6537812.cloudwaysapps.com/wp-json/wp/v2
```

### 3. CLI Commands
```bash
npm run dev       # Starts local development server at http://localhost:4321
npm run build     # Builds production static files in the ./dist directory
npm run preview   # Previews the production build locally
```

*Tip:* In development mode (`npm run dev`), content changes in WordPress are reflected instantly upon refreshing your browser due to real-time runtime API fetching.

## Deploying to Cloudflare Pages

1. Ensure the code is pushed to your GitHub repository.
2. In the Cloudflare Pages dashboard, create a new project and link it to your repository.
3. Configure the following build settings:
   * **Framework preset:** `Astro`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. Under **Environment variables**, add the following variable:
   * **Name:** `WORDPRESS_API_URL`
   * **Value:** `https://wordpress-1252676-6537812.cloudwaysapps.com/wp-json/wp/v2`
5. Save and deploy the project. Copy the generated deploy webhook URL from Cloudflare settings and paste it into the **YostratO Settings** tab in WordPress to activate instant live updates on save.
