# Project Status

**Current Phase**: Phase 7 (Polish & Launch) - **IN PROGRESS**
**Date**: 2025-12-25

## Overview
The application is in the final verification stage. We have switched the storage strategy from Cloudinary to **Local Disk Storage** to ensure reliability and simplify the deployment on Render.

**Key Updates (2025-12-25)**:
- **Storage Migration**: Switched from Cloudinary to Local File System for uploads.
- **Upload Route**: Updated to save files to `uploads/` directory.
- **Download Route**: Updated to serve files from local disk (via `/api/uploads/[filename]`).
- **Cloudinary Fallback**: Reverted to direct redirect for existing Cloudinary files.

## Completed Tasks
### Phase 1-6
- [x] All core functionalities.

### Phase 7 (Polish & Launch)
- [x] Cloudinary Integration (Replaced with Local Storage).
- [x] Admin-Only Mode (Registration Disabled).
- [x] Manual Publication Workflow (Enhanced).
- [x] Dashboard Quick Actions.
- [x] Archives Page Update (Support for Manual Collections).
- [x] Production Download Fix (Local Storage).

## Active Tasks
- [ ] Final End-to-End Verification of Manual Uploads.
- [x] Production Deployment (Fixing Seed Configuration).
- [x] Content Updates (Footer text, Contact page map removed).
- [x] UI/UX Polish (Author Affiliation Grouping).

## Security Notes
- **Storage**: Files are stored on the local disk (or mounted persistent disk on Render). Served via a secure API route that checks for path traversal.
- **Input Validation**: `manual-upload.ts` strictly validates all new fields (Zod).
- **Access Control**: Manual upload strictly limited to `ADMIN` and `EDITOR` roles.
