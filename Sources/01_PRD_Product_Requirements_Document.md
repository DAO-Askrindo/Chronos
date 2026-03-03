# Product Requirements Document (PRD)
**Project Name:** Chronos  
**Document Version:** 1.0  
**Date:** March 2026  

---

## 1. Executive Summary
**Chronos** adalah platform Enterprise Workspace modern yang menggabungkan kapabilitas *Project & Portfolio Management* (terinspirasi dari OpenProject & Jira) dengan *Collaboration & Meeting Management*. Aplikasi ini dirancang dari awal untuk mendukung arsitektur **Multi-tenant** dan **Multi-portfolio**, memungkinkan skalabilitas tinggi untuk melayani berbagai anak perusahaan, divisi, atau klien eksternal dalam satu instansi platform yang aman.

## 2. Product Vision & Target Audience
**Vision:** Menjadi *single source of truth* untuk seluruh aktivitas operasional perusahaan—mulai dari perencanaan strategis (RJPP), eksekusi proyek (Task Management), hingga kolaborasi sinkronus (Meetings & Calendars).

**Target Audience:**
1. **C-Level / Executives:** Membutuhkan *bird's-eye view* (Portfolio Dashboard) terhadap kesehatan dan progress strategis perusahaan.
2. **Project Managers (PM):** Membutuhkan alat tracking harian, Gantt chart, alokasi resource, dan milestone tracking.
3. **Team Members / Staff:** Membutuhkan kejelasan mengenai task (To-Do list), kalender harian, dan fitur RSVP meeting yang terintegrasi.
4. **System Administrators:** Membutuhkan panel untuk mengelola *Tenants*, *Workspaces*, dan *Role-Based Access Control* (RBAC) secara tersentralisasi.

## 3. Core Features & Requirements

### 1.2. Visi
Menyatukan pemantauan RJPP strategis dan penjadwalan tugas harian dalam satu platform berbasis *Fully-Parameterized Engine*, memungkinkan anak perusahaan di ekosistem PT Askrindo untuk mengelola siklus hidup proyek, berkolaborasi dalam Rapat *(Meetings)* secara kontekstual, dengan fleksibilitas membentuk *workflow* dan *data points* mandiri.

## 2. Target Audience & Roles
Aplikasi ini ditujukan untuk digunakan secara berjenjang di PT Askrindo:
1. **Super Admin / Holding Admin:** Mengelola pembuatan tenant baru (Subsidiaries).
2. **C-Level & Executive (Tenant Admin):** Papan kontrol eksekutif, *Portfolio overview*, melihat laporan agregat dan membuat custom workflows.
  - *Project Admin:* Mengelola board, sprint, dan member di dalam project.
  - *Guest / Client:* Akses eksternal terbatas hanya pada tiket/proyek yang di-assign tanpa mengekspos data organisasi (Vendor Collaboration).
  - **Dynamic Role-Based Access Control (RBAC):** Pembuatan peran dan konfigurasi batasan otorisasi diserahkan sepenuhnya ke Tenant Admin melalui User Interface (Fully Parameterizable).

### 3.2. Project & Portfolio Management (PPM)
- **Portfolio Aggregation:** Dashboard untuk memonitor progress dari sekumpulan project secara agregat. Termasuk ROI, budget vs actual, dan timeline agregat.
- **Task Management (Kanban & List):** Fitur tracking task mirip Jira. Mendukung **Dynamic Workflows** (Custom status column) dan **Custom Fields** (tanpa batasan melalui implementasi tipe data NoSQL JSONB).
- **Reporting & Timeline:** Gantt Chart interaktif lintas-project untuk mengidentifikasi bottleneck dan dependensi antar *Milestones*.
- **Progress Auto-calculation:** Mengadopsi fitur dari ProSync, di mana progress Project (0-100%) dapat dihitung otomatis berdasarkan bobot/selesainya Sub-tasks.
- **Activity Audit Trail:** Riwayat (history) mendetail tentang siapa yang mengubah status/data tiket apa dan kapan, penting untuk audit B2B.

### 3.3. Collaboration & Calendar Integration (Smart Meetings)
- **Unified Master Calendar:** Kalender terpusat yang menggabungkan:
  - Deadline Tasks / Project Milestones
  - Jadwal Meeting harian
- **Contextual Meetings:** Setiap undangan meeting dapat ditautkan (linked) ke spesifik Project atau Task. Notes dan Notulen dari meeting tersebut akan tersimpan sebagai riwayat (history) pada tiket Task terkait.
- **RSVP Meeting:** Mengadopsi fitur dari DailySync untuk konfirmasi kehadiran peserta (Accept/Decline/Tentative) pada undangan meeting.

### 3.4. Notifications & Reminders
- Engine notifikasi multi-channel (In-app, Email) untuk:
  - H-1 Milestone Deadline
  - Panggilan Meeting (15 menit sebelum mulai)
  - @mentions di komentar Task.

## 4. Non-Functional Requirements (NFR)
1. **Performance:** Harus sanggup menangani concurrent users dalam jumlah besar (Enterprise scale) tanpa degradasi performa di halaman rendering Gantt Chart.
2. **Security & Privacy:** Wajib menerapkan *Row-Level Security* (RLS) di level database untuk mencegah data membocorkan (leakage) lintas tenant. Enkripsi password menggunakan bcrypt/Argon2.
3. **Usability / UI/UX:** Mengikuti prinsip "Clean & Premium Aesthetics" (TailwindCSS/Modern UI), responsive baik di Desktop maupun Tablet.
4. **Availability:** Arsitektur harus di-deploy dengan konsep *High Availability* (HA) menggunakan Containerization (Docker/Kubernetes).

## 5. Success Metrics (KPIs)
- **Adopsi:** 100% migrasi dari sistem lama (ProSync & DailySync) dalam 3 bulan.
- **Engagement:** DAU (Daily Active Users) rata-rata > 70% dari total karyawan yang terdaftar.
- **Efisiensi:** Mengurangi waktu konsolidasi laporan manajerial dari hitungan hari menjadi real-time dashboard.
