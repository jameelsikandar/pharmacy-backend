# Pharmacy POS Backend (v1)

A **Pharmacy Point of Sale (POS) Backend** built with **Node.js, Express, TypeScript, and MongoDB**.  
This project provides a **clean, scalable, and production-ready REST API** for managing **clients, medicines, suppliers, users, and sales (POS operations).**

---

## Key Features

- **TypeScript + Express** — Strong typing with a clean REST API design
- **MVP Architecture** — Modular structure (controllers, validators, models, utilities)
- **Zod Validation** — Strict runtime validation for all requests
- **Atomic Sale Workflow** — Stock updates, receipt numbering, and historical price snapshots
- **Client Management** — Optional clients, on-the-fly client creation during sales
- **Medicine & Inventory** — Add, update, and track stock with supplier relations
- **Consistent Responses** — Unified response format with `ApiResponse` & `ApiError`
- **Multer + Cloudinary (optional)** — Image/file uploads

---

## Tech Stack

- **Node.js** – Runtime
- **Express** – Web framework
- **TypeScript** – Type safety
- **MongoDB + Mongoose** – Database & ODM
- **Zod** – Validation
- **Multer + Cloudinary** – (Optional) File/image uploads

---

## Getting Started

### Prerequisites

- Node.js **v16+**
- MongoDB **v5+**
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jameelsikandar/pharmacy-backend.git
cd pharmacy-backend

# Install dependencies
npm install
Environment Setup
Create a .env file in the root directory:

bash
Copy
Edit
PORT=5000
DATABASE_URI=mongodb://localhost:27017/pharmacy-pos
CLOUDINARY_URL=your_cloudinary_url # (optional)

** Running the Server
bash
Copy
Edit
# Development (watch mode)
npm run dev

# Build TypeScript -> JavaScript
npm run build

# Run production build
npm run start


 ** API Overview
*Authentication
    POST /api/v1/auth/login – User login

    POST /api/v1/auth/register – User registration

*Sales (POS)
    POST /api/v1/sales – Record a sale (updates stock, generates receipt, optional client creation)

    Request

json
Copy
Edit
{
  "fullName": "Ali Khan",
  "contact": "+923001234567",
  "items": [
    { "medicineId": "66c0b7f8...", "quantity": 2 },
    { "medicineId": "66c0b8a1...", "quantity": 1 }
  ]
}
Response

json
Copy
Edit
{
  "success": true,
  "message": "Sale recorded successfully!",
  "data": {
    "_id": "66d3af99...",
    "clientId": "66c4b7f9...",
    "items": [
      { "medicineId": "66c0b7f8...", "quantity": 2, "priceAtSale": 100 },
      { "medicineId": "66c0b8a1...", "quantity": 1, "priceAtSale": 300 }
    ],
    "total": 500,
    "receiptNumber": 123,
    "createdAt": "2025-08-21T10:00:00.000Z"
  }
}
💊 Medicines
GET /api/v1/medicines — Get all medicines (pagination + filtering)

POST /api/v1/medicines — Create a medicine

GET /api/v1/medicines/:id — Get medicine by ID

PUT /api/v1/medicines/:id — Update medicine

DELETE /api/v1/medicines/:id — Delete medicine

👥 Clients
CRUD operations (/api/v1/clients)

🚚 Suppliers
CRUD operations (/api/v1/suppliers)

📂 Project Structure
bash
Copy
Edit
pharmacy-backend/
├── src/
│   ├── controllers/   # REST controllers
│   ├── models/        # Mongoose schemas
│   ├── validators/    # Zod validation schemas
│   ├── routes/        # Express routers
│   ├── utils/         # Helpers (ApiError, ApiResponse, asyncHandler, validateDto)
│   └── app.ts         # Express setup
├── tests/             # Unit & integration tests (planned)
├── .env.example       # Example environment config
├── tsconfig.json      # TypeScript config
└── README.md
📑 API Response Format
✅ Success

json
Copy
Edit
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
❌ Error

json
Copy
Edit
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
🗺 Roadmap
MongoDB transactions for safer stock operations

Reporting APIs (sales summary, best-sellers, low stock)

Payment methods (cash, card, mobile)

Return/Refund functionality

Barcode scanning support

React + TypeScript frontend integration

Unit & integration testing

API documentation (Swagger/OpenAPI)

Role-based access control

Audit logging

🤝 Contributing
Fork the repo

Create a feature branch

bash
Copy
Edit
git checkout -b feature/your-feature
Commit changes

bash
Copy
Edit
git commit -m "Add your feature"
Push & open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for details.

👨‍💻 Author
Jameel Sikandar
🔗 GitHub: @jameelsikandar

📌 Status
🚧 Active Development — MVP Ready
```
