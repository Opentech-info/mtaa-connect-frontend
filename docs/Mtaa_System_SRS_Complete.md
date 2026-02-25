# Software Requirements Specification (SRS)

# Mtaa Resident Registration & Verification System

**A Simple Digital System for Local Government Resident Registration and Verification Letters**

---

| Document Information |  |
|---------------------|--|
| **Version** | 1.0 |
| **Date** | January 04, 2026 |
| **Status** | Draft |
| **Classification** | Internal |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Stakeholders](#2-stakeholders)
3. [Feasibility Study](#3-feasibility-study)
4. [System Requirements](#4-system-requirements)
5. [Use Cases](#5-use-cases)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Database Design](#7-database-design)
8. [User Interface Design](#8-user-interface-design)
9. [Sequence Diagrams](#9-sequence-diagrams)
10. [Security Considerations](#10-security-considerations)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment](#12-deployment)
13. [Document Approval](#13-document-approval)

---

# Phase 1: Planning and Requirement Analysis

## 1. Introduction

### 1.1 Purpose

This document provides a detailed description of the requirements for the **Mtaa Resident Registration & Verification System**. It is intended for stakeholders, developers, and academic evaluation.

### 1.2 Scope

Mtaa Resident Registration & Verification System is a web-based MVP platform designed to help local government offices (Serikali ya Mtaa) register residents and issue verification letters for:

- **Residence verification**
- **NIDA registration support**
- **License applications**

The system includes user authentication, request submission, review processes, and PDF letter generation without integrations to national systems.

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **Mtaa** | Local government administrative unit in Tanzania |
| **NIDA** | National Identification Authority |
| **MVP** | Minimum Viable Product |
| **RLS** | Row Level Security |
| **PDF** | Portable Document Format |
| **SRS** | Software Requirements Specification |

### 1.4 Document Overview

This SRS follows IEEE 830 standards and covers:
- Functional and non-functional requirements
- System architecture and database design
- User interface specifications
- Testing and deployment strategies

---

## 2. Stakeholders

| Stakeholder | Role | Responsibilities |
|-------------|------|------------------|
| **Citizen** | End User | Register, submit details, request letters, track status |
| **Local Officer** | Reviewer | Review requests, recommend approval/rejection |
| **Chairperson (Admin)** | Administrator | Final approval, manage users, generate letters |
| **Developers** | Technical Team | Build and maintain the system |
| **UI/UX Designer** | Design Team | Create intuitive user interfaces |
| **Database Administrator** | Technical Team | Manage database and data integrity |
| **TAMISEMI** | Government Body | Policy guidance and oversight |

---

## 3. Feasibility Study

### 3.1 Technical Feasibility

| Aspect | Assessment | Details |
|--------|------------|---------|
| **Frontend** | ✅ Feasible | React JS with TypeScript, Tailwind CSS |
| **Backend** | ✅ Feasible | Supabase (PostgreSQL, Auth, Storage) |
| **PDF Generation** | ✅ Feasible | Server-side PDF creation with templates |
| **Hosting** | ✅ Feasible | Cloud-based deployment |
| **Authentication** | ✅ Feasible | Supabase Auth with role-based access |

### 3.2 Economic Feasibility

| Cost Category | Estimated Cost | Notes |
|---------------|----------------|-------|
| Development | Low | Open-source technologies |
| Hosting | Minimal | Cloud services with free tier |
| Maintenance | Low | Minimal infrastructure |
| Training | Minimal | Intuitive interface |

**Benefits:**
- Reduced paper-based processes
- Faster service delivery
- Improved record-keeping
- Cost savings for local government

### 3.3 Operational Feasibility

- **Citizens**: Easy registration and request submission via mobile or desktop
- **Officers**: Simple dashboard for reviewing requests
- **Admins**: Comprehensive management tools

### 3.4 Legal Feasibility

| Requirement | Compliance |
|-------------|------------|
| Data Protection | ✅ Secure storage and encryption |
| Local Government Authority | ✅ Letters issued as official documents |
| Privacy | ✅ User data protected with RLS |

### 3.5 Schedule Feasibility

| Phase | Duration | Activities |
|-------|----------|------------|
| Planning | 1 week | Requirements gathering |
| Design | 1 week | UI/UX and database design |
| Development | 3 weeks | Frontend and backend implementation |
| Testing | 1 week | Unit, integration, UAT |
| Deployment | 1 week | Production setup and launch |
| **Total** | **7 weeks** | |

---

## 4. System Requirements

### 4.1 Functional Requirements

#### FR-001: User Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001.1 | System shall allow citizens to register with email and password | High |
| FR-001.2 | System shall allow registered users to log in | High |
| FR-001.3 | System shall support role-based access (citizen, officer, admin) | High |
| FR-001.4 | System shall allow users to reset passwords | Medium |
| FR-001.5 | System shall log out users after session timeout | Medium |

#### FR-002: Citizen Registration and Details

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-002.1 | Citizens shall submit personal details (name, gender, age, address, phone) | High |
| FR-002.2 | NIDA number shall be optional during registration | High |
| FR-002.3 | Citizens shall view and update their own details | High |
| FR-002.4 | System shall validate input data before storage | High |

#### FR-003: Letter Request Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-003.1 | Citizens shall request Residence Letters | High |
| FR-003.2 | Citizens shall request NIDA Verification Letters | High |
| FR-003.3 | Citizens shall request License Verification Letters | High |
| FR-003.4 | Each request shall include status (Pending, Approved, Rejected) | High |
| FR-003.5 | Citizens shall view request history and status | High |
| FR-003.6 | Citizens shall download approved letters as PDF | High |

#### FR-004: Review and Approval

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-004.1 | Officers shall view all citizen registrations | High |
| FR-004.2 | Officers shall review and recommend requests | High |
| FR-004.3 | Admins shall approve or reject requests | High |
| FR-004.4 | Approved requests shall generate PDF letters | High |
| FR-004.5 | System shall notify citizens of status changes | Medium |

#### FR-005: Admin Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-005.1 | Admin shall manage user roles | High |
| FR-005.2 | Admin shall view all requests and approvals | High |
| FR-005.3 | Admin shall access system audit logs | Medium |
| FR-005.4 | Admin shall manage letter templates | Medium |

### 4.2 Non-Functional Requirements

#### NFR-001: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001.1 | Page load time | < 3 seconds |
| NFR-001.2 | API response time | < 500ms |
| NFR-001.3 | Concurrent users | 100+ simultaneous |
| NFR-001.4 | PDF generation time | < 5 seconds |

#### NFR-002: Security

| ID | Requirement |
|----|-------------|
| NFR-002.1 | Passwords must be encrypted using bcrypt |
| NFR-002.2 | All connections must use HTTPS |
| NFR-002.3 | Role-based access control enforced at database level |
| NFR-002.4 | Session tokens must expire after inactivity |
| NFR-002.5 | Audit logs for all sensitive operations |

#### NFR-003: Usability

| ID | Requirement |
|----|-------------|
| NFR-003.1 | Mobile-responsive design |
| NFR-003.2 | Simple navigation (max 3 clicks to any feature) |
| NFR-003.3 | Support for Swahili and English languages |
| NFR-003.4 | Accessibility compliance (WCAG 2.1 AA) |

#### NFR-004: Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-004.1 | System uptime | 99.5% |
| NFR-004.2 | Data backup frequency | Daily |
| NFR-004.3 | Recovery time objective | < 4 hours |

#### NFR-005: Compatibility

| Platform | Support |
|----------|---------|
| Mobile phones | ✅ Responsive design |
| Tablets | ✅ Optimized layout |
| Desktop | ✅ Full features |
| Browsers | Chrome, Firefox, Safari, Edge |

---

## 5. Use Cases

### 5.1 Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MTAA RESIDENT REGISTRATION SYSTEM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────┐                                         ┌─────────────┐      │
│    │         │                                         │             │      │
│    │ CITIZEN │                                         │   OFFICER   │      │
│    │         │                                         │             │      │
│    └────┬────┘                                         └──────┬──────┘      │
│         │                                                     │             │
│         ├──────────► [ Register Account ]                     │             │
│         │                                                     │             │
│         ├──────────► [ Login / Logout ] ◄─────────────────────┤             │
│         │                                                     │             │
│         ├──────────► [ Submit Personal Details ]              │             │
│         │                                                     │             │
│         ├──────────► [ Update Personal Details ]              │             │
│         │                                                     │             │
│         ├──────────► [ Request Residence Letter ]             │             │
│         │                                                     │             │
│         ├──────────► [ Request NIDA Letter ]                  │             │
│         │                                                     │             │
│         ├──────────► [ Request License Letter ]               │             │
│         │                                                     │             │
│         ├──────────► [ View Request Status ]                  │             │
│         │                                                     │             │
│         ├──────────► [ Download PDF Letter ]                  │             │
│         │                                                     │             │
│         │              [ View Registrations ] ◄───────────────┤             │
│         │                                                     │             │
│         │              [ Review Requests ] ◄──────────────────┤             │
│         │                                                     │             │
│         │              [ Recommend Approval ] ◄───────────────┤             │
│         │                                                     │             │
│    ┌────┴────┐                                         ┌──────┴──────┐      │
│    │         │                                         │             │      │
│    │ SYSTEM  │                                         │    ADMIN    │      │
│    │         │                                         │ (Chairperson│      │
│    └────┬────┘                                         └──────┬──────┘      │
│         │                                                     │             │
│         ├──────────► [ Validate Authentication ]              │             │
│         │                                                     │             │
│         ├──────────► [ Store/Retrieve Data ]                  │             │
│         │                                                     │             │
│         ├──────────► [ Generate PDF ]                         │             │
│         │                                                     │             │
│         ├──────────► [ Send Notifications ]                   │             │
│         │                                                     │             │
│         │              [ Approve/Reject Requests ] ◄──────────┤             │
│         │                                                     │             │
│         │              [ Manage User Roles ] ◄────────────────┤             │
│         │                                                     │             │
│         │              [ View Audit Logs ] ◄──────────────────┤             │
│         │                                                     │             │
│         │              [ Manage Templates ] ◄─────────────────┤             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Use Case Descriptions

#### UC-001: Register Account

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-001 |
| **Name** | Register Account |
| **Actor** | Citizen |
| **Preconditions** | User has valid email address |
| **Main Flow** | 1. User navigates to registration page<br>2. User enters email, password, and personal details<br>3. System validates input<br>4. System creates account with 'citizen' role<br>5. System sends confirmation email<br>6. User is redirected to login |
| **Postconditions** | User account created and stored in database |
| **Exceptions** | Email already registered, invalid input format |

#### UC-002: Login

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-002 |
| **Name** | User Login |
| **Actor** | Citizen, Officer, Admin |
| **Preconditions** | User has registered account |
| **Main Flow** | 1. User enters email and password<br>2. System validates credentials<br>3. System creates session token<br>4. User redirected to role-specific dashboard |
| **Postconditions** | User authenticated and session active |
| **Exceptions** | Invalid credentials, account locked |

#### UC-003: Request Letter

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-003 |
| **Name** | Request Verification Letter |
| **Actor** | Citizen |
| **Preconditions** | Citizen logged in, personal details submitted |
| **Main Flow** | 1. Citizen selects letter type<br>2. Citizen adds optional notes<br>3. System validates request<br>4. System stores request with 'pending' status<br>5. System notifies officers |
| **Postconditions** | Request created and visible to officers |
| **Exceptions** | Incomplete profile, duplicate pending request |

#### UC-004: Review Request

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-004 |
| **Name** | Review Letter Request |
| **Actor** | Officer |
| **Preconditions** | Officer logged in, pending requests exist |
| **Main Flow** | 1. Officer views request list<br>2. Officer selects request to review<br>3. Officer views citizen details<br>4. Officer recommends approval or rejection<br>5. System updates request status |
| **Postconditions** | Request status updated to 'recommended' |

#### UC-005: Approve Request

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-005 |
| **Name** | Approve/Reject Request |
| **Actor** | Admin (Chairperson) |
| **Preconditions** | Admin logged in, recommended requests exist |
| **Main Flow** | 1. Admin views recommended requests<br>2. Admin approves or rejects<br>3. If approved, system generates PDF<br>4. System notifies citizen<br>5. PDF available for download |
| **Postconditions** | Request finalized, PDF generated if approved |

#### UC-006: Download PDF

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-006 |
| **Name** | Download Approved Letter |
| **Actor** | Citizen |
| **Preconditions** | Citizen logged in, request approved |
| **Main Flow** | 1. Citizen views approved requests<br>2. Citizen clicks download button<br>3. System retrieves PDF from storage<br>4. Browser downloads PDF file |
| **Postconditions** | PDF downloaded to user device |

---

## 6. Data Flow Diagrams

### 6.1 Level 0 DFD (Context Diagram)

```
                              ┌─────────────────────────────────────┐
                              │                                     │
       Registration &         │                                     │         Review &
       Request Data           │        MTAA RESIDENT                │         Approval Data
    ─────────────────────────►│        REGISTRATION                 │◄─────────────────────────
                              │        SYSTEM                       │
       Status &               │                                     │         Notifications &
       PDF Letters            │                                     │         Reports
    ◄─────────────────────────│                                     │─────────────────────────►
                              │                                     │
                              └─────────────────────────────────────┘
                                        ▲               ▲
         ┌──────────┐                   │               │                   ┌──────────────┐
         │          │                   │               │                   │              │
         │ CITIZEN  │───────────────────┘               └───────────────────│ OFFICER/     │
         │          │                                                       │ ADMIN        │
         └──────────┘                                                       └──────────────┘
```

### 6.2 Level 1 DFD

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│  ┌──────────┐          Registration Data          ┌─────────────────────┐               │
│  │          │ ─────────────────────────────────► │                     │               │
│  │ CITIZEN  │                                     │  1.0 USER           │               │
│  │          │ ◄───────────────────────────────── │  MANAGEMENT         │               │
│  └──────────┘          Auth Status                │                     │               │
│       │                                           └──────────┬──────────┘               │
│       │                                                      │                          │
│       │                                                      │ User Data                │
│       │                                                      ▼                          │
│       │                                           ┌─────────────────────┐               │
│       │                                           │                     │               │
│       │                                           │   D1: USER          │               │
│       │                                           │   DATABASE          │               │
│       │                                           │                     │               │
│       │                                           └─────────────────────┘               │
│       │                                                      ▲                          │
│       │          Request Submission               ┌──────────┴──────────┐               │
│       │ ─────────────────────────────────────────►│                     │               │
│       │                                           │  2.0 REQUEST        │               │
│       │ ◄─────────────────────────────────────────│  MANAGEMENT         │               │
│       │          Status & PDF                     │                     │               │
│       │                                           └──────────┬──────────┘               │
│       │                                                      │                          │
│       │                                                      │ Request Data             │
│       │                                                      ▼                          │
│       │                                           ┌─────────────────────┐               │
│       │                                           │                     │               │
│       │                                           │   D2: REQUEST       │               │
│       │                                           │   DATABASE          │               │
│       │                                           │                     │               │
│       │                                           └─────────────────────┘               │
│       │                                                      ▲                          │
│       │                                           ┌──────────┴──────────┐               │
│       │                                           │                     │  ┌──────────┐ │
│       │                                           │  3.0 REVIEW &       │◄─│ OFFICER/ │ │
│       │                                           │  APPROVAL           │──│ ADMIN    │ │
│       │                                           │                     │  └──────────┘ │
│       │                                           └──────────┬──────────┘               │
│       │                                                      │                          │
│       │                                                      │ PDF Data                 │
│       │                                                      ▼                          │
│       │          Download PDF                     ┌─────────────────────┐               │
│       │ ◄─────────────────────────────────────────│                     │               │
│       │                                           │  4.0 PDF            │               │
│       └──────────────────────────────────────────►│  GENERATION         │               │
│                  Download Request                 │                     │               │
│                                                   └─────────────────────┘               │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Level 2A DFD - User Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           1.0 USER MANAGEMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     Registration      ┌─────────────────┐                     │
│  │          │ ─────────────────────►│                 │                     │
│  │ CITIZEN  │                       │ 1.1 REGISTER    │                     │
│  │          │                       │ ACCOUNT         │                     │
│  └──────────┘                       │                 │                     │
│       │                             └────────┬────────┘                     │
│       │                                      │                              │
│       │                                      │ Store Credentials            │
│       │                                      ▼                              │
│       │                             ┌─────────────────┐                     │
│       │     Login Credentials       │                 │                     │
│       │ ───────────────────────────►│ 1.2 VALIDATE    │                     │
│       │                             │ AUTHENTICATION  │◄────────────────┐   │
│       │                             │                 │                 │   │
│       │                             └────────┬────────┘                 │   │
│       │                                      │                          │   │
│       │          Access Granted/Denied       │       Verify             │   │
│       │ ◄────────────────────────────────────┤       Credentials        │   │
│       │                                      ▼                          │   │
│       │                             ┌─────────────────┐                 │   │
│       │     Logout Request          │                 │                 │   │
│       │ ───────────────────────────►│ 1.3 LOGOUT      │                 │   │
│       │                             │                 │                 │   │
│       │                             └────────┬────────┘                 │   │
│       │                                      │                          │   │
│       │          Session Ended               │ Invalidate Session       │   │
│       │ ◄────────────────────────────────────┤                          │   │
│       │                                      ▼                          │   │
│       │                             ┌─────────────────┐                 │   │
│       │                             │                 │                 │   │
│       │                             │   D1: USER      │─────────────────┘   │
│       │                             │   DATABASE      │                     │
│       │                             │                 │                     │
│       │                             └─────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Level 2B DFD - Request Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          2.0 REQUEST MANAGEMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     Submit Request    ┌─────────────────┐                     │
│  │          │ ─────────────────────►│                 │                     │
│  │ CITIZEN  │                       │ 2.1 SUBMIT      │                     │
│  │          │                       │ REQUEST         │                     │
│  └──────────┘                       │                 │                     │
│       │                             └────────┬────────┘                     │
│       │                                      │                              │
│       │                                      │ Store Request                │
│       │                                      ▼                              │
│       │                             ┌─────────────────┐                     │
│       │                             │                 │                     │
│       │                             │   D2: REQUEST   │◄────────────────┐   │
│       │                             │   TABLE         │                 │   │
│       │                             │                 │─────────────┐   │   │
│       │                             └─────────────────┘             │   │   │
│       │                                      ▲                      │   │   │
│       │                                      │                      │   │   │
│       │     View Status             ┌────────┴────────┐             │   │   │
│       │ ───────────────────────────►│                 │             │   │   │
│       │                             │ 2.2 VIEW        │◄────────────┘   │   │
│       │ ◄───────────────────────────│ STATUS          │                 │   │
│       │     Status Display          │                 │                 │   │
│       │                             └─────────────────┘                 │   │
│       │                                                                 │   │
│       │                                                                 │   │
│  ┌──────────┐     Review Requests   ┌─────────────────┐                 │   │
│  │ OFFICER/ │ ─────────────────────►│                 │◄────────────────┘   │
│  │ ADMIN    │                       │ 2.3 REVIEW      │                     │
│  │          │ ◄─────────────────────│ REQUESTS        │                     │
│  └──────────┘     Request List      │                 │                     │
│       │                             └────────┬────────┘                     │
│       │                                      │                              │
│       │     Approve/Reject                   │ Update Status                │
│       │ ────────────────────────────────────►│                              │
│       │                                      ▼                              │
│       │                             ┌─────────────────┐                     │
│       │                             │                 │                     │
│       │                             │ 2.4 UPDATE      │                     │
│       │                             │ STATUS          │                     │
│       │                             │                 │                     │
│       │                             └─────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Level 2C DFD - PDF Generation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           4.0 PDF GENERATION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐     Approve Request   ┌─────────────────┐                     │
│  │          │ ─────────────────────►│                 │                     │
│  │  ADMIN   │                       │ 4.1 TRIGGER     │                     │
│  │          │                       │ GENERATION      │                     │
│  └──────────┘                       │                 │                     │
│                                     └────────┬────────┘                     │
│                                              │                              │
│                                              │ Fetch Template               │
│                                              ▼                              │
│                                     ┌─────────────────┐                     │
│                                     │                 │                     │
│                                     │   D3: PDF       │                     │
│                                     │   TEMPLATES     │                     │
│                                     │                 │                     │
│                                     └────────┬────────┘                     │
│                                              │                              │
│                                              │ Template Data                │
│                                              ▼                              │
│                                     ┌─────────────────┐                     │
│                                     │                 │                     │
│                                     │ 4.2 MERGE       │◄───── Citizen Data  │
│                                     │ DATA            │       from D1       │
│                                     │                 │                     │
│                                     └────────┬────────┘                     │
│                                              │                              │
│                                              │ Merged Content               │
│                                              ▼                              │
│                                     ┌─────────────────┐                     │
│                                     │                 │                     │
│                                     │ 4.3 GENERATE    │                     │
│                                     │ PDF FILE        │                     │
│                                     │                 │                     │
│                                     └────────┬────────┘                     │
│                                              │                              │
│                                              │ Store PDF                    │
│                                              ▼                              │
│                                     ┌─────────────────┐                     │
│                                     │                 │                     │
│                                     │   D4: PDF       │                     │
│                                     │   STORAGE       │                     │
│                                     │                 │                     │
│                                     └────────┬────────┘                     │
│                                              │                              │
│  ┌──────────┐     Download PDF               │                              │
│  │          │ ◄──────────────────────────────┘                              │
│  │ CITIZEN  │                                                               │
│  │          │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 2: Designing Phase

## 7. Database Design

### 7.1 Schema Overview

The database schema supports resident registration and verification processes with:

| Metric | Count |
|--------|-------|
| Tables | 5 |
| Foreign Keys | 6 |
| Enum Types | 3 |
| Primary Keys | 5 |

### 7.2 Enum Types

```sql
-- User role types
CREATE TYPE public.app_role AS ENUM ('citizen', 'officer', 'admin');

-- Letter request types
CREATE TYPE public.request_type AS ENUM ('residence', 'nida', 'license');

-- Request status states
CREATE TYPE public.request_status AS ENUM ('pending', 'recommended', 'approved', 'rejected');
```

### 7.3 Table Definitions

#### 7.3.1 profiles

Stores user profile information linked to auth.users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User identifier |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| phone | VARCHAR(20) | | Phone number |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### 7.3.2 user_roles

Maps users to their assigned roles (separate from profiles for security).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → auth.users, NOT NULL | Reference to user |
| role | app_role | NOT NULL | User role type |
| assigned_at | TIMESTAMP | DEFAULT NOW() | Assignment date |

**Unique Constraint:** (user_id, role)

#### 7.3.3 resident_details

Stores citizen personal details for letter generation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → auth.users, UNIQUE | Reference to user |
| gender | VARCHAR(10) | | Gender |
| age | INTEGER | | Age |
| address | TEXT | NOT NULL | Residential address |
| nida_id | VARCHAR(50) | | Optional NIDA ID |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### 7.3.4 letter_requests

Stores verification letter requests from citizens.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → auth.users, NOT NULL | Requesting citizen |
| request_type | request_type | NOT NULL | Type of letter |
| notes | TEXT | | Additional notes |
| status | request_status | DEFAULT 'pending' | Request status |
| reviewed_by | UUID | FK → auth.users | Reviewing officer |
| approved_by | UUID | FK → auth.users | Approving admin |
| pdf_url | VARCHAR(500) | | URL to generated PDF |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### 7.3.5 audit_logs

Tracks system actions for compliance and debugging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → auth.users | Acting user |
| action | VARCHAR(100) | NOT NULL | Action performed |
| table_name | VARCHAR(100) | | Affected table |
| record_id | UUID | | Affected record |
| old_values | JSONB | | Previous values |
| new_values | JSONB | | New values |
| created_at | TIMESTAMP | DEFAULT NOW() | Action time |

### 7.4 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIP DIAGRAM                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│    ┌─────────────────┐          1:1          ┌─────────────────┐                        │
│    │                 │◄─────────────────────►│                 │                        │
│    │   AUTH.USERS    │                       │    PROFILES     │                        │
│    │                 │                       │                 │                        │
│    │  - id (PK)      │                       │  - id (PK,FK)   │                        │
│    │  - email        │                       │  - first_name   │                        │
│    │  - password     │                       │  - last_name    │                        │
│    │  - created_at   │                       │  - phone        │                        │
│    │                 │                       │  - created_at   │                        │
│    └────────┬────────┘                       └─────────────────┘                        │
│             │                                                                           │
│             │ 1:1                                                                       │
│             ▼                                                                           │
│    ┌─────────────────┐                                                                  │
│    │                 │                                                                  │
│    │   USER_ROLES    │                                                                  │
│    │                 │                                                                  │
│    │  - id (PK)      │                                                                  │
│    │  - user_id (FK) │                                                                  │
│    │  - role         │                                                                  │
│    │  - assigned_at  │                                                                  │
│    │                 │                                                                  │
│    └─────────────────┘                                                                  │
│             │                                                                           │
│    ┌────────┴────────┐                                                                  │
│    │                 │                                                                  │
│    │ 1:1             │ 1:N                                                              │
│    ▼                 ▼                                                                  │
│    ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐        │
│    │                 │          │                 │          │                 │        │
│    │ RESIDENT_       │          │ LETTER_         │          │ AUDIT_LOGS      │        │
│    │ DETAILS         │          │ REQUESTS        │          │                 │        │
│    │                 │          │                 │          │  - id (PK)      │        │
│    │  - id (PK)      │          │  - id (PK)      │          │  - user_id (FK) │        │
│    │  - user_id (FK) │          │  - user_id (FK) │          │  - action       │        │
│    │  - gender       │          │  - request_type │          │  - table_name   │        │
│    │  - age          │          │  - notes        │          │  - record_id    │        │
│    │  - address      │          │  - status       │          │  - old_values   │        │
│    │  - nida_id      │          │  - reviewed_by  │          │  - new_values   │        │
│    │  - updated_at   │          │  - approved_by  │          │  - created_at   │        │
│    │                 │          │  - pdf_url      │          │                 │        │
│    └─────────────────┘          │  - created_at   │          └─────────────────┘        │
│                                 │  - updated_at   │                                     │
│                                 │                 │                                     │
│                                 └─────────────────┘                                     │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  LEGEND:  ──────► One-to-One    ─────►► One-to-Many    (PK) Primary Key   (FK) Foreign  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 Relationship Summary

| Entity A | Relationship | Entity B | Cardinality |
|----------|--------------|----------|-------------|
| auth.users | has | profiles | 1:1 |
| auth.users | has | user_roles | 1:1 |
| auth.users | has | resident_details | 1:1 |
| auth.users | submits | letter_requests | 1:N |
| auth.users | generates | audit_logs | 1:N |

---

## 8. User Interface Design

### 8.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Mobile-First** | Responsive design starting from 320px |
| **Government Style** | Professional colors (deep blue, gold accents) |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Simplicity** | Max 3 clicks to any feature |
| **Bilingual** | English and Swahili support |

### 8.2 Color Palette

| Color | HSL Value | Usage |
|-------|-----------|-------|
| Primary (Deep Blue) | hsl(221, 83%, 35%) | Headers, buttons, links |
| Primary Foreground | hsl(210, 40%, 98%) | Text on primary |
| Secondary (Gold) | hsl(45, 93%, 47%) | Accents, highlights |
| Success (Green) | hsl(142, 76%, 36%) | Approved status |
| Warning (Amber) | hsl(38, 92%, 50%) | Pending status |
| Destructive (Red) | hsl(0, 84%, 60%) | Rejected status, errors |
| Background | hsl(210, 40%, 98%) | Page background |
| Muted | hsl(210, 40%, 96%) | Card backgrounds |

### 8.3 Screen Wireframes

#### 8.3.1 Landing Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🏛️ MTAA SYSTEM    Home  Services  About  Contact    [Login] [Register] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │                         HERO SECTION                                │    │
│  │                                                                     │    │
│  │     "Mtaa Resident Registration & Verification System"              │    │
│  │                                                                     │    │
│  │     Your trusted partner for local government verification         │    │
│  │     services. Fast, secure, and accessible.                         │    │
│  │                                                                     │    │
│  │         [ Get Started ]    [ Learn More ]                           │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │                   │  │                   │  │                   │       │
│  │  📋 RESIDENCE     │  │  🆔 NIDA          │  │  📜 LICENSE       │       │
│  │     LETTER        │  │     VERIFICATION  │  │     VERIFICATION  │       │
│  │                   │  │                   │  │                   │       │
│  │  Proof of         │  │  Support for      │  │  Verification     │       │
│  │  residence for    │  │  national ID      │  │  for license      │       │
│  │  various needs    │  │  registration     │  │  applications     │       │
│  │                   │  │                   │  │                   │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         HOW IT WORKS                                │    │
│  │                                                                     │    │
│  │  ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐                          │    │
│  │  │  1  │───►│  2  │───►│  3  │───►│  4  │                          │    │
│  │  └─────┘    └─────┘    └─────┘    └─────┘                          │    │
│  │  Register   Submit    Wait for   Download                          │    │
│  │  Account    Request   Approval   Letter                            │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  © 2026 Mtaa System | Privacy Policy | Terms of Service            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.2 Citizen Login Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🏛️ MTAA SYSTEM    Home  Services  About  Contact    [Login] [Register] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                     ┌─────────────────────────────────┐                     │
│                     │                                 │                     │
│                     │         🏛️ MTAA SYSTEM          │                     │
│                     │                                 │                     │
│                     │    Welcome Back, Citizen        │                     │
│                     │    Sign in to access services   │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 📧 Email                 │    │                     │
│                     │  │ citizen@example.com     │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 🔒 Password              │    │                     │
│                     │  │ ••••••••                │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  [        Sign In        →]     │                     │
│                     │                                 │                     │
│                     │  Don't have an account?         │                     │
│                     │  Register here                  │                     │
│                     │                                 │                     │
│                     │  ─────────────────────────      │                     │
│                     │                                 │                     │
│                     │  🛡️ Officer Portal →            │                     │
│                     │                                 │                     │
│                     └─────────────────────────────────┘                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  © 2026 Mtaa System | Privacy Policy | Terms of Service            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.3 Citizen Registration Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🏛️ MTAA SYSTEM    Home  Services  About  Contact                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                     ┌─────────────────────────────────┐                     │
│                     │                                 │                     │
│                     │         🏛️ MTAA SYSTEM          │                     │
│                     │                                 │                     │
│                     │    Create Your Account          │                     │
│                     │    Join to access services      │                     │
│                     │                                 │                     │
│                     │  ┌───────────┐ ┌───────────┐    │                     │
│                     │  │ First Name │ │ Last Name │    │                     │
│                     │  │ John       │ │ Doe       │    │                     │
│                     │  └───────────┘ └───────────┘    │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 📧 Email                 │    │                     │
│                     │  │ john.doe@example.com    │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 📱 Phone Number          │    │                     │
│                     │  │ +255 xxx xxx xxx        │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 🔒 Password              │    │                     │
│                     │  │ ••••••••                │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  ┌─────────────────────────┐    │                     │
│                     │  │ 🔒 Confirm Password      │    │                     │
│                     │  │ ••••••••                │    │                     │
│                     │  └─────────────────────────┘    │                     │
│                     │                                 │                     │
│                     │  [      Create Account    →]    │                     │
│                     │                                 │                     │
│                     │  Already have an account?       │                     │
│                     │  Sign in here                   │                     │
│                     │                                 │                     │
│                     └─────────────────────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.4 Citizen Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🏛️ MTAA SYSTEM    Dashboard  New Request  Profile    👤 John [Logout] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  Welcome back, John Doe!                                            │    │
│  │  Manage your letter requests and track their status.                │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  QUICK ACTIONS                                                      │    │
│  │                                                                     │    │
│  │  ┌───────────────────┐  ┌───────────────────┐                      │    │
│  │  │ 📝 Update Details │  │ ✉️ New Request     │                      │    │
│  │  │                   │  │                   │                      │    │
│  │  └───────────────────┘  └───────────────────┘                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  YOUR REQUESTS                                                      │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ 📋 Residence Letter                                         │   │    │
│  │  │                                                             │   │    │
│  │  │ Submitted: Jan 2, 2026              Status: ✅ APPROVED     │   │    │
│  │  │                                                             │   │    │
│  │  │                                     [ Download PDF 📄 ]     │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ 🆔 NIDA Verification Letter                                 │   │    │
│  │  │                                                             │   │    │
│  │  │ Submitted: Jan 3, 2026              Status: 🟡 PENDING      │   │    │
│  │  │                                                             │   │    │
│  │  │ Awaiting officer review...                                  │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ 📜 License Verification Letter                              │   │    │
│  │  │                                                             │   │    │
│  │  │ Submitted: Dec 28, 2025             Status: ❌ REJECTED     │   │    │
│  │  │                                                             │   │    │
│  │  │ Reason: Incomplete address information                      │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.5 New Request Form

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🏛️ MTAA SYSTEM    Dashboard  New Request  Profile    👤 John [Logout] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  Request Verification Letter                                        │    │
│  │  Select the type of letter you need and provide details.           │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  LETTER TYPE                                                        │    │
│  │                                                                     │    │
│  │  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────┐   │    │
│  │  │ ☑️ RESIDENCE       │  │ ☐ NIDA            │  │ ☐ LICENSE     │   │    │
│  │  │                   │  │                   │  │               │   │    │
│  │  │ Proof of          │  │ National ID       │  │ License       │   │    │
│  │  │ residence         │  │ support           │  │ verification  │   │    │
│  │  └───────────────────┘  └───────────────────┘  └───────────────┘   │    │
│  │                                                                     │    │
│  │  YOUR INFORMATION (Auto-filled from profile)                        │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐          │    │
│  │  │ Full Name               │  │ Phone                   │          │    │
│  │  │ John Doe                │  │ +255 xxx xxx xxx        │          │    │
│  │  └─────────────────────────┘  └─────────────────────────┘          │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Address                                                     │   │    │
│  │  │ 123 Mtaa Street, Dar es Salaam                              │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Additional Notes (Optional)                                 │   │    │
│  │  │                                                             │   │    │
│  │  │ Please process urgently as needed for bank account...      │   │    │
│  │  │                                                             │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  [       Submit Request        →]                                  │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.6 Officer Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 🛡️ OFFICER PORTAL    Requests  Citizens  Reports    👤 Officer [Logout] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  Officer Dashboard                                                  │    │
│  │  Review and process citizen requests.                               │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  STATISTICS                                                         │    │
│  │                                                                     │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                │    │
│  │  │   12    │  │    8    │  │    3    │  │    1    │                │    │
│  │  │ Pending │  │Approved │  │Rejected │  │  Today  │                │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PENDING REQUESTS                                     [Filter ▼]    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ REQUEST #001                                                │   │    │
│  │  │                                                             │   │    │
│  │  │ 👤 John Doe           📋 Residence Letter                   │   │    │
│  │  │ 📅 Jan 3, 2026        🏠 123 Mtaa Street                    │   │    │
│  │  │                                                             │   │    │
│  │  │ [ View Details ]  [ ✅ Recommend ]  [ ❌ Reject ]           │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ REQUEST #002                                                │   │    │
│  │  │                                                             │   │    │
│  │  │ 👤 Jane Smith         🆔 NIDA Verification                  │   │    │
│  │  │ 📅 Jan 3, 2026        🏠 456 Mlimani Road                   │   │    │
│  │  │                                                             │   │    │
│  │  │ [ View Details ]  [ ✅ Recommend ]  [ ❌ Reject ]           │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 8.3.7 Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 👑 ADMIN PORTAL    Approvals  Users  Logs  Settings   👤 Admin [Logout] │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  Admin Dashboard (Chairperson)                                      │    │
│  │  Final approval authority for all requests.                         │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SYSTEM OVERVIEW                                                    │    │
│  │                                                                     │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                │    │
│  │  │   156   │  │    42   │  │    12   │  │    5    │                │    │
│  │  │ Citizens │  │ Officers│  │Pending  │  │ Today   │                │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  RECOMMENDED FOR APPROVAL                             [Filter ▼]    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ REQUEST #001          Recommended by: Officer Mwanza        │   │    │
│  │  │                                                             │   │    │
│  │  │ 👤 John Doe           📋 Residence Letter                   │   │    │
│  │  │ 📅 Jan 3, 2026        🏠 123 Mtaa Street                    │   │    │
│  │  │                                                             │   │    │
│  │  │ Officer Notes: "All documents verified, resident since 2020"│   │    │
│  │  │                                                             │   │    │
│  │  │ [ View Full Details ]  [ ✅ Approve & Generate PDF ]        │   │    │
│  │  │                        [ ❌ Reject ]                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  USER MANAGEMENT                                                    │    │
│  │                                                                     │    │
│  │  [ + Add Officer ]  [ Manage Roles ]  [ View Audit Logs ]          │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Mobile Responsive Design

All screens adapt to mobile viewports (320px - 768px) with:

- Hamburger menu for navigation
- Stacked card layouts
- Touch-friendly button sizes (minimum 44px)
- Collapsible sections for complex forms

---

## 9. Sequence Diagrams

### 9.1 User Registration Sequence

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│ CITIZEN│          │ FRONTEND │          │  AUTH    │          │ DATABASE │
└───┬────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
    │                    │                     │                     │
    │ 1. Fill Form       │                     │                     │
    │───────────────────►│                     │                     │
    │                    │                     │                     │
    │                    │ 2. Validate Input   │                     │
    │                    │────────────────────►│                     │
    │                    │                     │                     │
    │                    │                     │ 3. Check Duplicate  │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 4. No Duplicate     │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │                     │ 5. Create User      │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 6. User Created     │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │                     │ 7. Create Profile   │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 8. Assign Role      │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │ 9. Success Response │                     │
    │                    │◄────────────────────│                     │
    │                    │                     │                     │
    │ 10. Redirect Login │                     │                     │
    │◄───────────────────│                     │                     │
    │                    │                     │                     │
```

### 9.2 User Login Sequence

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  USER  │          │ FRONTEND │          │  AUTH    │          │ DATABASE │
└───┬────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
    │                    │                     │                     │
    │ 1. Submit Login    │                     │                     │
    │───────────────────►│                     │                     │
    │                    │                     │                     │
    │                    │ 2. Send Credentials │                     │
    │                    │────────────────────►│                     │
    │                    │                     │                     │
    │                    │                     │ 3. Validate         │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 4. User Found       │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │                     │ 5. Verify Password  │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 6. Password Valid   │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │                     │ 7. Get User Role    │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 8. Role: citizen    │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │ 9. Return Session   │                     │
    │                    │◄────────────────────│                     │
    │                    │                     │                     │
    │ 10. Redirect to    │                     │                     │
    │     Dashboard      │                     │                     │
    │◄───────────────────│                     │                     │
    │                    │                     │                     │
```

### 9.3 Letter Request Sequence

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│CITIZEN │          │ FRONTEND │          │   API    │          │ DATABASE │
└───┬────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
    │                    │                     │                     │
    │ 1. Select Type     │                     │                     │
    │───────────────────►│                     │                     │
    │                    │                     │                     │
    │                    │ 2. Load Profile     │                     │
    │                    │────────────────────►│                     │
    │                    │                     │                     │
    │                    │                     │ 3. Fetch Details    │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 4. Return Details   │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │ 5. Show Form        │                     │
    │                    │◄────────────────────│                     │
    │                    │                     │                     │
    │ 6. Add Notes &     │                     │                     │
    │    Submit          │                     │                     │
    │───────────────────►│                     │                     │
    │                    │                     │                     │
    │                    │ 7. Create Request   │                     │
    │                    │────────────────────►│                     │
    │                    │                     │                     │
    │                    │                     │ 8. Store Request    │
    │                    │                     │    (pending)        │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 9. Request ID       │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │ 10. Success         │                     │
    │                    │◄────────────────────│                     │
    │                    │                     │                     │
    │ 11. Show Status    │                     │                     │
    │◄───────────────────│                     │                     │
    │                    │                     │                     │
```

### 9.4 Request Review & Approval Sequence

```
┌────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│OFFICER │  │ ADMIN  │  │ FRONTEND │  │   API    │  │ DATABASE │  │PDF SERVICE│
└───┬────┘  └───┬────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
    │           │            │             │             │             │
    │ 1. View   │            │             │             │             │
    │ Requests  │            │             │             │             │
    │──────────────────────►│             │             │             │
    │           │            │             │             │             │
    │           │            │ 2. Fetch    │             │             │
    │           │            │ Pending     │             │             │
    │           │            │────────────────────────►│             │
    │           │            │             │             │             │
    │           │            │             │ 3. Query   │             │
    │           │            │             │────────────────────────►│
    │           │            │             │             │             │
    │           │            │             │ 4. Return  │             │
    │           │            │             │◄────────────────────────│
    │           │            │             │             │             │
    │           │            │ 5. Display  │             │             │
    │           │            │◄────────────────────────│             │
    │           │            │             │             │             │
    │ 6. Review │            │             │             │             │
    │ & Recommend           │             │             │             │
    │──────────────────────►│             │             │             │
    │           │            │             │             │             │
    │           │            │ 7. Update   │             │             │
    │           │            │ Status      │             │             │
    │           │            │────────────────────────►│             │
    │           │            │             │             │             │
    │           │            │             │ 8. Set     │             │
    │           │            │             │ Recommended│             │
    │           │            │             │────────────────────────►│
    │           │            │             │             │             │
    │           │ 9. View    │             │             │             │
    │           │ Recommended│             │             │             │
    │           │───────────►│             │             │             │
    │           │            │             │             │             │
    │           │ 10. Approve│             │             │             │
    │           │───────────►│             │             │             │
    │           │            │             │             │             │
    │           │            │ 11. Approve │             │             │
    │           │            │ Request     │             │             │
    │           │            │────────────────────────►│             │
    │           │            │             │             │             │
    │           │            │             │ 12. Update │             │
    │           │            │             │ Approved   │             │
    │           │            │             │────────────────────────►│
    │           │            │             │             │             │
    │           │            │             │ 13. Generate            │
    │           │            │             │ PDF        │             │
    │           │            │             │─────────────────────────────────►│
    │           │            │             │             │             │
    │           │            │             │             │ 14. PDF URL │
    │           │            │             │◄─────────────────────────────────│
    │           │            │             │             │             │
    │           │            │             │ 15. Store  │             │
    │           │            │             │ PDF URL    │             │
    │           │            │             │────────────────────────►│
    │           │            │             │             │             │
    │           │            │ 16. Success │             │             │
    │           │            │◄────────────────────────│             │
    │           │            │             │             │             │
```

### 9.5 PDF Download Sequence

```
┌────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│CITIZEN │          │ FRONTEND │          │ STORAGE  │          │ BROWSER  │
└───┬────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
    │                    │                     │                     │
    │ 1. Click Download  │                     │                     │
    │───────────────────►│                     │                     │
    │                    │                     │                     │
    │                    │ 2. Get PDF URL      │                     │
    │                    │────────────────────►│                     │
    │                    │                     │                     │
    │                    │ 3. Signed URL       │                     │
    │                    │◄────────────────────│                     │
    │                    │                     │                     │
    │                    │ 4. Trigger Download │                     │
    │                    │────────────────────────────────────────►│
    │                    │                     │                     │
    │                    │                     │ 5. Fetch PDF        │
    │                    │                     │◄────────────────────│
    │                    │                     │                     │
    │                    │                     │ 6. Return PDF       │
    │                    │                     │────────────────────►│
    │                    │                     │                     │
    │ 7. Save File       │                     │                     │
    │◄───────────────────────────────────────────────────────────────│
    │                    │                     │                     │
```

---

## 10. Security Considerations

### 10.1 Authentication Security

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with salt |
| Session Management | JWT tokens with expiry |
| Rate Limiting | Max 5 login attempts per minute |
| Password Policy | Min 8 chars, mixed case, numbers |

### 10.2 Authorization Security

| Measure | Implementation |
|---------|----------------|
| Role-Based Access | Separate user_roles table |
| Row Level Security | RLS policies on all tables |
| Function Security | Security definer functions |
| API Protection | Authenticated endpoints only |

### 10.3 Data Protection

| Measure | Implementation |
|---------|----------------|
| Encryption at Rest | Database encryption |
| Encryption in Transit | HTTPS/TLS |
| Input Validation | Zod schema validation |
| SQL Injection | Parameterized queries |
| XSS Prevention | React auto-escaping |

### 10.4 Audit Trail

All sensitive operations are logged in audit_logs table:
- User registration/login
- Request creation/updates
- Approval/rejection actions
- PDF generation and downloads

---

## 11. Testing Strategy

### 11.1 Test Types

| Type | Scope | Tools |
|------|-------|-------|
| Unit Testing | Components, functions | Vitest, React Testing Library |
| Integration Testing | API endpoints, auth flow | Vitest, MSW |
| E2E Testing | Full user journeys | Playwright |
| Security Testing | Auth, RLS policies | Manual + automated |
| Performance Testing | Load, response times | k6 |

### 11.2 Test Cases

#### Authentication Tests

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-001 | Register with valid data | Account created |
| TC-002 | Register with existing email | Error message shown |
| TC-003 | Login with valid credentials | Redirect to dashboard |
| TC-004 | Login with invalid password | Error message shown |
| TC-005 | Access protected route without auth | Redirect to login |

#### Request Processing Tests

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-010 | Submit residence letter request | Request saved as pending |
| TC-011 | Officer recommends request | Status changes to recommended |
| TC-012 | Admin approves request | PDF generated, status approved |
| TC-013 | Download approved PDF | File downloads successfully |
| TC-014 | Citizen views request status | Correct status displayed |

---

## 12. Deployment

### 12.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │                  │                                                       │
│  │  USER DEVICES    │                                                       │
│  │  (Mobile/Desktop)│                                                       │
│  │                  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           │ HTTPS                                                           │
│           ▼                                                                 │
│  ┌──────────────────┐                                                       │
│  │                  │                                                       │
│  │  CDN/HOSTING     │◄───── Static Assets (React Build)                     │
│  │  (Lovable/Vercel)│                                                       │
│  │                  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           │ API Calls                                                       │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      LOVABLE CLOUD (SUPABASE)                        │   │
│  │                                                                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │            │  │            │  │            │  │            │     │   │
│  │  │  AUTH      │  │ DATABASE   │  │  STORAGE   │  │  EDGE      │     │   │
│  │  │            │  │ PostgreSQL │  │  (Files)   │  │ FUNCTIONS  │     │   │
│  │  │            │  │            │  │            │  │            │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘     │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local testing | localhost:5173 |
| Staging | Pre-production testing | staging.mtaa-system.example.com |
| Production | Live system | mtaa-system.example.com |

---

## 13. Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | _________________ | _________ | January 04, 2026 |
| Technical Lead | _________________ | _________ | January 04, 2026 |
| QA Lead | _________________ | _________ | January 04, 2026 |
| Stakeholder | _________________ | _________ | January 04, 2026 |

---

## Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| Mtaa | Local government administrative unit |
| NIDA | National Identification Authority |
| RLS | Row Level Security |
| MVP | Minimum Viable Product |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| PDF | Portable Document Format |

### Appendix B: References

1. IEEE 830-1998 - Software Requirements Specifications
2. React Documentation - https://react.dev
3. Supabase Documentation - https://supabase.com/docs
4. Tailwind CSS - https://tailwindcss.com
5. Shadcn/UI - https://ui.shadcn.com

---

**Document Version Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 04, 2026 | Development Team | Initial SRS document |

---

*This document is generated based on the current system implementation and may be updated as the project evolves.*
