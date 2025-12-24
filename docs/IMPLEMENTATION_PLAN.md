# Implementation Plan: JITTED Web Platform

## Phase 1: Foundation & Public Identity
**Goal**: Establish the project structure, deployment pipeline, and public-facing informational pages.
*   [x] Initialize Next.js Project (TypeScript, Tailwind, Shadcn UI).
*   [x] Configure Render.com Deployment (Web Service + DB).
*   [x] Implement "Mobile-First" Layout (Navbar, Footer with Tetfund/FCE logos).
*   [x] **Page**: Landing Page (Hero, Latest News/Call).
*   [x] **Page**: About (Editorial Board, Scope).
*   [x] **Page**: Guidelines (Author instructions).
*   [x] **Page**: Contact.
*   [x] **Security**: Setup Basic Headers, Rate Limiting.

## Phase 2: Authentication & User Management
**Goal**: Allow users to register and manage profiles.
*   [x] Database Schema Design (Users, Roles: Author, Editor, Reviewer).
*   [x] Implement Authentication (Sign Up, Sign In).
*   [x] **Role Management**: Middleware for protecting routes.
*   [x] **User Dashboard**: Basic profile management.

## Phase 3: Submission System (Author Workflow)
**Goal**: Enable authors to submit manuscripts digitally.
*   [x] Database Schema (Submissions, Files, Status History).
*   [x] **File Storage Setup**: Configure upload handling (Size limits, Type checks).
*   [x] **Submission Wizard**:
    *   Step 1: Metadata (Title, Abstract).
    *   Step 2: Authors.
    *   Step 3: File Upload.
    *   Step 4: Confirmation.
*   [x] **Author Dashboard**: View submission status.

## Phase 4: Editorial Management (The Engine)
**Goal**: Give Editors tools to manage the 12-week cycle.
*   [x] **Editor Dashboard**: List of all submissions with filters.
*   [x] **Action: Vetting**: Accept for Review vs. Reject immediately.
*   [x] **Action: Assign Reviewer**: Invite registered reviewers.
*   [x] **Action: Decision**: Accept, Request Revision, Reject.

## Phase 5: Peer Review Portal
**Goal**: Facilitate the review process.
*   [x] **Reviewer Dashboard**: View assigned papers (blind/double-blind view).
*   [x] **Review Form**: Structured feedback + Recommendation.
*   [x] **Revision Loop**: Author uploads corrected version -> Editor verifies.

## Phase 6: Publication & Archives
**Goal**: Publish accepted articles to the world.
*   [x] **Issue Management**: Create Volume/Issue containers.
*   [x] **Publishing**: Assign accepted articles to an Issue.
*   [x] **Archives Page**: Public listing of Volumes -> Issues -> Articles.
*   [x] **Article View**: Abstract + PDF Download.
*   [x] **Search**: Basic search functionality.

## Phase 7: Polish & Launch
**Goal**: Final testing and handover.
*   [x] UI/UX Polish (Animations, Loading states, Mobile tweaks).
*   [x] Security Audit (Input validation check, Dependency audit).
*   [x] Documentation (User Manual for Editors).
*   [x] **Email Notifications**: Trigger emails on status changes (Priority).
*   [ ] End to end test of all functionalites i.e. testing all API's and functionalities end to end.
*   [ ] Final Deployment Verification.
