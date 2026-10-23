import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "../globals.css";
import { isRtl, routing, type AppLocale } from "@/i18n/routing";
import { SITE } from "@/lib/site-config";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { CompanyProvider } from "@/components/company/CompanyProvider";
import { getCompany } from "@/lib/company";
import { getLocations } from "@/lib/fleet-data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  preload: false,
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  preload: false,
  variable: "--font-display",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
  variable: "--font-arabic",
  display: "swap",
});

const CLIENT_NAMESPACES = [
  "Common",
  "Cta",
  "Extras",
  "Faq",
  "Features",
  "Fleet",
  "Form",
  "Hero",
  "HomeFleet",
  "HowItWorks",
  "Reviews",
  "Inquiry",
  "Nav",
  "Search",
  "Services",
  "Guides",
  "Visit",
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? `https://${SITE.domain}`,
  ),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Rent a car Sarajevo. Besplatna dostava na Aerodrom Sarajevo i na vašu adresu, depozit od 200 €, neograničena kilometraža i puno osiguranje.",
  applicationName: SITE.name,
  authors: [{ name: "mehiccdev", url: "https://mehiccdev.com" }],
  creator: "mehiccdev",
  formatDetection: { telephone: true, address: true, email: true },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | Rent a Car Sarajevo`,
    description:
      "Rent a car Sarajevo s besplatnom dostavom na aerodrom i adresu.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE.name} | Rent a Car Sarajevo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Rent a Car Sarajevo`,
    description:
      "Rent a car Sarajevo s besplatnom dostavom na aerodrom i adresu.",
    images: ["/og-image.jpg"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const all = await getMessages();

  const company = await getCompany();
  const footerLocations = await getLocations(locale);

  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in all).map((ns) => [ns, all[ns]]),
  );

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable} ${arabic.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {SITE.gtmId && process.env.NODE_ENV === "production" && (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,i){var ev=['scroll','pointerdown','keydown','touchstart','mousemove'],done=false;function load(){if(done)return;done=true;ev.forEach(function(e){w.removeEventListener(e,load)});w.dataLayer=w.dataLayer||[];w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j)}ev.forEach(function(e){w.addEventListener(e,load,{passive:true})})})(window,document,'${SITE.gtmId}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${SITE.gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <JsonLd locale={locale} />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <CompanyProvider value={company}>
            <CurrencyProvider defaultCurrency="EUR">
            <MotionProvider>
              <div className="flex min-h-dvh flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer company={company} locations={footerLocations} />
              </div>
              <BackToTop />
              <WhatsAppFab />
            </MotionProvider>
            </CurrencyProvider>
            </CompanyProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
