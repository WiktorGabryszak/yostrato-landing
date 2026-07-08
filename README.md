# YostratO — Headless Landing Page (Astro + WordPress)

Projekt nowoczesnego, ultraszybkiego landing page'a dla **YostratO** zbudowany w **Astro** (SSG) i zintegrowany z **WordPress** jako bezgłowym systemem zarządzania treścią (Headless CMS). Strona jest przystosowana do wdrożenia na **Cloudflare Pages**.

## Architektura i integracje

Wszystkie treści witryny są w pełni edytowalne z poziomu panelu administracyjnego WordPress i dostarczane do Astro przez REST API:
* **Dynamiczne sekcje powtarzalne (Repeater Fields):** Użytkownik w WordPressie może dodać dowolną liczbę sekcji 50-50 (tekst + obrazek), ustalać ich kolejność, układy (obrazek po lewej/prawej), warianty kolorystyczne oraz wybierać obrazy bezpośrednio z biblioteki mediów WordPressa.
* **Biblioteka mediów WP & Astro Image:** Zdjęcia są wybierane przez natywny uploader mediów WordPressa, a w Astro są automatycznie optymalizowane do formatu WebP (generowanie obrazków responsywnych o ułamkowym rozmiarze pliku).
* **Automatyczne wdrożenia (Webhooki):** Zapisanie, usunięcie (kosz) lub przywrócenie strony w WordPressie automatycznie wysyła sygnał (webhook) do Cloudflare Pages, inicjując natychmiastowe przebudowanie i aktualizację wersji produkcyjnej strony.
* **Globalny panel ustawień:** W menu bocznym WordPressa znajduje się zakładka **YostratO Settings**, w której konfiguruje się produkcyjny adres URL strony oraz link do webhooka Cloudflare.
* **Integracja Rank Math SEO:** Tytuły i dane meta stron są pobierane bezpośrednio z wtyczki Rank Math SEO.
* **Przekierowania Headless:** Bezpośrednie próby wejścia na tradycyjny frontend WordPressa przez odwiedzających są automatycznie przekierowywane na docelowy adres URL w Astro (z obsługą parametrów podglądu).

## Struktura projektu Astro

```
src/
  layouts/
    BaseLayout.astro     – bazowy szablon HTML (czcionki, skrypty, meta)
    Layout.astro         – główny layout (obsługa SEO z Rank Math, logo, czcionki)
  components/
    Header.astro         – nagłówek z responsywnym menu mobilnym (a11y: zapobieganie CLS)
    Hero.astro           – sekcja Hero pobierająca tytuł i teksty z WordPressa
    ServiceBlock.astro   – elastyczne sekcje 50-50 z optymalizacją `<Image>`
    Testimonials.astro   – karuzela opinii klientów z poprawionym ARIA tab-role
    CallToAction.astro   – sekcja zachęcająca do kontaktu (telefon / email z WP)
    Footer.astro         – zoptymalizowana stopka z poprawnym kontrastem kolorów
  pages/
    [...slug].astro      – dynamiczny router obsługujący podstrony w locie z WP
    blog/
      index.astro        – katalog artykułów z WordPressa
      [slug].astro       – pojedynczy artykuł na blogu
  styles/
    global.css           – design tokens, zmienne CSS i kolory systemowe
```

## Rozwój lokalny

### 1. Klonowanie i instalacja
```bash
git clone https://github.com/WiktorGabryszak/yostrato-landing.git
cd yostrato-landing
npm install
```

### 2. Konfiguracja zmiennych środowiskowych
Utwórz plik `.env` w katalogu głównym projektu i podaj adres API WordPressa:
```env
WORDPRESS_API_URL=https://wordpress-1252676-6537812.cloudwaysapps.com/wp-json/wp/v2
```

### 3. Komendy
```bash
npm run dev       # Uruchamia serwer lokalny pod http://localhost:4321
npm run build     # Buduje gotowe statyczne pliki do folderu ./dist
npm run preview   # Pozwala podejrzeć lokalnie zbudowaną wersję produkcyjną
```

*Wskazówka:* W trybie deweloperskim (`npm run dev`) zmiany wprowadzone w WordPressie są odzwierciedlane natychmiast po odświeżeniu strony w przeglądarce dzięki dynamicznemu pobieraniu danych w czasie rzeczywistym.

## Deploy na Cloudflare Pages

1. Upewnij się, że kod jest wypchnięty na Twój GitHub.
2. W panelu Cloudflare Pages utwórz nowy projekt i połącz go ze swoim repozytorium.
3. Skonfiguruj następujące ustawienia:
   * **Framework preset:** `Astro`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
4. W sekcji **Environment variables** dodaj zmienną:
   * **Name:** `WORDPRESS_API_URL`
   * **Value:** `https://wordpress-1252676-6537812.cloudwaysapps.com/wp-json/wp/v2`
5. Zapisz i wdrożyj projekt. Skopiuj wygenerowany adres Webhooka wdrożeń z ustawień Cloudflare i wklej go do panelu **YostratO Settings** w WordPressie, aby włączyć automatyczne aktualizacje na żywo.
