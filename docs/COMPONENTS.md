# Components Documentation

## Main Website Components

### Layout Components

#### Header
**Location**: `src/components/layout/Header.tsx`

Main navigation header with language switcher and menu items.

**Props**:
- `currentPage`: Current page identifier
- `onNavigate`: Navigation callback function

**Features**:
- Responsive navigation menu
- Language switcher
- Active page highlighting

---

#### Footer
**Location**: `src/components/layout/Footer.tsx`

Website footer with company information and links.

**Props**:
- `onNavigate`: Navigation callback function

**Features**:
- Company description
- Quick links
- Contact information
- Certificates list

---

#### LanguageToast
**Location**: `src/components/layout/LanguageToast.tsx`

Toast notification for language selection.

**Features**:
- Auto-dismissible
- Smooth animations
- Accessible

---

### Homepage Components

#### Hero
**Location**: `src/components/home/Hero.tsx`

Main hero section with 3D product viewer and call-to-action.

**Props**:
- `onNavigate`: Navigation callback function

**Features**:
- 3D product viewer
- Statistics display
- Smooth scroll animations
- Responsive design

---

#### Statistics
**Location**: `src/components/home/Statistics.tsx`

Statistics section displaying company metrics.

**Features**:
- Animated counters
- Responsive grid layout

---

#### Contact
**Location**: `src/components/home/Contact.tsx`

Contact form section.

**Features**:
- Form validation
- Email submission
- Responsive design

---

### Gallery Components

#### Gallery
**Location**: `src/components/gallery/Gallery.tsx`

Main gallery page component.

**Features**:
- Product filtering
- Search functionality
- Color filters
- Category tabs
- Responsive grid

---

#### GalleryGrid
**Location**: `src/components/gallery/GalleryGrid.tsx`

Grid layout for displaying products.

**Props**:
- `products`: Array of products
- `onProductClick`: Product click handler

**Features**:
- Responsive grid
- Lazy loading
- Image optimization

---

#### GalleryCard
**Location**: `src/components/gallery/GalleryCard.tsx`

Individual product card component.

**Props**:
- `product`: Product data
- `onClick`: Click handler

**Features**:
- Product image
- Product information
- Hover effects
- AR/3D viewer link

---

### Collaboration Components

#### Collaboration
**Location**: `src/components/collaboration/Collaboration.tsx`

Collaboration page component.

**Features**:
- Hero section
- Partnership information
- Product programs
- Certifications display
- Contact section

---

### About Components

#### About
**Location**: `src/components/about/About.tsx`

About page component.

**Props**:
- `onNavigate`: Navigation callback function

**Features**:
- Company history
- Milestones timeline
- Certifications
- Mission statement
- Statistics

---

### Shared Components

#### Product3DViewer
**Location**: `src/components/shared/Product3DViewer.tsx`

3D product viewer component using Three.js.

**Props**:
- `product`: Product data
- `onClose`: Close handler

**Features**:
- 3D model rendering
- Interactive controls
- Responsive design

---

## Admin Panel Components

### ProductsManager
**Location**: `admin/src/components/ProductsManager.tsx`

Product management interface.

**Features**:
- Product listing
- Create/Edit/Delete products
- Product filtering
- Search functionality
- Form validation

**State Management**:
- Local state with React hooks
- API integration for CRUD operations

---

### TranslationsManager
**Location**: `admin/src/components/TranslationsManager.tsx`

Translation management interface.

**Features**:
- Translation listing by page
- Edit translations
- Batch updates
- Multi-language support
- Search and filter

**State Management**:
- Local state with React hooks
- API integration for updates

---

## Component Patterns

### Props Interface
All components use TypeScript interfaces for props:

```typescript
interface ComponentProps {
  prop1: string;
  prop2?: number; // Optional
  onAction: (value: string) => void;
}
```

### State Management
- **Local State**: `useState`, `useReducer` for component-specific state
- **Global State**: React Context for shared state (Auth, Language)
- **Server State**: Next.js Server Components for admin panel

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Not currently implemented (future enhancement)

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management

### Performance
- Code splitting with `React.lazy()`
- Image lazy loading
- Memoization where appropriate
- Optimized re-renders

---

## Best Practices

### Component Structure
1. Import statements
2. Type definitions
3. Component function
4. Hooks
5. Event handlers
6. Render logic
7. Export

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard`)
- Props: camelCase (e.g., `onProductClick`)
- Files: Match component name (e.g., `ProductCard.tsx`)

### Code Organization
- One component per file
- Related components in same directory
- Shared components in `shared/` directory
- Feature-specific components in feature directories

### Documentation
- JSDoc comments for complex functions
- TypeScript types for all props
- Clear prop names
- Example usage in comments

---

## Future Enhancements

- [ ] Storybook for component documentation
- [ ] Component testing with React Testing Library
- [ ] Design system documentation
- [ ] Component playground
- [ ] Accessibility audit
- [ ] Performance benchmarks

