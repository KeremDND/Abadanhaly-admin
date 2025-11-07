# API Documentation

## Admin Panel API

Base URL: `http://localhost:3000/api` (development)

All API routes require authentication (except login).

---

## Authentication

### POST /api/auth/login

Login to the admin panel.

**Request Body:**
```json
{
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

---

### POST /api/auth/logout

Logout from the admin panel.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Products

### GET /api/products

Get all products.

**Response (200):**
```json
[
  {
    "id": "clx123...",
    "name": "Product Name",
    "sku": "SKU-001",
    "category": "new",
    "color": "red",
    "image": "/Images/Halylar/product.jpg",
    "description": "Product description",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/products

Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "sku": "SKU-001",
  "category": "new",
  "color": "red",
  "image": "/Images/Halylar/product.jpg",
  "description": "Product description",
  "active": true
}
```

**Response (201):**
```json
{
  "id": "clx123...",
  "name": "Product Name",
  "sku": "SKU-001",
  "category": "new",
  "color": "red",
  "image": "/Images/Halylar/product.jpg",
  "description": "Product description",
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (400):**
```json
{
  "error": "Validation error message"
}
```

---

### PUT /api/products/[id]

Update a product.

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "sku": "SKU-001",
  "category": "bestseller",
  "color": "blue",
  "image": "/Images/Halylar/product-updated.jpg",
  "description": "Updated description",
  "active": true
}
```

**Response (200):**
```json
{
  "id": "clx123...",
  "name": "Updated Product Name",
  "sku": "SKU-001",
  "category": "bestseller",
  "color": "blue",
  "image": "/Images/Halylar/product-updated.jpg",
  "description": "Updated description",
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Response (404):**
```json
{
  "error": "Product not found"
}
```

---

### DELETE /api/products/[id]

Delete a product.

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Response (404):**
```json
{
  "error": "Product not found"
}
```

---

## Translations

### GET /api/translations

Get translations for a specific page.

**Query Parameters:**
- `page` (optional): Filter by page name (e.g., "home", "gallery", "about")

**Response (200):**
```json
[
  {
    "id": "clx123...",
    "page": "home",
    "section": "hero",
    "key": "title",
    "locale": "en",
    "value": "Crafted at scale. Built for real homes.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### POST /api/translations

Batch update translations.

**Request Body:**
```json
{
  "translations": [
    {
      "page": "home",
      "section": "hero",
      "key": "title",
      "locale": "en",
      "value": "Updated title"
    },
    {
      "page": "home",
      "section": "hero",
      "key": "title",
      "locale": "ru",
      "value": "Обновленный заголовок"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Translations updated successfully",
  "count": 2
}
```

**Response (400):**
```json
{
  "error": "Validation error message"
}
```

---

## Error Responses

All API routes may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Authentication

All API routes (except `/api/auth/login`) require authentication via session cookie. The session is created after successful login and stored in an HTTP-only cookie.

To authenticate:
1. Call `POST /api/auth/login` with valid password
2. Session cookie is automatically set
3. Include cookie in subsequent requests (handled automatically by browser)

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

---

## CORS

CORS is configured for the admin panel. In production, ensure CORS is properly configured for your domain.

