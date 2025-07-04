
### **Deployment Guide: Hotel Management & Booking Platform**

#### **1. Philosophy & Strategy**

This guide outlines a Continuous Integration/Continuous Deployment (CI/CD) strategy using **GitHub Actions** for automation and **Docker** for containerization. This approach ensures that every deployment is consistent, repeatable, and requires minimal manual intervention.

*   **Environments:** We will maintain two primary environments:
    *   **Staging:** A mirror of production for testing and validation. Deployed automatically from the `develop` branch.
    *   **Production:** The live application for end-users. Deployed automatically (or with a manual approval step) from the `main` branch.
*   **Git Flow:**
    *   `feature/your-feature-name` -> PR -> `develop` (triggers Staging deployment)
    *   `develop` -> PR -> `main` (triggers Production deployment)

---

#### **2. Prerequisites**

Before deployment, ensure you have accounts and configurations for the following services:

1.  **Hosting Platform:** **Render** is highly recommended for its simplicity and developer experience. Alternatives include AWS (Elastic Beanstalk/ECS) or Google Cloud Run.
2.  **GitHub Repository:** Code for the backend and frontend.
3.  **Docker Hub Account:** Or another container registry like AWS ECR or GHCR.
4.  **Domain Name:** A custom domain for your production environment.
5.  **3rd-Party Services:** Accounts for Stripe, Cloudinary, and Resend (or your chosen email provider).

---

#### **3. Infrastructure Setup (Using Render)**

On [Render.com](https://render.com/), create the following services for **both** your Staging and Production environments.

1.  **PostgreSQL Database:**
    *   Create a new "PostgreSQL" service.
    *   Choose a region close to your users.
    *   **Important:** Keep the "Internal Database URL" handy. This will be your `DATABASE_URL` environment variable.

2.  **Backend Service (API):**
    *   Create a new "Web Service".
    *   Connect it to your GitHub repository.
    *   Set the **Runtime** to **Docker**. Render will build and run your `Dockerfile`.
    *   Add the necessary environment variables (see section 4).

3.  **Frontend Service (Guest & Admin UI):**
    *   Create another new "Web Service".
    *   Connect it to your GitHub repository.
    *   Set the **Runtime** to **Docker**.
    *   Add the necessary environment variables.

4.  **Deploy Hooks (The Automation Key):**
    *   For both the Backend and Frontend services, go to the "Settings" tab and find the **Deploy Hook URL**.
    *   Copy these URLs. We will use them in GitHub Actions to trigger new deployments after a successful build.

---

#### **4. Environment Variable Setup**

In your Render services (under the "Environment" tab), add the following variables. Use your **Staging** keys/URLs for the Staging environment and **Production** keys/URLs for the Production environment.

**In GitHub Repository Secrets** (`Settings > Secrets and variables > Actions`):
*   `DOCKERHUB_USERNAME`: Your Docker Hub username.
*   `DOCKERHUB_TOKEN`: Your Docker Hub access token.
*   `RENDER_DEPLOY_HOOK_BACKEND_STAGING`: Deploy hook for the staging backend.
*   `RENDER_DEPLOY_HOOK_BACKEND_PROD`: Deploy hook for the production backend.
*   `RENDER_DEPLOY_HOOK_FRONTEND_STAGING`: Deploy hook for the staging frontend.
*   `RENDER_DEPLOY_HOOK_FRONTEND_PROD`: Deploy hook for the production frontend.

**In Render Environment Variables:**

| Variable Name | Backend/Frontend | Description & Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | From your Render PostgreSQL service. `postgres://...` |
| `NODE_ENV` | Both | `staging` or `production` |
| `JWT_SECRET` | Backend | A long, random string for signing tokens. |
| `CLIENT_URL_STAGING` | Backend | URL of the staging frontend. `https://hotel-staging.onrender.com` |
| `CLIENT_URL_PROD` | Backend | URL of the production frontend. `https://www.yourhotel.com` |
| `NEXT_PUBLIC_API_URL`| Frontend | URL of the backend API. `https://api-staging.onrender.com/v1` |
| `STRIPE_SECRET_KEY` | Backend | Your Stripe secret key (`sk_test_...` or `sk_live_...`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend | Your Stripe publishable key (`pk_test_...` or `pk_live_...`). |
| `RESEND_API_KEY` | Backend | Your Resend (or other email service) API key. |
| `CLOUDINARY_URL` | Backend | Your Cloudinary connection string. `cloudinary://...`|

---

#### **5. Containerization with Docker**

Create a `Dockerfile` in the root of both your backend and frontend projects.

**`backend/Dockerfile` (for NestJS/Node.js)**
```dockerfile
# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /usr/src/app

# Only copy necessary production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose port and run the app
EXPOSE 8000
CMD ["node", "dist/main"]
```

**`frontend/Dockerfile` (Multi-stage build for Next.js)**
```dockerfile
# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
# Pass build-time env vars if needed
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# Stage 2: Production Runner
FROM node:18-alpine
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy only necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000 and run the app
EXPOSE 3000
CMD ["npm", "start"]
```

---

#### **6. CI/CD with GitHub Actions**

Create a `.github/workflows` directory in your repository root. Add the following YAML files.

**`.github/workflows/deploy-backend.yml`**
```yaml
name: Deploy Backend

on:
  push:
    branches: [ "main", "develop" ]
    paths:
      - 'backend/**' # Only run if backend code changes

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Set Image Tag
        id: vars
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "TAG=latest" >> $GITHUB_OUTPUT
          else
            echo "TAG=staging" >> $GITHUB_OUTPUT
          fi

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v4
        with:
          context: ./backend # Path to your backend's Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/hotel-backend:${{ steps.vars.outputs.TAG }}

      - name: Trigger Staging Deploy
        if: github.ref == 'refs/heads/develop'
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_BACKEND_STAGING }}

      - name: Trigger Production Deploy
        if: github.ref == 'refs/heads/main'
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_BACKEND_PROD }}
```

*(Create a similar file, `deploy-frontend.yml`, adjusting the context path, image name, and deploy hook secrets accordingly.)*