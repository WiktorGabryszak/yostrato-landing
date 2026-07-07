# SYSTEM INSTRUCTIONS: Autonomous Astro SSG + Headless WordPress Installation

You are an advanced full-stack developer and automation agent executing tasks via Claude Code and MCP. Your goal is to build a complete, production-ready, ultra-fast Headless WordPress frontend using **Astro in strict Static (SSG) mode**, deployed for free on Cloudflare Pages. 

This architecture completely bypasses commercial plugins like PhantomWP by leveraging native WordPress REST API and Astro's build engine.

---

## STEP 1: ENVIRONMENT & STYLING FRAMEWORK DETECTION
Before generating UI code, inspect the root directory using filesystem tools:
1. Search for `tailwind.config.*` or check `package.json` for Tailwind CSS dependencies.
2. **If Tailwind is present**: Build all UI elements using utility classes.
3. **If Tailwind is absent**: Use native Astro scoped styles (`<style>` tags inside `.astro` files).

---

## STEP 2: WORDPRESS BACKEND INFRASTRUCTURE (MCP / WP-CLI)
If an active WordPress environment is accessible via MCP terminal tools, execute the following commands to configure the backend infrastructure. If remote execution is unavailable, generate an `acf-export.json` file in the root for manual import.

```bash
# Install core SEO and Field Builders
wp plugin install rank-math --activate
wp plugin install smart-custom-fields --activate

# Install the essential bridge to inject RankMath SEO directly into standard REST API nodes
wp plugin install wp-headless-rest-seo --activate

# Flush rewrite rules to ensure /wp-json/wp/v2/pages and /posts function correctly
wp rewrite flush
```

### Expected ACF / Smart Custom Fields Schema
The configuration must expose a Flexible Content field named `page_blocks` inside the standard page REST API payload:
- **Layout Name:** `hero` 
  - Fields: `title` (text), `subtitle` (text), `cta_label` (text)
- **Layout Name:** `faq`
  - Fields: `faq_items` (Repeater) -> Subfields: `question` (text), `answer` (textarea)

---

## STEP 3: ENVIRONMENT CONFIGURATION
Create or verify the `.env` file in the project root:
```env
WORDPRESS_API_URL=[https://your-wordpress-cloudways-domain.com/wp-json/wp/v2](https://your-wordpress-cloudways-domain.com/wp-json/wp/v2)
```

---

## STEP 4: CODEBASE GENERATION (FULL FILES)

Generate the following files exactly as specified. Do not shorten codes or use placeholders.

### File 1: Master Layout with SEO Integration
**Path:** `src/layouts/Layout.astro`
```astro
---
interface Props {
  title?: string;
  seoData?: {
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical?: string;
  };
}

const { title, seoData } = Astro.props;
const defaultTitle = "Decoupled High-Performance Site";
---

<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Meta Tags generated from RankMath/Yoast API nodes -->
    <title>{title || seoData?.og_title || defaultTitle}</title>
    <meta name="description" content={seoData?.description || "High-performance headless static deployment."} />
    
    <!-- Open Graph Markups -->
    <meta property="og:title" content={seoData?.og_title || title || defaultTitle} />
    <meta property="og:description" content={seoData?.og_description || seoData?.description} />
    {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
    {seoData?.canonical && <link rel="canonical" href={seoData.canonical} />}

    <!-- Global Marketing & Analytical Tags (GTM / Cookie Banner Placeholders) -->
  </head>
  <body class="bg-gray-50 text-gray-900 min-h-screen m-0 p-0 font-sans">
    <nav class="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 shadow-sm">
      <a href="/" class="text-blue-600 hover:underline font-medium">Strona Główna</a>
      <a href="/blog" class="text-blue-600 hover:underline font-medium">Blog</a>
    </nav>
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <slot />
    </main>
  </body>
</html>
```

### File 2: Flexible Content Component - Hero
**Path:** `src/components/blocks/Hero.astro`
```astro
---
const { data } = Astro.props;
---
<section class="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-12 my-6 text-center shadow-lg">
  <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{data.title}</h1>
  <p class="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8">{data.subtitle}</p>
  {data.cta_label && (
    <button class="bg-white text-purple-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition shadow-md cursor-pointer">
      {data.cta_label}
    </button>
  )}
</section>
```

### File 3: Flexible Content Component - FAQ Accordion
**Path:** `src/components/blocks/FAQ.astro`
```astro
---
const { data } = Astro.props;
---
<section class="bg-white border border-gray-200 rounded-2xl p-8 my-6 shadow-sm">
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Często zadawane pytania (FAQ)</h2>
  <div class="space-y-4">
    {data.faq_items?.map((item: any) => (
      <details class="group border border-gray-100 bg-gray-50 rounded-xl p-4 transition duration-300 open:bg-white open:border-gray-200">
        <summary class="font-semibold text-gray-700 list-none flex justify-between items-center cursor-pointer select-none">
          <span>{item.question}</span>
          <span class="text-xl transition-transform duration-300 group-open:rotate-45">+</span>
        </summary>
        <p class="mt-3 text-gray-600 leading-relaxed border-t border-gray-200/60 pt-3">{item.answer}</p>
      </details>
    ))}
  </div>
</section>
```

### File 4: Catch-All Dynamic Page Content Router
**Path:** `src/pages/[slug].astro`
```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/blocks/Hero.astro';
import FAQ from '../components/blocks/FAQ.astro';

export async function getStaticPaths() {
  const apiUrl = import.meta.env.WORDPRESS_API_URL;
  const response = await fetch(`${apiUrl}/pages?_embed&per_page=100`);
  const pages = await response.json();

  if (!Array.isArray(pages)) return [];

  return pages.map((page: any) => ({
    params: { slug: page.slug === 'home' ? undefined : page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
const blocks = page.acf?.page_blocks || [];

const seoData = {
  description: page.yoast_head_json?.description || page.rank_math_description,
  og_title: page.yoast_head_json?.og_title || page.rank_math_title,
  og_description: page.yoast_head_json?.og_description || page.rank_math_description,
  og_image: page.yoast_head_json?.og_image?.[0]?.url || page._embedded?.['wp:featuredmedia']?.[0]?.source_url
};
---

<Layout seoData="{seoData}" title="{page.title.rendered}">
  {blocks.length === 0 ? (
    <article class="prose prose-lg max-w-none">
      <h1 class="text-3xl font-bold mb-6" set:html={page.title.rendered} />
      <div set:html={page.content.rendered} />
    </article>
  ) : (
    blocks.map((block: any) => {
      switch (block.acf_fc_layout) {
        case 'hero':
          return <Hero data="{block}"/>;
        case 'faq':
          return <FAQ data="{block}"/>;
        default:
          return <div class="p-4 bg-yellow-50 text-yellow-700 my-2 rounded-lg">Unrecognized Layout Component: {block.acf_fc_layout}</div>;
      }
    })
  )}
</Layout>
```

### File 5: Blog Archive Directory
**Path:** `src/pages/blog/index.astro`
```astro
---
import Layout from '../../layouts/Layout.astro';

const apiUrl = import.meta.env.WORDPRESS_API_URL;
const response = await fetch(`${apiUrl}/posts?_embed&per_page=100`);
const posts = await response.json();
---

<Layout title="Katalog Artykułów - Blog">
  <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Artykuły i Wiedza</h1>
  <p class="text-gray-500 mb-8 text-lg">Zarządzane bezpośrednio z poziomu tradycyjnego panelu WordPress.</p>
  
  <div class="grid gap-6 md:grid-cols-2">
    {Array.isArray(posts) && posts.map((post: any) => (
      <article class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition" set:html={post.title.rendered} />
          <div class="text-gray-600 text-sm line-clamp-3 mb-4" set:html={post.excerpt.rendered} />
        </div>
        <a href={`/blog/${post.slug}`} class="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 text-sm">
          Czytaj artykuł <span class="ml-1">&rarr;</span>
        </a>
      </article>
    ))}
  </div>
</Layout>
```

### File 6: Individual Blog Post Subpage Template
**Path:** `src/pages/blog/[slug].astro`
```astro
---
import Layout from '../../layouts/Layout.astro';

export async function getStaticPaths() {
  const apiUrl = import.meta.env.WORDPRESS_API_URL;
  const response = await fetch(`${apiUrl}/posts?_embed&per_page=100`);
  const posts = await response.json();

  if (!Array.isArray(posts)) return [];

  return posts.map((post: any) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;

const seoData = {
  description: post.yoast_head_json?.description || post.rank_math_description,
  og_title: post.yoast_head_json?.og_title || post.rank_math_title,
  og_description: post.yoast_head_json?.og_description || post.rank_math_description,
  og_image: post.yoast_head_json?.og_image?.[0]?.url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
  canonical: post.yoast_head_json?.canonical || post.rank_math_canonical
};
---

<Layout seoData="{seoData}" title="{post.title.rendered}">
  <article class="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm">
    <h1 class="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight" set:html={post.title.rendered} />
    <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-4 wp-content" set:html={post.content.rendered} />
  </article>
</Layout>

<style is:global>
  .wp-content p { margin-bottom: 1.25rem; }
  .wp-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1f2937; }
  .wp-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin-top: 1rem; margin-bottom: 1rem; }
</style>
```

---

## STEP 5: VALIDATION & COMPILATION CHECKS
Once files are created:
1. Run local diagnostic building (`npm run build`) to ensure no runtime fetching syntax errors occur.
2. Confirm typography parameters gracefully unpack HTML data vectors via `set:html`.
```