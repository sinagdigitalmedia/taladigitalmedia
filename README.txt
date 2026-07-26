TALA DIGITAL MEDIA ADVERTISING & EVENTS — WEBSITE
===================================================

FOLDER STRUCTURE
----------------
index.html      Home page markup
team.html        Team page markup (shares styles.css / script.js with index.html)
styles.css       All styling
script.js        Interactivity (nav, scroll reveals, contact form, video controls)
README.txt       This file
assets/
  tala-logo.png       Official logo (nav + hero watermark)
  mon-sarmiento.webp  Founder photo
  whatsapp-icon.png   WhatsApp brand icon (floating button + contact list)
  uber-icon.png       Uber brand icon (floating button + ride booking)
  badrgo-icon.png     BadrGo brand icon (floating button + ride booking)
  instagram-icon.png  Instagram brand icon (available if you want to swap
                       it in for the current inline SVG version)
  sinag-workshops-poster.jpg  Workshops poster shown in the announcement
                       popup (compressed copy of the original you sent)
  team/               Cropped photos for the six people on the Team page
  posters/            Thumbnail frame for each showreel video
  videos/             Compressed, web-ready MP4s shown in the "Work" section

RUN LOCALLY
-----------
No build step or dependencies. Either:
  1. Double-click index.html to open it in a browser, or
  2. Serve it properly (recommended, avoids browser file:// restrictions):
       python3 -m http.server 8000
     then visit http://localhost:8000

DEPLOY WITH GITHUB PAGES
-------------------------
1. Push this folder's contents to a GitHub repository (index.html at the repo root).
2. Repo Settings -> Pages -> Source: "main" branch, "/ (root)".
3. Site goes live at https://<username>.github.io/<repo-name>/

KEY EDIT POINTS
----------------
- Colors & fonts: CSS variables at the top of styles.css (:root block).
- Copy (mission/vision/about/services): inline in the matching <section> of index.html.
- Socials: Facebook/Instagram links in the #contact section of index.html.
- Contact email: CONTACT_EMAIL constant in script.js, plus the mailto links in
  index.html (nav "Email us" button, #contact section, and the form's
  fallback). Currently set to taladigitalmedia@gmail.com.
- Work / showreel: the #work section in index.html lists four video cards.
  Each <video> points to a compressed file in assets/videos/ with a poster
  thumbnail from assets/posters/. To add another reel, copy the markup block
  for one .work-card, swap the poster/video paths and title/description.
  Videos were re-encoded to 720px-wide H.264 (~4-10MB each) so the repo stays
  git-friendly — swap in the original masters yourself if you need full
  resolution somewhere other than the website. The play button on each
  thumbnail is a pure CSS triangle (.play-btn::after in styles.css) rather
  than a text/emoji character, so it renders identically and cleanly
  across every OS and browser instead of varying with each platform's
  emoji font.
- 3D touches: mouse-tilt on cards (mission/vision, pillars, team, the
  contact form panel) is driven by [data-tilt] attributes in index.html and
  the tilt/parallax logic in script.js. It's deliberately left off the Work
  section's video cards, since tilting an element under the cursor fights
  with native video controls (scrubbing, play/pause) and caused a hover
  glitch there. Tilt and the hero watermark parallax are automatically
  disabled on touch devices and when the visitor has "reduce motion" turned
  on, so nothing needs to be touched for mobile.
- Floating action buttons: a stacked group in the bottom-right corner,
  visible on every page — Uber and BadrGo on top, WhatsApp at the bottom.
  All three link straight to the studio: Uber opens with the dropoff
  address pre-filled, BadrGo opens the app itself (see RIDE BOOKING below
  for why BadrGo can't pre-fill a destination), and WhatsApp opens a chat
  pre-filled with an intro message, currently pointed at +974 3304 3148.
  To change the WhatsApp number, update the two "https://wa.me/974..."
  links in index.html (search for "wa.me") — no plus sign or spaces in the
  digits. The same three buttons (plus the full address/hours) also live
  inline in the Location section for anyone who scrolls past the float.
- Language switcher: an EN / AR pill in the header (visible on every page,
  desktop and mobile) swaps all visible copy between English and Arabic,
  flips the page to right-to-left, and switches to the Cairo typeface for
  Arabic text. The chosen language is remembered per visitor (localStorage)
  so it stays set on their next visit. All translated text lives in one
  place in script.js — the `translations` object near the top — with an
  `en` and an `ar` block sharing the same keys. To edit copy in either
  language, change the matching key in that object; the HTML pulls its text
  from there automatically via `data-i18n` attributes, so you don't need to
  touch index.html to update wording. To add a third language later, add a
  new block (e.g. `fr: { ... }`) with the same keys and a matching button
  in the header's `.lang-switch`.

CONTACT FORM — CLIENT CHOOSES EMAIL OR WHATSAPP
-------------------------------------------------------------------
The form has two buttons instead of one — "Send via Email" and "Send via
WhatsApp" — so the client picks whichever they'd rather use. Both are
right there side by side; nothing opens automatically without the client
choosing it.

- SEND VIA EMAIL validates the fields, then delivers straight to
  taladigitalmedia@gmail.com via FormSubmit (confirmed already activated
  on your end) — the client sees "your message is on its way" on the page
  itself, nothing else to do.
- SEND VIA WHATSAPP validates the fields, then opens a new tab with
  WhatsApp pre-filled with the same inquiry, addressed to
  +974 3304 3148 (wa.me/97433043148). The client still needs to tap
  "Send" once inside WhatsApp — there's no way for a plain website to
  silently deliver a WhatsApp message on someone's behalf without
  WhatsApp's official Business API (which needs a paid Meta Business
  account and a server, not just a static site). This is the closest
  thing to instant that's possible without that infrastructure — it
  removes typing for the client entirely, they just confirm and hit send.
- Pressing Enter inside any text field defaults to the email path (same
  as clicking "Send via Email"), so keyboard users get sensible behavior
  even without touching a button.

FormSubmit — already active on your end:

  You mentioned FormSubmit is already activated for
  taladigitalmedia@gmail.com, so "Send via Email" should work immediately
  with no further setup. If you ever reconnect the form to a different
  inbox, the one-time step is: submit the form once yourself, open the
  "Please Activate FormSubmit.co" email FormSubmit sends, and click the
  activation link — after that, submissions arrive automatically forever.

If you ever want a nicer submissions dashboard (spam filtering, file
uploads, etc.) instead of plain emails, formsubmit.co also offers a free
account with the same email — see https://formsubmit.co for details, but
it's optional; the current setup already delivers to your inbox on its own.

"EMAIL US" LINKS NOW GO TO THE FORM, NOT THE EMAIL APP
---------------------------------------------------------
Previously, the "Email us" button in the nav and the email address shown
in the Contact section both opened the visitor's own email app (a mailto
link). Both now scroll straight down to the contact form instead:
  - The nav "Email us" button links to #contact (or index.html#contact
    from team.html).
  - The email address shown under "Email us" in the Contact section links
    to #inquiryForm, landing right on the form.
Nothing on the page triggers mailto: anymore — every path leads to the
form, where the client picks Email or WhatsApp themselves.

Fallback: if a client's browser blocks the email request (ad blocker,
offline, etc.), the form automatically falls back to opening their own
email app addressed to taladigitalmedia@gmail.com, so no inquiry is ever
lost — the WhatsApp tab still opens either way.

MOBILE
------
Layout, type scale, spacing, tap targets, and the video grid are all tuned
down to small phones (~360px wide). Decorative-only effects (cursor glow,
card tilt, hero parallax) are automatically switched
off on touch devices — they add polish on desktop without weighing down or
cluttering the mobile experience.

TEAM PAGE
---------
Team is now its own page — team.html — instead of a section on the home
page, linked from the "Team" item in every page's nav. It shares the same
header, footer, floating Uber/BadrGo/WhatsApp buttons, and language
switcher as index.html (all driven by the same script.js and styles.css),
so it feels like part of the same site rather than a separate build.

Six real people are featured, each with a photo, name, and role:
  - Mon Sarmiento — Founder & Creative Director
  - Drew Dhiren Nolasco — Head of Creatives, Multimedia & Director of
    Photography (DOP)
  - Ryan Benedick Yamar — Head of Audio Engineering
  - Anjo Canicosa — Stage Manager & Assistant Director of Photography
    (Assistant DOP)
  - Juliana Sofia Angeline Usac Flores — Social Media Manager & Content
    Creation
  - Jonalyn F. Barte — Events Coordinator & Administrative Secretary

Photos are cropped/resized copies in assets/team/. To add or swap someone:
duplicate one .team-card block in team.html, point the <img> at a new file
in assets/team/, and update the name/role. Role text is translatable via
the `team.*` keys in script.js; names are treated as proper nouns and left
untranslated (same pattern as the founder's). A `.team-avatar` monogram
style (gradient circle with initials, no photo needed) is still defined in
styles.css if a future team member joins before their photo is ready —
just swap the <img class="team-photo"> for a
<div class="team-avatar">XX</div> the same way the placeholder card
worked earlier.

OUR JOURNEY
-----------
The #journey section (on index.html, between About and Work) carries the
"our journey" company story you provided — founding vision, then the two
divisions (Sinag Events and Yamar Muzik Studio) as side-by-side
cards, then the closing statement. All of it is translatable via the
`journey.*` keys in script.js.

STUDIO RENTALS
--------------
A dedicated callout — #rentals, between Our Journey and Work — introduces
studio rentals as its own offering rather than burying it in a dropdown.
It's a single minimal card: a short line about renting the space by the
hour or day, and a button that scrolls straight to the contact form.
"Studio Rentals" was also added to the scrolling filmstrip ticker up near
the hero, and it's already selectable as a service in the contact form's
dropdown ("Studio Rental"). All the copy is translatable via the
`rentals.*` keys in script.js.

STUDIO HOURS
------------
The open/closed status lives in two places, both driven by the same
`schedule` array near the top of the language-switcher block in script.js:

  1. A compact blinking pill in the HEADER (every page, desktop and
     mobile, including team.html) — just the dot and "Open now" /
     "Closed now".
  2. The full schedule + status card inside the LOCATION section
     (#location, which also holds the address, map, and ride buttons —
     click "Hours" in the nav and it scrolls straight to that block).

(Fixed: the header pill previously only updated on pages that also had
the full schedule card — like index.html — so it silently never updated
on team.html. renderHours() in script.js now updates the header pill
first, independent of whether the full card exists on that page.)

Current hours:
  Sunday–Thursday & Saturday:  2:00 PM – 10:00 PM
  Friday:                      Closed

The dot blinks green when open and red when closed, reading the CURRENT
TIME IN DOHA (Asia/Qatar) regardless of the visitor's own time zone — so
it's accurate for someone browsing from anywhere. Both indicators recheck
every 60 seconds while the page is open.

To change the hours later, edit the `schedule` array in script.js — one
entry per day (Sunday first), each either `{ open: <minutes>, close:
<minutes> }` (minutes since midnight — e.g. 2:00 PM = 14*60) or `null` for
a closed day. The schedule list and status text are both translated
automatically using the `hours.*` and `day.*` keys already in the
`translations` object.

RIDE BOOKING (UBER & BADRGO)
------------------------------
Uber and BadrGo buttons appear in three places — the floating stack in the
bottom-right corner (every page, including team.html) and inline under the
studio hours in the Location section. Both use the official brand logos
you provided (assets/uber-icon.png and assets/badrgo-icon.png).

- UBER opens the Uber app (or uber.com on desktop) with the dropoff set
  to the full address you provided — "TALA Digital Media Advertising &
  Events, Building No 30, Office Building, 5th Floor, Street No 138,
  Zone 6, Doha, Qatar" — plus the exact coordinates (25.2862122,
  51.5359695, pulled from your Google Maps pin) backing it up. Passing
  both together means the trip request shows your full business name and
  address as the destination label, while the coordinates keep the actual
  pin accurate. Be aware, though: Uber's public web/app link format does
  not offer a way to guarantee a fully "zero-tap" destination on every
  device and app version — that level of control only exists through
  Uber's Business API, which needs a paid partner account and backend,
  not something a static website can do on its own. What's here is the
  most direct experience the public link format supports. All three Uber
  links (floating buttons on both pages + the inline Location button)
  point to the same address/coordinates — update the
  `dropoff[formatted_address]`, `dropoff[latitude]`, and
  `dropoff[longitude]` values in all three spots if the studio ever moves.
- BADRGO opens the app via its official smart link (onelink.to/badrgo) —
  installs it if it's not already on the client's phone, opens it directly
  if it is. Unlike Uber, BadrGo (a Qatari-only app) doesn't publish a
  public API for pre-filling a destination, so the client will need to
  type or search the address themselves once the app opens — this is a
  limitation of BadrGo itself, not something fixable from the website
  side. If BadrGo releases a destination-prefill link in the future, swap
  the href on the ".ride-badrgo" link — there are two, one in the floating
  stack ("float-badrgo") and one inline in Location ("ride-badrgo"), both
  currently pointing to the same onelink.to/badrgo URL.

The map embed and the "Open in Google Maps" link in the Location section
were also updated to the exact pin you shared
(maps.app.goo.gl/7puvrBPLFeUCGzJm7), so all three — map, Uber, and the
"Open in Google Maps" link — now point to the same precise spot.

BEFORE YOU GO LIVE — QUICK CHECKLIST
--------------------------------------
[ ] Test "Send via Email" on the contact form — since FormSubmit is
    already activated on your end, this should deliver to
    taladigitalmedia@gmail.com immediately with no extra setup.
[ ] Test "Send via WhatsApp" on the contact form — confirm it opens a new
    tab addressed to +974 3304 3148 with the inquiry pre-filled.
[ ] Click "Email us" in the nav, and the email address under "Email us"
    in the Contact section — both should scroll to the form now, not
    open your email app. If either still opens mailto, the browser may
    be caching an old version of the page; hard-refresh to confirm.
[ ] Confirm the WhatsApp number (+974 3304 3148) and email address are
    correct throughout.
[ ] Double-check the Google Maps pin under #location opens the right spot.
[ ] Test all three Uber buttons open with the full address and land
    close to the pin.
[ ] Read the new Studio Rentals callout (#rentals, between Our Journey
    and Work) and confirm the wording matches what you actually offer —
    hourly/daily rates, minimum booking length, etc. aren't listed yet,
    so add specifics there if you want them shown.
[ ] Give the Our Journey copy a read-through — it's your text as provided,
    just confirm it reads the way you want before it's public.
[ ] Confirm the studio hours in script.js match what you actually want live.
[ ] Click "Team" in the nav from both index.html and team.html to make
    sure the two pages link to each other correctly once deployed.
[ ] Confirm the header Open/Closed pill now shows correctly on team.html
    too (previously it silently stayed blank there — now fixed).
[ ] Test the EN / AR language toggle and the mobile menu on an actual phone.
[ ] Open the site in a fresh/incognito browser tab and confirm the
    workshops popup appears after ~1 second, shows the poster image
    correctly, the Google Form link opens, and the WhatsApp button opens
    a chat to +974 3304 3148.
[ ] The Charcoal (Aug 1–8) and Acrylic (Aug 10–17) dates in the text list
    now match the poster exactly — worth one more glance since the rest
    of the list was originally transcribed by hand.

SINAG EVENTS WORKSHOPS POPUP
-----------------------------
A temporary announcement modal appears on both pages (index.html and
team.html) about 1.2 seconds after a first-time visitor loads the site.
It shows your actual workshops poster image at the top
(assets/sinag-workshops-poster.jpg — a compressed copy of the poster you
provided), followed by a text list of all eight workshop sessions
(Charcoal and Acrylic are split into two rows since they run on different
dates) with dates/times, and two CTAs — the Google Form and a WhatsApp
link to +974 3304 3148. It only shows once per browser session
(sessionStorage), and won't reappear if the visitor closes it and keeps
browsing, or comes back later in the same session. Closes via the ×
button, clicking outside the card, or the Escape key.

It's genuinely temporary — script.js has a `POPUP_EXPIRY` date
(currently the day after the last workshop, "Building a Band," wraps on
Sep 5, 2026) near the bottom of the file. Past that date, the popup stops
appearing automatically — nothing to remember to remove. To end the
campaign earlier, just change that date; to run it again for a future
batch of workshops, update the date, swap in a new poster image at that
same file path (or a new filename — just update the <img src=""> in both
HTML files), and update the text list entries (both the HTML in
index.html/team.html and the matching `popup.*` keys in script.js —
names, dates/times, and the two link URLs).

DESIGN NOTES
------------
- Reel play buttons: no longer a text/emoji character — it's a pure CSS
  triangle, and the native browser play icon that some browsers (notably
  Safari/iOS) draw over a paused video is now explicitly hidden, so only
  the one clean custom button shows.
- Hero starfield: a very subtle twinkling star layer sits behind the hero
  text (.hero::before / .hero::after in styles.css) — small dots at low
  opacity that fade in and out on two staggered timers so it doesn't feel
  mechanical. It's decorative only (pointer-events: none) and turns off
  automatically for visitors with "reduce motion" enabled. To adjust it,
  look for the "subtle twinkling starfield" comment in styles.css — the
  dot positions are just percentage coordinates in the radial-gradient
  list, and opacity/animation-duration control how bright and how fast
  it twinkles.
- Scroll progress bar: a thin gold-to-maroon line at the very top of the
  viewport (every page) that fills in as the visitor scrolls down —
  driven by the "scroll progress bar" block in script.js. Purely visual,
  respects reduced-motion.
- Work section on mobile — "reels" carousel: below ~600px wide, the Work
  section's video grid switches from a stacked list to a horizontal,
  swipeable, snap-scrolling carousel (one video mostly in view, the next
  peeking in from the edge) — closer to how people actually browse short
  vertical video elsewhere, and it fits the "reels" framing of that
  section. A small animated "swipe to see more" hint appears underneath
  on mobile only. Desktop is unaffected — still the original grid. Look
  for ".work-grid" inside the "@media(max-width:600px)" block in
  styles.css to adjust card width or remove the effect.
- General mobile pass: tightened header/logo/nav spacing at very narrow
  widths (~360px and under, e.g. iPhone SE) so the logo, language
  switcher, and menu button never crowd each other; confirmed every
  interactive element (buttons, nav links, social icons) meets a
  comfortable tap-target size on touch devices; verified no element
  causes horizontal page scroll on small screens.

BROWSER SUPPORT
----------------
Built with plain HTML/CSS/JS — no framework, no build tooling. Uses modern
but well-supported features (CSS clamp(), IntersectionObserver, backdrop-filter).
Respects prefers-reduced-motion and is responsive from mobile to desktop.
