# Deployment Guide: Manual Web Service (Render.com)

This guide outlines the steps to deploy the JITTED platform manually using a Render **Web Service** (instead of the `render.yaml` blueprint).

## 1. Prerequisites

Ensure you have the following ready (found in this document):
*   **Database URL**: Connection string for the external PostgreSQL database.
*   **GitHub Repository**: Ensure your code is pushed to your GitHub repository.

## 2. Create Web Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account if not already connected.
4.  Search for and select the **`jitted`** repository.

## 3. Configure Service Settings

Fill in the following fields carefully. The **Root Directory** is critical because the Next.js app lives in the `web/` subfolder.

| Field | Value | Note |
| :--- | :--- | :--- |
| **Name** | `jitted-web` (or any name you like) | This determines your URL (e.g., `jitted-web.onrender.com`). |
| **Region** | `Oregon (US West)` | Match your database region if possible for best performance. |
| **Branch** | `main` | Or whichever branch you want to deploy. |
| **Root Directory** | `web` | **IMPORTANT**: Do not leave this blank. |
| **Runtime** | `Node` | |
| **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` | Installs deps, generates Prisma client, **migrates DB**, and builds the app. |
| **Start Command** | `npm start` | Starts the Next.js production server. |
| **Instance Type** | `Free` (or appropriate plan) | |

## 4. Configure Environment Variables

Scroll down to the **Environment Variables** section and click **Add Environment Variable**. Add the following:

| Key | Value |
| :--- | :--- |
| `NODE_VERSION` | `20.10.0` |
| `DATABASE_URL` | `postgresql://jitted_db_user:hdwGJ6P6yPuqaNbPBcX6D6ILaHSvYKXU@dpg-d55ukjmuk2gs73c6e0l0-a.oregon-postgres.render.com/jitted_db` |
| `NEXTAUTH_URL` | `https://<YOUR-APP-NAME>.onrender.com` (e.g., `https://jitted-web.onrender.com`) |
| `NEXTAUTH_SECRET` | *(Generate a random string)*. You can use: `38401349f283401293` or generate one via terminal: `openssl rand -base64 32` |

> **Note on NEXTAUTH_URL**: You won't know the exact URL until you create the service, but usually it follows the format `https://<service-name>.onrender.com`. You can create the service first, wait for the URL to be assigned, and then update this variable in the "Environment" tab.

## 5. Deploy

1.  Click **Create Web Service**.
2.  Render will start the deployment process:
    *   It will clone the repo.
    *   Enter the `web` directory.
    *   Run `npm install`.
    *   Run `npx prisma generate`.
    *   Run `npm run build`.
    *   Run `npm start`.
3.  Watch the logs. If successful, you will see `Ready in ...` and the status will turn **Live**.

## Troubleshooting

*   **Build Failures**: Check the logs. If it says "Command not found", ensure `Root Directory` is set to `web`.
*   **Database Errors**: Ensure the `DATABASE_URL` is correct and the database is accessible from Render (0.0.0.0/0 allowlist if required, though Render-to-Render is usually fine).
*   **500 Errors on Login**: Usually indicates `NEXTAUTH_SECRET` is missing or `NEXTAUTH_URL` does not match the actual domain.
