# Project Status

**Current Phase**: Phase 7 (Polish & Launch) - **IN PROGRESS**
**Date**: 2025-12-25

## Overview
The application is in the final verification stage. We have reverted the storage strategy to **Cloudinary** but optimized the configuration to ensure PDF accessibility without requiring paid Render disk storage.

**Key Updates (2025-12-25)**:
- **Storage Strategy**: Reverted to Cloudinary to avoid paid Render disk costs.
- **Upload Optimization**: Enforcing `resource_type: "raw"` for all PDFs to prevent them being treated as images (which caused 404s and strict access issues).
- **Download Route**: Updated to direct redirect for Cloudinary URLs (since "raw" resources don't need complex signing).
- **Access Mode**: Explicitly setting `access_mode: "public"` for all uploads.

## Completed Tasks
### Phase 1-6
- [x] All core functionalities.

### Phase 7 (Polish & Launch)
- [x] Cloudinary Integration (Optimized for PDFs).
- [x] Admin-Only Mode (Registration Disabled).
- [x] Manual Publication Workflow (Enhanced).
- [x] Dashboard Quick Actions.
- [x] Archives Page Update (Support for Manual Collections).
- [x] Production Download Fix (Cloudinary Raw Mode).

## Active Tasks
- [ ] Final End-to-End Verification of Manual Uploads.
- [x] Production Deployment (Fixing Seed Configuration).
- [x] Content Updates (Footer text, Contact page map removed).
- [x] UI/UX Polish (Author Affiliation Grouping).

## Security Notes
- **Storage**: Files are stored in Cloudinary. New PDFs are stored as "raw" resources with public access.
- **Input Validation**: `manual-upload.ts` strictly validates all new fields (Zod).
- **Access Control**: Manual upload strictly limited to `ADMIN` and `EDITOR` roles.
