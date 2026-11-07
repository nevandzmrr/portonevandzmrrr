# Alur publikasi GitHub Pages

## Folder aset

Simpan file sesuai jenisnya, lalu gunakan path relatif yang sama di Admin:

- Foto profil: `assets/profile/nama-foto.jpg`
- Sertifikat PDF: `assets/certificate/nama-sertifikat.pdf`
- Gambar project: `assets/projects/nama-project-01.png`

## Mengubah isi portfolio

1. Buka `editor.html` pada browser.
2. Ubah profile, skills, certificate, project, contact, dan label halaman.
3. Untuk file yang akan tampil di GitHub, salin file asli ke folder `assets/...` di repository dan isi path relatifnya pada form Admin.
4. Klik `Save changes` untuk menyimpan draft di browser.
5. Klik `Export portfolio-data.js`.
6. Ganti file `portfolio-data.js` di repository dengan file hasil export.
7. Commit dan push `portfolio-data.js` beserta file asetnya.

GitHub Pages bersifat static, sehingga browser tidak dapat menulis file baru langsung ke repository. Karena itu tombol upload di Admin digunakan untuk preview lokal, sedangkan file final perlu ditempatkan di folder repository dan di-commit. Setelah push, halaman publik akan membaca `portfolio-data.js` dan aset dari folder `assets`.
