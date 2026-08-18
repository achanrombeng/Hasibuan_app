# Admin UI Overview

## Existing Features

Based on `resources/js/pages/Admin`, the following modules are implemented:

1.  **Dashboard** (`/admin`)
    - Stats cards (Products, Orders, Customers, Revenue).
    - Recent orders list.
    - Low stock alerts.

2.  **Products Management** (`/admin/products`)
    - List with search and basic classification filters (Category, Status, Sale Type).
    - Create/Edit/Delete products with image upload.
    - Stock management.

3.  **Orders Management** (`/admin/orders`)
    - List with search and status filter.
    - Order details view.
    - Status management.

4.  **Customers** (`/admin/customers`)
    - List with search (Name/Email).
    - Customer details (Total spent, Order history).

5.  **User Management** (`/admin/users`)
    - Role-based access (Super Admin, Admin, Manager, Staff).
    - CRUD operations for internal users.

6.  **Settings** (`/admin/settings`)
    - General Site Config.
    - Homepage CMS.
    - Payment Configuration.

7.  **Notifications** (`/admin/notifications`)
    - List of system alerts.
    - Mark as read / Clear all.

## Missing Features (Opportunities for "Full Feature" Admin)

To reach a truly "Full Feature" standard, the following areas could be improved:

### 1. Advanced Analytics & Charts

- **Current State**: Only text-based stats and simple lists.
- **Opportunity**: Add visual charts (using Recharts or Chart.js) for:
    - Sales trend over time (Last 7 days / 30 days).
    - Orders by status distribution (Pie chart).
    - Top selling products / categories.

### 2. Data Export & Import

- **Current State**: No visible option to export data.
- **Opportunity**: Add CSV/Excel export for:
    - Orders (for accounting/shipping).
    - Products (for inventory backup).
    - Customers (for marketing).
- **Opportunity**: Add Product Import from CSV.

### 3. Bulk Actions

- **Current State**: Operations must be done one-by-one.
- **Opportunity**: Add checkbox selection to tables for:
    - Bulk Delete (Products, Users).
    - Bulk Status Update (Orders).

### 4. Advanced Filtering

- **Current State**: Single dropdown filters.
- **Opportunity**:
    - **Date Range Picker** for Orders and Reports.
    - **Price Range** filter for Products.
    - **Multiple Selection** for Status/Category.

### 5. Audit / Activity Logs

- **Current State**: No visibility into _who_ changed _what_.
- **Opportunity**: Add a strict log of admin actions (e.g., "User X updated Product Y price from A to B"). Important for security and accountability.

### 6. Dynamic Role Management permissions

- **Current State**: Roles seem hardcoded (Super Admin, Admin, etc.).
- **Opportunity**: A UI to create custom Roles and granularly assign permissions (e.g., "Can View Orders" but "Cannot Delete Orders").

### 7. Media Manager

- **Current State**: Image upload is per-product.
- **Opportunity**: A centralized Media Library to browse, reuse, and manage uploaded assets.

### 8. UX Enhancements

- **Dark Mode**: Toggle for nighttime administration.
- **Global Search**: `CMD+K` command palette for quick navigation.
