

### **API Specification: Hotel Management & Booking Platform**

**Base URL:** `https://api.yourhotel.com/v1`

**Authentication:**
Endpoints marked as **Admin Only** require a JSON Web Token (JWT) to be sent in the `Authorization` header.
`Authorization: Bearer <your_jwt_token>`

**Standard Error Response Format:**
All error responses (4xx, 5xx) will return a JSON object with the following structure:
```json
{
  "statusCode": 400,
  "message": "Validation failed: checkInDate must be before checkOutDate",
  "error": "Bad Request"
}
```

---

### **1. Authentication**

#### `POST /auth/login`
*   **Description:** Authenticates a hotel admin and returns a JWT.
*   **Auth:** Public
*   **Request Body:**
    ```json
    {
      "email": "admin@hotel.com",
      "password": "secure_password"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "accessToken": "ey...",
      "user": {
        "id": "user_uuid_1",
        "email": "admin@hotel.com",
        "role": "admin"
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: Invalid credentials.
    *   `400 Bad Request`: Missing email or password.

---

### **2. Guest-Facing Endpoints (Public)**

#### `GET /rooms`
*   **Description:** Retrieves a list of all publicly available rooms.
*   **Auth:** Public
*   **Success Response (200 OK):** An array of room objects.
    ```json
    [
      {
        "id": "room_uuid_1",
        "name": "Ocean View Suite",
        "tagline": "Wake up to the sound of waves.",
        "basePrice": 250.00,
        "mainImageUrl": "https://cdn.yourhotel.com/image1.jpg"
      }
    ]
    ```

#### `GET /rooms/:id`
*   **Description:** Retrieves the full details for a single room.
*   **Auth:** Public
*   **Success Response (200 OK):**
    ```json
    {
      "id": "room_uuid_1",
      "name": "Ocean View Suite",
      "description": "A full description of the room...",
      "size": 45, // in sq. meters
      "bedType": "King",
      "maxCapacity": 2,
      "basePrice": 250.00,
      "photos": [
        {"id": "photo_1", "url": "https://cdn.yourhotel.com/image1.jpg"},
        {"id": "photo_2", "url": "https://cdn.yourhotel.com/image2.jpg"}
      ],
      "amenities": [
        {"name": "Wi-Fi", "icon": "wifi"},
        {"name": "Air Conditioning", "icon": "ac_unit"}
      ]
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: Room with the specified ID does not exist.

#### `GET /rooms/availability`
*   **Description:** Searches for available rooms within a specified date range. This is the core of the booking engine.
*   **Auth:** Public
*   **Query Parameters:**
    *   `checkInDate` (string, required): `YYYY-MM-DD`
    *   `checkOutDate` (string, required): `YYYY-MM-DD`
*   **Success Response (200 OK):** An array of available room objects, including the calculated total price for the stay.
    ```json
    [
      {
        "id": "room_uuid_1",
        "name": "Ocean View Suite",
        "mainImageUrl": "https://cdn.yourhotel.com/image1.jpg",
        "totalCost": 500.00,
        "nights": 2
      }
    ]
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid date format or `checkOutDate` is not after `checkInDate`.

#### `POST /bookings`
*   **Description:** Creates a new booking reservation.
*   **Auth:** Public
*   **Request Body:**
    ```json
    {
      "roomId": "room_uuid_1",
      "checkInDate": "2024-10-20",
      "checkOutDate": "2024-10-22",
      "guestDetails": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      },
      "paymentToken": "tok_stripe_..." // Token from Stripe.js
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "bookingId": "booking_uuid_123",
      "referenceNumber": "HJB-8A4K2",
      "status": "confirmed",
      "bookingSummary": {
        "roomName": "Ocean View Suite",
        "checkInDate": "2024-10-20",
        "checkOutDate": "2024-10-22",
        "totalCost": 500.00
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: Invalid input data (e.g., email format).
    *   `409 Conflict`: Room is not available for the selected dates.
    *   `402 Payment Required`: Payment token is invalid or declined.

---

### **3. Admin Panel Endpoints (Admin Only)**

#### `GET /admin/dashboard/stats`
*   **Description:** Retrieves key stats for the admin dashboard.
*   **Auth:** Admin Only
*   **Success Response (200 OK):**
    ```json
    {
      "activeBookings": 12,
      "occupancyRate": 75.0, // Percentage
      "todaysCheckIns": 3,
      "todaysCheckOuts": 2
    }
    ```

#### `GET /admin/calendar`
*   **Description:** Retrieves all bookings and blocked dates for a given month/view, formatted for a calendar grid.
*   **Auth:** Admin Only
*   **Query Parameters:**
    *   `startDate` (string, required): `YYYY-MM-DD`
    *   `endDate` (string, required): `YYYY-MM-DD`
*   **Success Response (200 OK):**
    ```json
    {
      "events": [
        {
          "id": "booking_uuid_123",
          "type": "booking", // 'booking' or 'block'
          "roomId": "room_uuid_1",
          "date": "2024-10-20",
          "details": "John Doe"
        },
        {
          "id": "block_uuid_456",
          "type": "block",
          "roomId": "room_uuid_2",
          "date": "2024-10-21",
          "details": "Deep cleaning scheduled"
        }
      ]
    }
    ```

#### `GET /admin/bookings`
*   **Description:** Retrieves a paginated and searchable list of all bookings.
*   **Auth:** Admin Only
*   **Query Parameters:**
    *   `page` (integer, optional): Default `1`
    *   `limit` (integer, optional): Default `20`
    *   `search` (string, optional): Searches guest name, email, or reference number.
    *   `status` (string, optional): Filter by `confirmed`, `cancelled`.
*   **Success Response (200 OK):**
    ```json
    {
      "data": [
        // Array of detailed booking objects
      ],
      "pagination": {
        "total": 150,
        "page": 1,
        "limit": 20,
        "totalPages": 8
      }
    }
    ```

#### `GET /admin/bookings/export`
*   **Description:** Exports booking data as a CSV file.
*   **Auth:** Admin Only
*   **Query Parameters:** Can include same filters as `GET /admin/bookings`.
*   **Success Response (200 OK):**
    *   **Content-Type:** `text/csv`
    *   **Body:** The raw CSV file data.

#### `PUT /admin/bookings/:id`
*   **Description:** Modifies an existing booking (e.g., change dates, cancel).
*   **Auth:** Admin Only
*   **Request Body:**
    ```json
    {
      "status": "cancelled"
      // or other fields to update
    }
    ```
*   **Success Response (200 OK):** The updated booking object.
*   **Error Responses:**
    *   `404 Not Found`: Booking with the specified ID does not exist.

#### `POST /admin/blocked-dates`
*   **Description:** Blocks a range of dates for a specific room for maintenance or other reasons.
*   **Auth:** Admin Only
*   **Request Body:**
    ```json
    {
        "roomId": "room_uuid_2",
        "startDate": "2024-11-10",
        "endDate": "2024-11-12",
        "notes": "Painting the room"
    }
    ```
*   **Success Response (201 Created):** A confirmation message.
*   **Error Responses:**
    *   `409 Conflict`: Dates conflict with an existing booking.

#### `DELETE /admin/blocked-dates/:id`
*   **Description:** Removes a date block, making the room available again.
*   **Auth:** Admin Only
*   **Success Response (204 No Content):**
*   **Error Responses:**
    *   `404 Not Found`: Blocked date with the specified ID does not exist.

#### `PUT /admin/rooms/:id`
*   **Description:** Updates all details for a specific room, including pricing, amenities, and photos.
*   **Auth:** Admin Only
*   **Request Body:** The full room object (or partial with `PATCH`).
    ```json
    {
      "name": "Deluxe King Suite",
      "description": "An updated description.",
      "basePrice": 300.00,
      "status": "out_of_service" // or 'available'
    }
    ```
*   **Success Response (200 OK):** The fully updated room object.
*   **Error Responses:**
    *   `404 Not Found`: Room not found.

#### `PUT /admin/settings/hotel`
*   **Description:** Updates the general hotel settings.
*   **Auth:** Admin Only
*   **Request Body:**
    ```json
    {
      "name": "The Seaside Boutique Hotel",
      "contactInfo": { "phone": "...", "email": "..." },
      "policies": "Check-in is after 3 PM...",
      "defaultCheckInTime": "15:00",
      "defaultCheckOutTime": "11:00"
    }
    ```
*   **Success Response (200 OK):** The updated settings object.