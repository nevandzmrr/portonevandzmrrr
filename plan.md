# Plan — Portofolio Kreatif

## Arah produk
Website portofolio mahasiswa IT dengan dua mode: tampilan publik untuk recruiter/kolaborator dan panel editor ringan untuk mengubah isi melalui browser. Versi awal memakai HTML, CSS, JavaScript, dan localStorage agar dapat langsung dicoba tanpa backend.

## Desain

### Kandidat gaya
- Futuristic Systems Dashboard — probabilitas 0.07
- Neo-Brutalist Campus Lab — probabilitas 0.04
- Quiet Digital Atelier — probabilitas 0.02

### Gaya terpilih: Futuristic Systems Dashboard
**Design Movement:** editorial digital yang memadukan interface sistem, visualisasi data orbit, dan komposisi majalah modern.

**Core Principles:** (1) informasi mudah dipindai, (2) aksen warna dipakai sebagai sinyal interaksi, (3) konten personal tetap menjadi fokus, (4) animasi terasa responsif namun tidak mengganggu.

**Color Philosophy:** navy biru gelap memberi rasa fokus dan kedalaman; lime menjadi warna kepemilikan untuk status, CTA, dan highlight; cyan elektrik memperkuat kesan data/teknologi; violet memberi lapisan spektral untuk elemen sistem.

**Layout Paradigm:** halaman menggunakan kolom editorial asimetris dengan rail nomor/metadata di desktop, lalu berubah menjadi alur satu kolom di mobile.

**Signature Elements:** nomor section bergaya monospace, garis grid/scanline halus, ring orbit dengan pusat “IT”, dan chip data yang melayang.

**Interaction Philosophy:** setiap aksi terasa seperti mengoperasikan sistem kreatif—editor dibuka dari tombol command, panel memiliki feedback hover yang jelas, dan form memberi respons singkat.

**Animation:** reveal berbasis IntersectionObserver, orbit berputar, chip data mengambang, shimmer pada tombol utama, hover lift 3–6px, transisi galeri proyek yang lembut, dan background glow bergerak lambat.

**Typography System:** Space Grotesk untuk heading dan Inter untuk body; IBM Plex Mono untuk label, metadata, dan aksen sistem.

**Brand Essence:** mahasiswa IT yang menerjemahkan ide menjadi produk digital yang rapi, cepat, dan manusiawi — eksploratif, teliti, adaptif.

**Brand Voice:** ringkas, percaya diri, dan personal. Contoh: “Saya membangun antarmuka yang membuat kompleksitas terasa sederhana.” / “Mari ubah ide berikutnya menjadi sesuatu yang bisa dipakai.”

**Wordmark & Logo:** monogram `<>` sebagai simbol pembuka kode, dipasangkan dengan nama yang dapat diedit.

**Signature Brand Color:** signal lime `#b7ff63`, dipasangkan dengan electric cyan `#46e6ff`.

## Struktur proyek
- `index.html`: halaman portfolio publik tanpa markup popup editor, termasuk hero foto profil dan biodata akademik.
- `editor.html`: workspace admin penuh yang terpisah dari portfolio publik.
- `styles.css`: sistem visual responsive, kartu, animasi, dan state editor.
- `skill-overrides.css`: style CRUD Skills, picker emoji, dan nama header agar tidak terpotong.
- `profile-overrides.css`: frame foto publik, biodata facts, dan upload preview.
- `profile-facts-overrides.css`: floating biodata cards dekat foto dengan connector line dan animasi.
- `certificate-overrides.css`: hover state kartu certificate dan popup detail responsive.
- `skill-overrides.css`: CRUD category/module builder admin dan tech-console category panels publik dengan glow, accordion, hover, dan staggered animation.
- `contact-overrides.css`: empat contact cards berlogo dengan channel color dan responsive animation.
- `admin.css`: layout sidebar/workspace untuk halaman admin penuh.
- `script.js`: state default/localStorage, render section, upload PDF/gambar, galeri, modal, dan form.
- `assets/certificate/`, `assets/projects/`: asset publik yang di-commit ke repository GitHub dan dirujuk dari admin menggunakan path relatif.
- `manus-routes.json`: deklarasi route root untuk Preview.
- `plan.md`, `TODO.md`: dokumentasi implementasi.
