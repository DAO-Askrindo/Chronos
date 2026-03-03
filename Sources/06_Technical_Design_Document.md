# Technical Design Document (TDD)
**Project Name:** Chronos  
**Document Version:** 1.0  
**Date:** March 2026  

---

## 1. System Architecture Overview
**Chronos** menggunakan arsitektur modern berbasis **Monolithic terstruktur (Modular Monolith)** atau **Microservices-ready** untuk memudahkan skalabilitas. Mengingat sifat interkoneksi yang erat antara Project Management dan Collaboration, arsitektur *Modular Monolith* di tahap awal adalah yang paling ideal.

### High-Level Components
1. **Client Tier:** Single Page Application (SPA) berbasis React.js.
2. **API Gateway / App Tier:** Node.js (Express atau NestJS) REST/GraphQL API.
3. **Data Tier:** Relational Database (PostgreSQL) + Caching Layer (Redis).
4. **Background Jobs:** Worker process untuk notifikasi, recurring meetings, dan scheduled reports.

---

## 2. Multi-tenant Architecture Strategy
Mengingat ini adalah platform Enterprise yang melayani banyak organisasi (divisi/anak perusahaan/klien), kita memiliki 3 opsi arsitektur database:

1. *Database per Tenant* (Paling aman, paling mahal)
2. *Schema per Tenant* (Aman, middle ground)
3. **Shared Database, Shared Schema (Row-Level Security)** -> **PILIHAN UTAMA**

**Alasan Pemilihan Shared Database (menggunakan kolom `tenant_id`):**
- Biaya operasional database lebih murah.
- Sangat mudah untuk melakukan "Cross-Tenant Analytics" jika di masa depan Holding Company ingin melihat summary agregat dari seluruh anak perusahaannya.
- Keamanan dijamin secara matematis di level Database melalui fitur **PostgreSQL Row-Level Security (RLS)**. Sekalipun ada bug di level kode Node.js, developer tidak bisa tidak sengaja meng-query data dari tenant lain tanpa context RLS yang benar.

---

## 3. Multi-Tenant & Parameterization Strategy

### 3.1. Database Architecture: Shared Database, Shared Schema
Pendekatan yang paling hemat biaya namun scalable. Semua tenant berada di satu database (PostgreSQL) dan berbagi skema tabel yang sama. Isolasi data dikelola sepenuhnya oleh fitur **Row-Level Security (RLS)** PostgreSQL.
Setiap tabel *mutative* WAJIB memiliki kolom `tenant_id`.

### 3.2. Fully Parameterized Architecture
Chronos dirancang sebagai sistem *Data-Driven Engine*:
- **Dynamic Database Constraints:** Hardcoded Enums seperti "To Do/Done" atau "High/Low" dihilangkan. Front-end dan Back-end mendasarkan *dropdown* list dan workflow validation pada nilai yang disimpan di tabel `system_parameters` dan `workflow_states`.
- **Hybrid Relational-JSON Storage:** Setiap tiket (Task) memiliki satu kolom `custom_data (JSONB)` sehingga Tenant bebas menambahkan atribut tanpa perlu `ALTER TABLE` DDL yang mahal/berbahaya di Production.
- **Dynamic RBAC Pivot:** Sistem keamanan berdasarkan granularitas aksi (misal: "task:delete_comment") via tabel `role_permissions`, bukan hardcoded Role Strings.

## 4. Technology Stack

| Layer | Technology | Alasan Pemilihan |
|-------|------------|------------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Zustand | Cepat, modern, styling premium & dinamis, state management yang ringan. |
| **Backend** | Node.js (Express), Prisma ORM / TypeORM | Ekosistem JavaScript raksasa, asynchronous I/O sanggup menangani banyak koneksi. ORM wajib untuk type-safety. |
| **Database** | PostgreSQL 16+ | Dukungan RLS, JSONB fields untuk custom properties, ACID compliance yang kuat. |
| **Background Processing**| Redis + BullMQ | Menangani pengiriman email, reminder kalender, dan report generation tanpa memblokir API thread. |
| **File Storage** | AWS S3 / MinIO | Untuk attachment pada Task dan Meeting. Harus terisolasi via permission. |

---

## 4. Key Structural Models

### 4.1. Hierarchy Models
- `Tenant`: Perusahaan/Kumpulan Tertinggi.
- `User`: Identitas login (Bisa tergabung di lebih dari 1 Tenant jika diizinkan).
- `Portfolio`: Wadah strategis untuk mengelompokkan project.
- `Project`: Konteks ruang kerja. Punya role (Admin, Member, Viewer).

### 4.2. Work Models
- `Task / Issue`: Unit pekerjaan. Memiliki status, assignee, reporter, due_date, story_points. Mendukung *Optimistic Locking* (versioning) untuk menghindari konflik edit.
- `TaskLink`: Relasi dependensi antar task (blocks, relates_to).
- `TaskComment`: Riwayat komunikasi pada task (Rich text format).
- `CustomField`: Definisi field dinamis per Project.
- `ActivityLog`: Audit trail immutable untuk semua perubahan state.

### 4.3. Calendar Models (Evolved from DailySync)
- `Meeting`: Jadwal acara, memegang relasi ke `Project` atau `Task` opsional.
- `MeetingAttendee`: Participant dan rsvp_status.
- `Room`, `RoomBooking`: Manajemen fasilitas fisik.

---

## 5. Security Architecture
1. **Authentication:** Stateless JWT terenkripsi. Payload JWT akan memuat `user_id` dan *active* `tenant_id`.
2. **Authorization (RBAC):** 
   - Konsep Role matrix: `(User + Project) -> Role` dan `(User + Tenant) -> Role`.
   - Backend memvalidasi action berdasarkan permission (contoh: `can_edit_task`, `can_invite_meeting`).
3. **Data Isolation (RLS):** 
   - Di setiap request API, middleware akan mengatur session variable di PostgreSQL: `SET LOCAL chronos.current_tenant_id = 'xxx'`.
   - PostgreSQL otomatis mem-filter row `WHERE tenant_id = 'xxx'` di level kernel mesin DB.

---

## 6. Deployment & Scaling Strategy
- **Containerization:** Dockerized frontend dan backend.
- **Orchestration:** Kubernetes atau Docker Compose (tergantung skala infratruktur internal PT Askrindo).
- **CI/CD:** GitHub Actions atau GitLab CI untuk automated testing dan linting sebelum merge.
- **Scaling:** Backend direplikasi secara horisontal (Stateless). Database menggunakan Primary-Replica jika pembacaan (Read) sangat tinggi untuk pembuatan Reports/Dashboard.

## 7. Real-time & API Best Practices
- **WebSockets / Server-Sent Events (SSE):** Digunakan untuk sinkronisasi Kanban Board secara *real-time* di tab seluruh anggota tim.
- **Cursor-based Pagination:** Wajib diimplementasikan pada *list endpoint* (`GET /tasks`) untuk performa tinggi ketimbang *offset pagination*.
