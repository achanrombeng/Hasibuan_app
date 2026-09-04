# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

**Ronica** is a full-stack e-commerce furniture platform built with:
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **SSR/Routing**: Inertia.js (supports SSR mode)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **Testing**: Pest PHP
- **Database**: MySQL 8.0+ / MariaDB 10.6+
- **Queue**: Database-driven (configurable to Redis)
- **Payment Gateway**: Midtrans
- **Shipping**: RajaOngkir API

## Development Commands

### Setup
```bash
# Initial setup (install dependencies, generate key, migrate DB, build assets)
composer setup

# Or manually:
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
```

### Development Servers
```bash
# Start all dev services (Laravel server + queue worker + Vite)
composer dev

# SSR mode (includes SSR server + logs)
composer dev:ssr
npm run build:ssr  # Build SSR bundle separately

# Individual services:
php artisan serve          # Backend server (port 8000)
npm run dev               # Vite dev server
php artisan queue:listen  # Queue worker
php artisan pail          # Real-time logs
```

### Building & Assets
```bash
npm run build       # Production build
npm run build:ssr   # SSR production build
```

### Code Quality
```bash
# Linting & Formatting
npm run lint             # ESLint (with auto-fix)
npm run format           # Prettier format
npm run format:check     # Check formatting
npm run types            # TypeScript type check
./vendor/bin/pint        # PHP code style (Laravel Pint)
./vendor/bin/phpstan analyse  # Static analysis

# Testing
./vendor/bin/pest                    # Run all tests
./vendor/bin/pest --coverage         # With coverage
./vendor/bin/pest --filter=ProductTest  # Single test
composer test                        # Alias for pest
```

## Architecture Overview

### Route Organization

The application uses **three separate route namespaces**:

1. **Shop Routes** (`routes/shop.php`): Customer-facing storefront
   - Prefix: `/shop`
   - Namespace: `App\Http\Controllers\Shop`
   - Handles: Product catalog, cart, checkout, orders, wishlist
   - Cart accessible to both guests and authenticated users via `share.cart` middleware

2. **Admin Routes** (`routes/admin.php`): Admin panel
   - Prefix: `/admin`
   - Namespace: `App\Http\Controllers\Admin`
   - Middleware: `auth`, `verified`, `role:admin|super-admin|manager|staff`
   - Handles: Dashboard, product/category management, orders, reports, settings
   - Super admin routes for user management and global settings

3. **Settings Routes** (`routes/settings.php`): User account settings
   - Prefix: `/settings`
   - Namespace: `App\Http\Controllers\Settings`
   - Middleware: `auth`
   - Handles: Profile, password, 2FA, addresses, appearance

4. **Web Routes** (`routes/web.php`): Root routing and auth
   - Root `/` redirects to `shop.home`
   - Dashboard redirects admins to `/admin`
   - Includes sitemap routes

### Actions Pattern

The codebase uses **Action classes** (Single Responsibility Principle) in `app/Actions/` to encapsulate business logic outside controllers:
- Cart actions (e.g., `Cart\CalculateCartTotals`, `Cart\MergeGuestCart`)
- Category actions (e.g., `Category\UpdateCategoryHierarchy`)
- Checkout actions (e.g., `Checkout\CreateOrderFromCart`, `Checkout\ProcessPayment`)
- Order actions (e.g., `Order\CancelOrder`, `Order\UpdateOrderStatus`)
- Product actions (e.g., `Product\UpdateProductStock`)
- Promo banner actions

Controllers should remain thin and delegate to Action classes for complex operations.

### Frontend Structure

React components in `resources/js/`:
- **pages/**: Inertia.js page components (Admin, Shop, Customer, auth, settings)
- **layouts/**: Layout wrappers (ShopLayout, AdminLayout, AppLayout, AuthLayout)
- **components/**: Reusable UI components (including shadcn/ui components)
- **actions/**: Frontend actions (TypeScript client-side logic)
- **hooks/**: Custom React hooks
- **contexts/**: React contexts
- **routes/**: Frontend route utilities
- **utils/**: Utility functions
- **types/**: TypeScript type definitions
- **wayfinder/**: Laravel Wayfinder integration (type-safe routing)

### Models & Relationships

Key models in `app/Models/`:
- **User**: Has roles (Spatie Permission), addresses, orders, cart, wishlist
- **Product**: Has categories, images (MediaLibrary), reviews, cart items, order items
- **Category**: Hierarchical (parent/children), has products
- **Order**: Has items, payment, belongs to user
- **Cart**: Has items, belongs to user or guest (session_id)
- **Address**: Belongs to user, has default flag
- **ProductReview**: Belongs to product and user

### Enums

Type-safe enums in `app/Enums/`:
- `OrderStatus`: pending, processing, shipped, delivered, cancelled, etc.
- `PaymentMethod`: bank_transfer, credit_card, e_wallet, cod, qris
- `PaymentStatus`: pending, paid, failed, refunded
- `ProductStatus`: draft, published, archived

### Middleware

- `HandleInertiaRequests`: Shares global data (auth, cart, settings) to all Inertia pages
- `ShareCartData`: Shares cart data to all shop routes (guest and authenticated)
- `HandleAppearance`: Theme/appearance handling

### Authentication & Authorization

- **Laravel Fortify**: Handles authentication (login, register, 2FA)
- **Spatie Laravel Permission**: Role-based access control
  - Roles: `super-admin`, `admin`, `manager`, `staff`, `customer`
  - Admin middleware checks: `role:admin|super-admin|manager|staff`
- **Laravel Sanctum**: API token authentication (if needed)

### Guest Cart Handling

The application supports **guest carts** stored by `session_id`:
- Guest users can add items to cart without authentication
- On login, guest cart merges with user cart via `MergeGuestCart` action
- `ShareCartData` middleware makes cart available to all shop pages

### Payment Integration

- **Midtrans**: Primary payment gateway
- Configuration in `.env`: `midtrans_server_key`, `midtrans_client_key`, `midtrans_is_production`
- Payment flow handled in checkout actions

### Media Management

- **Spatie MediaLibrary**: Product images stored via `ProductImage` model
- Storage linked: `php artisan storage:link`

### Database Seeders

Comprehensive seeders in `database/seeders/`:
- `RoleAndPermissionSeeder`: Sets up roles and permissions
- `UserSeeder`: Creates admin and test users
- `CategorySeeder`: Product categories
- `ProductSeeder`: Sample products with images
- `OrderSeeder`: Sample orders
- `ProductReviewSeeder`: Sample reviews
- `NotificationSeeder`: Sample notifications

Run: `php artisan db:seed`

## Important Conventions

### Currency Formatting
Global helper functions in `app/Helpers/helpers.php`:
- `format_rupiah(int|float|null $amount, bool $withSymbol = true): string` - Format as IDR
- `parse_rupiah(string $formatted): int` - Parse formatted string to integer

All prices are stored as integers (cents) and formatted for display.

### Inertia Page Props
Common props shared via `HandleInertiaRequests`:
- `auth.user`: Current authenticated user with roles
- `cart`: Cart data (items, totals) for shop pages
- `flash`: Flash messages
- `settings`: Application settings

### TypeScript & React
- Uses React 19 with **React Compiler** (babel-plugin-react-compiler)
- TypeScript strict mode enabled
- shadcn/ui components for UI primitives
- Radix UI for accessible components
- Framer Motion for animations
- cmdk for command palette

### Route Naming
- Shop: `shop.*` (e.g., `shop.products.show`, `shop.cart.index`)
- Admin: `admin.*` (e.g., `admin.products.index`, `admin.orders.show`)
- Settings: `profile.edit`, `user-password.update`, etc.

### API Resources
Laravel API Resources in `app/Http/Resources/` transform models for JSON responses:
- Used for Inertia props and API endpoints
- Example: `CategoryResource`, `ProductResource`

## Environment Variables

Key variables in `.env`:
```env
# App
APP_NAME="Ronica"
APP_LOCALE=id              # Indonesian locale
APP_FAKER_LOCALE=id_ID

# Database
DB_CONNECTION=mysql
DB_DATABASE=latif_ecommerce

# Queue & Cache
QUEUE_CONNECTION=database  # or redis
CACHE_STORE=database       # or redis

# Payment (Midtrans)
midtrans_server_key=
midtrans_client_key=
midtrans_is_production=false

# Shipping (RajaOngkir)
RAJAONGKIR_API_KEY=
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
RAJAONGKIR_ORIGIN_ID=153
```

## Key Packages

### Backend
- **spatie/laravel-permission**: Role & permission management
- **spatie/laravel-medialibrary**: Media/image management
- **spatie/laravel-query-builder**: API filtering & sorting
- **spatie/laravel-data**: DTOs & data transformation
- **laravel/wayfinder**: Type-safe routing for Inertia
- **midtrans/midtrans-php**: Payment gateway

### Frontend
- **@inertiajs/react**: Inertia.js React adapter
- **@radix-ui/***: Accessible UI primitives
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **cmdk**: Command palette
- **tailwind-merge**: Tailwind class merging
- **class-variance-authority**: Component variants

## Testing Strategy

- Use Pest PHP for all tests
- Feature tests in `tests/Feature/`
- Unit tests in `tests/Unit/`
- Test factories in `database/factories/`
- Run with coverage to ensure quality
