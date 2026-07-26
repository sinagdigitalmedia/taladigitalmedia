/* =========================================================
   TALA Digital Media Advertising & Events — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- studio hours: schedule + live open/closed status ---------- */
  // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat — times in minutes since midnight, Doha time.
  const schedule = [
    { open: 14 * 60, close: 22 * 60 }, // Sun
    { open: 14 * 60, close: 22 * 60 }, // Mon
    { open: 14 * 60, close: 22 * 60 }, // Tue
    { open: 14 * 60, close: 22 * 60 }, // Wed
    { open: 14 * 60, close: 22 * 60 }, // Thu
    null,                              // Fri — closed
    { open: 14 * 60, close: 22 * 60 }, // Sat
  ];

  function getQatarNow() {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Qatar', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const map = {};
    fmt.formatToParts(new Date()).forEach(p => { map[p.type] = p.value; });
    const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let hour = parseInt(map.hour, 10);
    if (hour === 24) hour = 0;
    return { day: weekdayMap[map.weekday], minutes: hour * 60 + parseInt(map.minute, 10) };
  }

  function formatTime(mins) {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  function tpl(str, values) {
    return str.replace(/\{(\w+)\}/g, (_, k) => values[k] !== undefined ? values[k] : '');
  }

  function renderHours(lang) {
    const dict = translations[lang] || translations.en;
    const hoursList = document.getElementById('hoursList');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusDetail = document.getElementById('statusDetail');
    const headerDot = document.getElementById('headerStatusDot');
    const headerText = document.getElementById('headerStatusText');
    if (!hoursList || !statusDot || !statusText || !statusDetail) return;

    const now = getQatarNow();
    const today = schedule[now.day];
    const isOpen = !!today && now.minutes >= today.open && now.minutes < today.close;

    // build the schedule list
    hoursList.innerHTML = '';
    for (let d = 0; d < 7; d++) {
      const row = document.createElement('div');
      row.className = 'hours-row' + (d === now.day ? ' is-today' : '') + (!schedule[d] ? ' is-closed' : '');
      const dayName = document.createElement('span');
      dayName.className = 'day';
      dayName.textContent = dict[`day.${d}`];
      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = schedule[d] ? `${formatTime(schedule[d].open)} – ${formatTime(schedule[d].close)}` : dict['hours.closedLabel'];
      row.appendChild(dayName);
      row.appendChild(time);
      hoursList.appendChild(row);
    }

    // status dot + headline
    statusDot.classList.toggle('is-open', isOpen);
    statusDot.classList.toggle('is-closed', !isOpen);
    statusText.textContent = isOpen ? dict['hours.openNow'] : dict['hours.closedNow'];

    if (headerDot && headerText) {
      headerDot.classList.toggle('is-open', isOpen);
      headerDot.classList.toggle('is-closed', !isOpen);
      headerText.textContent = isOpen ? dict['hours.openNow'] : dict['hours.closedNow'];
    }

    // status detail
    if (isOpen) {
      statusDetail.textContent = tpl(dict['hours.closesToday'], { time: formatTime(today.close) });
    } else {
      // find the next open slot, scanning up to 7 days ahead
      for (let i = 0; i <= 7; i++) {
        const d = (now.day + i) % 7;
        const slot = schedule[d];
        if (!slot) continue;
        if (i === 0 && now.minutes >= slot.close) continue; // today already closed for the day
        if (i === 0 && now.minutes < slot.open) {
          statusDetail.textContent = tpl(dict['hours.opensToday'], { time: formatTime(slot.open) });
        } else if (i === 1) {
          statusDetail.textContent = tpl(dict['hours.opensTomorrow'], { time: formatTime(slot.open) });
        } else {
          statusDetail.textContent = tpl(dict['hours.opensOn'], { day: dict[`day.${d}`], time: formatTime(slot.open) });
        }
        break;
      }
    }
  }

  let currentLang = 'en';
  let hoursTimer = null;

  /* ---------- language switcher (English / Arabic) ---------- */
  const translations = {
    en: {
      'brand.full': 'TALA Digital Media<br>Advertising &amp; Events',
      'nav.mission': 'Mission',
      'nav.about': 'About',
      'nav.work': 'Work',
      'nav.contact': 'Contact',
      'nav.location': 'Location',
      'nav.team': 'Team',
      'nav.hours': 'Hours',
      'nav.email': 'Email us',
      'hero.eyebrow': 'Doha, Qatar — Est. Creative Media House',
      'hero.title': 'Stories, <em>framed</em><br>with purpose.',
      'hero.sub': 'TALA Digital Media Advertising & Events is a creative media and production company based in Doha. We handle digital content, events coverage, and full media production — every project shaped around your vision, start to final cut.',
      'hero.ctaPrimary': 'Start a project',
      'hero.ctaSecondary': 'See our work',
      'hero.scroll': 'Scroll',
      'film.01': 'Digital Content',
      'film.02': 'Events Coverage',
      'film.03': 'Media Production',
      'film.04': 'Brand Storytelling',
      'film.05': 'Creative Direction',
      'mv.eyebrow': 'Why we exist',
      'mv.lead1': "Two ideas drive everything TALA builds — ",
      'mv.lead2': "where we're going",
      'mv.lead3': ', and ',
      'mv.lead4': 'why it matters',
      'mv.lead5': '.',
      'mv.missionLabel': '— Mission',
      'mv.missionHead': 'Every story, told with <span class="accent">craft.</span>',
      'mv.missionBody': 'Our mission is to deliver innovative and high-quality digital media solutions in Qatar that empower brands, organizations, and communities to tell their stories with creativity, purpose, and excellence.',
      'mv.visionLabel': '— Vision',
      'mv.visionHead': 'A standard for <span class="accent">impact.</span>',
      'mv.visionBody': 'Our vision is to become a leading creative digital media hub in Qatar and beyond — recognized for excellence in production, innovation, and artistic collaboration, connecting people, elevating brands, and inspiring communities.',
      'about.storyMark': 'Our story.',
      'about.title': 'Built in Doha, made for every screen.',
      'about.founderRole': 'Founder, TALA Digital Media Advertising & Events',
      'about.p1': "TALA Digital Media Advertising & Events is a Doha, Qatar–based creative media company founded by Mon Sarmiento. We specialize in providing professional digital media solutions, from strategic planning and creative design to full project execution, tailored to meet each client's unique requirements.",
      'about.p2': 'Driven by innovation, technical expertise, and a commitment to excellence, our team delivers high-quality and impactful content that strengthens brand identity and elevates events and organizations. We aim to build lasting partnerships by offering reliable, efficient, and results-oriented media services.',
      'about.pillar1Title': 'Planning',
      'about.pillar1Body': 'Strategy and creative direction shaped around your goals before a single frame is shot.',
      'about.pillar2Title': 'Production',
      'about.pillar2Body': 'Full-scale execution — content, coverage, and media crafted with technical precision.',
      'about.pillar3Title': 'Partnership',
      'about.pillar3Body': 'Reliable, results-oriented collaboration built to outlast a single project.',
      'journey.eyebrow': 'Our journey',
      'journey.title': 'From one vision to two specialized divisions.',
      'journey.intro': 'TALA Digital Media was established with a clear vision — to create a unified creative platform that delivers innovative, high-quality, and purpose-driven media solutions in Doha, Qatar. What began as a passion for storytelling, production, music, and visual arts has grown into a dynamic creative hub that brings together specialized divisions dedicated to different fields of the industry.',
      'journey.sinagName': 'Sinag Productions',
      'journey.sinagBody': 'Through Sinag Productions, we advanced into professional photo, video, and multimedia content creation.',
      'journey.yamarName': 'Yamar Muzik Studio',
      'journey.yamarBody': 'With Yamar Muzik Studio, we expanded into music production and audio engineering, providing artists and events with refined and powerful sound.',
      'journey.closing': 'As the industry continues to evolve, TALA Digital Media remains committed to innovation, technical excellence, and creative collaboration. Our journey is defined by our dedication to delivering seamless execution, building lasting partnerships, and transforming ideas into meaningful and impactful experiences for our clients and the wider community.',
      'team.eyebrow': 'The people behind it',
      'team.title': 'Behind TALA Digital Media Advertising & Events.',
      'team.sub': 'A small, senior team that plans, shoots, and delivers every project in-house.',
      'team.founderRole': 'Founder & Creative Director',
      'team.role1Title': 'Head of Creatives, Multimedia & Director of Photography (DOP)',
      'team.role2Title': 'Head of Audio Engineering',
      'team.role3Title': 'Stage Manager',
      'team.role6Title': 'Content Creation & Assistant Director of Photography (Assistant DOP)',
      'team.role4Title': 'Social Media Manager',
      'team.role5Title': 'Events Coordinator & Administrative Secretary',
      'team.ctaText': 'Want to work with us on your next project?',
      'team.ctaBtn': 'Get in touch',
      'work.eyebrow': 'Selected work',
      'work.title': 'A few frames from the field.',
      'work.sub': 'Recent coverage and production work — tap any reel to play.',
      'work.card1Title': 'Acrylic Workshop',
      'work.card1Body': 'Hands-on creative session, captured and cut for social.',
      'work.card2Title': 'Articulation Workshop',
      'work.card2Body': 'Workshop coverage focused on process and participant energy.',
      'work.card3Title': 'Building a Band Workshop',
      'work.card3Body': 'Multi-camera coverage of a live collaborative session.',
      'work.card4Title': 'Sinag Fashion Camp — Year 2',
      'work.card4Body': 'Full event recap: styling, runway, and behind-the-scenes.',
      'hours.eyebrow': 'Studio hours',
      'hours.title': "When we're around.",
      'hours.sub': 'Doha time — reach out or plan your visit around these hours.',
      'hours.openNow': 'Open now',
      'hours.closedNow': 'Closed now',
      'hours.closesToday': 'Closes today at {time}',
      'hours.opensToday': 'Opens today at {time}',
      'hours.opensTomorrow': 'Opens tomorrow at {time}',
      'hours.opensOn': 'Opens {day} at {time}',
      'hours.closedLabel': 'Closed',
      'day.0': 'Sunday',
      'day.1': 'Monday',
      'day.2': 'Tuesday',
      'day.3': 'Wednesday',
      'day.4': 'Thursday',
      'day.5': 'Friday',
      'day.6': 'Saturday',
      'contact.title': "Let's make something worth remembering.",
      'contact.sub': "Tell us what you're planning and the team behind every TALA frame will follow up shortly.",
      'contact.emailLabel': 'Email us',
      'contact.followLabel': 'Follow along',
      'contact.facebook': 'Facebook',
      'contact.instagram': 'Instagram',
      'contact.whatsapp': 'WhatsApp',
      'contact.visitLabel': 'Visit us',
      'contact.address': 'Building No 30, Office Building, 5th Floor<br>Street No 138, Zone 6, Doha, Qatar',
      'form.name': 'Your name',
      'form.namePh': 'Full name',
      'form.nameErr': 'Please tell us your name.',
      'form.email': 'Email',
      'form.emailPh': 'you@company.com',
      'form.emailErr': 'Enter a valid email address.',
      'form.phone': 'Phone',
      'form.optional': '(optional)',
      'form.service': 'What do you need?',
      'form.serviceSelect': 'Select a service',
      'form.opt1': 'Digital Content',
      'form.opt2': 'Events Coverage',
      'form.opt3': 'Media Production',
      'form.opt4': 'Brand Storytelling',
      'form.opt5': 'Creative Direction',
      'form.opt6': 'Something else',
      'form.serviceErr': 'Select what you need.',
      'form.message': 'Tell us about the project',
      'form.messagePh': "Timeline, budget range, what you're trying to achieve...",
      'form.messageErr': 'Give us a few details (10+ characters).',
      'form.submit': 'Send inquiry',
      'form.note': 'Sends straight to our inbox and opens WhatsApp with your message ready to send — quick and direct.',
      'location.eyebrow': 'Visit the studio',
      'location.title': 'Find us in Doha.',
      'location.sub': 'Address, studio hours, and a ride there — all in one place.',
      'map.addressLabel': 'Address',
      'map.title': 'TALA Digital Media Advertising & Events',
      'map.caption': 'Building No 30, Office Building, 5th Floor, Street No 138, Zone 6 — Doha, Qatar.',
      'map.open': 'Open in Google Maps ↗',
      'map.badge': 'TALA Digital Media Advertising & Events',
      'ride.uberName': 'Book with Uber',
      'ride.uberSub': 'Destination pre-filled',
      'ride.badrgoName': 'Book with BadrGo',
      'ride.badrgoSub': 'Opens the app',
      'footer.brand': 'TALA Digital Media Advertising & Events',
      'footer.tagline': 'Doha, Qatar — Creative Media & Production',
    },
    ar: {
      'brand.full': 'تالا لإدارة الإعلام الرقمي<br>والدعاية والفعاليات',
      'nav.mission': 'رسالتنا',
      'nav.about': 'من نحن',
      'nav.work': 'أعمالنا',
      'nav.contact': 'تواصل معنا',
      'nav.location': 'الموقع',
      'nav.team': 'الفريق',
      'nav.hours': 'أوقات العمل',
      'nav.email': 'راسلنا',
      'hero.eyebrow': 'الدوحة، قطر — بيت إبداعي للإعلام الرقمي',
      'hero.title': 'قصص، <em>موثّقة</em><br>بغاية.',
      'hero.sub': 'تالا للإعلام الرقمي والدعاية والفعاليات شركة إعلام إبداعي وإنتاج مقرها الدوحة. نتولى المحتوى الرقمي، وتغطية الفعاليات، والإنتاج الإعلامي الكامل — كل مشروع يُصمَّم وفق رؤيتكم من البداية حتى اللقطة الأخيرة.',
      'hero.ctaPrimary': 'ابدأ مشروعك',
      'hero.ctaSecondary': 'شاهد أعمالنا',
      'hero.scroll': 'مرر للأسفل',
      'film.01': 'محتوى رقمي',
      'film.02': 'تغطية الفعاليات',
      'film.03': 'إنتاج إعلامي',
      'film.04': 'سرد العلامة التجارية',
      'film.05': 'إخراج إبداعي',
      'mv.eyebrow': 'لماذا نحن هنا',
      'mv.lead1': 'فكرتان تقودان كل ما تبنيه تالا — ',
      'mv.lead2': 'إلى أين نتجه',
      'mv.lead3': '، ولماذا',
      'mv.lead4': ' يهم الأمر',
      'mv.lead5': '.',
      'mv.missionLabel': '— رسالتنا',
      'mv.missionHead': 'كل قصة تُروى بـ<span class="accent">حرفية.</span>',
      'mv.missionBody': 'رسالتنا هي تقديم حلول إعلامية رقمية مبتكرة وعالية الجودة في قطر، تمكّن العلامات التجارية والمؤسسات والمجتمعات من سرد قصصها بإبداع وهدف وتميّز.',
      'mv.visionLabel': '— رؤيتنا',
      'mv.visionHead': 'معيار لـ<span class="accent">التأثير.</span>',
      'mv.visionBody': 'رؤيتنا أن نصبح مركزاً إبداعياً رائداً للإعلام الرقمي في قطر وخارجها — معروفين بالتميّز في الإنتاج والابتكار والتعاون الفني، ونصل الناس ونرتقي بالعلامات التجارية ونلهم المجتمعات.',
      'about.storyMark': 'قصتنا.',
      'about.title': 'وُلدنا في الدوحة، وصُممنا لكل شاشة.',
      'about.founderRole': 'المؤسس، تالا للإعلام الرقمي والدعاية والفعاليات',
      'about.p1': 'تالا للإعلام الرقمي والدعاية والفعاليات شركة إعلام إبداعي مقرها الدوحة، قطر، أسسها مون سارمينتو. نقدّم حلولاً إعلامية رقمية احترافية، من التخطيط الاستراتيجي والتصميم الإبداعي إلى التنفيذ الكامل للمشاريع، بما يلائم احتياجات كل عميل.',
      'about.p2': 'مدفوعين بالابتكار والخبرة التقنية والالتزام بالتميّز، يقدّم فريقنا محتوى عالي الجودة ومؤثراً يعزز هوية العلامة التجارية ويرتقي بالفعاليات والمؤسسات. نسعى لبناء شراكات دائمة عبر خدمات إعلامية موثوقة وفعّالة وقائمة على النتائج.',
      'about.pillar1Title': 'التخطيط',
      'about.pillar1Body': 'استراتيجية وتوجيه إبداعي يُصمَّمان حول أهدافكم قبل تصوير أي لقطة.',
      'about.pillar2Title': 'الإنتاج',
      'about.pillar2Body': 'تنفيذ متكامل — محتوى وتغطية وإعلام بدقة تقنية عالية.',
      'about.pillar3Title': 'الشراكة',
      'about.pillar3Body': 'تعاون موثوق وقائم على النتائج يدوم لما بعد المشروع الواحد.',
      'journey.eyebrow': 'رحلتنا',
      'journey.title': 'من رؤية واحدة إلى قسمين متخصصين.',
      'journey.intro': 'تأسست تالا للإعلام الرقمي برؤية واضحة — إنشاء منصة إبداعية موحّدة تقدّم حلولاً إعلامية مبتكرة وعالية الجودة وهادفة في الدوحة، قطر. وما بدأ كشغف بسرد القصص والإنتاج والموسيقى والفنون البصرية، تطوّر إلى مركز إبداعي ديناميكي يجمع أقساماً متخصصة مكرّسة لمجالات مختلفة من الصناعة.',
      'journey.sinagName': 'سيناغ للإنتاج',
      'journey.sinagBody': 'من خلال سيناغ للإنتاج، تقدّمنا في إنتاج المحتوى الفوتوغرافي والفيديو والوسائط المتعددة الاحترافي.',
      'journey.yamarName': 'استوديو يامار ميوزيك',
      'journey.yamarBody': 'مع استوديو يامار ميوزيك، توسّعنا في إنتاج الموسيقى وهندسة الصوت، لنوفر للفنانين والفعاليات صوتاً نقياً وقوياً.',
      'journey.closing': 'مع استمرار تطوّر الصناعة، تبقى تالا للإعلام الرقمي ملتزمة بالابتكار والتميّز التقني والتعاون الإبداعي. تتحدد رحلتنا بالتزامنا بتنفيذ سلس، وبناء شراكات دائمة، وتحويل الأفكار إلى تجارب هادفة ومؤثرة لعملائنا والمجتمع الأوسع.',
      'team.eyebrow': 'الفريق وراء العمل',
      'team.title': 'خلف تالا للإعلام الرقمي والدعاية والفعاليات.',
      'team.sub': 'فريق صغير ومتمرّس يخطط وينفّذ ويسلّم كل مشروع داخلياً.',
      'team.founderRole': 'المؤسس والمدير الإبداعي',
      'team.role1Title': 'رئيس الإبداع والوسائط المتعددة ومدير التصوير (DOP)',
      'team.role2Title': 'رئيس هندسة الصوت',
      'team.role3Title': 'مدير المسرح',
      'team.role6Title': 'إنتاج المحتوى ومساعد مدير التصوير (Assistant DOP)',
      'team.role4Title': 'مدير التواصل الاجتماعي',
      'team.role5Title': 'منسقة الفعاليات والسكرتيرة الإدارية',
      'team.ctaText': 'هل تريد العمل معنا في مشروعك القادم؟',
      'team.ctaBtn': 'تواصل معنا',
      'work.eyebrow': 'أعمال مختارة',
      'work.title': 'لقطات من الميدان.',
      'work.sub': 'تغطيات وأعمال إنتاج حديثة — اضغط على أي مقطع لتشغيله.',
      'work.card1Title': 'ورشة الأكريليك',
      'work.card1Body': 'جلسة إبداعية تفاعلية، صُوّرت ومُونتجت لمنصات التواصل.',
      'work.card2Title': 'ورشة النطق والتعبير',
      'work.card2Body': 'تغطية ورشة تركّز على سير العمل وطاقة المشاركين.',
      'work.card3Title': 'ورشة تكوين فرقة موسيقية',
      'work.card3Body': 'تغطية متعددة الكاميرات لجلسة تعاونية حية.',
      'work.card4Title': 'معسكر سيناغ للأزياء — السنة الثانية',
      'work.card4Body': 'ملخص كامل للفعالية: التنسيق، عرض الأزياء، وخلف الكواليس.',
      'hours.eyebrow': 'أوقات العمل',
      'hours.title': 'أوقات تواجدنا.',
      'hours.sub': 'بتوقيت الدوحة — تواصلوا معنا أو خططوا لزيارتكم ضمن هذه الأوقات.',
      'hours.openNow': 'مفتوح الآن',
      'hours.closedNow': 'مغلق الآن',
      'hours.closesToday': 'يُغلق اليوم الساعة {time}',
      'hours.opensToday': 'يفتح اليوم الساعة {time}',
      'hours.opensTomorrow': 'يفتح غداً الساعة {time}',
      'hours.opensOn': 'يفتح يوم {day} الساعة {time}',
      'hours.closedLabel': 'مغلق',
      'day.0': 'الأحد',
      'day.1': 'الاثنين',
      'day.2': 'الثلاثاء',
      'day.3': 'الأربعاء',
      'day.4': 'الخميس',
      'day.5': 'الجمعة',
      'day.6': 'السبت',
      'contact.title': 'لنصنع شيئاً يستحق أن يُتذكّر.',
      'contact.sub': 'أخبرونا بما تخططون له، وسيتواصل معكم فريق تالا قريباً.',
      'contact.emailLabel': 'راسلنا',
      'contact.followLabel': 'تابعونا',
      'contact.facebook': 'فيسبوك',
      'contact.instagram': 'إنستغرام',
      'contact.whatsapp': 'واتساب',
      'contact.visitLabel': 'زوروا مكتبنا',
      'contact.address': 'مبنى رقم 30، الطابق الخامس<br>شارع رقم 138، المنطقة 6، الدوحة، قطر',
      'form.name': 'الاسم الكامل',
      'form.namePh': 'الاسم الكامل',
      'form.nameErr': 'يرجى كتابة اسمكم.',
      'form.email': 'البريد الإلكتروني',
      'form.emailPh': 'you@company.com',
      'form.emailErr': 'يرجى إدخال بريد إلكتروني صحيح.',
      'form.phone': 'رقم الهاتف',
      'form.optional': '(اختياري)',
      'form.service': 'ما الذي تحتاجونه؟',
      'form.serviceSelect': 'اختر خدمة',
      'form.opt1': 'محتوى رقمي',
      'form.opt2': 'تغطية فعاليات',
      'form.opt3': 'إنتاج إعلامي',
      'form.opt4': 'سرد العلامة التجارية',
      'form.opt5': 'إخراج إبداعي',
      'form.opt6': 'شيء آخر',
      'form.serviceErr': 'يرجى اختيار الخدمة المطلوبة.',
      'form.message': 'أخبرونا عن مشروعكم',
      'form.messagePh': 'الجدول الزمني، الميزانية التقريبية، وما تسعون لتحقيقه...',
      'form.messageErr': 'يرجى إضافة بعض التفاصيل (10 أحرف على الأقل).',
      'form.submit': 'إرسال الطلب',
      'form.note': 'يصل مباشرة إلى بريدنا، ويفتح واتساب برسالتكم جاهزة للإرسال — سريع ومباشر.',
      'location.eyebrow': 'زوروا الاستوديو',
      'location.title': 'موقعنا في الدوحة.',
      'location.sub': 'العنوان، أوقات العمل، ورحلة إلينا — كل ذلك في مكان واحد.',
      'map.addressLabel': 'العنوان',
      'map.title': 'تالا للإعلام الرقمي والدعاية والفعاليات',
      'map.caption': 'مبنى رقم 30، الطابق الخامس، شارع رقم 138، المنطقة 6 — الدوحة، قطر.',
      'map.open': 'افتح في خرائط جوجل ↗',
      'map.badge': 'تالا للإعلام الرقمي والدعاية والفعاليات',
      'ride.uberName': 'احجز عبر أوبر',
      'ride.uberSub': 'الوجهة معبأة مسبقاً',
      'ride.badrgoName': 'احجز عبر بدرگو',
      'ride.badrgoSub': 'يفتح التطبيق',
      'footer.brand': 'تالا للإعلام الرقمي والدعاية والفعاليات',
      'footer.tagline': 'الدوحة، قطر — إعلام وإنتاج إبداعي',
    },
  };

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    const isAr = lang === 'ar';
    document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-ar', isAr);

    const enBtn = document.getElementById('langEn');
    const arBtn = document.getElementById('langAr');
    if (enBtn && arBtn) {
      enBtn.classList.toggle('active', !isAr);
      arBtn.classList.toggle('active', isAr);
    }

    try { localStorage.setItem('tala-lang', lang); } catch (e) { /* ignore */ }

    currentLang = isAr ? 'ar' : 'en';
    renderHours(currentLang);
  }

  const langEnBtn = document.getElementById('langEn');
  const langArBtn = document.getElementById('langAr');
  if (langEnBtn && langArBtn) {
    langEnBtn.addEventListener('click', () => applyLanguage('en'));
    langArBtn.addEventListener('click', () => applyLanguage('ar'));
  }

  let savedLang = 'en';
  try { savedLang = localStorage.getItem('tala-lang') || 'en'; } catch (e) { /* ignore */ }
  applyLanguage(savedLang);

  // keep the open/closed status accurate while the page stays open
  hoursTimer = setInterval(() => renderHours(currentLang), 60000);

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- cursor spotlight ---------- */
  const spot = document.getElementById('spotlight');
  if (spot && finePointer && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      spot.style.left = e.clientX + 'px';
      spot.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', () => { spot.style.opacity = 0; });
    window.addEventListener('mouseenter', () => { spot.style.opacity = 1; });
  } else if (spot) {
    spot.style.display = 'none';
  }

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    links.querySelectorAll('a[data-close]').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 3D tilt on cards (desktop / fine pointer only) ---------- */
  if (finePointer && !reducedMotion) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      let frame = null;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const max = parseFloat(el.dataset.tiltMax) || 7;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.transform =
            `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(6px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        if (frame) cancelAnimationFrame(frame);
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });

    /* hero watermark parallax */
    const hero = document.querySelector('.hero');
    const watermark = document.querySelector('.hero-watermark');
    if (hero && watermark) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        watermark.style.transform =
          `translate(${(px * -18).toFixed(1)}px, calc(-50% + ${(py * -18).toFixed(1)}px)) rotate(${(px * 3).toFixed(1)}deg)`;
      });
      hero.addEventListener('mouseleave', () => {
        watermark.style.transform = 'translateY(-50%)';
      });
    }
  }

  /* ---------- work showreel video controls ---------- */
  document.querySelectorAll('.work-video').forEach(wrap => {
    const video = wrap.querySelector('video');
    const playBtn = wrap.querySelector('.play-btn');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => { video.play(); });
    video.addEventListener('play', () => wrap.classList.add('is-playing'));
    video.addEventListener('pause', () => wrap.classList.remove('is-playing'));
    video.addEventListener('ended', () => wrap.classList.remove('is-playing'));
  });

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- contact form ---------- */
  const CONTACT_EMAIL = 'taladigitalmedia@gmail.com';
  const form = document.getElementById('inquiryForm');
  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  if (form) {
    const fields = {
      name: form.querySelector('#f-name'),
      email: form.querySelector('#f-email'),
      phone: form.querySelector('#f-phone'),
      service: form.querySelector('#f-service'),
      message: form.querySelector('#f-message'),
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      const wrap = field.closest('.field');
      const msg = wrap.querySelector('.err-msg');
      wrap.classList.add('invalid');
      if (msg) msg.textContent = message;
    }

    function clearError(field) {
      field.closest('.field').classList.remove('invalid');
    }

    function validate() {
      let valid = true;

      if (!fields.name.value.trim()) {
        setError(fields.name, 'Please tell us your name.');
        valid = false;
      } else clearError(fields.name);

      if (!fields.email.value.trim() || !emailPattern.test(fields.email.value.trim())) {
        setError(fields.email, 'Enter a valid email address.');
        valid = false;
      } else clearError(fields.email);

      if (!fields.service.value) {
        setError(fields.service, 'Select what you need.');
        valid = false;
      } else clearError(fields.service);

      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        setError(fields.message, 'Give us a few details (10+ characters).');
        valid = false;
      } else clearError(fields.message);

      return valid;
    }

    Object.values(fields).forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    function buildWhatsAppUrl() {
      const summary =
`New inquiry via website:
Name: ${fields.name.value.trim()}
Email: ${fields.email.value.trim()}
Phone: ${fields.phone.value.trim() || 'Not provided'}
Service: ${fields.service.value}
Message: ${fields.message.value.trim()}`;
      return `https://wa.me/97433043148?text=${encodeURIComponent(summary)}`;
    }

    function mailtoFallback() {
      const subject = `New project inquiry — ${fields.service.value}`;
      const body =
`Name: ${fields.name.value.trim()}
Email: ${fields.email.value.trim()}
Phone: ${fields.phone.value.trim() || 'Not provided'}
Service: ${fields.service.value}

Message:
${fields.message.value.trim()}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function setSubmitting(isSubmitting) {
      submitBtn.disabled = isSubmitting;
      submitBtn.style.opacity = isSubmitting ? '.6' : '1';
      submitBtn.style.cursor = isSubmitting ? 'wait' : 'pointer';
      submitBtn.querySelector('.btn-label').textContent = isSubmitting ? 'Sending…' : 'Send inquiry';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validate()) {
        statusBox.textContent = 'Please fix the highlighted fields.';
        statusBox.className = 'form-status show err';
        return;
      }

      // Open WhatsApp with the inquiry pre-filled, synchronously and before
      // any await — browsers can block window.open() once the original
      // click's "user activation" expires across an async gap, so this has
      // to fire immediately inside the submit handler, not after the fetch.
      window.open(buildWhatsAppUrl(), '_blank', 'noopener');

      setSubmitting(true);
      statusBox.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          statusBox.textContent = "Thanks — your message is on its way, and we've opened WhatsApp so you can send it there too.";
          statusBox.className = 'form-status show ok';
          form.reset();
        } else {
          throw new Error('Form endpoint returned an error');
        }
      } catch (err) {
        // Network or endpoint failure — fall back to mailto so the
        // client's message still reaches us either way.
        mailtoFallback();
        statusBox.textContent = "Couldn't send the email automatically, so we opened your email app — and WhatsApp is ready in the other tab.";
        statusBox.className = 'form-status show err';
      } finally {
        setSubmitting(false);
      }
    });
  }

});
