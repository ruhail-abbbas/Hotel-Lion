# Hotel Lion Booking Integration

## Overview
The Hotel Lion marketing website has been integrated with the Hotel Lion booking frontend to provide a seamless user experience from marketing to reservation.

## Integration Details

### Booking Frontend Configuration
- **URL**: `http://localhost:3000`
- **Hotel UUID**: `15d0da75-0c13-4578-82f5-355632c17ebc`
- **Default Parameters**: 
  - Check-in: Tomorrow's date
  - Check-out: 3 days from today
  - Guests: 2 adults, 0 children

### Booking Buttons Updated

#### Marketing Site (index.html)
1. **Navigation BOOK Button** (`.booking-btn-nav`)
   - Location: Top navigation bar
   - Action: Redirects to search page with default parameters

2. **Hero BOOK NOW Button** (`.booking-btn-hero`) 
   - Location: Hero section center
   - Enhanced with 🏨 emoji
   - Action: Redirects to search page with default parameters

3. **Footer Book Your Stay Button** (`.booking-btn-footer`)
   - Location: Footer section
   - Enhanced with ⭐ emoji
   - Action: Redirects to search page with default parameters

#### Rooms Page (rooms.html)
1. **Navigation BOOK Button** (`.booking-btn-nav`)
   - Location: Top navigation bar
   - Action: Redirects to search page with default parameters

2. **Check Availability Button** (`.booking-btn-cta`)
   - Location: Call-to-action section
   - Enhanced with 🗺️ emoji
   - Action: Redirects to search page with default parameters

3. **Footer Book Now Button** (`.booking-btn-footer`)
   - Location: Footer section
   - Enhanced with 🏨 emoji
   - Action: Redirects to search page with default parameters

4. **Individual Room Book Now Buttons** (`.book-room-btn`)
   - Location: Each room card
   - Action: Redirects to search page with room parameter
   - Room-specific: Includes room name in URL as `room` parameter

### JavaScript Implementation

#### main.js
- Enhanced `initBookingButtons()` function
- Supports all booking button classes
- Creates dynamic booking URLs with date parameters
- Enhanced notifications with emojis and better styling
- Opens booking system in new tab

#### rooms.js  
- Room-specific booking functionality
- Passes room name as URL parameter
- Enhanced room-specific notifications
- Better user feedback during redirect

### User Experience Flow

1. **User clicks any booking button** on marketing site
2. **Loading state** shows with "Redirecting..." text
3. **Success notification** appears with hotel branding
4. **New tab opens** with Hotel Lion booking frontend
5. **Search page loads** with pre-filled parameters
6. **User can search and book** their preferred room

### URL Structure

**General Booking:**
```
http://localhost:3000/search?hotel=15d0da75-0c13-4578-82f5-355632c17ebc&check_in=2024-XX-XX&check_out=2024-XX-XX&guests=2&infants=0
```

**Room-Specific Booking:**
```
http://localhost:3000/search?hotel=15d0da75-0c13-4578-82f5-355632c17ebc&check_in=2024-XX-XX&check_out=2024-XX-XX&guests=2&infants=0&room=Room%20Name
```

### Configuration Variables

To change the booking frontend URL or hotel, update these variables in `assets/js/main.js` and `assets/js/rooms.js`:

```javascript
const BOOKING_FRONTEND_URL = 'http://localhost:3000'; // Change this to your booking frontend URL
const HOTEL_UUID = '15d0da75-0c13-4578-82f5-355632c17ebc'; // Change this to your hotel UUID
```

### Testing

1. Open the marketing site: `index.html` or `rooms.html`
2. Click any booking button
3. Verify notification appears
4. Verify new tab opens with booking frontend
5. Verify URL contains correct parameters
6. Verify booking frontend loads correctly

### Deployment Notes

- Update `BOOKING_FRONTEND_URL` for production environment
- Ensure booking frontend is accessible from marketing site domain
- Test cross-origin requests if hosted on different domains
- Consider adding environment detection for different URLs (dev/staging/prod)

## Troubleshooting

### Common Issues

1. **"localhost:3000 not accessible"**
   - Ensure booking frontend is running on port 3000
   - Check firewall settings
   - Verify frontend build is working

2. **Buttons not working**
   - Check browser console for JavaScript errors
   - Verify booking button classes are correctly applied
   - Ensure main.js and rooms.js are loaded

3. **Wrong hotel or parameters**
   - Verify HOTEL_UUID matches your backend
   - Check date formatting in URL parameters
   - Confirm URL structure matches frontend routing

### Support

For technical issues or questions about this integration, refer to:
- Marketing site: `/mnt/d/Abbbas/cc/Hotel-Lion/`
- Booking frontend: `/mnt/d/Abbbas/cc/Hotel-Lion-frontend/`
- Backend configuration: Check hotel UUID in database