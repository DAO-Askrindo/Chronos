# Business Requirements Document (BRD)
**Project Name:** Chronos (Integrated Enterprise Workspace)
**Document Version:** 1.0  
**Date:** March 2026  
**Sponsor:** Divisi Transformasi Perusahaan - PT Askrindo

---

## 1. Executive Summary
**Chronos** adalah inisiatif strategis untuk menggabungkan fungsionalitas monitoring program kerja (saat ini *ProSync*) dengan manajemen kalender dan penjadwalan rapat (saat ini *DailySync*). Proyek ini bertujuan untuk menciptakan satu platform *Enterprise Workspace* yang bersifat *Multi-tenant* dan *Multi-portfolio*, sehingga dapat digunakan secara terpusat oleh seluruh divisi, unit bisnis, dan anak perusahaan di ekosistem PT Askrindo, menghemat biaya lisensi software eksternal, dan mendorong budaya kerja yang kolaboratif.

## 2. Business Problem (Latar Belakang)
Saat ini perusahaan menghadapi beberapa tantangan operasional:
1. **Silos Data dan Aplikasi:** Pemantauan Rencana Jangka Panjang Perusahaan (RJPP) dilakukan terpisah dari pelaksanaan harian. *Meeting* pembahasan program kerja seringkali tidak terhubung secara digital dengan tiket tugasnya (Task/Ticket).
2. **Duplikasi Upaya & Infrastruktur:** Mengelola dan me-*maintain* dua aplikasi yang berbeda (ProSync dan DailySync) membutuhkan biaya *server*, pemeliharaan kode (maintenance), dan resiko inkonsistensi data pengguna (User Management).
3. **Keterbatasan Skalabilitas:** ProSync saat ini hanya bersifat "Frontend-only" dengan demo-data yang belum siap secara *production* untuk seluruh perusahaan.
4. **Tidak Mendukung Multi-tenant:** Aplikasi lama sulit jika ingin digunakan oleh Anak Perusahaan secara terpisah namun tetap terpantau oleh Holding (Pusat) karena datanya akan bercampur.

## 3. Business Goals & Objectives
Tujuan utama proyek **Chronos** adalah:
1. **Efisiensi Sistem (Single Point of Truth):** Menyatukan alur kerja monitoring strategis (RJPP) dan penjadwalan rapat dalam satu aplikasi.
2. **Kesiapan Skala Enterprise:** Mengadopsi arsitektur *Multi-tenant* (PostgreSQL dengan RLS) agar platform ini bisa digunakan oleh entitas bisnis lain di bawah naungan perusahaan tanpa biaya implementasi tambahan.
3. **Standardisasi Reporting:** Memfasilitasi pimpinan (*Eksekutif/C-Level*) dengan Dashboard lintas portofolio untuk visibilitas 360 derajat atas anggaran dan penyelesaian target.
4. **Pengurangan Opex:** Mengurangi biaya lisensi *Groupware* atau sistem manajemen proyek komersial pihak ketiga.

## 4. Project Scope (Ruang Lingkup)

### In-Scope (Dalam Lingkup)
- **Multi-Tenant Administration:** Pembuatan *workspace* terisolasi untuk tiap divis/anak perusahaan.
- **Portfolio & Project Management (PPM):** Fitur pembuatan project, backlog (task/ticket), Kanban board, dan Gantt Chart.
- **Collaboration & Meeting Management:** Kalender gabungan, RSVP meeting, dan link meeting ke spesifik tiket/proyek.
- **Resource Booking:** Pemesanan Ruang Rapat (berasal dari DailySync).
- **Executive Dashboard:** Ringkasan progres inisiatif.

### Out-of-Scope (Di Luar Lingkup Saat Ini - Phase 2)
- Integrasi *Payroll* atau Sistem HR internal.
- Aplikasi *Mobile App Native* (Akan menggunakan pendekatan *Responsive Web App* terlebih dahulu).
- Modul *Request ATK & Kendaraan* (Fitur legacy DailySync ini akan dihentikan atau dibuatkan microservice terpisah nantinya jika prioritas bisnis bergeser).

## 5. Key Stakeholders
| Peran (Role) | Entitas / Divisi | Tanggung Jawab dalam Proyek |
|--------------|------------------|-----------------------------|
| **Project Sponsor** | Divisi Transformasi Perusahaan | Penyedia anggaran dan penentu arah bisnis *(Business Owner)*. |
| **Product Owner** | Tim PMO (Project Mgt. Office) | Mendefinisikan *requirements*, prioritas *backlog*, dan *acceptance test*. |
| **End Users (Primary)** | PM / PIC Program / Staff | Pengguna harian untuk tracking tiket dan kalender. |
| **End Users (Secondary)**| C-Level / Kadiv | Pembaca *report* dan pengambil keputusan strategis. |
| **Development Team** | Tim IT Internal / Vendor | Bertanggung jawab penuh atas arsitektur (Node.js/React), *coding*, *deployment*, dan *maintenance*. |

## 6. Business Assumptions & Dependencies
- **Asumsi:** Semua karyawan sudah terbiasa menggunakan aplikasi *booking* dan *monitoring* dasar, sehingga transisi ke platform Chronos hanya membutuhkan minimal sesi *training*.
- **Ketergantungan (Dependency):** Keandalan Single Sign-On (SSO) internal jika diimplementasikan, atau infrastruktur *Server/Cloud* yang disiapkan oleh Divisi TI Askrindo.

## 7. Cost / Benefit Analysis (High-Level)
- **Biaya Utama:** Biaya rekayasa perangkat lunak (Development time) untuk migrasi dari arsitektur lama ke `Chronos`.
- **Keuntungan Berwujud (Tangible):** Penghematan biaya *server hosting* (dari 2 server menjadi 1 kluster terpusat).
- **Keuntungan Tak Berwujud (Intangible):** Rapat yang lebih produktif karena terikat konteks dengan *Task*, transparansi eksekusi RJPP, dan kecepatan pelaporan.

## 8. Approval Criteria
BRD ini harus ditinjau dan disetujui oleh:
- [ ] VP Transformasi Perusahaan
- [ ] VP Teknologi Informasi (TI)
- [ ] Lead Developer / Systems Architect
