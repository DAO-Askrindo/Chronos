# User Story & Backlog
**Project Name:** Chronos  
**Document Version:** 1.0  

---

## EPIC 1: Multi-tenant & Foundation (MVP)

**Feature:** Autentikasi & Manajemen Workspace
- **US 1.01:** *Sebagai SuperAdmin, saya ingin membuat Tenant (Workspace) baru agar anak perusahaan/divisi baru bisa menggunakan sistem secara terisolasi.*
- **US 1.02:** *Sebagai Pengguna (User), saya ingin login menggunakan email dan password agar dapat mengakses Tenant yang ditugaskan kepada saya.*
- **US 1.03:** *Sebagai Pengguna dengan akses ke beberapa Tenant, saya ingin bisa berpindah Workspace dari Top Navbar dengan mulus.*

## EPIC 2: Portfolio & Project Setup (MVP)

**Feature:** Pembuatan Portfolio dan Proyek
- **US 2.01:** *Sebagai TenantAdmin, saya ingin membuat Portfolio agar saya dapat mengelompokkan proyek strategis yang saling berkaitan.*
- **US 2.02:** *Sebagai Manager, saya ingin membuat Proyek di dalam sebuah Portfolio agar tim saya dapat mulai mengeksekusi dan berkolaborasi.*
- **US 2.03:** *Sebagai ProjectAdmin, saya ingin mengundang Pengguna ke dalam Proyek saya dan memberikan peran (Member, Viewer) agar mereka bisa mengakses tugas (tasks).*

## EPIC 3: Task Management Engine (MVP)

**Feature:** Pembuatan Tugas, Pelacakan (Tracking), dan Kanban Boards
- **US 3.01:** *Sebagai Anggota Tim (Member), saya ingin membuat Tugas (Tiket) dengan Judul, Deskripsi, Penanggung Jawab (Assignee), dan Tenggat Waktu (Due Date).*
- **US 3.02:** *Sebagai Manager, saya ingin melihat seluruh tugas dalam Kanban Board agar saya bisa melacak progress sprint secara visual.*
- **US 3.03:** *Sebagai Pengguna, saya bisa menggeser (drag-and-drop) kartu Tugas dari "To Do" ke "In Progress" untuk memperbarui statusnya secara instan (Real-time update).*
- **US 3.04:** *Sebagai Pengguna, saya ingin memberikan komentar menggunakan Rich Text Editor dan me-mention (@) rekan tim agar kami bisa berdiskusi sesuai konteks pekerjaannya.*
- **US 3.05:** *Sebagai ProjectAdmin, saya ingin mengubah definisi nama kolom (Custom Status) pada Kanban Board agar sesuai dengan alur kerja spesifik divisi saya.*
- **US 3.06:** *Sebagai Auditor/Admin, saya ingin melihat Audit Trail (Riwayat Aktivitas) pada sebuah Tugas untuk melacak siapa yang melakukan perubahan status dan kapan.*
- **US 3.07:** *Sebagai Pengguna, saya ingin mentautkan dependensi (blocks/relates to) antar Tugas agar urutan kerja menjadi jelas.*

## EPIC 4: Smart Calendars & Meetings (MVP)

**Feature:** Penjadwalan Terintegrasi (Evolusi DailySync)
- **US 4.01:** *Sebagai Pengguna, saya ingin menjadwalkan Meeting dan mengundang Pengguna lain dari Tenant saya.*
- **US 4.02:** *Sebagai pihak yang diundang, saya ingin menerima notifikasi In-App dan bisa merespon (Accept/Decline/Tentative) undangan meeting.*
- **US 4.03:** *Sebagai ProjectManager, saya ingin menautkan (link) Meeting yang baru dibuat ke Tugas/Proyek spesifik agar agenda dan notulen rapat lebih terkonsolidasi.*
- **US 4.04:** *Sebagai Pengguna, saya menginginkan Kalender Pusat (Unified Calendar View) yang menampilkan jadwal Meeting dan Tenggat Waktu (Due Date) Tugas saya dalam satu layar.*

## EPIC 5: Reporting & Analytics (Phase 2)

**Feature:** Dashboard & Gantt Charts
- **US 5.01:** *Sebagai Eksekutif (C-Level), saya ingin melihat Dashboard yang menampilkan persentase penyelesaian agregat (gabungan) dari seluruh Portfolio.*
- **US 5.02:** *Sebagai ProjectManager, saya menginginkan Gantt Chart interaktif yang dibuat berdasarkan Tanggal Mulai dan Tanggal Selesai sebuah Tugas untuk memvisualisasikan dependensi antar tugas.*
- **US 5.03:** *Sebagai Admin, saya ingin mengekspor Laporan Progress Proyek sebagai file PDF atau Excel.*
