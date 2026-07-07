# YostratO — Landing Page (Astro)

Testowy landing page dla yostrato.com zbudowany w Astro, przygotowany pod
deploy na Cloudflare Pages, żeby porównać zasięgi/wydajność względem
WordPressa.

## Struktura

```
src/
  layouts/BaseLayout.astro   – <head>, fonty (Poppins + Nunito Sans), meta
  components/
    Header.astro             – nawigacja + przycisk telefonu (menu mobilne)
    Hero.astro                – sekcja hero z gradientem i falą
    ServiceBlock.astro        – naprzemienne bloki obraz/tekst (3x na stronie)
    Testimonials.astro        – opinie klientów (3 karty)
    CallToAction.astro        – pasek "Poproś o kontakt zwrotny"
    Footer.astro               – stopka 4-kolumnowa + social bar
  pages/index.astro            – składa wszystko w jedną stronę
  styles/global.css            – zmienne kolorów / typografii (design tokens)
```

## Kolory i fonty

Paleta i gradienty są zdefiniowane jako CSS custom properties w
`src/styles/global.css` (`--c-orange`, `--gradient-hero`, itd.) — łatwo
podmienić na dokładne wartości marki, jeśli macie plik brand guidelines.
Domyślnie: Poppins (nagłówki) + Nunito Sans (tekst), ładowane z Google Fonts.

Zdjęcia w blokach usług to tymczasowe zdjęcia z Unsplash (`images.unsplash.com`)
— podmieńcie na własne w `src/pages/index.astro` (props `image`).

## Rozwój lokalny

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # build produkcyjny do ./dist
npm run preview   # podgląd builda
```

## Deploy na Cloudflare Pages

1. Wrzućcie repo na GitHub/GitLab.
2. W Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Framework preset: Astro (Cloudflare wykryje automatycznie).

Alternatywnie z CLI (Wrangler):

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=yostrato-landing
```

## Do zrobienia przed publikacją

- [ ] Podmienić placeholder-owe zdjęcia (Unsplash) na własne/klienta
- [ ] Podmienić treści testimoniali na prawdziwe opinie klientów
- [ ] Zweryfikować dokładne kolory marki (hex) i podmienić w `global.css`
- [ ] Podpiąć formularz kontaktowy / numer GA4 do trackingu zasięgów
- [ ] Dodać favicon.ico dopasowany do faviconu firmowego
