/* Pixora — AI Chat Assistant Widget
   Self-contained: injects own HTML + CSS, no dependencies
   Design: Skatebuilder-inspired light palette (white/gray/black)
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  /* ── CSS ──────────────────────────────────────────────────────────── */
  const css = `
    #px-chat {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 10000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #111111;
    }

    /* ── Toggle button ─────────────────────────────────────────────── */
    #px-toggle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #6C47FF;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(108,71,255,.45);
      transition: transform .3s cubic-bezier(.34,1.56,.64,1),
                  box-shadow .3s ease;
      position: relative;
    }
    #px-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(108,71,255,.55);
    }
    #px-toggle .ic-chat,
    #px-toggle .ic-close {
      position: absolute;
      transition: opacity .25s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
    }
    #px-toggle .ic-close {
      opacity: 0;
      transform: rotate(-90deg) scale(.5);
    }
    #px-chat.open #px-toggle .ic-chat  { opacity: 0; transform: rotate(90deg) scale(.5); }
    #px-chat.open #px-toggle .ic-close { opacity: 1; transform: rotate(0) scale(1); }

    /* Unread badge */
    #px-badge {
      position: absolute;
      top: -3px; right: -3px;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #EF4444;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #080808;
      animation: pxBadgePop .35s cubic-bezier(.34,1.56,.64,1) forwards;
      pointer-events: none;
    }
    @keyframes pxBadgePop {
      from { transform: scale(0); }
      to   { transform: scale(1); }
    }

    /* ── Panel ─────────────────────────────────────────────────────── */
    #px-panel {
      position: absolute;
      bottom: 66px;
      right: 0;
      width: 360px;
      max-height: 530px;
      background: #FFFFFF;
      border-radius: 22px;
      border: 1px solid #E8E8E8;
      box-shadow: 0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.07);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(.85) translateY(14px);
      opacity: 0;
      pointer-events: none;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1),
                  opacity   .25s ease;
    }
    #px-chat.open #px-panel {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* ── Header ────────────────────────────────────────────────────── */
    #px-header {
      padding: 16px 20px;
      border-bottom: 1px solid #F0F0F0;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFFFFF;
      flex-shrink: 0;
    }
    .px-avatar {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6C47FF, #9B7BFF);
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 15px;
      flex-shrink: 0;
      letter-spacing: -.5px;
    }
    .px-hinfo { flex: 1; }
    .px-hname {
      display: block;
      font-weight: 700;
      font-size: 14px;
      color: #111;
      letter-spacing: -.2px;
    }
    .px-hstatus {
      font-size: 12px;
      color: #888;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .px-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #10B981;
      flex-shrink: 0;
      box-shadow: 0 0 0 2px rgba(16,185,129,.2);
    }

    /* ── Messages ──────────────────────────────────────────────────── */
    #px-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 16px 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      scroll-behavior: smooth;
    }
    #px-messages::-webkit-scrollbar { width: 4px; }
    #px-messages::-webkit-scrollbar-track { background: transparent; }
    #px-messages::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 2px; }

    .px-msg {
      display: flex;
      animation: pxMsgIn .22s ease forwards;
    }
    @keyframes pxMsgIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .px-msg.user { flex-direction: row-reverse; }

    .px-bubble {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 18px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
    }
    .px-msg.user .px-bubble {
      background: #111111;
      color: #FFFFFF;
      border-bottom-right-radius: 5px;
    }
    .px-msg.bot .px-bubble {
      background: #F4F4F4;
      color: #111111;
      border-bottom-left-radius: 5px;
    }

    /* Typing indicator */
    #px-typing-wrap { display: flex; }
    .px-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 16px;
      background: #F4F4F4;
      border-radius: 18px;
      border-bottom-left-radius: 5px;
      width: fit-content;
    }
    .px-tdot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #999;
      animation: pxBounce 1.3s ease infinite;
    }
    .px-tdot:nth-child(2) { animation-delay: .17s; }
    .px-tdot:nth-child(3) { animation-delay: .34s; }
    @keyframes pxBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%           { transform: translateY(-5px); }
    }

    /* Quick reply pills */
    .px-qr {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px 0 4px;
      animation: pxMsgIn .25s ease forwards;
    }
    .px-qr-btn {
      padding: 6px 13px;
      border-radius: 20px;
      border: 1.5px solid #E0E0E0;
      background: #FFFFFF;
      color: #333;
      font-size: 12.5px;
      font-family: inherit;
      cursor: pointer;
      transition: border-color .2s, color .2s, background .2s;
      line-height: 1.4;
    }
    .px-qr-btn:hover {
      border-color: #6C47FF;
      color: #6C47FF;
      background: rgba(108,71,255,.05);
    }

    /* ── Input area ─────────────────────────────────────────────────── */
    #px-input-area {
      padding: 12px 14px;
      border-top: 1px solid #F0F0F0;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      flex-shrink: 0;
    }
    #px-input {
      flex: 1;
      border: 1.5px solid #E5E5E5;
      border-radius: 22px;
      padding: 9px 16px;
      font-size: 13.5px;
      font-family: inherit;
      color: #111;
      background: #F8F8F8;
      outline: none;
      transition: border-color .2s, background .2s;
    }
    #px-input::placeholder { color: #AAAAAA; }
    #px-input:focus { border-color: #6C47FF; background: #FFFFFF; }
    #px-send {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: #111111;
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: white;
      transition: background .2s, transform .2s;
    }
    #px-send:hover { background: #333; transform: scale(1.06); }
    #px-send:disabled { background: #D5D5D5; cursor: not-allowed; transform: none; }

    /* Branding strip */
    #px-footer {
      padding: 8px 16px 10px;
      text-align: center;
      font-size: 11px;
      color: #BBBBBB;
      border-top: 1px solid #F5F5F5;
      flex-shrink: 0;
      background: #FAFAFA;
    }
    #px-footer a {
      color: #6C47FF;
      text-decoration: none;
      font-weight: 500;
    }
    #px-footer a:hover { text-decoration: underline; }

    @media (max-width: 420px) {
      #px-panel { width: calc(100vw - 32px); right: -14px; bottom: 68px; }
      #px-chat  { right: 16px; bottom: 16px; }
    }
  `;

  /* Inject CSS */
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ──────────────────────────────────────────────────────────── */
  const widgetHTML = `
    <div id="px-chat">
      <div id="px-panel" role="dialog" aria-label="Pixorbot" aria-modal="true">

        <div id="px-header">
          <div class="px-avatar">P</div>
          <div class="px-hinfo">
            <span class="px-hname">Pixorbot</span>
            <span class="px-hstatus">
              <span class="px-dot"></span>Alltid tilgjengelig
            </span>
          </div>
        </div>

        <div id="px-messages" aria-live="polite"></div>

        <div id="px-input-area">
          <input
            id="px-input"
            type="text"
            placeholder="Spør oss om nettsider..."
            autocomplete="off"
            maxlength="300"
            aria-label="Skriv en melding"
          />
          <button id="px-send" aria-label="Send melding">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div id="px-footer">
          Drevet av <a href="om-oss.html">Pixora</a> — Stavanger, Norge
        </div>
      </div>

      <button id="px-toggle" aria-label="Åpne chat" aria-expanded="false">
        <svg class="ic-chat" width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="ic-close" width="19" height="19" viewBox="0 0 24 24" fill="none"
          stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  /* ── Knowledge Base ────────────────────────────────────────────────── */
  /* Each entry: patterns (keywords to match), response, quick (follow-up pills) */
  const KB = [
    {
      id: 'greet',
      patterns: ['hei', 'hallo', 'heisan', 'god dag', 'hi ', 'hello', 'howdy', 'heia'],
      response: 'Hei! 👋 Hyggelig at du er innom. Jeg kan svare på spørsmål om priser, leveringstid, tjenester og hva Pixora kan gjøre for deg. Hva lurer du på?',
      quick: ['Hva koster en nettside?', 'Gratis utkast?', 'Hvem er Pixora?', 'Leveringstid?']
    },
    {
      id: 'priser',
      patterns: ['pris', 'kost', 'krone', ' kr', 'betale', 'pakke', 'plan', 'tilbud', 'billig', 'budsjett', 'faktura'],
      response: 'Vi har tre faste pakker — ingen skjulte kostnader:\n\n💜 <strong>Basis — 3 500 kr</strong> (engangsbeløp)\nOpptil 3 sider, SEO, mobiloptimalisert, kontaktskjema.\n\n💜 <strong>Profesjonell — 5 000 kr</strong> (engangsbeløp)\nOpptil 6 sider, avansert SEO, blogg, Google Analytics + 30 dagers gratis revisjon.\n\n💜 <strong>Nettbutikk — 8 000 kr</strong> (engangsbeløp)\nFull nettbutikk med betalingsintegrasjon og ordrebehandling.\n\nVedlikehold: <strong>499 kr/mnd</strong> (ingen binding).',
      quick: ['Hva er inkludert?', 'Nettbutikk?', 'Vedlikehold?', 'Se alle priser']
    },
    {
      id: 'basis',
      patterns: ['basis', 'enkel', 'billigste', 'grunnleggende', 'starter', 'minst', 'lite'],
      response: '<strong>Basis — 3 500 kr</strong> (betales én gang)\n\nPerfekt for bedrifter som trenger en profesjonell tilstedeværelse på nett:\n\n✓ Opptil 3 sider (hjem, om oss, kontakt)\n✓ Grunnleggende SEO\n✓ Mobiloptimalisert\n✓ Kontaktskjema\n✓ Rask lastetid\n✓ Skreddersydd design — ingen maler\n\nIngen månedlige kostnader til hosting (vi bruker GitHub Pages, gratis).',
      quick: ['Profesjonell-pakken?', 'Hva er vedlikehold?', 'Start med gratis utkast']
    },
    {
      id: 'profesjonell',
      patterns: ['profesjonell', 'avansert', 'blogg', 'analytics', 'revisjon', 'mest populær', 'mellom'],
      response: '<strong>Profesjonell — 5 000 kr</strong> (betales én gang)\n\nVår mest populære pakke:\n\n✓ Opptil 6 sider\n✓ Avansert SEO + søkeordanalyse\n✓ Blogg\n✓ Google Analytics\n✓ 30 dagers gratis revisjon etter lansering\n✓ Alt i Basis-pakken\n\nDu betaler én gang og eier alt. Ingen abonnement.',
      quick: ['Basis-pakken?', 'Nettbutikk?', 'Ta kontakt']
    },
    {
      id: 'nettbutikk',
      patterns: ['nettbutikk', 'butikk', 'produkt', 'stripe', 'vipps', 'betaling', 'handel', 'shop', 'selge', 'kjøp'],
      response: '<strong>Nettbutikk — 8 000 kr</strong> (betales én gang)\n\nFull e-handelsløsning:\n\n✓ Produktkatalog\n✓ Handlekurv og kasse\n✓ Stripe / Vipps-integrasjon\n✓ Ordrebehandling\n✓ Mobiloptimalisert og raskt\n✓ SEO for produktsider\n\nOppe og i drift på under én uke.',
      quick: ['Profesjonell-pakken?', 'Hva er vedlikehold?', 'Ta kontakt']
    },
    {
      id: 'vedlikehold',
      patterns: ['vedlikehold', 'oppdater', 'endre', 'fikse', 'månedlig', 'abonnement', 'support', 'etter lansering', 'etterpå'],
      response: '<strong>Vedlikehold — 499 kr/mnd</strong>\n\nFor deg som vil ha ro etter lansering:\n\n✓ Oppdatering av tekst og bilder\n✓ Tekniske fikser\n✓ Sikkerhetskopier\n✓ Ytelsesjustering\n✓ Svar innen én virkedag\n\nIngen binding — si opp når som helst.',
      quick: ['Pakker og priser', 'Ta kontakt']
    },
    {
      id: 'levering',
      patterns: ['tid', 'lever', 'uke', 'dag', 'rask', 'hurtig', 'fort', 'vente', 'deadline', 'ferdig', 'frist', 'lang'],
      response: 'Gjennomsnittlig leveringstid er <strong>4 dager</strong> fra vi starter.\n\n📋 Dag 1 — Vi starter designutkastet\n🎨 Dag 2–3 — Utkast klart, du gir tilbakemelding\n⚙️ Dag 3–4 — Ferdigstilling og hosting-oppsett\n🚀 Dag 4–5 — Nettsiden er live!\n\nTradisjonelle byråer bruker 6–12 uker. Vi er ferdig mens de har sitt første møte.',
      quick: ['Hva er prosessen?', 'Gratis utkast?']
    },
    {
      id: 'utkast',
      patterns: ['utkast', 'gratis', 'design', 'preview', 'se design', 'prototype', 'eksempel', 'mock', 'forplikt', 'betale noe'],
      response: 'Ja! Vi lager alltid et <strong>gratis designutkast</strong> — ingen betaling, ingen forpliktelse.\n\nSlik fungerer det:\n1. Du sender oss info om bedriften din\n2. Vi designer et ferdig utkast (2–3 dager)\n3. Du ser det og bestemmer deg\n\n<strong>Du eier utkastet uansett hva du bestemmer deg for.</strong> Liker du det ikke, betaler du ingenting og beholder designet.\n\nDette er ikke en mal — det er skreddersydd for deg.',
      quick: ['Start gratis utkast', 'Hva koster det?', 'Leveringstid?']
    },
    {
      id: 'prosess',
      patterns: ['prosess', 'steg', 'hvordan', 'fungere', 'start', 'begynne', 'trinn', 'flyt', 'ablauf'],
      response: 'Slik er prosessen:\n\n<strong>1 — Ta kontakt</strong>\nSend melding eller ring. Vi svarer innen én virkedag.\n\n<strong>2 — Gratis utkast</strong>\nVi designer nettsiden og sender deg et utkast. Gratis, ingen forpliktelse.\n\n<strong>3 — Juster og godkjenn</strong>\nFortell oss hva du vil endre. Vi justerer til du er fornøyd.\n\n<strong>4 — Live!</strong>\nVi setter opp hosting, domene og lanserer. Du er live på nett.',
      quick: ['Leveringstid?', 'Hva koster det?', 'Gratis utkast?']
    },
    {
      id: 'seo',
      patterns: ['seo', 'google', 'søk', 'rangere', 'synlig', 'trafikk', 'søkemotor', 'keyword', 'finne', 'søkeord'],
      response: 'SEO er inkludert i alle pakker — ikke som tillegg.\n\nHva vi gjør:\n✓ Semantisk HTML-struktur\n✓ Meta-titler og beskrivelser\n✓ Rask lastetid (Google belønner dette)\n✓ Mobiloptimalisering\n✓ Intern lenkestruktur\n✓ Bildekomprimering og alt-tekster\n\nProfesjonell-pakken inkluderer avansert SEO med søkeordanalyse og strukturert data.',
      quick: ['Se pakker', 'Ta kontakt']
    },
    {
      id: 'mobil',
      patterns: ['mobil', 'telefon', 'responsiv', 'tablet', 'ipad', 'iphone', 'android', 'skjerm', 'enhet'],
      response: 'Alle nettsider vi leverer er <strong>mobil-first</strong>.\n\nVi designer for mobil og skalerer opp til desktop — ikke omvendt. Mer enn 60 % av nettrafikken er på mobil.\n\nVi tester på:\n📱 iPhone (Safari)\n📱 Android (Chrome)\n💻 Desktop (Chrome, Firefox, Safari)',
      quick: ['Se pakker', 'Gratis utkast?']
    },
    {
      id: 'teknologi',
      patterns: ['wordpress', 'wix', 'squarespace', 'kode', 'teknologi', 'html', 'cms', 'plugin', 'shopify', 'bygget', 'plattform'],
      response: 'Vi bruker <strong>håndskrevet HTML, CSS og JavaScript</strong> — ingen WordPress, ingen side-builders.\n\nHvorfor dette er bedre:\n⚡ Raskere — ingen tunge plugins\n🔒 Sikrere — ingen plugin-sårbarheter\n🎯 Bedre SEO — ren, semantisk kode\n💰 Billigere drift — ingen lisensingskostnader\n\nHosting på GitHub Pages: gratis. Du betaler kun domenet (~100–200 kr/år).',
      quick: ['Hva er hosting?', 'Priser', 'Gratis utkast?']
    },
    {
      id: 'hosting',
      patterns: ['hosting', 'server', 'domene', 'dns', 'github', 'drift', 'drifts', 'url', 'adresse'],
      response: 'Vi setter opp hosting og domene for deg — ingen teknisk kunnskap nødvendig.\n\nVi bruker <strong>GitHub Pages</strong> for hosting:\n✓ Gratis (ingen månedlig hostingkostnad)\n✓ Rask global leveranse\n✓ HTTPS inkludert\n✓ Vi kobler ditt domene (f.eks. dinbedrift.no)\n\nDomene koster ~100–200 kr/år — betales direkte til registraren.',
      quick: ['Teknologi', 'Priser']
    },
    {
      id: 'hvem',
      patterns: ['hvem', 'pixora', 'om dere', 'om deg', 'om oss', 'firma', 'selskap', 'team', 'grunnlagt', 'startet', 'bakgrunn', 'rasmus', 'aksel', 'arne'],
      response: 'Pixora er et webutviklingsfirma fra <strong>Stavanger</strong>, grunnlagt i 2026.\n\nVi er tre medgründere:\n\n👨‍💻 <strong>Rasmus Hansen Østensen</strong> — Medgründer & teknisk ansvarlig. Sørger for at alle nettsider er raske, sikre og godt optimaliserte.\n\n💼 <strong>Aksel Dørum Middelthon</strong> — Medgründer & økonomiansvarlig. Holder prisene lave og kvaliteten høy.\n\n📣 <strong>Arne Farstad</strong> — Medgründer & markedssjef. Pitcher kunder og jobber med SEO og vekststrategi.\n\nVi startet fordi lokale bedrifter fortjener profesjonelle nettsider uten de enorme byråprisene.',
      quick: ['Hva koster det?', 'Ta kontakt', 'Gratis utkast?']
    },
    {
      id: 'kontakt',
      patterns: ['kontakt', 'ring', 'telefon', 'mail', 'epost', 'e-post', 'nå', 'snakk', 'møte'],
      response: 'Du kan nå oss direkte:\n\n📧 <strong>pixorawebdesigns@gmail.com</strong>\n📞 <strong>465 12 634</strong>\n\nVi svarer alltid innen én virkedag — som regel samme dag.',
      quick: ['Gå til kontaktskjema', 'Hva koster det?']
    },
    {
      id: 'stavanger',
      patterns: ['stavanger', 'rogaland', 'norges', 'norsk', 'lokalt', 'by', 'geografisk', 'nærhet'],
      response: 'Vi holder til i <strong>Stavanger</strong>, men betjener kunder over hele <strong>Norge</strong> 🇳🇴\n\nAlt foregår digitalt — du trenger ikke møte oss fysisk. Vi kommuniserer på e-post, telefon og videomøte.',
      quick: ['Hvem er Pixora?', 'Ta kontakt']
    },
    {
      id: 'garanti',
      patterns: ['garanti', 'risiko', 'sikker', 'trygg', 'forplikt', 'binde', 'angre', 'usikker', 'prøve'],
      response: 'Vi gjør det risikofritt:\n\n✅ Gratis utkast — se ferdig design før du betaler\n✅ Fast pris — ingen overraskelser\n✅ Ingen binding — vedlikehold sies opp når som helst\n✅ Du eier alt — kode, domene og innhold er ditt\n✅ 30 dagers revisjon inkludert i Profesjonell-pakken\n\nLiker du ikke utkastet, betaler du ingenting.',
      quick: ['Hva koster det?', 'Start gratis utkast']
    },
    {
      id: 'sammenligning',
      patterns: ['byrå', 'konkurrent', 'annen', 'forsk', 'vs', 'versus', 'sammenlign', 'tradisjonell', 'dyrere', 'anderledes'],
      response: 'Pixora vs tradisjonelt webbyrå:\n\n💰 <strong>Pris:</strong> 3 500–8 000 kr vs 50 000–200 000 kr\n⏱ <strong>Leveringstid:</strong> 3–5 dager vs 4–12 uker\n👤 <strong>Kontakt:</strong> Direkte med utvikler vs prosjektleder i kø\n💻 <strong>Kode:</strong> Håndskrevet vs WordPress + plugins\n🎁 <strong>Utkast:</strong> Gratis vs betalt\n🔒 <strong>Hosting:</strong> Gratis (GitHub Pages) vs månedlig kostnad\n\nSamme kvalitet — en brøkdel av prisen.',
      quick: ['Se pakker og priser', 'Gratis utkast']
    },
    {
      id: 'inkludert',
      patterns: ['inkluder', 'hva får', 'hva er med', 'innhold', 'funksjon', 'feature', 'hva inng'],
      response: 'I alle pakkene er dette inkludert som standard:\n\n✓ Skreddersydd design (ingen maler)\n✓ Mobiloptimalisering\n✓ SEO-grunnlag\n✓ HTTPS + sikker hosting\n✓ Kontaktskjema\n✓ Rask lastetid\n✓ Gratis designutkast\n✓ Oppsett av domene\n\nProfesjonell- og Nettbutikk-pakken inkluderer mer — se prisside for detaljer.',
      quick: ['Se pakker', 'Ta kontakt']
    }
  ];

  /* ── Element refs ───────────────────────────────────────────────────── */
  const widget   = document.getElementById('px-chat');
  const panel    = document.getElementById('px-panel');
  const toggle   = document.getElementById('px-toggle');
  const msgs     = document.getElementById('px-messages');
  const inputEl  = document.getElementById('px-input');
  const sendBtn  = document.getElementById('px-send');

  let isOpen   = false;
  let isBusy   = false;
  let welcomed = false;

  /* ── Toggle open/close ──────────────────────────────────────────────── */
  function openChat () {
    if (isOpen) return;
    isOpen = true;
    widget.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    removeBadge();
    if (!welcomed) { welcomed = true; showWelcome(); }
    setTimeout(() => inputEl.focus(), 350);
  }

  function closeChat () {
    if (!isOpen) return;
    isOpen = false;
    widget.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeChat() : openChat();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !widget.contains(e.target)) closeChat();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* ── Badge (proactive) ──────────────────────────────────────────────── */
  function removeBadge () {
    const b = document.getElementById('px-badge');
    if (b) b.remove();
  }

  setTimeout(() => {
    if (!isOpen) {
      const b = document.createElement('div');
      b.id = 'px-badge';
      b.textContent = '1';
      toggle.appendChild(b);
    }
  }, 4500);

  /* ── Message helpers ────────────────────────────────────────────────── */
  function addMsg (html, sender) {
    const row = document.createElement('div');
    row.className = `px-msg ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'px-bubble';
    bubble.innerHTML = html;
    row.appendChild(bubble);
    msgs.appendChild(row);
    scroll();
    return row;
  }

  function showTyping () {
    const wrap = document.createElement('div');
    wrap.id = 'px-typing-wrap';
    wrap.className = 'px-msg bot';
    wrap.innerHTML = `<div class="px-typing">
      <span class="px-tdot"></span>
      <span class="px-tdot"></span>
      <span class="px-tdot"></span>
    </div>`;
    msgs.appendChild(wrap);
    scroll();
  }

  function removeTyping () {
    const el = document.getElementById('px-typing-wrap');
    if (el) el.remove();
  }

  function addQuickReplies (replies) {
    const wrap = document.createElement('div');
    wrap.className = 'px-qr';
    replies.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'px-qr-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        wrap.remove();
        // Navigation shortcuts
        if (/kontaktskjema|kom i gang|start gratis utkast/i.test(label)) {
          window.location.href = 'kontakt.html';
        } else if (/se (alle )?priser|pakker og priser|pakker|se priser/i.test(label)) {
          window.location.href = 'priser.html';
        } else if (/ta kontakt$/i.test(label)) {
          window.location.href = 'kontakt.html';
        } else {
          handleMsg(label);
        }
      });
      wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    scroll();
  }

  function scroll () {
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── Format text (bold + line breaks) ─────────────────────────────── */
  function fmt (text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  /* ── Response engine ────────────────────────────────────────────────── */
  function findMatch (text) {
    const low = text.toLowerCase();
    let best = null, bestScore = 0;

    for (const entry of KB) {
      let score = 0;
      for (const p of entry.patterns) {
        if (low.includes(p)) score += p.length;
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return bestScore > 0 ? best : null;
  }

  /* ── Welcome ────────────────────────────────────────────────────────── */
  function showWelcome () {
    setTimeout(() => {
      addMsg('Hei! 👋 Jeg er Pixorbot — jeg kan svare på spørsmål om priser, leveringstid, tjenester og mer.', 'bot');
      setTimeout(() => {
        addMsg('Hva kan jeg hjelpe deg med?', 'bot');
        addQuickReplies(['Hva koster en nettside?', 'Gratis utkast?', 'Leveringstid?', 'Hvem er Pixora?']);
      }, 550);
    }, 280);
  }

  /* ── Handle user message ────────────────────────────────────────────── */
  function handleMsg (text) {
    text = text.trim();
    if (!text || isBusy) return;

    addMsg(escHtml(text), 'user');
    inputEl.value = '';
    sendBtn.disabled = true;
    isBusy = true;

    showTyping();

    const delay = 420 + Math.random() * 480;

    setTimeout(() => {
      removeTyping();

      const match = findMatch(text);

      if (match) {
        addMsg(fmt(match.response), 'bot');
        if (match.quick && match.quick.length) {
          setTimeout(() => addQuickReplies(match.quick), 180);
        }
      } else {
        addMsg(
          'Godt spørsmål! Det er litt utenfor det jeg har svar på akkurat nå. Ta kontakt direkte, så hjelper vi deg:\n\n📧 <strong>pixorawebdesigns@gmail.com</strong>\n📞 <strong>465 12 634</strong>\n\nVi svarer innen én virkedag 😊',
          'bot'
        );
        setTimeout(() => addQuickReplies(['Gå til kontaktskjema', 'Hva koster det?', 'Gratis utkast?']), 180);
      }

      isBusy = false;
      sendBtn.disabled = false;
    }, delay);
  }

  function escHtml (str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Events ─────────────────────────────────────────────────────────── */
  sendBtn.addEventListener('click', () => handleMsg(inputEl.value));

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMsg(inputEl.value);
    }
  });

  inputEl.addEventListener('input', () => {
    sendBtn.disabled = !inputEl.value.trim() || isBusy;
  });

  sendBtn.disabled = true; // starts disabled until input has content

})();
