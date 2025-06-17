
### **Mini System Design Document (SDD): Hotel Management & Booking Platform**

#### **1. Overview**

This document outlines the technical design for a modern hotel management platform. The system consists of two primary interfaces:

1.  **Admin Panel:** A secure, feature-rich backend for the Hotel Admin/Manager to manage all aspects of the hotel's operations.
2.  **Guest-Facing Website:** A sophisticated, visually appealing, and user-friendly website for potential guests to find, view, and book rooms.

The core architectural principle is a **decoupled (or headless) approach**, where a central backend API serves data to one or more frontend applications. This ensures performance, scalability, and allows for independent development of the UI and backend logic.

#### **2. Core Modules**

The system can be broken down into the following logical modules:

*   **A. Admin Panel (Frontend Application)**
    *   **Dashboard:** Renders key statistics and navigation. Fetches summary data from the API.
    *   **Calendar Module:** A complex state-managed component that visualizes room occupancy. Handles API calls for fetching bookings, creating new ones, and blocking/unblocking dates.
    *   **Bookings Management:** A data-grid component that displays, searches, and filters bookings. Manages CRUD (Create, Read, Update, Delete) operations for bookings via the API.
    *   **Room & Hotel Management:** Forms and interfaces for CRUD operations on rooms, hotel details, pricing rules, and amenities.
    *   **Authentication:** Login forms and token management to secure access.

*   **B. Guest-Facing Website (Frontend Application)**
    *   **Booking Engine:** The primary search component (date picker) and room availability display logic.
    *   **Content Pages:** Static or semi-static pages for the homepage, room details, etc.
    *   **Booking & Checkout Flow:** A multi-step process for a guest to select a room, enter details, and complete payment.
    *   **Confirmation Page:** Displays success state and booking summary.

*   **C. Core Backend (API & Services)**
    *   **API Gateway:** A single entry point for all requests from the frontend applications.
    *   **Authentication Service:** Manages admin logins, password hashing, and session/token validation.
    *   **Booking Service:** Handles all logic related to creating, modifying, canceling, and retrieving bookings. Calculates pricing and checks for availability conflicts.
    *   **Room Service:** Manages all data related to rooms, including pricing, amenities, photos, and availability status ("Out of Service").
    *   **Channel Sync Service:** A dedicated service to handle the complex logic of synchronizing data with external OTAs (Online Travel Agencies).
    *   **Notification Service:** Triggers transactional emails (e.g., booking confirmations).

#### **3. System Architecture**

We will adopt a **Headless API-First Architecture**.



**Technology Stack Recommendations:**

*   **Frontend (Admin Panel & Guest Website):**
    *   **Framework:** **React (with Next.js)** . Next.js is highly recommended as it provides server-side rendering (great for SEO on the guest site) and a fantastic developer experience.
    *   **UI/Styling:** To achieve a "stunning and sophisticated" look, use a component library like **MUI (Material-UI)** or **Ant Design**. For more custom control, use **Tailwind CSS**. A combination of Tailwind CSS for layout and headless UI components (like Radix or Headless UI) offers maximum flexibility.
    *   **State Management:** React Query (TanStack Query) for managing server state (API calls, caching) and Zustand or Redux Toolkit for global client state.

*   **Backend (Core API):**
    *   **Framework:** **Node.js with NestJS**. NestJS provides a structured, scalable architecture out-of-the-box, perfect for a complex application like this. Alternatively, **Python with FastAPI** is an excellent, high-performance choice.
    *   **Database:** **PostgreSQL**. Its relational nature is perfect for the structured data of a hotel (rooms, bookings, users). Its support for JSONB fields can handle flexible data like `amenities`.
    *   **ORM (Object-Relational Mapper):** **Prisma** or **TypeORM** (if using NestJS). Prisma offers incredible type-safety and simplifies database interactions.

*   **Deployment:**
    *   **Frontend:** **Vercel** or **Netlify**. They are optimized for Next.js/React apps and offer seamless CI/CD.
    *   **Backend & Database:** **AWS (using Elastic Beanstalk/ECS for the API and RDS for PostgreSQL)** or **Google Cloud**. For simpler setups, **Heroku** or **Render** are great alternatives.

#### **4. Key Data Models (Simplified Database Schema)**

*   **`User`**: `id`, `email`, `passwordHash`, `role` (e.g., 'admin', 'staff')
*   **`Hotel`**: `id`, `name`, `contactInfo`, `policies`, `defaultCheckinTime`, `defaultCheckoutTime`
*   **`Room`**: `id`, `name`, `description`, `basePrice`, `maxCapacity`, `status` ('available', 'out_of_service')
*   **`RoomPhoto`**: `id`, `roomId`, `imageUrl`, `order`
*   **`Amenity`**: `id`, `name`, `icon`
*   **`RoomAmenity`** (Join Table): `roomId`, `amenityId`
*   **`Booking`**: `id`, `roomId`, `guestName`, `guestEmail`, `checkInDate`, `checkOutDate`, `totalCost`, `status` ('confirmed', 'cancelled'), `source` ('website', 'airbnb')
*   **`BlockedDate`**: `id`, `roomId`, `date`, `notes` (for maintenance, etc.)
*   **`RateRule`**: `id`, `roomId`, `channel` ('website', 'airbnb', 'booking.com'), `priceAdjustment` (e.g., -10, +15%)

#### **5. Recommended 3rd-Party Services**

Integrating with specialized services will save immense development time and provide best-in-class functionality.

*   **Payment Processing:**
    *   **Stripe:** The gold standard. Excellent developer APIs, secure, and handles complex payment flows easily. Use Stripe Elements for a beautiful, pre-built, and PCI-compliant checkout UI.

*   **Channel Sync (Crucial for `Desired Feature: Channel Sync`):**
    *   **Recommendation:** **Integrate with a Channel Manager API (e.g., SiteMinder, Cloudbeds, Rentals United) instead of building direct integrations with Airbnb and Booking.com.**
    *   **Why:** Building and maintaining individual API integrations is a massive, ongoing effort. A Channel Manager does this for you. Your backend only needs to sync with *one* service, which then pushes availability, pricing, and bookings to all connected OTAs. This is the industry-standard approach.

*   **Image & Asset Management:**
    *   **Cloudinary:** The best choice for this project. It's not just storage (like AWS S3); it provides on-the-fly image transformation, optimization, and a fast CDN. This is key for a "stunning UI" with fast-loading photos.

*   **Transactional Emails:**
    *   **Resend** or **Postmark:** Modern and developer-friendly services designed specifically for transactional emails like booking confirmations, ensuring high deliverability. **SendGrid** is another robust option.

*   **Analytics:**
    *   **Google Analytics** for the guest-facing website to track visitor behavior.
    *   **Plausible** or **Fathom** for privacy-focused analytics.

