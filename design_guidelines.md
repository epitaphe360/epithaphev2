# Design Guidelines: Epitaphe 360 Agency Website Clone

## Design Approach
**Reference-Based**: Drawing inspiration from modern creative agency websites (Awwwards-style agencies, R/GA, AKQA) with bold typography, generous whitespace, and sophisticated interactions. French language content throughout.

## Typography System
- **Primary Font**: Montserrat (all weights: 400, 500, 600, 700)
- **Secondary Font**: Muli (for body copy variations)
- **Hierarchy**:
  - Hero H1: Bold, 3.5rem desktop / 2rem mobile
  - Section H2: Bold, 2.5rem desktop / 1.75rem mobile  
  - Service/Card H3: Semibold, 1.5rem
  - Body: Regular, 1rem line-height 1.6
  - Small text/captions: 0.875rem

## Layout System
**Spacing Units**: Tailwind scale of 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-20 desktop / py-12 mobile
- Container: max-w-7xl with px-6
- Grid gaps: gap-8 for cards, gap-12 for major sections

## Component Library

### Navigation
- Fixed transparent header, becomes solid on scroll
- Logo left, navigation center, CTA button right
- Mobile: Hamburger menu with full-screen overlay
- Links: "Services", "Portfolio", "Blog", "Agence", "Contact"

### Hero Section
**Large, Impactful Hero**:
- Full viewport height (min-h-screen)
- Centered content with particle/gradient background overlay
- Headline: "Epitaphe 360" (large display text)
- Subheadline: "Inspirez. Connectez. Marquez Durablement."
- Decorative particle graphics (subtle geometric shapes)
- Scroll indicator at bottom

### Services Grid
- 3-column grid desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Image top, title overlay or below
- Services: Digital, Industrie publicitaire, Contents, Communication globale, Événementiel
- Cards with subtle hover elevation effect
- Repeating carousel on mobile

### Stats Section  
- 4-column layout (grid-cols-2 lg:grid-cols-4)
- Large numbers with animated counter effect
- Labels: "Ans d'expérience", "Vision globale", "Projets réalisés", "Clients satisfaits"
- Centered alignment with decorative particle background

### Client Logos
- Infinite horizontal scrolling carousel
- Grayscale logos that saturate on hover
- Logos: Qatar Airways, HPS, Schneider Electric, Vinci Energies, etc.
- Seamless loop animation

### Benefits Section
- 2-column layout: Image left (max-w-lg), content right
- Title: "Une agence de communication 360, c'est:"
- Bulleted list with checkmarks/icons
- Image: Agency workspace/team photo

### Blog/Articles
- 3-column card grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Featured image, title, excerpt
- "Tous les articles" CTA button
- Hover: Image slight zoom, card elevation

### Portfolio/Projects
- Masonry-style grid or 2-column layout
- Project cards with large images
- Client names: Qatar Airways, Schneider Electric, Dell, SNEP, Ajial
- Overlay title on hover

### Contact Form Section
- Split layout: Form left (wider), benefits/info right
- Form fields: Prénom, Nom, Fonction, Entreprise, GSM (with country selector), Email, Message
- Benefits list with icons
- Submit button: "Envoyer" 
- Decorative particle background element

### Footer
- 3-column layout: Logo/tagline, Quick links, Contact info
- Social media icons
- Newsletter signup option
- Copyright and legal links

## Images
**Hero**: Abstract gradient/particle background (no photo, geometric pattern)
**Services**: Each service has dedicated imagery showing work type
**Benefits**: Professional office/team collaboration photo (lg image, left-aligned)
**Blog**: Article featured images (varied topics, professional photography)
**Portfolio**: Project showcase images (case studies, client work)
**Client Logos**: Transparent PNG logos on contrasting background

## Forms & Inputs
- Border radius: rounded (0.375rem standard, not rounded-sm 2px)
- Border: 1px solid, subtle
- Padding: px-4 py-3
- Focus: Ring effect with offset
- Phone input: Custom country selector dropdown
- Required fields marked with asterisk

## Interactions (Minimal)
- Smooth scroll between sections
- Navbar background transition on scroll
- Card hover: Subtle elevation (shadow-lg)
- Logo carousel: Continuous auto-scroll
- Stat numbers: Count-up animation on viewport entry
- No complex animations or transitions

## Responsive Behavior
- Desktop (lg): Full multi-column layouts
- Tablet (md): 2-column where appropriate
- Mobile: Single column, stacked layout
- Touch-friendly tap targets (min 44px)

## Accessibility
- Semantic HTML5 structure
- ARIA labels for icon-only buttons
- Form labels visible and associated
- Sufficient contrast ratios
- Keyboard navigation support