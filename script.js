/**
 * PORTFOLIO CLIENT ENGINE — MUHAMMAD NEVAN DZAMIR
 * Handles Data Loading, Interactive Rendering, Filtering, Lightbox & Modals
 */

const STORAGE_KEY = 'portfolio-tech-editor-v1';

// Active Filters State
let currentSkillCategory = 'all';
let currentSkillSearch = '';
let currentCertCategory = 'all';
let currentCertSearch = '';

const svgData = (title, colorA, colorB, accent) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colorA}"/><stop offset="1" stop-color="${colorB}"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.08)"/></pattern></defs><rect width="1600" height="900" fill="url(#g)"/><rect width="1600" height="900" fill="url(#p)"/><circle cx="1200" cy="200" r="260" fill="none" stroke="${accent}" stroke-opacity=".3" stroke-width="2"/><text x="100" y="720" font-family="'Space Grotesk', sans-serif" font-size="64" font-weight="700" fill="white">${title}</text><text x="100" y="780" font-family="'IBM Plex Mono', monospace" font-size="24" fill="${accent}">Portfolio Showcase · 16:9 · 2026</text></svg>`
  )}`;

const defaultData = {
  profile: {
    name: 'Muhammad Nevan Dzamir',
    role: 'Web Developer · Data Analyst · System Analyst',
    location: 'Indonesia',
    domicile: 'Indonesia',
    university: 'Universitas Gunadarma',
    gpa: '3.53 / 4.00',
    birthdate: '02 / 06 / 2004',
    photoPath: 'assets/profile/foto-profile.png',
    photo: '',
    email: 'nevandzmir@gmail.com',
    phone: '+6282125060232',
    instagram: '@nevan.dzmrr',
    bio: 'Fresh Graduate S1 Sistem Informasi Universitas Gunadarma dengan minat mendalam pada Software Development dan Data Analytics. Berpengalaman dalam pengembangan aplikasi web terintegrasi, perancangan skema database relasional, serta analisis data untuk menghasilkan solusi digital yang andal dan solutif.',
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/in/nevandzmrr/'
  },
  stats: [
    { number: '3.53', label: 'IPK / GPA (Gunadarma)' },
    { number: '12+', label: 'Sertifikasi Keahlian' },
    { number: '2026', label: 'Lulusan S1 Sistem Informasi' }
  ],
  labels: {
    navAbout: 'About',
    navSkills: 'Skills',
    navCertificates: 'Certificates',
    navProjects: 'Projects',
    navContact: 'Contact',
    sectionAbout: 'about me',
    sectionSkills: 'technical skills',
    sectionCertificates: 'certificates',
    sectionProjects: 'selected projects',
    sectionContact: 'get in touch',
    aboutKicker: 'ringkasan profil',
    skillsKicker: 'toolkit & keahlian',
    certificatesKicker: 'bukti kompetensi',
    projectsKicker: 'karya terpilih',
    contactKicker: 'terhubung langsung',
    projectOverlay: 'selected work',
    projectStack: 'stack teknologi',
    projectVisit: 'kunjungi proyek ↗',
    projectCaseStudy: 'detail studi kasus ↗'
  },
  copy: {
    heroEyebrow: 'PORTOFOLIO PROFESIONAL',
    heroTitleStart: 'Muhammad',
    heroTitleHighlight: 'Nevan',
    heroTitleEnd: 'Dzamir',
    heroActionProjects: 'Lihat Proyek Unggulan',
    heroActionContact: 'Mari Terhubung',
    heroBasedIn: 'berdomisili di',
    heroFocus: 'fokus bidang',
    heroFocusValue: 'Web Dev & Data Analytics',
    aboutHeadingStart: 'TENTANG',
    aboutHeadingHighlight: 'SAYA',
    aboutParagraph1Prefix: 'Halo! Saya',
    aboutParagraph1: 'Fresh Graduate S1 Sistem Informasi Universitas Gunadarma yang memiliki fokus kuat pada Software Development dan Data Analytics. Memiliki kemampuan dalam pengembangan aplikasi berbasis web, analisis dan pengolahan data, perancangan UI/UX, serta pengelolaan database menggunakan PHP, Laravel, Python, SQL, dan MySQL.',
    aboutParagraph2: 'Terbiasa bekerja dengan teknologi modern seperti PHP, Laravel, Python, Golang, SQL, MySQL, Power BI, dan Tableau. Saya selalu antusias memecahkan permasalahan kompleks dengan pendekatan analitis yang terukur, berkolaborasi dalam tim, serta terus memperluas wawasan teknologi untuk menciptakan solusi digital yang berdampak nyata.',
    aboutLink: 'Diskusikan Peluang Kolaborasi',
    skillsHeadingStart: 'Teknologi &',
    skillsHeadingHighlight: 'Toolkit Keahlian',
    skillsIntro: 'Kumpulan bahasa pemrograman, framework, database, dan tools analitik yang saya kuasai dan terus kembangkan.',
    certificatesHeadingStart: 'Arsip Dokumen',
    certificatesHeadingHighlight: 'Sertifikasi Resmi',
    certificatesIntro: '12 Sertifikat resmi dari Universitas Gunadarma dan BNSP sebagai bukti kompetensi dan dedikasi belajar.',
    projectsHeadingStart: 'Portofolio',
    projectsHeadingHighlight: 'Karya Terpilih',
    projectsIntro: 'Penerapan nyata dari analisis kebutuhan sistem, perancangan arsitektur data, hingga implementasi aplikasi web.',
    contactHeadingStart: 'Mari Terhubung &',
    contactHeadingHighlight: 'Ciptakan Solusi Hebat',
    footerBuilt: 'Dirancang & dibangun dengan dedikasi tinggi',
    footerBack: 'Kembali ke atas'
  },
  skillCategories: [],
  certificates: [],
  projects: [],
  contact: {
    availability: 'Available for Web Dev, Data Analyst & System Analyst Roles',
    cta: 'Mari Terhubung & Diskusikan Peluang Kolaborasi.',
    message: 'Terbuka untuk peluang kerja Full-Time, Project-Based, maupun diskusi seputar pengembangan teknologi dan analisis data. Hubungi saya melalui kanal di bawah:'
  }
};

let data = loadData();
let activeTab = 'profile';
let galleryIndexes = {};
let toastTimer;

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function mergeData(base, extra = {}) {
  return {
    ...base,
    ...extra,
    profile: { ...base.profile, ...(extra.profile || {}) },
    contact: { ...base.contact, ...(extra.contact || {}) },
    labels: { ...base.labels, ...(extra.labels || {}) },
    copy: { ...base.copy, ...(extra.copy || {}) }
  };
}

function loadData() {
  try {
    const repo = window.PORTFOLIO_DATA || {};
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    let merged = mergeData(clone(defaultData), repo);

    if (saved) {
      // If saved data has empty projects but repo has projects, keep repo projects
      if ((!saved.projects || saved.projects.length === 0) && repo.projects && repo.projects.length > 0) {
        saved.projects = repo.projects;
      }
      // If saved data has empty certificates but repo has certificates, keep repo
      if ((!saved.certificates || saved.certificates.length === 0) && repo.certificates && repo.certificates.length > 0) {
        saved.certificates = repo.certificates;
      }
      merged = mergeData(merged, saved);
    }

    // Fallback to repo categories if empty
    if (!merged.skillCategories || merged.skillCategories.length === 0) {
      merged.skillCategories = repo.skillCategories || [];
    }
    if (!merged.certificates || merged.certificates.length === 0) {
      merged.certificates = repo.certificates || [];
    }
    if (!merged.projects || merged.projects.length === 0) {
      merged.projects = repo.projects || [];
    }

    merged.skillCategories = (merged.skillCategories || []).map(category => ({
      id: category.id || `category-${Date.now()}-${Math.random()}`,
      name: category.name || 'Untitled category',
      emoji: category.emoji || '✦',
      items: Array.isArray(category.items) ? category.items : []
    }));

    return merged;
  } catch (err) {
    console.error('Error loading data:', err);
    return clone(defaultData);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;'
  }[char]));
}

function parseAssetPaths(value = '') {
  return String(value).split(/[\n,]+/).map(path => path.trim()).filter(Boolean);
}

function projectImages(project) {
  if (project.assetPaths && project.assetPaths.length > 0) {
    return project.assetPaths;
  }
  if (project.images && project.images.length > 0) {
    return project.images;
  }
  return [svgData(project.title, '#0a1628', '#050a14', '#00f2a9')];
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==========================================================================
   RENDER FUNCTIONS
   ========================================================================== */

function renderProfile() {
  document.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = data.profile.name);
  document.querySelectorAll('[data-profile-role]').forEach(el => el.textContent = data.profile.role);
  document.querySelectorAll('[data-profile-location]').forEach(el => el.textContent = data.profile.location);
  document.querySelectorAll('[data-profile-bio]').forEach(el => el.textContent = data.profile.bio);
  document.querySelectorAll('[data-profile-university]').forEach(el => el.textContent = data.profile.university);
  document.querySelectorAll('[data-profile-gpa]').forEach(el => el.textContent = data.profile.gpa);
  document.querySelectorAll('[data-profile-birthdate]').forEach(el => el.textContent = data.profile.birthdate);
  document.querySelectorAll('[data-profile-domicile]').forEach(el => el.textContent = data.profile.domicile);
  document.querySelectorAll('[data-profile-email]').forEach(el => el.textContent = data.profile.email);
  document.querySelectorAll('[data-profile-phone]').forEach(el => el.textContent = data.profile.phone || '+62 821-2506-0232');
  document.querySelectorAll('[data-profile-instagram]').forEach(el => el.textContent = data.profile.instagram || '@nevan.dzmrr');

  const linkedinDisplay = (data.profile.linkedin || 'https://www.linkedin.com/in/nevandzmrr/').replace(/^https?:\/\/(www\.)?/, '');
  document.querySelectorAll('[data-profile-linkedin]').forEach(el => el.textContent = linkedinDisplay);

  document.querySelectorAll('[data-profile-email-link]').forEach(el => el.href = `mailto:${data.profile.email}`);

  const cleanPhone = (data.profile.phone || '').replace(/[^+\d]/g, '');
  document.querySelectorAll('[data-profile-phone-link]').forEach(el => el.href = `tel:${cleanPhone}`);

  // WhatsApp Link
  const waNumber = cleanPhone.replace(/^\+/, '');
  const waBtn = document.getElementById('waDirectBtn');
  if (waBtn) waBtn.href = `https://wa.me/${waNumber || '6282125060232'}`;

  document.querySelectorAll('[data-profile-instagram-link]').forEach(el => {
    const val = data.profile.instagram || '@nevan.dzmrr';
    el.href = val.startsWith('http') ? val : `https://instagram.com/${val.replace(/^@/, '')}`;
  });

  document.querySelectorAll('[data-profile-linkedin-link]').forEach(el => {
    el.href = data.profile.linkedin || 'https://www.linkedin.com/in/nevandzmrr/';
  });

  // Profile Photo
  document.querySelectorAll('[data-profile-photo]').forEach(el => {
    const photoSrc = data.profile.photoPath || data.profile.photo;
    if (photoSrc) {
      el.src = photoSrc;
      el.classList.add('has-photo');
    } else {
      el.removeAttribute('src');
      el.classList.remove('has-photo');
    }
  });

  document.querySelectorAll('[data-profile-photo-placeholder]').forEach(el => {
    el.classList.toggle('is-hidden', Boolean(data.profile.photoPath || data.profile.photo));
  });

  const contactText = document.querySelector('[data-contact-message]');
  if (contactText) contactText.textContent = data.contact.message;

  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
}

function renderCopy() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    const key = el.dataset.copy;
    if (data.copy?.[key] !== undefined) el.textContent = data.copy[key];
  });
}

function renderLabels() {
  document.querySelectorAll('[data-label]').forEach(el => {
    const key = el.dataset.label;
    if (data.labels?.[key]) el.textContent = data.labels[key];
  });
}

function renderStats() {
  const target = document.getElementById('statsRow');
  if (!target) return;
  target.innerHTML = data.stats.map(stat => `
    <div class="stat">
      <span class="stat-number">${escapeHTML(stat.number)}</span>
      <span class="stat-label">${escapeHTML(stat.label)}</span>
    </div>
  `).join('');
}

/**
 * Modern Interactive Skills Grid with Category & Search Filters
 */
function renderSkills() {
  const target = document.getElementById('skillsList');
  if (!target) return;

  const query = currentSkillSearch.toLowerCase().trim();
  let itemsToRender = [];

  data.skillCategories.forEach(category => {
    if (currentSkillCategory !== 'all' && category.id !== currentSkillCategory) {
      return;
    }
    category.items.forEach(skill => {
      const matchSearch = !query ||
        skill.name.toLowerCase().includes(query) ||
        category.name.toLowerCase().includes(query);
      if (matchSearch) {
        itemsToRender.push({
          ...skill,
          categoryName: category.name,
          categoryId: category.id
        });
      }
    });
  });

  if (itemsToRender.length === 0) {
    target.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted); font-family: var(--mono); font-size: 13px;">
        Tidak ada keahlian yang cocok dengan pencarian "<strong>${escapeHTML(currentSkillSearch)}</strong>".
      </div>
    `;
    return;
  }

  target.innerHTML = itemsToRender.map((skill, index) => `
    <div class="skill-bento-tile reveal" style="transition-delay: ${Math.min(index * 0.04, 0.4)}s">
      <div class="skill-tile-left">
        <div class="skill-tile-emoji" aria-hidden="true">${escapeHTML(skill.emoji || '⚡')}</div>
        <div class="skill-tile-info">
          <span class="skill-tile-name">${escapeHTML(skill.name)}</span>
          <span class="skill-tile-category">${escapeHTML(skill.categoryName)}</span>
        </div>
      </div>
      <span class="skill-tile-badge">${escapeHTML(skill.level || 'Kompeten')}</span>
    </div>
  `).join('');

  observeReveals();
}

/**
 * Certificate Previews & Filtering
 */
function certificateArtwork(cert) {
  return `
    <div class="cert-preview-art">
      <div class="cert-art-watermark">UG</div>
      <div class="cert-art-head">
        <span>&lt;/&gt; VERIFIED CREDENTIAL</span>
        <span>${escapeHTML(cert.tag || 'CERT')}</span>
      </div>
      <div class="cert-art-title">${escapeHTML(cert.title)}</div>
      <div class="cert-art-foot">
        <span>${escapeHTML(cert.issuer)}</span>
        <span>${escapeHTML(cert.year)}</span>
      </div>
    </div>
  `;
}

function certificateViewerMarkup(source, label, large = false) {
  return `
    <div class="certificate-pdf-viewer${large ? ' is-large' : ''}" data-pdf-source="${escapeHTML(source)}" aria-label="Preview ${escapeHTML(label)}" style="width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;">
      <canvas style="max-width:100%;max-height:100%;object-fit:contain;"></canvas>
      <div class="certificate-viewer-controls" style="position:absolute;bottom:8px;left:8px;right:8px;display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:rgba(8,13,26,0.85);border-radius:6px;font-family:var(--mono);font-size:9px;color:var(--cyan);">
        <button type="button" data-viewer-action="prev" style="color:var(--primary);padding:2px 6px;">←</button>
        <span class="certificate-page-count">page 1 / …</span>
        <button type="button" data-viewer-action="next" style="color:var(--primary);padding:2px 6px;">→</button>
      </div>
    </div>
  `;
}

function renderCertificatePage(viewer) {
  const pdf = viewer._pdf;
  if (!pdf) return;
  pdf.getPage(viewer._page).then(page => {
    const canvas = viewer.querySelector('canvas');
    if (!canvas) return;
    const width = Math.max(160, viewer.clientWidth - 16);
    const base = page.getViewport({ scale: 1 });
    const scale = width / base.width;
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width * devicePixelRatio;
    canvas.height = viewport.height * devicePixelRatio;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    const context = canvas.getContext('2d');
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    page.render({ canvasContext: context, viewport });
    const counter = viewer.querySelector('.certificate-page-count');
    if (counter) counter.textContent = `hlm ${viewer._page} / ${pdf.numPages}`;
  }).catch(err => console.warn('Render page error', err));
}

function hydrateCertificateViewers() {
  if (!window.pdfjsLib) return;
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  document.querySelectorAll('.certificate-pdf-viewer:not([data-ready])').forEach(viewer => {
    viewer.dataset.ready = 'true';
    const source = viewer.dataset.pdfSource;
    if (!source) return;

    window.pdfjsLib.getDocument(source).promise.then(pdf => {
      viewer._pdf = pdf;
      viewer._page = 1;
      renderCertificatePage(viewer);
    }).catch(() => {
      viewer.innerHTML = '<div style="font-family:var(--mono);font-size:10px;color:var(--faint);padding:20px;text-align:center;">Pratinjau PDF siap dibuka</div>';
    });
  });
}

function moveCertificatePage(viewer, direction) {
  if (!viewer?._pdf || viewer._pdf.numPages < 2) return;
  viewer._page = ((viewer._page - 1 + direction) % viewer._pdf.numPages) + 1;
  renderCertificatePage(viewer);
}

function renderCertificates() {
  const grid = document.getElementById('certificatesGrid');
  if (!grid) return;

  const query = currentCertSearch.toLowerCase().trim();

  // Sort certificates by year descending (newest first)
  const sorted = [...data.certificates].sort((a, b) => {
    const yA = parseInt(a.year, 10) || 0;
    const yB = parseInt(b.year, 10) || 0;
    return yB - yA;
  });

  const filtered = sorted.filter(cert => {
    // Category match
    if (currentCertCategory !== 'all') {
      if (currentCertCategory === 'database' && cert.category !== 'database') return false;
      if (currentCertCategory === 'web' && cert.category !== 'web') return false;
      if (currentCertCategory === 'data' && cert.category !== 'data') return false;
      if (currentCertCategory === 'others' && (cert.category === 'database' || cert.category === 'web' || cert.category === 'data')) return false;
    }
    // Search match
    if (query) {
      const match = cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.tag && cert.tag.toLowerCase().includes(query)) ||
        (cert.description && cert.description.toLowerCase().includes(query));
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted); font-family: var(--mono); font-size: 13px;">
        Tidak ada sertifikat yang cocok dengan pencarian "<strong>${escapeHTML(currentCertSearch)}</strong>".
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((cert, index) => {
    const source = cert.assetPath || cert.fileData;
    const preview = source ? certificateViewerMarkup(source, cert.title) : certificateArtwork(cert);

    return `
      <article class="certificate-card reveal" tabindex="0" role="button" data-certificate-id="${escapeHTML(cert.id)}" aria-label="Lihat detail ${escapeHTML(cert.title)}" style="transition-delay: ${Math.min(index * 0.05, 0.4)}s">
        <div class="cert-preview-frame">
          ${preview}
          <div class="cert-inspect-overlay">
            <span class="cert-inspect-pill">Detail Dokumen ↗</span>
          </div>
        </div>
        <div class="certificate-meta-bar">
          <div class="cert-row-top">
            <span class="cert-issuer-tag">${escapeHTML(cert.issuer)}</span>
            <span class="cert-year-tag">${escapeHTML(cert.year)}</span>
          </div>
          <h3 class="certificate-title-text">${escapeHTML(cert.title)}</h3>
          <div class="cert-bottom-info">
            <span class="cert-category-badge">${escapeHTML(cert.tag || 'KOMPETENSI')}</span>
            <span>Verifikasi Resmi ✦</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  observeReveals();
  hydrateCertificateViewers();
}

/**
 * Modern Projects Showcase Cards with Gallery & Lightbox
 */
function renderProjects() {
  const stack = document.getElementById('projectsStack');
  if (!stack) return;

  if (!data.projects || data.projects.length === 0) {
    stack.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-lg); font-family: var(--mono); font-size: 13px; color: var(--muted);">
        Belum ada proyek yang ditampilkan. Buka <strong>editor.html</strong> untuk menambahkan proyek.
      </div>
    `;
    return;
  }

  // Sort projects by year descending (newest first)
  const sortedProjects = [...data.projects].sort((a, b) => {
    const yA = parseInt(a.year, 10) || 0;
    const yB = parseInt(b.year, 10) || 0;
    return yB - yA;
  });

  stack.innerHTML = sortedProjects.map((project, index) => {
    const images = projectImages(project);
    const current = Math.min(galleryIndexes[project.id] || 0, images.length - 1);
    galleryIndexes[project.id] = current;

    const stackItems = (project.stack || '').split(/[·,]+/).map(s => s.trim()).filter(Boolean);
    const highlights = project.highlights || [
      'Implementasi arsitektur sistem modular dan terstruktur',
      'Pengujian fungsionalitas dan integrasi antarmuka pengguna responsif',
      'Optimasi performa query dan manajemen basis data relasional'
    ];

    return `
      <article class="project-showcase-card reveal">
        <!-- Visual Column -->
        <div class="project-media-col">
          <div class="project-main-image-wrap" data-lightbox-src="${escapeHTML(images[current])}" data-lightbox-caption="${escapeHTML(project.title)} — Tangkapan Layar ${current + 1}">
            <div class="project-main-image" id="project-image-${escapeHTML(project.id)}" style="background-image: url('${escapeHTML(images[current])}')"></div>
            <span class="project-badge-overlay">${escapeHTML(data.labels?.projectOverlay || 'KARYA')} ${String(index + 1).padStart(2, '0')} · ${escapeHTML(project.year || '2026')}</span>
            <span class="project-zoom-hint">Klik untuk perbesar 🔍</span>
          </div>
          
          <div class="project-gallery-bar">
            <div class="gallery-thumbs-list">
              ${images.map((img, imgIdx) => `
                <button class="gallery-thumb-btn ${imgIdx === current ? 'is-active' : ''}" type="button" data-project-id="${escapeHTML(project.id)}" data-image-index="${imgIdx}" style="background-image: url('${escapeHTML(img)}')" aria-label="Tampilkan gambar ${imgIdx + 1}"></button>
              `).join('')}
            </div>
            ${images.length > 1 ? `
              <div class="gallery-nav-btns">
                <button class="gallery-nav-btn" type="button" data-gallery-action="prev" data-project-id="${escapeHTML(project.id)}" aria-label="Gambar sebelumnya">←</button>
                <button class="gallery-nav-btn" type="button" data-gallery-action="next" data-project-id="${escapeHTML(project.id)}" aria-label="Gambar berikutnya">→</button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Info Column -->
        <div class="project-info-col">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;">
              <span class="project-category-kicker" style="margin-bottom:0;">${escapeHTML(project.category || 'Web Application · System Analysis')}</span>
              <span class="cert-year-tag" style="background:rgba(0,242,169,0.1);color:var(--primary);border:1px solid rgba(0,242,169,0.25);font-size:11px;">Tahun ${escapeHTML(project.year || '2026')}</span>
            </div>
            <h3 class="project-heading-title">${escapeHTML(project.title)}</h3>
            <p class="project-desc-paragraph">${escapeHTML(project.description)}</p>
            
            <ul class="project-highlights-list">
              ${highlights.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
            </ul>
          </div>

          <div class="project-footer-bar">
            <div class="project-tags-wrap" title="${escapeHTML(data.labels?.projectStack || 'stack teknologi')}">
              ${stackItems.map(tech => `<span class="project-tech-pill">${escapeHTML(tech)}</span>`).join('')}
            </div>
            <div>
              ${project.link && project.link !== '#' ? `
                <a class="button button-secondary" href="${escapeHTML(project.link)}" target="_blank" rel="noreferrer" style="min-height: 40px; padding: 0 16px; font-size: 12px;">
                  <span>${escapeHTML(data.labels?.projectVisit || 'Kunjungi Proyek')}</span> <span class="btn-icon">↗</span>
                </a>
              ` : `
                <span class="text-link" style="font-size: 12px;">${escapeHTML(data.labels?.projectCaseStudy || 'Studi Kasus Lengkap ✦')}</span>
              `}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  observeReveals();
}

function renderAll() {
  renderCopy();
  renderLabels();
  renderProfile();
  renderStats();
  renderSkills();
  renderCertificates();
  renderProjects();
}

/* ==========================================================================
   CERTIFICATE MODAL & LIGHTBOX
   ========================================================================== */

function closeCertificateModal() {
  const modal = document.getElementById('certificateModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.classList.remove('certificate-modal-open');
}

function openCertificateModal(id) {
  const cert = data.certificates.find(item => item.id === id);
  if (!cert) return;

  let modal = document.getElementById('certificateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'certificateModal';
    modal.className = 'certificate-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="certificate-modal-card">
        <button class="certificate-modal-close" type="button" aria-label="Tutup detail certificate">×</button>
        <div class="certificate-modal-grid">
          <div class="certificate-modal-art" id="certificateModalArt"></div>
          <div class="certificate-modal-copy">
            <span class="cert-category-badge" id="certificateModalTag" style="width:fit-content;margin-bottom:8px;"></span>
            <h2 id="certificateModalTitle"></h2>
            <div class="certificate-modal-meta" id="certificateModalMeta"></div>
            <p id="certificateModalDescription"></p>
            <div class="cert-modal-actions" id="certModalActions"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('.certificate-modal-close')) {
        closeCertificateModal();
      }
    });
  }

  const source = cert.assetPath || cert.fileData;
  document.getElementById('certificateModalArt').innerHTML = source ?
    certificateViewerMarkup(source, cert.title, true) :
    certificateArtwork(cert);
  hydrateCertificateViewers();

  document.getElementById('certificateModalTag').textContent = cert.tag || 'SERTIFIKASI';
  document.getElementById('certificateModalTitle').textContent = cert.title;
  document.getElementById('certificateModalMeta').textContent = `${cert.issuer} · Tahun ${cert.year}`;
  document.getElementById('certificateModalDescription').textContent = cert.description ||
    'Sertifikat ini membuktikan partisipasi aktif dan penguasaan kompetensi profesional di bidang teknologi informasi.';

  const actionsContainer = document.getElementById('certModalActions');
  if (source) {
    actionsContainer.innerHTML = `
      <a class="button button-primary" href="${escapeHTML(source)}" target="_blank" rel="noreferrer" style="min-height:42px;padding:0 18px;font-size:12px;">
        <span>Buka / Unduh Dokumen PDF Asli</span> <span class="btn-icon">↗</span>
      </a>
    `;
  } else {
    actionsContainer.innerHTML = '';
  }

  modal.classList.add('is-open');
  document.body.classList.add('certificate-modal-open');
}

// Lightbox for Project Screenshots
function openLightbox(src, caption = '') {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption;
  modal.classList.add('is-open');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');
}

/* ==========================================================================
   EDITOR PANEL FUNCTIONS (Compatibility with editor.html)
   ========================================================================== */

function openEditor(tab = 'profile') {
  const modal = document.getElementById('editorModal');
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  switchTab(tab);
  fillEditor();
  document.body.classList.add('editor-open');
}

function closeEditor() {
  const modal = document.getElementById('editorModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('editor-open');
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.editor-tab').forEach(btn =>
    btn.classList.toggle('is-active', btn.dataset.tab === tab)
  );
  document.querySelectorAll('.editor-panel').forEach(panel =>
    panel.classList.toggle('is-active', panel.dataset.panel === tab)
  );
}

function fillEditor() {
  const form = document.getElementById('editorForm');
  if (!form) return;

  Object.entries(data.profile).forEach(([key, value]) => {
    if (form.elements[key] && key !== 'photo') form.elements[key].value = value;
  });

  const photoPreview = document.getElementById('profilePhotoPreview');
  const photoName = document.getElementById('profilePhotoName');
  if (photoPreview) {
    photoPreview.style.backgroundImage = (data.profile.photoPath || data.profile.photo) ?
      `url('${data.profile.photoPath || data.profile.photo}')` : '';
    photoPreview.classList.toggle('has-photo', Boolean(data.profile.photoPath || data.profile.photo));
  }
  if (photoName && data.profile.photo) {
    photoName.textContent = 'Foto saat ini aktif. Upload ulang untuk menggantinya.';
  }

  Object.entries(data.contact).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  Object.entries(data.copy || {}).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  Object.entries(data.labels || {}).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });

  renderEditorItems();
  renderSkillCategoryOptions();
  resetSkillForm();
}

function renderEditorItems() {
  const skillItems = document.getElementById('skillEditorItems');
  if (skillItems) {
    skillItems.innerHTML = data.skillCategories.map(category => `
      <div class="category-editor-block">
        <div class="category-editor-heading">
          <div class="editor-item-info">
            <div class="skill-item-emoji">${escapeHTML(category.emoji)}</div>
            <div>
              <strong>${escapeHTML(category.name)}</strong>
              <small>${category.items.length} skill${category.items.length === 1 ? '' : 's'}</small>
            </div>
          </div>
          <div class="editor-item-actions">
            <button class="edit-item" type="button" data-edit-category-id="${escapeHTML(category.id)}">edit</button>
            <button class="remove-item" type="button" data-remove-type="category" data-remove-id="${escapeHTML(category.id)}" aria-label="Hapus kategori">×</button>
          </div>
        </div>
        <div class="category-editor-skills">
          ${category.items.map((skill, index) => `
            <div class="editor-item skill-editor-item">
              <div class="editor-item-info">
                <div class="skill-item-emoji">${escapeHTML(skill.emoji)}</div>
                <div>
                  <strong>${escapeHTML(skill.name)}</strong>
                  <small>${escapeHTML(category.name)} · ${escapeHTML(skill.emoji)}</small>
                </div>
              </div>
              <div class="editor-item-actions">
                <button class="edit-item" type="button" data-edit-skill-category="${escapeHTML(category.id)}" data-edit-skill-index="${index}">edit</button>
                <button class="remove-item" type="button" data-remove-type="skill" data-remove-category="${escapeHTML(category.id)}" data-remove-id="${index}" aria-label="Hapus skill">×</button>
              </div>
            </div>
          `).join('') || '<p class="editor-note">Belum ada skill di kategori ini.</p>'}
        </div>
      </div>
    `).join('') || '<p class="editor-note">Belum ada kategori. Tambahkan kategori pertamamu.</p>';
  }

  const certItems = document.getElementById('certificateEditorItems');
  if (certItems) {
    const sortedCerts = [...data.certificates].sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
    certItems.innerHTML = sortedCerts.map(cert => `
      <div class="editor-item admin-cert-card">
        <div class="editor-item-info">
          <div class="editor-item-thumb cert-thumb">${cert.assetPath || cert.fileData ? 'PDF' : '✳'}</div>
          <div class="admin-item-meta-col">
            <div class="admin-item-badge-row">
              <span class="badge-cat">${escapeHTML(cert.tag || 'SERTIFIKASI')}</span>
              <span class="badge-year">Tahun ${escapeHTML(cert.year || '2026')}</span>
              <span class="badge-cat-filter">${escapeHTML(cert.category || 'database')}</span>
            </div>
            <strong class="admin-item-title">${escapeHTML(cert.title)}</strong>
            <small class="admin-item-sub">${escapeHTML(cert.issuer)}${cert.assetPath ? ` · <code>${escapeHTML(cert.assetPath)}</code>` : ''}</small>
          </div>
        </div>
        <div class="editor-item-actions">
          <button class="edit-item button-edit-admin" type="button" data-edit-type="certificate" data-edit-id="${escapeHTML(cert.id)}" title="Edit Sertifikat">Edit ✎</button>
          <button class="remove-item button-del-admin" type="button" data-remove-type="certificate" data-remove-id="${cert.id}" aria-label="Hapus certificate" title="Hapus Sertifikat">✕</button>
        </div>
      </div>
    `).join('') || '<p class="editor-note">Belum ada certificate tambahan.</p>';
  }

  const projectItems = document.getElementById('projectEditorItems');
  if (projectItems) {
    const sortedProjects = [...data.projects].sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
    projectItems.innerHTML = sortedProjects.map(project => {
      const images = projectImages(project);
      return `
        <div class="editor-item admin-project-card">
          <div class="editor-item-info">
            <div class="editor-item-thumb" style="background-image:url('${images[0] || ''}');background-size:cover;background-position:center;"></div>
            <div class="admin-item-meta-col">
              <div class="admin-item-badge-row">
                <span class="badge-cat">${escapeHTML(project.category || 'Web Application')}</span>
                <span class="badge-year">Tahun ${escapeHTML(project.year || '2026')}</span>
                ${project.link && project.link !== '#' ? '<span class="badge-link">URL Aktif ↗</span>' : '<span class="badge-casestudy">Studi Kasus</span>'}
              </div>
              <strong class="admin-item-title">${escapeHTML(project.title)}</strong>
              <div class="admin-project-tech-row">
                <span class="badge-stack">${escapeHTML(project.stack || '')}</span>
                <span class="badge-assets">${images.length} gambar (16:9)</span>
              </div>
            </div>
          </div>
          <div class="editor-item-actions">
            <button class="edit-item button-edit-admin" type="button" data-edit-type="project" data-edit-id="${escapeHTML(project.id)}" title="Edit Proyek">Edit ✎</button>
            <button class="remove-item button-del-admin" type="button" data-remove-type="project" data-remove-id="${project.id}" aria-label="Hapus project" title="Hapus Proyek">✕</button>
          </div>
        </div>
      `;
    }).join('') || '<p class="editor-note">Belum ada project tambahan.</p>';
  }
}

function resetSkillForm() {
  const form = document.getElementById('editorForm');
  if (!form) return;
  form.elements.skillName.value = '';
  form.elements.skillCategory.value = data.skillCategories[0]?.id || '';
  form.elements.skillEmoji.value = '⚡';
  document.querySelectorAll('.emoji-choice').forEach(button =>
    button.classList.toggle('is-selected', button.dataset.emoji === '⚡')
  );
  const addBtn = document.querySelector('[data-add-skill]');
  if (addBtn) addBtn.innerHTML = 'Tambahkan skill <span>+</span>';
  delete form.dataset.editSkillCategory;
  delete form.dataset.editSkillIndex;
}

function renderSkillCategoryOptions() {
  const select = document.querySelector('[name="skillCategory"]');
  if (select) {
    select.innerHTML = data.skillCategories.map(category => `
      <option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>
    `).join('');
  }
}

function addOrUpdateSkill() {
  const form = document.getElementById('editorForm');
  const name = form.elements.skillName.value.trim();
  const emoji = form.elements.skillEmoji.value || '✦';
  const category = data.skillCategories.find(item => item.id === form.elements.skillCategory.value);
  if (!name || !category) {
    showToast('Isi nama skill dan pilih kategori terlebih dahulu.');
    return;
  }
  const editCategory = form.dataset.editSkillCategory;
  const editIndex = form.dataset.editSkillIndex;
  if (editCategory !== undefined && editIndex !== undefined) {
    const oldCategory = data.skillCategories.find(item => item.id === editCategory);
    if (oldCategory) oldCategory.items.splice(Number(editIndex), 1);
    category.items.push({ name, emoji });
    showToast('Skill berhasil diperbarui.');
  } else {
    category.items.push({ name, emoji });
    showToast('Skill ditambahkan.');
  }
  saveData();
  renderSkills();
  renderEditorItems();
  resetSkillForm();
}

function editSkill(categoryId, index) {
  const category = data.skillCategories.find(item => item.id === categoryId);
  const skill = category?.items[index];
  if (!skill) return;
  const form = document.getElementById('editorForm');
  form.elements.skillName.value = skill.name;
  form.elements.skillCategory.value = categoryId;
  form.elements.skillEmoji.value = skill.emoji;
  form.dataset.editSkillCategory = categoryId;
  form.dataset.editSkillIndex = index;
  document.querySelectorAll('.emoji-choice').forEach(button =>
    button.classList.toggle('is-selected', button.dataset.emoji === skill.emoji)
  );
  document.querySelector('[data-add-skill]').innerHTML = 'Update skill <span>✓</span>';
  form.elements.skillName.focus();
}

function addOrUpdateCategory() {
  const form = document.getElementById('editorForm');
  const name = form.elements.categoryName.value.trim();
  const emoji = form.elements.categoryEmoji.value || '🧩';
  if (!name) {
    showToast('Isi nama kategori terlebih dahulu.');
    return;
  }
  const editId = form.dataset.editCategoryId;
  if (editId) {
    const category = data.skillCategories.find(item => item.id === editId);
    if (category) {
      category.name = name;
      category.emoji = emoji;
      showToast('Kategori berhasil diperbarui.');
    }
  } else {
    data.skillCategories.push({ id: `category-${Date.now()}`, name, emoji, items: [] });
    showToast('Kategori ditambahkan.');
  }
  saveData();
  renderSkills();
  renderSkillCategoryOptions();
  renderEditorItems();
  form.elements.categoryName.value = '';
  form.elements.categoryEmoji.value = '🧩';
  delete form.dataset.editCategoryId;
  document.querySelector('[data-add-category]').innerHTML = 'Tambah kategori <span>+</span>';
}

function editCategory(id) {
  const category = data.skillCategories.find(item => item.id === id);
  if (!category) return;
  const form = document.getElementById('editorForm');
  form.elements.categoryName.value = category.name;
  form.elements.categoryEmoji.value = category.emoji;
  form.dataset.editCategoryId = id;
  document.querySelector('[data-add-category]').innerHTML = 'Update kategori <span>✓</span>';
  form.elements.categoryName.focus();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readPdfRatio(file) {
  if (!file) return 0.707;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const text = new TextDecoder('latin1').decode(bytes.slice(0, Math.min(bytes.length, 250000)));
    const match = text.match(/\/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/);
    if (!match) return 0.707;
    const width = Math.abs(Number(match[3]) - Number(match[1]));
    const height = Math.abs(Number(match[4]) - Number(match[2]));
    return width > 0 && height > 0 ? Math.min(2.5, Math.max(0.35, width / height)) : 0.707;
  } catch {
    return 0.707;
  }
}

async function addCertificate() {
  const form = document.getElementById('editorForm');
  const title = form.elements.certificateTitle.value.trim();
  const issuer = form.elements.certificateIssuer.value.trim();
  const file = form.elements.certificateFile.files[0];
  const assetPath = form.elements.certificateAssetPath.value.trim();
  if (!title || !issuer) {
    showToast('Isi judul dan issuer certificate terlebih dahulu.');
    return;
  }
  const item = {
    title,
    issuer,
    year: form.elements.certificateYear.value.trim() || String(new Date().getFullYear()),
    tag: form.elements.certificateTag.value.trim() || 'CERT',
    category: form.elements.certificateCategory ? form.elements.certificateCategory.value : 'database',
    description: form.elements.certificateDescription.value.trim() || 'Sertifikat ini menjadi bagian dari perjalanan belajar dan eksplorasi saya di bidang teknologi.',
    assetPath,
    fileData: file ? await readFile(file) : '',
    ratio: file ? await readPdfRatio(file) : 0.707
  };
  const editId = form.dataset.editCertificateId;
  const existing = data.certificates.find(cert => cert.id === editId);
  if (existing) {
    Object.assign(existing, item, { fileData: file ? item.fileData : existing.fileData });
    showToast('Certificate berhasil diperbarui.');
  } else {
    data.certificates.push({ id: `cert-${Date.now()}`, ...item });
    showToast('Certificate berhasil ditambahkan.');
  }
  saveData();
  renderCertificates();
  renderEditorItems();
  resetCertificateForm();
}

async function addProject() {
  const form = document.getElementById('editorForm');
  const title = form.elements.projectTitle.value.trim();
  const category = form.elements.projectCategory.value.trim() || 'Web Application';
  const year = form.elements.projectYear ? form.elements.projectYear.value.trim() : String(new Date().getFullYear());
  const stack = form.elements.projectTechStack ? form.elements.projectTechStack.value.trim() : 'PHP · MySQL · JavaScript';
  const link = form.elements.projectLink ? form.elements.projectLink.value.trim() : '';
  const highlightsRaw = form.elements.projectHighlights ? form.elements.projectHighlights.value.trim() : '';
  const highlights = highlightsRaw ? highlightsRaw.split('\n').map(h => h.trim()).filter(Boolean) : [
    'Implementasi arsitektur sistem modular dan terstruktur',
    'Pengujian fungsionalitas dan integrasi antarmuka pengguna responsif',
    'Optimasi performa query dan manajemen basis data relasional'
  ];
  const description = form.elements.projectDescription.value.trim() || 'Proyek yang dikembangkan dengan fokus pada solusi digital terintegrasi.';
  const files = form.elements.projectImages ? [...form.elements.projectImages.files] : [];
  const assetPaths = parseAssetPaths(form.elements.projectAssetPaths ? form.elements.projectAssetPaths.value : '');

  if (!title) {
    showToast('Isi nama project terlebih dahulu.');
    return;
  }

  const images = files.length ? await Promise.all(files.map(readFile)) : [svgData(title, '#0a1628', '#050a14', '#00f2a9')];
  const item = {
    title,
    category,
    year: year || String(new Date().getFullYear()),
    description,
    stack,
    link: link || '#',
    highlights,
    assetPaths,
    images
  };

  const editId = form.dataset.editProjectId;
  const existing = data.projects.find(project => project.id === editId);
  if (existing) {
    Object.assign(existing, item, {
      images: files.length ? images : (existing.images && existing.images.length ? existing.images : images),
      assetPaths: assetPaths.length ? assetPaths : (existing.assetPaths || [])
    });
    showToast('Project berhasil diperbarui.');
  } else {
    data.projects.push({ id: `project-${Date.now()}`, ...item });
    showToast('Project baru berhasil ditambahkan.');
  }
  saveData();
  renderProjects();
  renderEditorItems();
  resetProjectForm();
}

function resetCertificateForm() {
  const form = document.getElementById('editorForm');
  if (!form) return;
  ['certificateTitle', 'certificateIssuer', 'certificateYear', 'certificateTag', 'certificateDescription', 'certificateAssetPath'].forEach(name => {
    if (form.elements[name]) form.elements[name].value = '';
  });
  if (form.elements.certificateCategory) form.elements.certificateCategory.value = 'database';
  if (form.elements.certificateFile) form.elements.certificateFile.value = '';
  const label = document.getElementById('certificateFileName');
  if (label) label.textContent = 'Untuk GitHub, simpan PDF di assets/certificate lalu isi path di atas.';
  delete form.dataset.editCertificateId;
  const addBtn = document.querySelector('[data-add-certificate]');
  if (addBtn) addBtn.innerHTML = 'Tambahkan certificate <span>+</span>';
  const banner = document.getElementById('certEditBanner');
  if (banner) banner.style.display = 'none';
  const cancelBottom = document.getElementById('cancelCertEditBtnBottom');
  if (cancelBottom) cancelBottom.style.display = 'none';
}

function resetProjectForm() {
  const form = document.getElementById('editorForm');
  if (!form) return;
  ['projectTitle', 'projectCategory', 'projectYear', 'projectTechStack', 'projectLink', 'projectHighlights', 'projectDescription', 'projectAssetPaths'].forEach(name => {
    if (form.elements[name]) form.elements[name].value = '';
  });
  if (form.elements.projectImages) form.elements.projectImages.value = '';
  const label = document.getElementById('projectFileName');
  if (label) label.textContent = 'Untuk GitHub, simpan gambar di assets/projects lalu isi path di atas.';
  delete form.dataset.editProjectId;
  const addBtn = document.querySelector('[data-add-project]');
  if (addBtn) addBtn.innerHTML = 'Tambahkan project <span>+</span>';
  const banner = document.getElementById('projectEditBanner');
  if (banner) banner.style.display = 'none';
  const cancelBottom = document.getElementById('cancelProjectEditBtnBottom');
  if (cancelBottom) cancelBottom.style.display = 'none';
}

function editCertificate(id) {
  const cert = data.certificates.find(item => item.id === id);
  if (!cert) return;
  const form = document.getElementById('editorForm');
  if (!form) return;
  form.elements.certificateTitle.value = cert.title || '';
  form.elements.certificateIssuer.value = cert.issuer || '';
  form.elements.certificateYear.value = cert.year || '';
  form.elements.certificateTag.value = cert.tag || '';
  if (form.elements.certificateCategory) form.elements.certificateCategory.value = cert.category || 'database';
  form.elements.certificateDescription.value = cert.description || '';
  form.elements.certificateAssetPath.value = cert.assetPath || '';
  form.dataset.editCertificateId = id;
  const addBtn = document.querySelector('[data-add-certificate]');
  if (addBtn) addBtn.innerHTML = 'Update certificate <span>✓</span>';
  const banner = document.getElementById('certEditBanner');
  const titleSpan = document.getElementById('certEditingTitle');
  const cancelBottom = document.getElementById('cancelCertEditBtnBottom');
  if (banner) banner.style.display = 'flex';
  if (titleSpan) titleSpan.textContent = cert.title;
  if (cancelBottom) cancelBottom.style.display = 'inline-flex';
  form.elements.certificateTitle.focus();
  form.elements.certificateTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function editProject(id) {
  const project = data.projects.find(item => item.id === id);
  if (!project) return;
  const form = document.getElementById('editorForm');
  if (!form) return;
  form.elements.projectTitle.value = project.title || '';
  form.elements.projectCategory.value = project.category || '';
  if (form.elements.projectYear) form.elements.projectYear.value = project.year || '';
  if (form.elements.projectTechStack) form.elements.projectTechStack.value = project.stack || '';
  if (form.elements.projectLink) form.elements.projectLink.value = project.link && project.link !== '#' ? project.link : '';
  if (form.elements.projectHighlights) {
    form.elements.projectHighlights.value = Array.isArray(project.highlights) ? project.highlights.join('\n') : '';
  }
  form.elements.projectDescription.value = project.description || '';
  if (form.elements.projectAssetPaths) {
    form.elements.projectAssetPaths.value = (project.assetPaths || []).join('\n');
  }
  form.dataset.editProjectId = id;
  const addBtn = document.querySelector('[data-add-project]');
  if (addBtn) addBtn.innerHTML = 'Update project <span>✓</span>';
  const banner = document.getElementById('projectEditBanner');
  const titleSpan = document.getElementById('projectEditingTitle');
  const cancelBottom = document.getElementById('cancelProjectEditBtnBottom');
  if (banner) banner.style.display = 'flex';
  if (titleSpan) titleSpan.textContent = project.title;
  if (cancelBottom) cancelBottom.style.display = 'inline-flex';
  form.elements.projectTitle.focus();
  form.elements.projectTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function saveEditor(event) {
  event.preventDefault();
  const form = event.currentTarget;

  // Manual validation for required profile fields
  const nameVal = form.elements.name?.value.trim();
  const emailVal = form.elements.email?.value.trim();
  if (!nameVal) {
    showToast('⚠️ Nama Lengkap wajib diisi di tab Profile.');
    document.querySelector('.editor-tab[data-tab="profile"]')?.click();
    form.elements.name?.focus();
    return;
  }
  if (!emailVal) {
    showToast('⚠️ Alamat Email wajib diisi di tab Profile.');
    document.querySelector('.editor-tab[data-tab="profile"]')?.click();
    form.elements.email?.focus();
    return;
  }

  const photoFile = form.elements.profilePhoto?.files?.[0];

  data.profile = {
    ...data.profile,
    name: form.elements.name.value.trim() || defaultData.profile.name,
    role: form.elements.role.value.trim() || defaultData.profile.role,
    university: form.elements.university.value.trim() || defaultData.profile.university,
    gpa: form.elements.gpa.value.trim() || defaultData.profile.gpa,
    birthdate: form.elements.birthdate.value.trim() || defaultData.profile.birthdate,
    domicile: form.elements.domicile.value.trim() || defaultData.profile.domicile,
    location: form.elements.location.value.trim() || defaultData.profile.location,
    email: form.elements.email.value.trim() || defaultData.profile.email,
    phone: form.elements.phone.value.trim() || defaultData.profile.phone,
    instagram: form.elements.instagram.value.trim() || defaultData.profile.instagram,
    bio: form.elements.bio.value.trim() || defaultData.profile.bio,
    github: form.elements.github.value.trim(),
    linkedin: form.elements.linkedin.value.trim(),
    photoPath: form.elements.photoPath?.value.trim() || data.profile.photoPath || '',
    photo: photoFile ? await readFile(photoFile) : data.profile.photo || ''
  };

  data.contact = {
    availability: form.elements.availability.value.trim() || defaultData.contact.availability,
    cta: form.elements.contactCta.value.trim() || defaultData.contact.cta,
    message: form.elements.contactMessage.value.trim() || defaultData.contact.message
  };

  data.copy = { ...data.copy };
  Object.keys(data.copy).forEach(key => {
    if (form.elements[key]) data.copy[key] = form.elements[key].value.trim() || data.copy[key];
  });

  const allLabelKeys = [
    'navAbout', 'navSkills', 'navCertificates', 'navProjects', 'navContact',
    'sectionAbout', 'sectionSkills', 'sectionCertificates', 'sectionProjects', 'sectionContact',
    'aboutKicker', 'skillsKicker', 'certificatesKicker', 'projectsKicker', 'contactKicker',
    'projectOverlay', 'projectStack', 'projectVisit', 'projectCaseStudy'
  ];
  data.labels = { ...(data.labels || {}) };
  allLabelKeys.forEach(key => {
    if (form.elements[key]) {
      const val = form.elements[key].value.trim();
      data.labels[key] = val || defaultData.labels[key] || '';
    }
  });

  saveData();
  renderAll();
  closeEditor();
  showToast('Perubahan tersimpan. Tekan Export untuk mengunduh portfolio-data.js.');
}

function resetData() {
  if (!confirm('Kembalikan semua isi ke sample awal?')) return;
  localStorage.removeItem(STORAGE_KEY);
  data = loadData();
  saveData();
  renderAll();
  fillEditor();
  resetSkillForm();
  showToast('Sample data berhasil dikembalikan.');
}

function normalizeSlashes(str) {
  return typeof str === 'string' ? str.replace(/\\/g, '/') : str;
}

function exportDataFile() {
  const output = clone(data);

  // Strip ephemeral/local-only data before export
  output.profile.photo = '';
  output.profile.photoPath = normalizeSlashes(output.profile.photoPath || '');

  // Certificates: remove inline base64 fileData, normalize paths for GitHub Pages
  output.certificates = output.certificates.map(item => ({
    ...item,
    fileData: '',
    assetPath: normalizeSlashes(item.assetPath || '')
  }));

  // Projects: preserve all fields, normalize assetPaths for GitHub Pages (forward slashes)
  // Strip only local base64-uploaded images; keep assetPaths intact
  output.projects = output.projects.map(item => ({
    ...item,
    stack: item.stack || '',
    year: item.year || String(new Date().getFullYear()),
    category: item.category || 'Web Application',
    highlights: item.highlights || [],
    link: item.link || '#',
    assetPaths: (item.assetPaths || []).map(normalizeSlashes),
    images: (item.images || []).filter(image => !String(image).startsWith('data:'))
  }));

  const timestamp = new Date().toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const header = `// portfolio-data.js — Diekspor dari Admin CMS: ${timestamp}\n// CARA UPDATE: Ganti (replace) file ini di folder proyek, lalu refresh dashboard.\n`;
  const content = header + `window.PORTFOLIO_DATA = ${JSON.stringify(output, null, 2)};\n`;

  const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'portfolio-data.js';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
  showToast('✓ portfolio-data.js diunduh! Ganti file di folder proyek, lalu refresh dashboard.');
}

function removeEditorItem(event) {
  const button = event.target.closest('[data-remove-id]');
  if (!button) return;
  if (button.dataset.removeType === 'skill') {
    const category = data.skillCategories.find(item => item.id === button.dataset.removeCategory);
    if (category) category.items.splice(Number(button.dataset.removeId), 1);
    resetSkillForm();
  } else if (button.dataset.removeType === 'category') {
    if (data.skillCategories.length <= 1) {
      showToast('Minimal satu kategori harus tersedia.');
      return;
    }
    data.skillCategories = data.skillCategories.filter(item => item.id !== button.dataset.removeId);
    renderSkillCategoryOptions();
  } else {
    const key = button.dataset.removeType === 'certificate' ? 'certificates' : 'projects';
    data[key] = data[key].filter(item => item.id !== button.dataset.removeId);
  }
  saveData();
  renderAll();
  renderEditorItems();
  showToast('Item berhasil dihapus dari portfolio.');
}

/* ==========================================================================
   SCROLLSPY, GALLERY, CONTROLS & INIT
   ========================================================================== */

function observeReveals() {
  const items = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(item => observer.observe(item));
}

function setupScrollspy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });
}

function handleGallery(event) {
  const thumb = event.target.closest('.gallery-thumb-btn');
  const arrow = event.target.closest('.gallery-nav-btn');
  const zoomWrap = event.target.closest('.project-main-image-wrap');

  if (zoomWrap && !thumb && !arrow) {
    const src = zoomWrap.dataset.lightboxSrc;
    const caption = zoomWrap.dataset.lightboxCaption || '';
    if (src) openLightbox(src, caption);
    return;
  }

  if (!thumb && !arrow) return;

  const id = (thumb || arrow).dataset.projectId;
  const project = data.projects.find(item => item.id === id);
  if (!project) return;

  const total = projectImages(project).length;
  let index = thumb ?
    Number(thumb.dataset.imageIndex) :
    galleryIndexes[id] + (arrow.dataset.galleryAction === 'next' ? 1 : -1);

  galleryIndexes[id] = (index + total) % total;
  renderProjects();
}

function handleCertificateViewerControls(event) {
  const button = event.target.closest('[data-viewer-action]');
  if (!button) return;
  const viewer = button.closest('.certificate-pdf-viewer');
  if (!viewer) return;
  event.preventDefault();
  event.stopPropagation();
  moveCertificatePage(viewer, button.dataset.viewerAction === 'next' ? 1 : -1);
}

// Quick Message Composer Form Handlers
function setupQuickMessageForm() {
  const waBtn = document.getElementById('sendViaWhatsappBtn');
  const emailBtn = document.getElementById('sendViaEmailBtn');
  const form = document.getElementById('quickMessageForm');

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const name = document.getElementById('senderName')?.value.trim() || 'Pengunjung';
      const subject = document.getElementById('senderSubject')?.value.trim() || 'Peluang Kolaborasi';
      const message = document.getElementById('senderMessage')?.value.trim();

      if (!message) {
        showToast('Mohon tuliskan pesan terlebih dahulu.');
        return;
      }

      const text = `Halo Nevan, saya ${name}.\nPerihal: ${subject}\n\n${message}`;
      const cleanPhone = (data.profile.phone || '+6282125060232').replace(/[^+\d]/g, '').replace(/^\+/, '');
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const name = document.getElementById('senderName')?.value.trim() || '';
      const subject = document.getElementById('senderSubject')?.value.trim() || 'Peluang Kolaborasi';
      const message = document.getElementById('senderMessage')?.value.trim();

      if (!message) {
        showToast('Mohon tuliskan pesan terlebih dahulu.');
        return;
      }

      const body = `Halo Nevan,\n\n${message}\n\nSalam,\n${name}`;
      window.location.href = `mailto:${data.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(data.profile.email).then(() => {
        showToast(`Email ${data.profile.email} berhasil disalin ke clipboard!`);
      }).catch(() => {
        showToast(`Email: ${data.profile.email}`);
      });
    });
  }
}

// Lightbox Close Handlers
function setupLightboxListeners() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeLightbox();
    });
  }
}

// Skills Filter & Search Handlers
function setupSkillsFilter() {
  const filterTabs = document.getElementById('skillCategoryFilter');
  const searchInput = document.getElementById('skillSearchInput');

  if (filterTabs) {
    filterTabs.addEventListener('click', e => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      filterTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentSkillCategory = btn.dataset.filter || 'all';
      renderSkills();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentSkillSearch = e.target.value;
      renderSkills();
    });
  }
}

// Certificates Filter & Search Handlers
function setupCertificatesFilter() {
  const filterTabs = document.getElementById('certificateFilter');
  const searchInput = document.getElementById('certSearchInput');

  if (filterTabs) {
    filterTabs.addEventListener('click', e => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      filterTabs.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentCertCategory = btn.dataset.certFilter || 'all';
      renderCertificates();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      currentCertSearch = e.target.value;
      renderCertificates();
    });
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  observeReveals();
  setupScrollspy();
  setupSkillsFilter();
  setupCertificatesFilter();
  setupQuickMessageForm();
  setupLightboxListeners();

  // Admin routing check
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('edit') === '1' && document.getElementById('editorModal')) {
    openEditor(urlParams.get('tab') || 'profile');
  }

  document.querySelectorAll('[data-close-editor]').forEach(button =>
    button.addEventListener('click', closeEditor)
  );

  const editorModal = document.getElementById('editorModal');
  if (editorModal) {
    editorModal.addEventListener('click', event => {
      if (event.target.id === 'editorModal') closeEditor();
    });
  }

  document.querySelectorAll('.editor-tab').forEach(button =>
    button.addEventListener('click', () => switchTab(button.dataset.tab))
  );

  const form = document.getElementById('editorForm');
  if (form) form.addEventListener('submit', saveEditor);

  document.querySelector('[data-add-certificate]')?.addEventListener('click', addCertificate);
  document.querySelector('[data-add-project]')?.addEventListener('click', addProject);
  document.querySelector('[data-add-category]')?.addEventListener('click', addOrUpdateCategory);
  document.querySelector('[data-add-skill]')?.addEventListener('click', addOrUpdateSkill);

  // Cancel edit buttons
  document.getElementById('cancelProjectEditBtn')?.addEventListener('click', resetProjectForm);
  document.getElementById('cancelProjectEditBtnBottom')?.addEventListener('click', resetProjectForm);
  document.getElementById('cancelCertEditBtn')?.addEventListener('click', resetCertificateForm);
  document.getElementById('cancelCertEditBtnBottom')?.addEventListener('click', resetCertificateForm);

  document.getElementById('emojiPicker')?.addEventListener('click', event => {
    const button = event.target.closest('[data-emoji]');
    if (!button) return;
    document.getElementById('editorForm').elements.skillEmoji.value = button.dataset.emoji;
    document.querySelectorAll('.emoji-choice').forEach(choice =>
      choice.classList.toggle('is-selected', choice === button)
    );
  });

  document.getElementById('skillEditorItems')?.addEventListener('click', event => {
    const editSkillButton = event.target.closest('[data-edit-skill-category]');
    if (editSkillButton) {
      editSkill(editSkillButton.dataset.editSkillCategory, Number(editSkillButton.dataset.editSkillIndex));
      return;
    }
    const editCategoryButton = event.target.closest('[data-edit-category-id]');
    if (editCategoryButton) {
      editCategory(editCategoryButton.dataset.editCategoryId);
      return;
    }
    removeEditorItem(event);
  });

  document.getElementById('resetData')?.addEventListener('click', resetData);
  document.getElementById('exportData')?.addEventListener('click', exportDataFile);

  // Projects stack delegation
  document.getElementById('projectsStack')?.addEventListener('click', handleGallery);

  // Certificate Controls & Modals
  document.addEventListener('click', handleCertificateViewerControls);
  document.getElementById('certificatesGrid')?.addEventListener('click', event => {
    if (event.target.closest('.certificate-viewer-controls')) return;
    const card = event.target.closest('[data-certificate-id]');
    if (card) openCertificateModal(card.dataset.certificateId);
  });

  document.getElementById('certificatesGrid')?.addEventListener('keydown', event => {
    const card = event.target.closest('[data-certificate-id]');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openCertificateModal(card.dataset.certificateId);
    }
  });

  // Photo & file upload listeners in editor
  document.querySelectorAll('[name="certificateFile"], [name="projectImages"], [name="profilePhoto"]').forEach(input => {
    input.addEventListener('change', async () => {
      if (input.name === 'profilePhoto') {
        const file = input.files[0];
        const preview = document.getElementById('profilePhotoPreview');
        const name = document.getElementById('profilePhotoName');
        if (file && preview) {
          preview.style.backgroundImage = `url('${await readFile(file)}')`;
          preview.classList.add('has-photo');
          if (name) name.textContent = file.name;
        }
        return;
      }
      const target = input.name === 'certificateFile' ?
        document.getElementById('certificateFileName') :
        document.getElementById('projectFileName');
      if (target) {
        target.textContent = input.files.length ?
          [...input.files].map(file => file.name).join(', ') :
          target.dataset.default || 'Belum ada file dipilih.';
      }
    });
  });

  document.getElementById('certificateEditorItems')?.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-type="certificate"]');
    if (edit) {
      editCertificate(edit.dataset.editId);
      return;
    }
    removeEditorItem(event);
  });

  document.getElementById('projectEditorItems')?.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit-type="project"]');
    if (edit) {
      editProject(edit.dataset.editId);
      return;
    }
    removeEditorItem(event);
  });

  // Mobile menu toggle
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('mainNav')?.classList.toggle('is-open');
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mainNav')?.classList.remove('is-open');
    });
  });

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Cursor glow
  window.addEventListener('mousemove', event => {
    const glow = document.getElementById('cursorGlow');
    if (glow) {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }
  });

  // Escape key closes modals
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCertificateModal();
      closeLightbox();
    }
  });

  // Admin workspace page mode
  if (document.body.classList.contains('admin-page')) {
    switchTab(urlParams.get('tab') || 'profile');
    fillEditor();
  }
});
