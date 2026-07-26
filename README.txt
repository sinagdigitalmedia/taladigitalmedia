TALA DIGITAL MEDIA ADVERTISING & EVENTS — WEBSITE
===================================================

FOLDER STRUCTURE
----------------
index.html      Page markup
styles.css       All styling
script.js        Interactivity (nav, scroll reveals, contact form, video controls)
README.txt       This file
assets/
  tala-logo.png       Official logo (nav + hero watermark)
  mon-sarmiento.webp  Founder photo
  whatsapp-icon.png   WhatsApp brand icon (floating button + contact list)
  badrgo-icon.png     BadrGo brand icon (ride booking button)
  instagram-icon.png  Instagram brand icon (available if you want to swap
                       it in for the current inline SVG version)
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
  resolution somewhere other than the website.
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

CONTACT FORM — SENDS STRAIGHT TO YOUR INBOX (NO SIGNUP NEEDED)
-------------------------------------------------------------------
The form is already wired up to deliver straight to
taladigitalmedia@gmail.com using a free service called FormSubmit — no
account, no API key, nothing to register. There's exactly ONE thing you
need to do, and only once, ever:

  1. Deploy the site (or open index.html locally) and submit the contact
     form yourself one time, with any test details.
  2. FormSubmit will send an email to taladigitalmedia@gmail.com titled
     something like "Please Activate FormSubmit.co". Open it and click the
     activation link inside.
  3. That's it — activation is permanent. From that point on, every real
     submission from a client arrives directly in the inbox automatically,
     and they see "your message is on its way" right on the page with
     nothing extra to click on their end.

Until that one-time activation happens, FormSubmit will silently hold the
very first submission back (that's the "please activate" step) — so do the
test submission yourself before sharing the site with clients, not the
other way around.

If you ever want a nicer submissions dashboard (spam filtering, file
uploads, etc.) instead of plain emails, formsubmit.co also offers a free
account with the same email — see https://formsubmit.co for details, but
it's optional; the current setup already delivers to your inbox on its own.

Fallback: if a client's browser blocks the request (ad blocker, offline,
etc.), the form automatically falls back to opening their own email app
addressed to taladigitalmedia@gmail.com, so no inquiry is ever lost.

MOBILE
------
Layout, type scale, spacing, tap targets, and the video grid are all tuned
down to small phones (~360px wide). Decorative-only effects (cursor glow,
card tilt, hero parallax) are automatically switched
off on touch devices — they add polish on desktop without weighing down or
cluttering the mobile experience.

TEAM SECTION
------------
The #team section (index.html) features the founder (real photo, name, and
role) alongside four role-based cards — Creative Direction, Production &
Videography, Photography & Content, and Events Coordination — each with an
initials avatar instead of a stock photo, since no other real team photos
were provided. To add real people later: duplicate one .team-card block,
swap the initials avatar for a <img class="team-photo"> like the founder's,
and add their name/role. All the card copy is translatable — see the
`team.*` keys in script.js's `translations` object.

STUDIO HOURS
------------
The open/closed status lives in two places, both driven by the same
`schedule` array near the top of the language-switcher block in script.js:

  1. A compact blinking pill in the HEADER (every page, desktop and
     mobile) — just the dot and "Open now" / "Closed now".
  2. The full schedule + status card inside the LOCATION section
     (#location, which also holds the address, map, and ride buttons —
     click "Hours" in the nav and it scrolls straight to that block).

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
Uber and BadrGo buttons appear in two places — the floating stack in the
bottom-right corner (every page) and inline under the studio hours in the
Location section:

- UBER opens the Uber app (or uber.com on desktop) with the dropoff
  address already filled in as "Building No 30, Street 138, Zone 6, Doha,
  Qatar" — the client only needs to confirm their pickup point. This uses
  Uber's official, documented deep-link format, so it's reliable.
- BADRGO opens the app via its official smart link (onelink.to/badrgo) —
  installs it if it's not already on the client's phone, opens it directly
  if it is. Unlike Uber, BadrGo (a Qatari-only app) doesn't publish a
  public API for pre-filling a destination, so the client will need to
  type or search the address themselves once the app opens. If BadrGo
  releases a destination-prefill link in the future, swap the href on the
  ".ride-badrgo" link in index.html — there are two, one in the floating
  stack ("float-badrgo") and one inline in Location ("ride-badrgo"), both
  currently pointing to the same onelink.to/badrgo URL.

BEFORE YOU GO LIVE — QUICK CHECKLIST
--------------------------------------
[ ] Submit the contact form once yourself so FormSubmit sends its one-time
    activation email to taladigitalmedia@gmail.com — click the link in it.
[ ] Confirm the WhatsApp number (+974 3304 3148) and email address are
    correct throughout.
[ ] Double-check the Google Maps pin under #location opens the right spot.
[ ] Test both Uber buttons (floating + Location section) open with the
    right dropoff address.
[ ] Skim the Team section — swap in real photos/names whenever you have them.
[ ] Confirm the studio hours in script.js match what you actually want live.
[ ] Test the EN / AR language toggle and the mobile menu on an actual phone.

BROWSER SUPPORT
----------------
Built with plain HTML/CSS/JS — no framework, no build tooling. Uses modern
but well-supported features (CSS clamp(), IntersectionObserver, backdrop-filter).
Respects prefers-reduced-motion and is responsive from mobile to desktop.
