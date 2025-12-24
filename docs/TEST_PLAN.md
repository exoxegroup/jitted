# JITTED - End-to-End Test Plan

**Status**: Build Verified, Smoke Tests Passed (Routes Accessible).
**Date**: 2025-12-24

This document outlines the test cases to verify the functionality of the JITTED platform across all user roles.

## 1. Authentication & User Management
- [ ] **Registration**: User can sign up with Name, Email, and Password.
- [ ] **Login**: User can log in with valid credentials.
- [x] **Role Assignment**: Admin can assign roles (Author, Reviewer, Editor) via database/admin panel.
- [ ] **Protected Routes**:
    - [x] Non-logged-in users cannot access `/dashboard` (Redirects to Login).
    - [ ] Authors cannot access `/dashboard/editor`.
    - [ ] Reviewers cannot access `/dashboard/editor`.

## 2. Author Workflow
- [ ] **New Submission**:
    - [ ] Can fill out Title, Abstract, Keywords.
    - [ ] Can upload a PDF file.
    - [ ] Successful submission redirects to dashboard with status `SUBMITTED`.
- [ ] **View Status**: Dashboard correctly shows `SUBMITTED`, `UNDER_REVIEW`, etc.
- [ ] **Submit Revision**:
    - [ ] Can access submission when status is `REVISION_REQUESTED`.
    - [ ] Can upload a new version.
    - [ ] Status updates to `SUBMITTED` (or similar re-evaluation status).

## 3. Editor Workflow (Secretary/Editor-in-Chief)
- [ ] **Vetting**:
    - [ ] Can view `SUBMITTED` manuscripts.
    - [ ] Can download/view PDF.
    - [ ] **Approve**: Changes status to `UNDER_REVIEW`.
    - [ ] **Reject**: Changes status to `REJECTED`.
- [ ] **Reviewer Assignment**:
    - [ ] Can select a reviewer for a submission.
    - [ ] System prevents duplicate assignment.
    - [ ] Email is triggered to reviewer.
- [ ] **Decision Making**:
    - [ ] Can view submitted reviews.
    - [ ] **Accept**: Changes status to `ACCEPTED`.
    - [ ] **Revision**: Changes status to `REVISION_REQUESTED`.
    - [ ] **Reject**: Changes status to `REJECTED`.
    - [ ] Email is triggered to author.

## 4. Reviewer Workflow
- [ ] **Assignment**:
    - [ ] Can see assigned papers in dashboard.
    - [ ] Cannot see author name (Blind Review check).
- [ ] **Submit Review**:
    - [ ] Can enter Score (1-10).
    - [ ] Can enter Feedback and Recommendation.
    - [ ] Submission updates review status.

## 5. Publication & Public Access
- [ ] **Create Issue**: Editor can create Volume X, Number Y.
- [ ] **Publish Issue**: Editor can add accepted articles to an issue and publish it.
- [ ] **Public View**:
    - [x] Published articles appear on Home/Archives (Pages Load verified).
    - [ ] PDF download works for public users.
- [ ] **Search**:
    - [x] Can search by keyword/author (Page Loads verified).
    - [ ] Results link to article details.

## 6. System Notifications (Email)
- [ ] **Submission Receipt**: Author receives email on submission.
- [ ] **Review Invitation**: Reviewer receives email on assignment.
- [ ] **Decision Notification**: Author receives email on Accept/Reject/Revision.

## 7. Security Checks
- [ ] **Input Validation**: Invalid inputs (e.g., negative volume numbers, empty titles) are rejected.
- [ ] **Access Control**: URL manipulation (e.g., trying to access another user's submission ID) is blocked.
