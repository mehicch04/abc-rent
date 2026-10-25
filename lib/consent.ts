export type Consent = { v: 1; analytics: boolean; marketing: boolean; ts: number };

export const CONSENT_KEY = "abc-consent";
export const CONSENT_EVENT = "abc:consent-open";

declare global {
  interface Window {
    __abcConsent?: (c: Consent) => void;
  }
}

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");
    return c && c.v === 1 ? (c as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean): Consent {
  const c: Consent = { v: 1, analytics, marketing, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {}
  window.__abcConsent?.(c);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "consent_update", analytics, marketing });
  return c;
}

export const openConsent = () => window.dispatchEvent(new Event(CONSENT_EVENT));

export function gtmBootstrap(id: string) {
  return `(function(w,d,i){w.dataLayer=w.dataLayer||[];function g(){w.dataLayer.push(arguments)}w.gtag=w.gtag||g;g('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});var loaded=false;function load(){if(loaded)return;loaded=true;w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;d.head.appendChild(j)}function apply(c){var m=c.marketing?'granted':'denied';g('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:m,ad_user_data:m,ad_personalization:m})}function lazy(){var ev=['scroll','pointerdown','keydown','touchstart','mousemove'],done=false;function f(){if(done)return;done=true;ev.forEach(function(e){w.removeEventListener(e,f)});load()}ev.forEach(function(e){w.addEventListener(e,f,{passive:true})})}w.__abcConsent=function(c){apply(c);if(c.analytics||c.marketing)load()};var c=null;try{c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null')}catch(e){}if(c&&c.v===1){apply(c);if(c.analytics||c.marketing)lazy()}})(window,document,'${id}');`;
}
