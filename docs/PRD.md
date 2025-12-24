# Product Requirements Document (PRD): JITTED Web Platform

## 1. Executive Summary
The **Journal of Issues in Technical Teacher Education (JITTED)** web platform is a modern, mobile-first academic journal management system. It aims to digitize the currently manual process of article submission, peer review, and publication for the Federal College of Education (Technical), Potiskum. The platform will serve authors, reviewers, and the editorial board, ensuring a streamlined, transparent, and efficient publication workflow.

**Funding**: Tertiary Education Trust Fund (TETFund).
**Hosting**: Render.com.

## 2. Core Goals
1.  **Digital Transformation**: Replace manual email/CD-ROM submissions with a web-based portal.
2.  **Workflow Automation**: Automate the 12-week quarterly publication cycle (Submission -> Review -> Correction -> Publication).
3.  **Global Accessibility**: Provide a public repository for published JITTED articles (Archives).
4.  **Professional Image**: Modern, responsive design reflecting the academic standard of the journal.

## 3. User Roles & Personas

### 3.1. Author
*   **Goal**: Submit research papers, track status, and receive feedback.
*   **Permissions**: Register, Submit Article (PDF/Doc), View Status, Upload Corrections, Pay Fees (Proof upload).

### 3.2. Editor-in-Chief / Secretary (Admin)
*   **Goal**: Manage the journal lifecycle.
*   **Permissions**:
    *   View all submissions.
    *   Screen/Vet initial submissions.
    *   Assign Reviewers.
    *   Make final acceptance/rejection decisions.
    *   Manage "Call for Papers".
    *   Publish Issues (group articles into Volumes/Issues).
    *   Manage Users.

### 3.3. Reviewer
*   **Goal**: Evaluate assigned articles.
*   **Permissions**: Accept/Reject review requests, Download manuscripts, Submit feedback/scores.

### 3.4. Public User / Researcher
*   **Goal**: Read published research.
*   **Permissions**: Search/Browse archives, View Abstract, Download PDF (if open access), Contact Journal.

## 4. Functional Requirements

### 4.1. Public Facing (Frontend)
*   **Home Page**: Featured articles, Current "Call for Papers", Tetfund branding.
*   **About**: Editorial board list, Scope, Guidelines.
*   **Archives**: Browse past volumes/issues.
*   **Contact**: Enquiry form.

### 4.2. Submission Portal (Auth Required)
*   **Dashboard**: Active submissions status tracker.
*   **New Submission**: Form (Title, Abstract, Authors) + File Upload (Manuscript).
*   **Revisions**: Upload corrected versions based on feedback.

### 4.3. Editorial Dashboard (Admin)
*   **Kanban/List View**: Track articles by stage (Submitted, In Review, Revision, Accepted, Published).
*   **Assignment**: Select reviewers for an article.
*   **Communication**: Automated emails (via SMTP2GO) for status changes.

### 4.4. Reviewer Hub
*   **Pending Reviews**: List of assigned papers.
*   **Evaluation Form**: Scorecard + Comment box.

## 5. Technical Architecture
*   **Frontend**: Next.js (React) - for SEO and mobile-first responsiveness.
*   **Backend**: Next.js API Routes (Serverless functions).
*   **Database**: PostgreSQL (Render Managed).
*   **Storage**: Render Disk or Cloudinary (for PDFs/Images).
*   **Authentication**: Custom Auth or Auth.js (NextAuth).
*   **Email**: SMTP2GO integration.
*   **Deployment**: Render.com.

## 6. Design Constraints
*   **Mobile First**: Must be fully functional on smartphones (common for users in the region).
*   **Performance**: Optimized for potential low-bandwidth scenarios.
*   **Branding**: Must display **TETFund** logo and **FCE(T) Potiskum** affiliation prominently.

## 7. Security Considerations
*   **Input Validation**: Strict validation on file uploads (PDF/Docx only) to prevent malware.
*   **Access Control**: RBAC (Role-Based Access Control) middleware.
*   **Data Protection**: Secure storage of unpublished manuscripts.
