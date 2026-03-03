# API Specification Document
**Project Name:** Chronos  
**Document Version:** 1.0  
**Base URL:** `/api/v1`

---

## 1. Authentication & Identity

### `POST /auth/login`
- **Description:** Login and receive access rights.
- **Request Body:** `{ "email": "user@askrindo.co.id", "password": "xxx" }`
- **Response `200 OK`:** Returns JWT Token and user context.
  ```json
  {
    "token": "eyJhbG...",
    "user": {
      "id": "uuid",
      "name": "Budi",
      "active_tenant_id": "tenant-uuid",
      "available_tenants": [{"id": "tenant-uuid", "name": "PT Askrindo"}]
    }
  }
  ```

### `POST /auth/switch-tenant`
- **Description:** Changes active tenant context and issues a new JWT.
- **Request Body:** `{ "target_tenant_id": "uuid" }`
- **Response `200 OK`:** Returns new JWT Token scoped to the target tenant.

---

## 2. Project Management (PPM)
*(Note: Every request requires Header `Authorization: Bearer <token>`)*

### `GET /projects`
- **Description:** List all projects in the active tenant where User has access.
- **Response `200 OK`:**
  ```json
  {
    "data": [
      {
        "id": "project-uuid",
        "name": "Modernisasi IT",
        "key": "ITMOD",
        "portfolio_id": "portfolio-uuid",
        "status": "Active"
      }
    ]
  }
  ```

### `POST /projects`
- **Description:** Create a new project.
- **Request Body:** `{ "name": "New Project", "key": "NEW", "portfolio_id": "optional-uuid" }`
- **Response `201 Created`**

---

## 3. Task / Issue Tracking

### `GET /projects/:projectId/tasks`
- **Description:** Fetch tasks for Kanban board view.
- **Query Params:** `?status=InProgress&assignee=me`
- **Response `200 OK`:**
  ```json
  {
    "data": [
      {
        "id": "task-uuid",
        "issue_key": "ITMOD-12",
        "title": "Design DB Schema",
        "status": "InProgress",
        "assignee_id": "user-uuid",
        "due_date": "2026-03-10"
      }
    ]
  }
  ```

### `POST /tasks`
- **Description:** Create a ticket.
- **Request Body:** `{ "project_id": "uuid", "title": "Buy Server", "type": "Task" }`
- **Response `201 Created`**

### `PUT /tasks/:taskId/status`
- **Description:** Quick update status (used for Kanban Drag & Drop).
- **Request Body:** `{ "new_status": "Done" }`

---

## 4. Meetings & Calendar

### `GET /calendar/unified`
- **Description:** Gets aggregated calendar events for the active user (merged tasks deadlines and meetings).
- **Query Params:** `?start_date=2026-03-01&end_date=2026-03-31`
- **Response `200 OK`:**
  ```json
  {
    "events": [
      {
        "id": "meeting-1",
        "type": "meeting",
        "title": "Weekly Sync",
        "start": "2026-03-05T09:00:00Z",
        "end": "2026-03-05T10:00:00Z"
      },
      {
        "id": "task-2",
        "type": "task_deadline",
        "title": "Submit Report (ITMOD-15)",
        "start": "2026-03-06T23:59:59Z",
        "end": "2026-03-06T23:59:59Z"
      }
    ]
  }
  ```

### `POST /meetings`
- **Description:** Schedule a meeting.
- **Request Body:**
  ```json
  {
    "title": "Kickoff",
    "linked_project_id": "project-uuid",
    "start_time": "...",
    "end_time": "...",
    "attendee_ids": ["user-1", "user-2"],
    "room_id": "room-uuid-optional"
  }
  ```
- **Response `201 Created`**
