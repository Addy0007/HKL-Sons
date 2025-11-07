# 🛍️ HKL & Sons - E-Commerce Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen?style=for-the-badge&logo=springboot"/>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql"/>
</p>

<p align="center">
  <i>A full-featured e-commerce platform supporting product browsing, cart & order management, authentication, and admin control.</i>
</p>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 👤 **User Authentication** | Secure login & signup using **JWT Authentication** with Spring Security |
| 🛒 **Cart & Wishlist** | Add, remove, and manage products in real-time with Redux state management |
| 💳 **Order Management** | Complete checkout flow with order summary & status tracking |
| 📦 **Admin Dashboard** | Manage products, inventory & users with role-based access control |
| 🔍 **Product Filters** | Advanced filtering by category, size, price range, brand & ratings |
| 🎨 **Responsive UI** | Seamless experience on desktop, tablet & mobile devices |
| 🔒 **Security** | Password encryption, JWT tokens, and protected API endpoints |

---

## 🧱 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Tools & Others
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)

---

## 📂 Project Structure

```
HKL-Sons/
│
├── backend/
│   ├── src/main/java/com/hkl/ecomm/
│   │   ├── config/          # Security & JWT configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── service/         # Business logic
│   │   └── utils/           # Helper utilities
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Main application pages
    │   ├── redux/           # State management
    │   ├── services/        # API integration
    │   └── App.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Java 17 or higher
- Node.js & npm
- PostgreSQL
- Maven

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Addy0007/HKL-Sons.git
cd HKL-Sons
```

### 2️⃣ Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE yourDb;
```

### 3️⃣ Backend Setup (Spring Boot)
```bash
cd backend
# Update application.properties with your database credentials
mvn clean install
mvn spring-boot:run
```

**Configure `application.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/yourDB
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update

jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000
```

Backend will run on: `http://localhost:8080`

### 4️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/{id}` | Get product by ID | No |
| POST | `/api/cart/add` | Add item to cart | Yes |
| POST | `/api/orders/create` | Create new order | Yes |
| GET | `/api/admin/users` | Get all users (Admin) | Yes (Admin) |

---

## ✅ Project Status

🚀 **In Active Development**

### Completed Features ✔️
- User authentication & authorization
- Product catalog with filters
- Shopping cart functionality
- Order placement system
- Admin dashboard basics

### Upcoming Features 🔜
- 💳 Payment Gateway Integration (Razorpay/Stripe)
- 📊 Advanced Admin Analytics Dashboard
- 📧 Email Notifications
- ⭐ Product Reviews & Ratings
- 🔔 Real-time Order Tracking
- 🎁 Discount Coupons System

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Aditya Sah**

[![Email](https://img.shields.io/badge/Email-adisah2003@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:adisah2003@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/adityasah0007)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-green?style=for-the-badge&logo=google-chrome)](https://addy0007.github.io/Portfolio)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/Addy0007)

---

<p align="center">
  <b>⭐ If you like this project, don't forget to give it a star! ⭐</b>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Addy0007">Aditya Sah</a>
</p>
