# Lion's Rooms n Apartments - Development Guide

## Project Overview
This document serves as the comprehensive guide for developing and maintaining Lion's Rooms n Apartments website. The project aims to create a modern, user-friendly digital experience that showcases apartment-style accommodations with excellent amenities and personalized service.

## UI Reference Analysis
Based on the provided WENS Hotel screenshots, we will adapt these modern design elements while maintaining our luxury brand identity:
- Clean, minimalist navigation with prominent booking button
- Hero section with building/location imagery
- Clear value propositions with icons
- Modern room showcases with high-quality photography
- Asymmetrical layouts for visual interest
- Professional color scheme with accent colors

## Brand Identity
- **Name**: Lion's Rooms n Apartments
- **Tagline**: "Quality Accommodation • Great Amenities"
- **Rating**: 8.3 points for amenities
- **Type**: Apartment-style accommodation with hotel services
- **Target Audience**: Business travelers, families, extended-stay guests
- **Core Values**: Comfort, convenience, excellent service, modern amenities

## Design Philosophy
- **Aesthetic**: Modern, clean, and functional design
- **Focus**: Practical luxury with excellent amenities and services
- **Emotions**: Calm, serenity, exclusivity, nature connection
- **Approach**: Minimalism with emotional depth

## Technical Stack
- **Framework**: Vanilla HTML5 with Tailwind CSS
- **Fonts**: 
  - Headings: Playfair Display or Cormorant Garamond (serif)
  - Body: Inter or Karla (sans-serif)
- **Animations**: CSS transitions or Framer Motion
- **Icons**: Minimal icon set for social media and UI elements
- **Media**: High-quality images and video backgrounds

## Color Palette
```css
:root {
  --deep-navy: #1a2a4c;      /* Primary - deep sea, text */
  --creamy-white: #f4f1ea;   /* Secondary - backgrounds */
  --sandy-beige: #d4c8b6;    /* Tertiary - subtle elements */
  --brushed-gold: #c8a97e;   /* Accent - CTAs and highlights */
}
```

## Typography Scale
```css
/* Desktop */
h1 { font-size: 64px; }
h2 { font-size: 48px; }
h3 { font-size: 32px; }
body { font-size: 18px; }
small { font-size: 14px; }

/* Mobile */
@media (max-width: 640px) {
  h1 { font-size: 48px; }
  h2 { font-size: 36px; }
  h3 { font-size: 24px; }
  body { font-size: 16px; }
}
```

## Navigation Structure (Inspired by Reference)
- Clean horizontal navigation bar
- Logo on the left
- Menu items: Home, Rooms, Experiences, About Us
- Prominent "BOOK" button on the right with accent color
- Sticky navigation on scroll with subtle background

## Page Sections

### 1. Hero Section
- Full viewport height with video/image background
- Inspired by reference: clean overlay with centered content
- Four-star rating display
- Hotel name in elegant serif font
- Tagline "Where the sea meets the sky"
- Single CTA: "BOOK NOW" button (similar to reference style)
- Subtle scroll indicator at bottom

### 2. Introduction Section
- Asymmetrical grid layout (similar to reference's two-column approach)
- Left side: Welcome text with hotel philosophy
- Right side: Gallery of 2-3 stunning property images
- Key features list with elegant icons:
  - Oceanfront location
  - Spa & wellness center
  - Michelin-starred dining
  - Private beach access
- "Offer at a glance" style bullet points

### 3. Rooms Showcase
- Title: "Our Sanctuaries"
- Grid layout inspired by reference (2 rooms per row)
- Each room card contains:
  - High-quality room image
  - Room type (e.g., "OCEAN SUITE")
  - Size and capacity (e.g., "45m² / 2 guests")
  - Starting price
  - Brief luxury description
  - "View Details" link with hover effect

### 4. Experiences Section
- Title: "Unforgettable Moments"
- Two signature experiences in cards
- Large, impactful images
- Brief, evocative descriptions
- Examples:
  - "Private Dining on the Cliffside"
  - "Morning Yoga Over the Ocean"
- Booking/inquiry links

### 5. Testimonial Section
- Full-width design with subtle background
- Single powerful guest quote
- 5-star rating display
- Guest name and origin
- Luxury hotel award badges

### 6. Footer CTA Section
- Two-tier footer design:
  - Upper section: Newsletter signup with elegant form
  - Lower section: 
    - Contact information
    - Quick links
    - Social media icons
    - "Book Your Stay" button
- Copyright and legal links

## Component Specifications

### Navigation Bar
```html
<nav class="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
  <div class="container mx-auto px-6 py-4 flex justify-between items-center">
    <div class="logo">The Azure Haven</div>
    <ul class="hidden md:flex space-x-8">
      <li>Home</li>
      <li>Rooms</li>
      <li>Experiences</li>
      <li>About Us</li>
    </ul>
    <button class="bg-brushed-gold text-white px-6 py-2 rounded">BOOK</button>
  </div>
</nav>
```

### Room Card Component
```html
<div class="room-card group cursor-pointer">
  <div class="overflow-hidden rounded-lg">
    <img class="group-hover:scale-105 transition-transform duration-500">
  </div>
  <div class="mt-4">
    <h3 class="text-2xl font-serif">Ocean Suite</h3>
    <p class="text-gray-600">45m² / 2 guests</p>
    <p class="mt-2">From $850/night</p>
  </div>
</div>
```

## Animation Guidelines
- **Principle**: Subtle, graceful, purposeful
- **Scroll animations**: Gentle fade-in with slight upward movement
- **Hover effects**: 
  - Images: Scale 1.05 with overflow hidden
  - Buttons: Background color transition with slight shadow
  - Links: Underline animation from left to right
- **Page transitions**: Smooth scrolling between sections
- **Loading**: Skeleton screens for images

## Development Checklist
- [ ] Set up Tailwind CSS configuration
- [ ] Add Google Fonts to HTML head
- [ ] Create semantic HTML structure
- [ ] Implement sticky navigation with scroll effects
- [ ] Design responsive grid layouts
- [ ] Add accessibility features (ARIA labels, alt text)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Implement smooth scroll behavior
- [ ] Create hover states for all interactive elements
- [ ] Test on multiple devices and browsers
- [ ] Validate HTML and check CSS performance
- [ ] Implement SEO meta tags

## Performance Guidelines
- Keep hero video/images optimized
- Use srcset for responsive images
- Implement lazy loading for below-fold images
- Minimize CSS and remove unused Tailwind classes
- Aim for 95+ Lighthouse score
- Use modern image formats (WebP, AVIF)

## Testing Requirements
- **Browsers**: Chrome, Safari, Firefox, Edge
- **Devices**: iPhone 12+, Samsung Galaxy, iPad, Desktop
- **Breakpoints**: 320px, 640px, 768px, 1024px, 1280px, 1920px
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals targets:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

## File Structure
```
/Hotel-Lion/
├── index.html              # Main homepage
├── assets/
│   ├── css/
│   │   └── custom.css     # Custom styles beyond Tailwind
│   ├── images/
│   │   ├── hero/          # Hero section images
│   │   ├── rooms/         # Room showcase images
│   │   ├── experiences/   # Experience section images
│   │   └── general/       # Other images
│   ├── videos/
│   │   └── hero-bg.mp4   # Hero background video
│   └── icons/            # SVG icons
├── CLAUDE.md             # This file
└── README.md            # Project readme
```

## Responsive Design Patterns
- **Mobile First**: Start with mobile layout, enhance for larger screens
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Grid Layouts**: 
  - Mobile: Single column
  - Tablet: 2 columns for rooms
  - Desktop: 2-3 columns with asymmetrical layouts
- **Typography**: Fluid sizing using clamp()
- **Images**: Different crops for mobile vs desktop

## SEO Optimization
- Semantic HTML5 markup
- Proper heading hierarchy
- Meta descriptions for each section
- Schema.org markup for hotel
- Open Graph tags for social sharing
- Sitemap.xml
- Robots.txt

## Deployment Notes
- Ensure all assets are optimized before deployment
- Set up proper caching headers for static assets
- Configure CDN for global performance
- Implement SSL certificate
- Set up redirects from www to non-www
- Configure error pages (404, 500)
- Enable Gzip compression

## Future Enhancements
- Multi-language support
- Dynamic content from CMS
- Advanced booking widget integration
- Virtual tour functionality
- Live chat support
- Weather widget for location
- Instagram feed integration

## Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Quality checks
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test         # Run tests
```

## Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Fonts](https://fonts.google.com)
- [Unsplash](https://unsplash.com) - Placeholder images
- [Pexels](https://www.pexels.com) - Video backgrounds
- [Heroicons](https://heroicons.com) - Icon set

## Design Inspiration Sources
- WENS Hotel website (reference provided)
- Aman Resorts
- Four Seasons
- Banyan Tree Hotels

## Contact
For questions about this project, please refer to the main README.md file or contact the development team.