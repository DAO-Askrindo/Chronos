# UI/UX Design Document
**Project Name:** Chronos  
**Document Version:** 1.0  

---

## 1. Design Philosophy
Chronos dirancang untuk penggunaan intensitas tinggi oleh Enterprise (B2B). Oleh karena itu, prinsip utama UX-nya adalah **"Information Density with Clarity"**—seperti Jira atau Asana, pengguna bisa melihat banyak data sekaligus tanpa merasa kewalahan. 

Estetika visual (Aesthetics) menggunakan pendekatan **Modern Clean & Minimalist** dengan sentuhan *Subtle Glassmorphism* pada elemen overlay (Modal, Dropdown).

## 2. Design System & Tech Stack
| Kategori | Keputusan | Alasan |
|----------|-----------|--------|
| **CSS Framework**| Tailwind CSS | Sangat fleksibel, build size kecil, dan mudah di-maintain. |
| **UI Components**| Shadcn/UI (Radix UI) | Accessible (a11y), bisa di-copy-paste dan di-custom style Tailwind-nya tanpa over-riding (seperti MUI). |
| **Icons** | Lucide React | Clean, konsisten, stroke-based modern icons. |
| **Charts** | Recharts atau Tremor | Interaktif untuk Dashboard dan Portfolio tracking. |
| **Calendar** | FullCalendar.io | Paling matang untuk rendering agenda kompleks. |

## 3. Theming & Colors
Mendukung 2 mode utama (**Light** & **Dark**). Setiap Tenant dapat memiliki fitur "White-labeling" di mana mereka bisa mengatur Primary Color sesuai warna *brand* mereka.

**Default Color Palette:**
- **Primary:** `Indigo-600` (`#4F46E5`) -> Aksen interaktif, tombol utama.
- **Secondary:** `Slate-800` (`#1E293B`) -> Teks dan elemen struktur.
- **Background (Light):** `Gray-50` (`#F9FAFB`)
- **Background (Dark):** `Zinc-950` (`#09090B`)
- **Status Colors:**
  - Success/Berdampak: `Emerald-500`
  - Warning/Risiko: `Amber-500`
  - Danger/Blocker: `Red-500`
  - Info/In Progress: `Blue-500`

## 4. Core Layout Structure

### 4.1. Global App Layout (App Shell)
- **Top Navbar:** 
  - Tenant Switcher (Dropdown "PT Askrindo" -> "Askrindo Syariah").
  - Global Search (CMD+K / CTRL+K untuk mencari Task, Project, atau User dengan cepat).
  - Notifikasi Center & Profile Avatar.
- **Left Sidebar (Collapsible):**
  - **Home:** Dashboard personal (My Tasks, My Calendar).
  - **Portfolios:** Navigasi agregat project.
  - **Projects:** List project favorit atau yang sedang aktif.
  - **Teams:** Direktori user dan struktur organisasi.
  - **Settings:** Khusus Admin.

### 4.2. View Spesifik

#### A. Project Dashboard / Board (Kanban)
- *Header:* Nama Project, Filter (Assignee, Label), tombol "Create Ticket".
- *Board View:* Kolom To Do, In Progress, in Review, Done. Mendukung *Drag & Drop*.
- *List View:* Tampilan tabular ringkas layaknya spreadsheet untuk mengedit massal.
- *Gantt View:* Tampilan interaktif timeline (diambil konsep perbaikan Layout dari ProSync).

#### B. Unified Calendar View
- Tampilan bulanan/mingguan/harian.
- Menggabungkan elemen dari tabel `meetings` (undangan rapat) dan dari tabel `tasks` (deadline).
- Warna dibedakan: **Biru** = Meeting, **Ungu** = Task Deadline.
- Klik event membuka drawer di sebelah kanan (Side Drawer) tanpa memindahkan halaman.

## 5. Micro-Interactions (WOW Factor)
- **Fluid Routing:** Transisi antar halaman mulus karena konsep SPA.
- **Optimistic UI:** Saat drag task ke kolom "Done", UI langsung terupdate sebelum server merespon `200 OK`. Jika gagal, baru di-revert. Memberikan kesan sangat *snappy*.
- **Command Palette:** Tekan `CTRL+K` kapan saja untuk action cepat (Create Task, Create Meeting, Go To Project).
