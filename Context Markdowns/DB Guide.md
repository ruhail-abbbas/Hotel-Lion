

### **Database Schema: Hotel Management & Booking Platform**

This schema is designed for a relational database like **PostgreSQL**, which is highly recommended for its robustness, support for custom types (ENUMs), and excellent handling of JSON data (`JSONB`).

Of course. Here is the complete PostgreSQL schema code based on the DBML and user stories.

This script is designed to be executed directly in a PostgreSQL database. It includes the creation of custom types (ENUMs), tables with appropriate constraints, indexes for performance, and a trigger to automatically handle `updated_at` timestamps.

---

```sql
-- PostgreSQL Schema for Hotel Management & Booking Platform
-- This script creates the entire database structure, including types, tables,
-- relationships, and performance-enhancing indexes.

-- Enable the pgcrypto extension to use gen_random_uuid() for primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================================
-- 1. DEFINE CUSTOM ENUM TYPES
--    Using ENUMs ensures data integrity and is more efficient than text with CHECK constraints.
-- =================================================================

CREATE TYPE user_role AS ENUM (
  'admin',
  'staff'
);

CREATE TYPE room_status AS ENUM (
  'available',
  'out_of_service'
);

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled'
);

CREATE TYPE adjustment_type AS ENUM (
  'percentage',
  'fixed'
);


-- =================================================================
-- 2. CREATE A TRIGGER FUNCTION FOR 'updated_at' TIMESTAMPS
--    This function will be used by triggers to automatically update the
--    'updated_at' column on any row modification.
-- =================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- =================================================================
-- 3. CREATE TABLES
--    Tables are created in an order that respects foreign key dependencies.
-- =================================================================

-- Table: Users
-- Purpose: Manages admin/staff access for the backend panel.
-- User Story: "As an admin, I want to log in securely..."
CREATE TABLE "Users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "role" user_role NOT NULL DEFAULT 'staff',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Table: Hotel
-- Purpose: Stores global hotel settings.
-- User Story: "As an admin, I want to set and update hotel details (name, contact info, policies)..."
CREATE TABLE "Hotel" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "contact_info" jsonb,
  "policies" text,
  "default_checkin_time" time NOT NULL,
  "default_checkout_time" time NOT NULL
);

-- Table: Rooms
-- Purpose: Represents the core rentable units of the hotel.
-- User Story: "As an admin, I want to manage a list of rooms with editable fields..."
CREATE TABLE "Rooms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) UNIQUE NOT NULL,
  "description" text,
  "base_price" decimal(10, 2) NOT NULL,
  "max_capacity" integer NOT NULL,
  "status" room_status NOT NULL DEFAULT 'available',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Table: Amenities
-- Purpose: Defines a master list of all possible amenities the hotel can offer.
-- User Story: "As an admin, I want to set room amenities..."
CREATE TABLE "Amenities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(100) UNIQUE NOT NULL,
  "icon" varchar(50)
);

-- Table: RoomPhotos
-- Purpose: Manages the image gallery for each room.
-- User Story: "As a guest, I want to see multiple images of the room..."
CREATE TABLE "RoomPhotos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" uuid NOT NULL REFERENCES "Rooms"("id") ON DELETE CASCADE,
  "image_url" varchar(255) NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0
);

-- Table: Bookings
-- Purpose: The central table for all guest reservations.
-- User Story: Supports the entire Bookings Management and guest booking flow.
CREATE TABLE "Bookings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" uuid NOT NULL REFERENCES "Rooms"("id"),
  "reference_number" varchar(20) UNIQUE NOT NULL,
  "guest_name" varchar(255) NOT NULL,
  "guest_email" varchar(255) NOT NULL,
  "check_in_date" date NOT NULL,
  "check_out_date" date NOT NULL,
  "total_cost" decimal(10, 2) NOT NULL,
  "status" booking_status NOT NULL DEFAULT 'pending',
  "source" varchar(50) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "check_out_after_check_in" CHECK ("check_out_date" > "check_in_date")
);

-- Table: BlockedDates
-- Purpose: Allows admins to manually block rooms for maintenance.
-- User Story: "As an admin, I want to block or unblock dates manually for repairs or maintenance..."
CREATE TABLE "BlockedDates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" uuid NOT NULL REFERENCES "Rooms"("id") ON DELETE CASCADE,
  "blocked_date" date NOT NULL,
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("room_id", "blocked_date")
);

-- Table: RateRules
-- Purpose: Defines price adjustments for different sales channels.
-- User Story: "As an admin, I want to define price matrices per room and per channel..."
CREATE TABLE "RateRules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "room_id" uuid NOT NULL REFERENCES "Rooms"("id") ON DELETE CASCADE,
  "channel" varchar(50) NOT NULL,
  "adjustment_type" adjustment_type NOT NULL,
  "adjustment_value" decimal(10, 2) NOT NULL,
  UNIQUE ("room_id", "channel")
);

-- Table: RoomAmenities (Join Table)
-- Purpose: Links rooms to their available amenities (Many-to-Many relationship).
-- User Story: "As a guest, I want to see a checklist of amenities..."
CREATE TABLE "RoomAmenities" (
  "room_id" uuid NOT NULL REFERENCES "Rooms"("id") ON DELETE CASCADE,
  "amenity_id" uuid NOT NULL REFERENCES "Amenities"("id") ON DELETE CASCADE,
  PRIMARY KEY ("room_id", "amenity_id")
);


-- =================================================================
-- 4. APPLY TRIGGERS
--    Attach the 'update_modified_column' function to tables with an 'updated_at' field.
-- =================================================================

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON "Users"
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_rooms_updated_at
BEFORE UPDATE ON "Rooms"
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON "Bookings"
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();


-- =================================================================
-- 5. CREATE INDEXES
--    Create indexes on foreign keys and frequently queried columns to improve query performance.
-- =================================================================

-- Index for fast lookup of bookings by guest email or dates
CREATE INDEX ON "Bookings" ("guest_email");
CREATE INDEX ON "Bookings" ("check_in_date", "check_out_date");

-- Index for fast lookup of photos and other related items by room_id
CREATE INDEX ON "RoomPhotos" ("room_id");
CREATE INDEX ON "RateRules" ("room_id");

-- Indexes for the join table
CREATE INDEX ON "RoomAmenities" ("room_id");
CREATE INDEX ON "RoomAmenities" ("amenity_id");
```
