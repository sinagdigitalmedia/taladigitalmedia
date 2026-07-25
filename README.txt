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
- 3D touches: the spinning medallion badge and the mouse-tilt on cards
  (mission/vision, pillars, work cards, the contact form panel) are driven
  by [data-tilt] attributes in index.html and the tilt/parallax logic in
  script.js. They're automatically disabled on touch devices and when the
  visitor has "reduce motion" turned on, so nothing needs to be touched for
  mobile — it just quietly turns itself off there.

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
card tilt, hero parallax, the spinning medallion) are automatically switched
off on touch devices — they add polish on desktop without weighing down or
cluttering the mobile experience.
- Contact form: the form has no backend — on submit it validates the fields,
  then opens the visitor's email app with a pre-filled message addressed to
  the contact email above. To collect submissions server-side instead, swap
  the mailto logic in script.js for a POST request to a form service
  (e.g. Formspree, Netlify Forms) or your own endpoint.
- Map: iframe src in the #location section of index.html. Update the query
  string if the address changes, or replace it with an embed generated from
  Google Maps -> Share -> Embed a map for the exact pin.

BROWSER SUPPORT
----------------
Built with plain HTML/CSS/JS — no framework, no build tooling. Uses modern
but well-supported features (CSS clamp(), IntersectionObserver, backdrop-filter).
Respects prefers-reduced-motion and is responsive from mobile to desktop.
