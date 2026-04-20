# Features

## Storefront

- Browse products on the homepage
- Filter products by category
- View product details and images
- Add products to cart
- Recommended products display in the cart

## Shopping Cart

- Persistent cart state via React context
- Update quantity or remove items
- Order summary with subtotal and total
- Empty cart state handling

## Admin Panel

- Dashboard overview with total products, categories, and users
- Manage products: list, create, edit, delete
- Manage categories: list, create, edit, delete
- Manage users and roles
- Protected routes requiring authentication

## Authentication

- Login page for admin access
- Session creation using JWT stored in cookies
- Role-based session checks
- Middleware redirects to protect `/admin` pages

## Database Models

- `User` with roles: `SUPERUSER`, `ADMIN`, `USER`
- `Category` with slug, description, and product relation
- `Product` with price, description, image, ratings, and variants
- `ProductVariant` for size/color and stock management

## Seeder

- Default admin users seeded with secure hashed passwords
- Initial categories and products seeded for fast start
