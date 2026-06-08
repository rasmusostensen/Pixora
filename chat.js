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
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #111111;
    }

    /* ── Toggle button ─────────────────────────────────────────────── */
    #px-toggle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #111111;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
      transition: transform .3s cubic-bezier(.34,1.56,.64,1),
                  box-shadow .3s ease;
      position: relative;
    }
    #px-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(0,0,0,.28);
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
      color: #FFFFFF;
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
      border: 1px solid rgba(0,0,0,.08);
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
      border-bottom: 1px solid rgba(0,0,0,.07);
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFFFFF;
      flex-shrink: 0;
    }
    .px-avatar {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #111, #444);
      display: flex; align-items: center; justify-content: center;
      color: #FFFFFF;
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
      color: #111111;
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
      background: #F4F4F2;
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
      background: #F4F4F2;
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
      border: 1.5px solid rgba(0,0,0,.1);
      background: #FFFFFF;
      color: #333;
      font-size: 12.5px;
      font-family: inherit;
      cursor: pointer;
      transition: border-color .2s, color .2s, background .2s;
      line-height: 1.4;
    }
    .px-qr-btn:hover {
      border-color: #111;
      color: #111;
      background: rgba(0,0,0,.04);
    }

    /* ── Input area ─────────────────────────────────────────────────── */
    #px-input-area {
      padding: 12px 14px;
      border-top: 1px solid rgba(0,0,0,.07);
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      flex-shrink: 0;
    }
    #px-input {
      flex: 1;
      border: 1.5px solid rgba(0,0,0,.1);
      border-radius: 22px;
      padding: 9px 16px;
      font-size: 13.5px;
      font-family: inherit;
      color: #111111;
      background: #F0F0EE;
      outline: none;
      transition: border-color .2s, background .2s;
    }
    #px-input::placeholder { color: #BBBBBB; }
    #px-input:focus { border-color: #111; background: #FFFFFF; }
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
      border-top: 1px solid rgba(0,0,0,.05);
      flex-shrink: 0;
      background: #F8F8F6;
    }
    #px-footer a {
      color: #111;
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
  /*  Each entry: id, patterns (keywords to score against), response (HTML),
      quick (follow-up pill labels).
      Scoring: base = pattern.length, +50 % bonus for whole-word match.    */
  const KB = [
    {
      id: 'hjelp',
      patterns: ['hva kan du hjelpe', 'hva hjelper du med', 'hva vet du om', 'hva kan du svare', 'hva kan boten', 'hva spør jeg om', 'hva kan jeg spørre', 'hjelpemeny', 'meny', 'oversikt over', 'hva tilbyr du'],
      response: 'Jeg kan svare på det meste om Pixora og nettsider! Her er hva jeg vet om:\n\n💜 <strong>Priser og pakker</strong> — fra 3 500 kr\n⚡ <strong>Leveringstid</strong> — normalt 3–5 dager\n🎁 <strong>Gratis utkast</strong> — ingen forpliktelse\n🔍 <strong>SEO</strong> — inkludert i alle pakker\n📱 <strong>Mobiloptimalisering</strong> — alltid\n⚙️ <strong>Teknologi</strong> — håndskrevet kode, ingen WordPress\n💳 <strong>Betaling</strong> — etter du er fornøyd\n👥 <strong>Om oss</strong> — tre gründere fra Stavanger\n\nBare spør — eller velg et tema nedenfor!',
      quick: ['Hva koster det?', 'Gratis utkast?', 'Leveringstid?', 'Hvem er Pixora?']
    },
    {
      id: 'greet',
      patterns: ['hei', 'hallo', 'heisan', 'god dag', 'hi ', 'hello', 'howdy', 'heia', 'god morgen', 'god kveld'],
      response: 'Hei! 👋 Hyggelig at du er innom. Jeg kan svare på spørsmål om priser, leveringstid, tjenester og hva Pixora kan gjøre for deg. Hva lurer du på?',
      quick: ['Hva koster en nettside?', 'Gratis utkast?', 'Hvem er Pixora?', 'Leveringstid?']
    },
    {
      id: 'priser',
      patterns: ['pris', 'kost', 'krone', ' kr', 'pakke', 'plan', 'tilbud', 'billig', 'budsjett', 'hva koster'],
      response: 'Vi har tre faste pakker — ingen skjulte kostnader:\n\n💜 <strong>Basis — 3 500 kr</strong> (engangsbeløp)\nOpptil 3 sider, SEO, mobiloptimalisert, kontaktskjema.\n\n💜 <strong>Profesjonell — 5 000 kr</strong> (engangsbeløp)\nOpptil 6 sider, avansert SEO, blogg, Google Analytics + 30 dagers gratis revisjon.\n\n💜 <strong>Nettbutikk — 8 000 kr</strong> (engangsbeløp)\nFull nettbutikk med betalingsintegrasjon og ordrebehandling.\n\nVedlikehold fra <strong>500 kr/mnd</strong> (ingen binding).',
      quick: ['Hva er inkludert?', 'Nettbutikk?', 'Vedlikehold?', 'Se alle priser']
    },
    {
      id: 'basis',
      patterns: ['basis', 'billigste', 'grunnleggende', 'enkleste', 'minste', 'startpakke', '3500', '3 500'],
      response: '<strong>Basis — 3 500 kr</strong> (betales én gang)\n\nPerfekt for bedrifter som trenger en profesjonell tilstedeværelse på nett:\n\n✓ Opptil 3 sider (hjem, om oss, kontakt)\n✓ Grunnleggende SEO\n✓ Mobiloptimalisert\n✓ Kontaktskjema\n✓ Rask lastetid\n✓ Skreddersydd design — ingen maler\n\nIngen månedlige kostnader til hosting.',
      quick: ['Profesjonell-pakken?', 'Hva er vedlikehold?', 'Start med gratis utkast']
    },
    {
      id: 'profesjonell',
      patterns: ['profesjonell', 'avansert', 'blogg', 'analytics', 'revisjon', 'mest populær', '5000', '5 000'],
      response: '<strong>Profesjonell — 5 000 kr</strong> (betales én gang)\n\nVår mest populære pakke:\n\n✓ Opptil 6 sider\n✓ Avansert SEO + søkeordanalyse\n✓ Blogg\n✓ Google Analytics\n✓ 30 dagers gratis revisjon etter lansering\n✓ Alt i Basis-pakken\n\nDu betaler én gang og eier alt. Ingen abonnement.',
      quick: ['Basis-pakken?', 'Nettbutikk?', 'Ta kontakt']
    },
    {
      id: 'nettbutikk',
      patterns: ['nettbutikk', 'butikk', 'produkt', 'stripe', 'handel', 'shop', 'selge', 'kjøp', 'e-handel', 'netthandel', '8000', '8 000'],
      response: '<strong>Nettbutikk — 8 000 kr</strong> (betales én gang)\n\nFull e-handelsløsning:\n\n✓ Produktkatalog\n✓ Handlekurv og kasse\n✓ Stripe / Vipps-integrasjon\n✓ Ordrebehandling\n✓ Mobiloptimalisert og raskt\n✓ SEO for produktsider\n\nOppe og i drift på under én uke.',
      quick: ['Profesjonell-pakken?', 'Hva er vedlikehold?', 'Ta kontakt']
    },
    {
      id: 'vedlikehold',
      patterns: ['vedlikehold', 'oppdatere', 'fikse feil', 'månedlig', 'abonnement', 'support', 'etter lansering', 'drifting'],
      response: '<strong>Vedlikehold</strong> — ingen binding, si opp når som helst:\n\n📦 Basis: <strong>500 kr/mnd</strong>\n📦 Profesjonell: <strong>800 kr/mnd</strong>\n📦 Nettbutikk: <strong>1 000 kr/mnd</strong>\n\nHva du får:\n✓ Oppdatering av tekst og bilder\n✓ Tekniske fikser\n✓ Sikkerhetskopier\n✓ Ytelsesjustering\n✓ Svar innen én virkedag\n\nVil du heller gjøre endringer selv? Vi hjelper deg med det også — gratis.',
      quick: ['Kan jeg endre selv?', 'Se pakker og priser', 'Ta kontakt']
    },
    {
      id: 'levering',
      patterns: ['leveringstid', 'levertid', 'uke', 'dager', 'vente', 'deadline', 'ferdig', 'frist', 'hvor lang', 'tid tar'],
      response: 'Gjennomsnittlig leveringstid er <strong>4 dager</strong> fra vi starter.\n\n📋 Dag 1 — Vi starter designutkastet\n🎨 Dag 2–3 — Utkast klart, du gir tilbakemelding\n⚙️ Dag 3–4 — Ferdigstilling og hosting-oppsett\n🚀 Dag 4–5 — Nettsiden er live!\n\nTradisjonelle byråer bruker 6–12 uker. Vi er ferdig mens de har sitt første møte.',
      quick: ['Hva er prosessen?', 'Gratis utkast?', 'Haster det?']
    },
    {
      id: 'utkast',
      patterns: ['utkast', 'gratis design', 'se design', 'prototype', 'forpliktelse', 'betale noe', 'prøve gratis', 'se utkast'],
      response: 'Ja! Vi lager alltid et <strong>gratis designutkast</strong> — ingen betaling, ingen forpliktelse.\n\nSlik fungerer det:\n1. Du sender oss info om bedriften din\n2. Vi designer et ferdig utkast (2–3 dager)\n3. Du ser det og bestemmer deg\n\n<strong>Du eier utkastet uansett hva du bestemmer deg for.</strong> Liker du det ikke, betaler du ingenting.',
      quick: ['Start gratis utkast', 'Hva koster det?', 'Leveringstid?']
    },
    {
      id: 'prosess',
      patterns: ['prosess', 'hvordan fungerer', 'steg for steg', 'begynne', 'komme i gang', 'trinn', 'hva skjer', 'slik virker'],
      response: 'Slik er prosessen:\n\n<strong>1 — Ta kontakt</strong>\nSend melding eller ring. Vi svarer innen én virkedag.\n\n<strong>2 — Gratis utkast</strong>\nVi designer nettsiden og sender deg et utkast. Gratis, ingen forpliktelse.\n\n<strong>3 — Juster og godkjenn</strong>\nFortell oss hva du vil endre. Vi justerer til du er fornøyd.\n\n<strong>4 — Live!</strong>\nVi setter opp hosting, domene og lanserer.',
      quick: ['Leveringstid?', 'Hva koster det?', 'Gratis utkast?']
    },
    {
      id: 'seo',
      patterns: ['seo', 'google', 'søkeoptimal', 'rangere', 'synlig på nett', 'trafikk', 'søkemotor', 'søkeord', 'finnes på google'],
      response: 'SEO er inkludert i alle pakker — ikke som tillegg.\n\nHva vi gjør:\n✓ Semantisk HTML-struktur\n✓ Meta-titler og beskrivelser\n✓ Rask lastetid (Google belønner dette)\n✓ Mobiloptimalisering\n✓ Intern lenkestruktur\n✓ Bildekomprimering og alt-tekster\n\nProfesjonell-pakken inkluderer avansert SEO med søkeordanalyse.',
      quick: ['Se pakker', 'Profesjonell-pakken?', 'Ta kontakt']
    },
    {
      id: 'mobil',
      patterns: ['mobil', 'telefon', 'responsiv', 'tablet', 'ipad', 'iphone', 'android', 'mobiloptim', 'ulike enheter', 'alle skjermer'],
      response: 'Alle nettsider vi leverer er <strong>mobil-first</strong>.\n\nVi designer for mobil og skalerer opp til desktop — ikke omvendt. Mer enn 60 % av nettrafikken er på mobil.\n\nVi tester på:\n📱 iPhone (Safari)\n📱 Android (Chrome)\n💻 Desktop (Chrome, Firefox, Safari)',
      quick: ['Se pakker', 'Gratis utkast?']
    },
    {
      id: 'teknologi',
      patterns: ['wordpress', 'wix', 'squarespace', 'teknologi', 'html', 'cms', 'plugin', 'shopify', 'plattform', 'laget med', 'bygget med'],
      response: 'Vi bruker <strong>håndskrevet HTML, CSS og JavaScript</strong> — ingen WordPress, ingen side-builders.\n\nHvorfor dette er bedre:\n⚡ Raskere — ingen tunge plugins\n🔒 Sikrere — ingen plugin-sårbarheter\n🎯 Bedre SEO — ren, semantisk kode\n💰 Billigere drift — ingen lisensingskostnader\n\nHosting på GitHub Pages: gratis. Du betaler kun domenet (~100–200 kr/år).',
      quick: ['Hva er hosting?', 'Priser', 'Gratis utkast?']
    },
    {
      id: 'hosting',
      patterns: ['hosting', 'server', 'domene', 'dns', 'github pages', 'drifts', 'nettadresse', 'url', 'dinbedrift.no'],
      response: 'Vi setter opp hosting og domene for deg — ingen teknisk kunnskap nødvendig.\n\nVi bruker <strong>GitHub Pages</strong> for hosting:\n✓ Gratis (ingen månedlig hostingkostnad)\n✓ Rask global leveranse\n✓ HTTPS inkludert\n✓ Vi kobler ditt domene (f.eks. dinbedrift.no)\n\nDomene koster ~100–200 kr/år — betales direkte til registraren.',
      quick: ['Teknologi', 'Priser']
    },
    {
      id: 'hvem',
      patterns: ['hvem er', 'om pixora', 'om dere', 'om deg', 'firma', 'selskap', 'team', 'grunnlagt', 'startet', 'bakgrunn', 'rasmus', 'aksel', 'arne'],
      response: 'Pixora er et webutviklingsfirma fra <strong>Stavanger</strong>, grunnlagt i 2026.\n\nVi er tre medgründere:\n\n👨‍💻 <strong>Rasmus Hansen Østensen</strong> — Medgründer & teknisk ansvarlig. Sørger for at alle nettsider er raske, sikre og godt optimaliserte.\n\n💼 <strong>Aksel Dørum Middelthon</strong> — Medgründer & økonomiansvarlig. Holder prisene lave og kvaliteten høy.\n\n📣 <strong>Arne Farstad</strong> — Medgründer & markedssjef. Jobber med SEO og vekststrategi.\n\nVi startet fordi lokale bedrifter fortjener profesjonelle nettsider uten de enorme byråprisene.',
      quick: ['Hva koster det?', 'Ta kontakt', 'Gratis utkast?']
    },
    {
      id: 'kontakt',
      patterns: ['kontakt', 'ring oss', 'telefonnummer', 'e-post', 'epost', 'mail oss', 'nå dere', 'snakke med', 'møte dere'],
      response: 'Du kan nå oss direkte:\n\n📧 <strong>pixorawebdesigns@gmail.com</strong>\n📞 <strong>465 12 634</strong>\n📍 Stavanger, Norge\n\nVi svarer alltid innen én virkedag — som regel samme dag.',
      quick: ['Gå til kontaktskjema', 'Hva koster det?']
    },
    {
      id: 'stavanger',
      patterns: ['stavanger', 'rogaland', 'norsk', 'lokalt byrå', 'geografisk', 'hele landet', 'utenfor stavanger'],
      response: 'Vi holder til i <strong>Stavanger</strong>, men betjener kunder over hele <strong>Norge</strong> 🇳🇴\n\nAlt foregår digitalt — du trenger ikke møte oss fysisk. Vi kommuniserer på e-post, telefon og videomøte.',
      quick: ['Hvem er Pixora?', 'Ta kontakt']
    },
    {
      id: 'garanti',
      patterns: ['garanti', 'risiko', 'trygg', 'forplikt', 'binde seg', 'angre', 'usikker', 'ingen risiko'],
      response: 'Vi gjør det risikofritt:\n\n✅ Gratis utkast — se ferdig design før du betaler\n✅ Fast pris — ingen overraskelser\n✅ Ingen binding — vedlikehold sies opp når som helst\n✅ Du eier alt — kode, domene og innhold er ditt\n✅ 30 dagers revisjon inkludert i Profesjonell-pakken\n\nLiker du ikke utkastet, betaler du ingenting.',
      quick: ['Hva koster det?', 'Start gratis utkast']
    },
    {
      id: 'sammenligning',
      patterns: ['byrå', 'konkurrent', 'sammenlign', 'tradisjonelt byrå', 'versus', 'annerledes enn', 'dyrere enn', 'andre leverandør'],
      response: 'Pixora vs tradisjonelt webbyrå:\n\n💰 <strong>Pris:</strong> 3 500–8 000 kr vs 50 000–200 000 kr\n⏱ <strong>Leveringstid:</strong> 3–5 dager vs 4–12 uker\n👤 <strong>Kontakt:</strong> Direkte med utvikler vs prosjektleder i kø\n💻 <strong>Kode:</strong> Håndskrevet vs WordPress + plugins\n🎁 <strong>Utkast:</strong> Gratis vs betalt\n🔒 <strong>Hosting:</strong> Gratis (GitHub Pages) vs månedlig kostnad\n\nSamme kvalitet — en brøkdel av prisen.',
      quick: ['Se pakker og priser', 'Gratis utkast']
    },
    {
      id: 'inkludert',
      patterns: ['inkludert', 'hva får jeg', 'hva er med', 'hva inngår', 'funksjoner', 'hva leverer'],
      response: 'I alle pakkene er dette inkludert som standard:\n\n✓ Skreddersydd design (ingen maler)\n✓ Mobiloptimalisering\n✓ SEO-grunnlag\n✓ HTTPS + sikker hosting\n✓ Kontaktskjema\n✓ Rask lastetid\n✓ Gratis designutkast\n✓ Oppsett av domene\n\nProfesjonell- og Nettbutikk-pakken inkluderer mer — se prisside for detaljer.',
      quick: ['Se pakker', 'Ta kontakt']
    },

    /* ── NYE EMNER ───────────────────────────────────────────────────── */

    {
      id: 'betaling',
      patterns: ['faktura', 'betalingsmåte', 'bankoverføring', 'vipps betale', 'kredittkort', 'når betaler', 'forskudd', 'deposit', 'delbetaling', 'betale etter'],
      response: 'Du betaler <strong>etter</strong> at nettsiden er klar og du er fornøyd — ikke før.\n\nVi godtar:\n✓ Bankoverføring\n✓ Vipps\n✓ Faktura med 14 dagers betalingsfrist\n\nIngen deposit, ingen skjulte kostnader.',
      quick: ['Hva koster det?', 'Gratis utkast?', 'Ta kontakt']
    },
    {
      id: 'eierskap',
      patterns: ['eie koden', 'eier koden', 'eier nettsiden', 'rettigheter', 'tilgang til koden', 'kildekode', 'bytte leverandør', 'låst inne'],
      response: 'Du eier <strong>alt 100 %</strong> etter levering:\n\n✓ All kildekode\n✓ Domenet ditt\n✓ Innhold og bilder\n✓ GitHub-repositoriet\n\nVi låser deg ikke inne. Du kan når som helst ta over selv, eller bytte til en annen leverandør — vi hjelper med overlevering.',
      quick: ['Vedlikehold?', 'Teknologi', 'Ta kontakt']
    },
    {
      id: 'innhold',
      patterns: ['hva trenger dere', 'hva trenger jeg', 'innhold til', 'tekst til', 'bilder til', 'levere til dere', 'sende dere', 'bidra med', 'logo har ikke', 'ikke logo'],
      response: 'Vi trenger litt info fra deg for å komme i gang:\n\n📝 <strong>Tekst:</strong> Hva du tilbyr, hvem dere er, kontaktinfo\n🖼 <strong>Bilder:</strong> Logo og eventuelle produktbilder\n🎨 <strong>Stil:</strong> Farger du liker, eller nettsider du synes ser bra ut\n\n<strong>Har du ikke alt?</strong> Ingen problem — vi hjelper med tekst og bruker gratis stockbilder. Du trenger ikke ha alt klart for å bestille.',
      quick: ['Gratis utkast?', 'Leveringstid?', 'Start gratis utkast']
    },
    {
      id: 'endre-selv',
      patterns: ['redigere selv', 'endre selv', 'oppdatere selv', 'admin panel', 'dashboard', 'administrere nettsiden', 'endre tekst selv', 'legge til innhold'],
      response: 'Vil du endre innhold på nettsiden etter lansering, har du to valg:\n\n🔧 <strong>Vi oppdaterer for deg</strong>\nVia vedlikeholdsavtalen — send oss en e-post og vi fikser det innen én virkedag.\n\n💻 <strong>Du gjør det selv</strong>\nVi gir deg tilgang til filene og viser deg hvordan. Ren HTML er enklere å endre enn det høres ut.\n\nBegge alternativer er inkludert i leveransen.',
      quick: ['Vedlikehold?', 'Teknologi', 'Ta kontakt']
    },
    {
      id: 'portefolje',
      patterns: ['eksempler', 'portfolio', 'portefølje', 'vis meg noe', 'referanser', 'tidligere arbeid', 'kunder dere har', 'se hva dere', 'laget før'],
      response: 'Vi er et nytt firma (2026) og bygger porteføljen vår — men denne nettsiden du er på nå er laget av oss!\n\nPixora.no er et godt eksempel på det vi leverer:\n✓ Rask lastetid\n✓ Mobiloptimalisert\n✓ Moderne design\n✓ Animasjoner og detaljer\n\nVi lager et <strong>gratis utkast</strong> spesialtilpasset deg — da ser du nøyaktig hva du får.',
      quick: ['Start gratis utkast', 'Hva koster det?', 'Hvem er Pixora?']
    },
    {
      id: 'haster',
      patterns: ['haster', 'asap', 'snarest mulig', 'rush levering', 'hastesak', 'trengs fort', 'veldig rask', 'åpning snart', 'lansering snart'],
      response: 'Vi er kjent for rask levering — normalt 3–5 dager.\n\nTrenger du det enda raskere? Ta kontakt direkte:\n\n📞 <strong>465 12 634</strong>\n📧 <strong>pixorawebdesigns@gmail.com</strong>\n\nForklar situasjonen og vi gjør vårt beste for å møte din deadline.',
      quick: ['Ta kontakt', 'Hva er prosessen?', 'Leveringstid?']
    },
    {
      id: 'logo',
      patterns: ['logo', 'grafisk design', 'merkevare', 'visuell profil', 'brand identitet', 'logotype', 'har ikke logo'],
      response: 'Hovedfokuset vårt er nettsider — men logodesign er inkludert i Profesjonell- og Nettbutikk-pakken som del av den visuelle profilen.\n\n<strong>Har du allerede en logo?</strong> Perfekt, send den over.\n\n<strong>Har du ikke logo?</strong> Vi lager en enkel, moderne logo som passer nettsiden.',
      quick: ['Profesjonell-pakken?', 'Se pakker', 'Ta kontakt']
    },
    {
      id: 'gdpr',
      patterns: ['gdpr', 'cookie', 'personvern', 'privacy policy', 'personopplysninger', 'samtykke', 'personvernlov', 'lovkrav'],
      response: 'Vi sørger for at nettsiden møter norsk personvernlovgivning:\n\n✓ Personvernerklæring (privacy policy)\n✓ Cookie-informasjon ved behov\n✓ HTTPS / kryptert tilkobling\n✓ Kontaktskjema med sikker databehandling\n\nFor de fleste små bedriftsnettsider er kravene enkle — vi hjelper deg gjennom det.',
      quick: ['Teknologi', 'Hva er inkludert?', 'Ta kontakt']
    },
    {
      id: 'kontrakt',
      patterns: ['kontrakt', 'avtale', 'skriftlig', 'signere', 'formelt dokument', 'juridisk', 'papirer'],
      response: 'Vi sender deg et enkelt avtaledokument før vi starter — ingen juridisk sjargong, bare klare punkter:\n\n✓ Hva vi leverer\n✓ Pris og betalingsbetingelser\n✓ Leveringstid\n✓ Hvem som eier hva\n\nKort, forståelig og fair for begge parter.',
      quick: ['Hva koster det?', 'Gratis utkast?', 'Ta kontakt']
    },
    {
      id: 'sprak',
      patterns: ['engelsk nettside', 'english website', 'tospråklig', 'internasjonal nettside', 'utenlandske kunder', 'flerspråklig', 'på engelsk'],
      response: 'Ja! Vi lager nettsider på både <strong>norsk og engelsk</strong> — eller tospråklig.\n\nHar du kunder i andre land eller driver en internasjonal bedrift, kan vi tilpasse innholdet til ditt marked.\n\nFortell oss hva du trenger i kontaktskjemaet.',
      quick: ['Ta kontakt', 'Gratis utkast?', 'Hva koster det?']
    },
    {
      id: 'sosialmedier',
      patterns: ['instagram', 'facebook', 'linkedin', 'tiktok', 'sosiale medier', 'social media', 'twitter', 'youtube', 'koble til instagram', 'lenke sosiale'],
      response: 'Vi kobler nettsiden din til alle dine sosiale medier — inkludert i alle pakker:\n\n✓ Lenker til Instagram, Facebook, LinkedIn, m.fl.\n✓ Instagram-feed på nettsiden (valgfritt)\n✓ Del-knapper for artikler og produkter\n✓ Open Graph-tags (pen forhåndsvisning når noen deler nettsiden din)\n\nIngen ekstra kostnad.',
      quick: ['Se pakker', 'Hva er inkludert?', 'Gratis utkast?']
    },
    {
      id: 'epost',
      patterns: ['bedriftsepost', 'profesjonell epost', 'epost med domene', 'info@', 'navn@bedrift', 'gmail bedrift', 'e-post adresse', 'epostoppsett'],
      response: 'Vi setter opp domenet ditt, men e-post er en separat tjeneste.\n\nEnkleste løsning:\n📧 <strong>Google Workspace</strong> — ca. 60 kr/mnd per bruker. Gir deg f.eks. <em>deg@dinbedrift.no</em> med full Gmail-opplevelse.\n\nEller gratis alternativer: Zoho Mail, Proton Mail, eller tilbud fra domeneregistraren din.\n\nVi veileder deg gjennom oppsett.',
      quick: ['Hosting', 'Ta kontakt']
    },
    {
      id: 'rabatt',
      patterns: ['rabatt', 'studentpris', 'frivillig', 'non-profit', 'ideell', 'lag og foreninger', 'bedre pris', 'forhandle'],
      response: 'Vi har ikke faste rabattordninger, men vi er alltid åpne for en prat.\n\nDriver du en ideell organisasjon, et studentprosjekt eller en lokal forening? Ta kontakt — vi ser hva vi kan gjøre.\n\nI tillegg er gratis utkast og fast pris uten tillegg vår standard for alle kunder.',
      quick: ['Hva koster det?', 'Ta kontakt', 'Gratis utkast?']
    }
  ];

  /* ── Friendly labels for suggestions fallback ───────────────────────── */
  const KB_LABELS = {
    hjelp: 'Hva kan du hjelpe med?',
    greet: 'Si hei',
    priser: 'Hva koster det?',
    basis: 'Basis-pakken?',
    profesjonell: 'Profesjonell-pakken?',
    nettbutikk: 'Nettbutikk?',
    vedlikehold: 'Vedlikehold?',
    levering: 'Leveringstid?',
    utkast: 'Gratis utkast?',
    prosess: 'Hva er prosessen?',
    seo: 'SEO?',
    mobil: 'Mobiloptimalisert?',
    teknologi: 'Hvilken teknologi?',
    hosting: 'Hosting og domene?',
    hvem: 'Hvem er Pixora?',
    kontakt: 'Kontaktinfo',
    stavanger: 'Dere fra Stavanger?',
    garanti: 'Risikofritt?',
    sammenligning: 'Pixora vs byrå?',
    inkludert: 'Hva er inkludert?',
    betaling: 'Betalingsmetoder?',
    eierskap: 'Hvem eier koden?',
    innhold: 'Hva trenger dere fra meg?',
    'endre-selv': 'Kan jeg endre selv?',
    portefolje: 'Se eksempler?',
    haster: 'Haster det?',
    logo: 'Lager dere logo?',
    gdpr: 'GDPR / personvern?',
    kontrakt: 'Kontrakt?',
    sprak: 'Engelsk nettside?',
    sosialmedier: 'Sosiale medier?',
    epost: 'Bedriftsepost?',
    rabatt: 'Rabatt?'
  };

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

  /* Expose for external callers (e.g. Spline card click in script.js) */
  window.pxOpen = openChat;

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
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent document "click outside → close" handler
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

  /* Score a single KB entry against user text.
     - Base:  pattern.length points per matched pattern
     - Bonus: +50 % when pattern is a whole word / phrase boundary match */
  function scoreEntry (entry, low) {
    let score = 0;
    for (const p of entry.patterns) {
      if (!low.includes(p)) continue;
      let pts = p.length;
      // Word-boundary bonus (handles Norwegian spaces & punctuation)
      try {
        const safe = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp('(?:^|[\\s,.!?])' + safe + '(?=[\\s,.!?]|$)').test(low)) {
          pts = Math.ceil(pts * 1.5);
        }
      } catch (_) { /* ignore regex edge cases */ }
      score += pts;
    }
    return score;
  }

  /* Return best-matching KB entry (score >= 3), or null */
  function findMatch (text) {
    const low = text.toLowerCase();
    let best = null, bestScore = 0;
    for (const entry of KB) {
      const s = scoreEntry(entry, low);
      if (s > bestScore) { bestScore = s; best = entry; }
    }
    return bestScore >= 3 ? best : null;
  }

  /* Return up to n closest entries (score > 0) for "did you mean?" */
  function findSuggestions (text, n) {
    const low = text.toLowerCase();
    return KB
      .map(entry => ({ entry, score: scoreEntry(entry, low) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, n || 3)
      .map(x => x.entry);
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
        // Try to surface related topics the user might have meant
        const suggestions = findSuggestions(text, 3);

        if (suggestions.length > 0) {
          addMsg('Hmm, jeg er ikke helt sikker hva du mener. Spør du kanskje om noe av dette?', 'bot');
          setTimeout(() => {
            addQuickReplies(suggestions.map(s => KB_LABELS[s.id] || 'Hva koster det?'));
          }, 180);
        } else {
          addMsg(
            'Godt spørsmål! Det er litt utenfor det jeg har svar på akkurat nå. Ta kontakt direkte, så hjelper vi deg:\n\n📧 <strong>pixorawebdesigns@gmail.com</strong>\n📞 <strong>465 12 634</strong>\n\nVi svarer innen én virkedag 😊',
            'bot'
          );
          setTimeout(() => addQuickReplies(['Gå til kontaktskjema', 'Hva koster det?', 'Gratis utkast?']), 180);
        }
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
