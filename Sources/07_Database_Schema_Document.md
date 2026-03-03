# Database Schema Document
**Project Name:** Chronos  
**Document Version:** 1.0  
**Target RDBMS:** PostgreSQL 16+

---

## 1. Schema Overview

Arsitektur database Chronos menggunakan pola **Shared Database, Shared Schema** dengan penambahan kolom `tenant_id` wajib pada setiap tabel referensial dan transaksional. Sistem akan dilindungi menggunakan PostgreSQL- **Row-Level Security (RLS)**: Semua tabel operasional wajib memiliki kolom `tenant_id` untuk isolasi data di tingkat database.
- **Fully Parameterized Engine**: Hampir semua konfigurasi bisnis (seperti Status, Role, Tipe Tiket, dan Prioritas) disimpan di database sebagai tabel *Lookup/Master* alih-alih di-*hardcode* di *source code*, memberikan fleksibilitas tanpa batas bagi Tenant Admin.
- Semua nama tabel menggunakan huruf kecil plural (snake_case).

## 2. Table Definitions

### 2.0. Core Parameterization & Lookup Tables (Master Data)
Bagian terpenting dari arsitektur *parameterized*. Memberikan kemampuan *customization* bagi Tenant tanpa deploy ulang.

**Table: `system_parameters`** (Dropdown Values, Priorities, Types)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default gen_random_uuid() | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| category| VARCHAR | NOT NULL | e.g. 'TaskPriority', 'TaskType', 'MeetingType' |
| label | VARCHAR | NOT NULL | Nama Tampilan e.g. 'Urgent', 'Bug' |
| value | VARCHAR | NOT NULL | Nilai internal e.g. 'urgent', 'bug' |
| color | VARCHAR | | Kode Hex (e.g. '#FF0000') |
| is_active| BOOLEAN| DEFAULT TRUE | Soft disable parameter |

**Table: `workflow_states`** (Dynamic Kanban Columns / Custom Statuses)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default gen_random_uuid() | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| name | VARCHAR | NOT NULL | Nama Status (e.g. 'In QA', 'Deployed') |
| category| VARCHAR | NOT NULL | Kategori state: 'TODO', 'IN_PROGRESS', 'DONE' |
| color | VARCHAR | | Kode Hex untuk label status |
| order_idx| INTEGER | | Urutan render di papan Kanban |

**Table: `custom_field_definitions`** (Template Atribut Dinamis)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default gen_random_uuid() | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| project_id| UUID | FK -> projects (Nullable) | Jika NULL, field tersedia global, jika tidak, field khusus project tertentu |
| name | VARCHAR | NOT NULL | Label UI (e.g. 'Story Points', 'Client Name') |
| field_key| VARCHAR | NOT NULL, UNIQUE (per project/tenant) | Kunci JSONB (e.g. 'story_points') |
| type | VARCHAR | NOT NULL | 'text', 'number', 'date', 'dropdown', 'user' |
| is_required| BOOLEAN| DEFAULT FALSE | Wajib diisi saat buat tiket? |

### 2.1. Tenant & Master Dataity & Multi-tenancy

**Table: `tenants`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifer for tenant |
| name | VARCHAR | NOT NULL | e.g. "PT Askrindo Pusat" |
| domain | VARCHAR | UNIQUE | Custom domain mapping |
| created_at | TIMESTAMP | | |

**Table: `users`**
*(Note: Users bisa berada di level global jika kita mendukung konsep "1 User Account, login ke banyak tenant", atau terikat ketat ke tenant. Untuk enterprise internal, biasanya kita bind ke tenant)*
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| email | VARCHAR | UNIQUE(tenant_id, email) | |
| name | VARCHAR | | |
| password_hash | VARCHAR | | |
| system_role | VARCHAR | | SuperAdmin, TenantAdmin, BasicUser |

### 2.2. Portfolio & Project Hierarchy

**Table: `portfolios`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| name | VARCHAR | NOT NULL | e.g. "IT Masterplan 2026" |
| owner_id | UUID | FK -> users | Sponsor of the portfolio |

**Table: `projects`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| portfolio_id| UUID | FK -> portfolios (Nullable)| |
| name | VARCHAR | NOT NULL | |
| key | VARCHAR | NOT NULL | e.g. "CHR" untuk tiket "CHR-123" |
| status | VARCHAR | | Planning, Active, Completed |
| start_date | DATE | | |
| target_date| DATE | | |

**Table: `roles`** (Dynamic Roles Definition)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default gen_random_uuid() | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| name | VARCHAR | NOT NULL | Nama Role (e.g. 'Manager', 'QA', 'Guest') |
| description| TEXT | | |
| is_system| BOOLEAN| DEFAULT FALSE | Jika TRUE, tidak bisa dihapus oleh pengguna |

**Table: `role_permissions`** (Pivot Table for RBAC)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| role_id | UUID | PK, FK -> roles | |
| permission_code| VARCHAR| PK | Kode ijin (e.g. 'project:create', 'task:delete') |

**Table: `project_members`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| project_id| UUID | PK, FK -> projects | |
| user_id | UUID | PK, FK -> users | |
| role_id | UUID | FK -> roles, NOT NULL | Parameterized RBAC Role |
| joined_at| TIMESTAMP | DEFAULT NOW() | |

### 2.3. Work Engine (Tickets & Tasks)

**Table: `tasks`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, Default gen_random_uuid() | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| project_id| UUID | FK -> projects, NOT NULL | |
| title | VARCHAR | NOT NULL | |
| issue_key| VARCHAR | UNIQUE | ID Singkat e.g. ITMOD-12 |
| description| TEXT | | Mendukung format Markdown/Rich Text |
| type_id | UUID | FK -> system_parameters | Jenis Tugas (Bug, Epic, Task) dari master tabel |
| priority_id| UUID| FK -> system_parameters | Prioritas (High, Low) dari master tabel |
| state_id | UUID | FK -> workflow_states, NOT NULL| Status Workflow Saat Ini (e.g. In QA) |
| assignee_id| UUID | FK -> users (Nullable) | PIC task |
| reporter_id| UUID | FK -> users | Yang membuat task |
| due_date | DATE | | Untuk Gantt Chart |
| weight | INTEGER | DEFAULT 1 | Bobot untuk persentase progress |
| parent_task_id| UUID | FK -> tasks (Nullable) | Hirarki Epic -> Task |
| custom_data| JSONB | DEFAULT '{}' | Menyimpan *Dynamic Custom Fields* sebagai Key-Value Pair |
| version | INTEGER | DEFAULT 1 | Optimistic Locking |
| deleted_at | TIMESTAMP | DEFAULT NULL | Soft Delete |

**Table: `task_links`** (Dependencies)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| source_task_id| UUID | PK, FK -> tasks | Task yang mem-block/berelasi |
| target_task_id| UUID | PK, FK -> tasks | Task yang diblock/direlasikan |
| link_type | VARCHAR | NOT NULL | 'blocks', 'is_blocked_by', 'relates_to' |

**Table: `activity_logs`** (Audit Trail)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| task_id | UUID | FK -> tasks | |
| user_id | UUID | FK -> users | Aktor yang mengubah |
| action | VARCHAR | NOT NULL | e.g. "status_changed" |
| old_value| JSONB | | Nilai lama |
| new_value| JSONB | | Nilai baru |
| created_at| TIMESTAMP | DEFAULT NOW() | |

### 2.4. Smart Calendar & Meetings (Merged from DailySync)

**Table: `meetings`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| tenant_id| UUID | FK -> tenants, NOT NULL | RLS Key |
| project_id | UUID | FK -> projects (Nullable) | Jika meeting terkait project |
| task_id | UUID | FK -> tasks (Nullable) | Jika meeting bahas task spesifik |
| title | VARCHAR | NOT NULL | |
| start_time | TIMESTAMP | NOT NULL | |
| end_time | TIMESTAMP | NOT NULL | |
| location_type| VARCHAR | | Online, Room |
| room_id | UUID | FK -> rooms (Nullable) | Jika offline booking room |

**Table: `meeting_attendees`**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| meeting_id | UUID | PK, FK -> meetings | |
| user_id | UUID | PK, FK -> users | |
| rsvp | VARCHAR | | Pending, Accepted, Declined |

---

## 3. Database Security implementation (RLS Example)

```sql
-- Mengaktifkan RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Membuat Policy agar User hanya bisa melihat data milik Tenant-nya saja
CREATE POLICY tenant_isolation_policy ON tasks
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

## 4. Migration & Evolution Strategy
Saat menyatukan DailySync dan ProSync:
1. `users` dan `divisions` dari DailySync & ProSync dimigrasikan dengan menyuntikkan `tenant_id` (misal UUID dari PT Askrindo Pusat).
2. Data `program_kerja` dari ProSync di-mapping menjadi `projects` dan `tasks` bertipe "Milestone/Epic".
3. Data `meetings` dari DailySync dipertahankan, namun skema di-alter untuk menambahkan kolom relasional ke `project_id` dan `tenant_id`.
