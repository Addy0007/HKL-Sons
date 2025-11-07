# 🛍️ HKL & Sons - E-Commerce Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen?style=for-the-badge&logo=springboot"/>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql"/>
</p>

<p align="center">
  <i>A secure, full-featured e-commerce platform with JWT authentication, role-based access control, and comprehensive product management.</i>
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
- Node.js & npm (v16+)
- PostgreSQL (v12+)
- Maven (v3.6+)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Addy0007/HKL-Sons.git
cd HKL-Sons
```

### 2️⃣ Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE hklsons;
```

### 3️⃣ Backend Configuration

**⚠️ IMPORTANT: Never commit sensitive credentials to version control**

#### Create Environment Configuration

**Option A: Using Environment Variables (Recommended)**

Create a `.env` file in the `backend/` directory:
```bash
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/hklsons
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_256_bits
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
```

**⚠️ Add `.env` to your `.gitignore` file:**
```bash
echo ".env" >> .gitignore
```

**Option B: Using application.properties**

Update `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Server Configuration
server.port=${SERVER_PORT:8080}
```

#### Generate Secure JWT Secret

Use one of these methods to generate a secure JWT secret:

**Method 1: Using OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 64
```

**Method 2: Using Java**
```java
import java.security.SecureRandom;
import java.util.Base64;

public class SecretGenerator {
    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[64];
        random.nextBytes(bytes);
        String secret = Base64.getEncoder().encodeToString(bytes);
        System.out.println(secret);
    }
}
```

**Method 3: Using Online Tool (Development Only)**
- Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- Select 256-bit or 512-bit encryption key

### 4️⃣ Run the Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

### 5️⃣ Frontend Configuration

Create a `.env` file in the `frontend/` directory:
```bash
REACT_APP_API_URL=http://localhost:8080/api
```

**⚠️ Add to `.gitignore`:**
```bash
echo ".env" >> .gitignore
```

### 6️⃣ Run the Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 🔒 Security Best Practices

### ✅ What This Project Implements:
- ✔️ JWT-based authentication
- ✔️ Password encryption using BCrypt
- ✔️ Role-based access control (RBAC)
- ✔️ Protected API endpoints
- ✔️ CORS configuration
- ✔️ Input validation

### 🚨 For Production Deployment:

1. **Environment Variables**
   - Never hardcode credentials
   - Use cloud secret managers (AWS Secrets Manager, Azure Key Vault, etc.)

2. **Database Security**
   - Use connection pooling
   - Enable SSL/TLS for database connections
   - Implement database access restrictions by IP

3. **API Security**
   - Enable HTTPS only
   - Implement rate limiting
   - Add API request validation
   - Set up CORS properly for production domains

4. **JWT Security**
   - Use strong secrets (minimum 256 bits)
   - Implement token refresh mechanism
   - Set appropriate expiration times
   - Store tokens securely (HttpOnly cookies)

5. **Additional Measures**
   - Regular dependency updates
   - Security headers (Helmet.js for Node/Express if applicable)
   - SQL injection prevention (handled by JPA/Hibernate)
   - XSS protection
   - CSRF tokens for state-changing operations

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/{id}` | Get product by ID | No |
| POST | `/api/cart/add` | Add item to cart | Yes (User) |
| GET | `/api/cart` | Get user cart | Yes (User) |
| POST | `/api/orders/create` | Create new order | Yes (User) |
| GET | `/api/orders/user` | Get user orders | Yes (User) |
| GET | `/api/admin/users` | Get all users | Yes (Admin) |
| POST | `/api/admin/products` | Create product | Yes (Admin) |
| PUT | `/api/admin/products/{id}` | Update product | Yes (Admin) |
| DELETE | `/api/admin/products/{id}` | Delete product | Yes (Admin) |

**Note:** Replace `/api` with your actual base URL in production.

---

## ✅ Project Status

🚀 **In Active Development**

### Completed Features ✔️
- User authentication & authorization
- Product catalog with filters
- Shopping cart functionality
- Order placement system
- Admin dashboard basics
- Role-based access control

### Upcoming Features 🔜
- 💳 Payment Gateway Integration (Razorpay/Stripe)
- 📊 Advanced Admin Analytics Dashboard
- 📧 Email Notifications (Order confirmation, shipping updates)
- ⭐ Product Reviews & Ratings
- 🔔 Real-time Order Tracking
- 🎁 Discount Coupons System
- 📱 Mobile App (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Please ensure:**
- Code follows existing style guidelines
- All tests pass
- No sensitive data is committed
- Environment variables are documented

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

This is a learning/portfolio project. For production use:
- Implement additional security measures
- Conduct security audits
- Use proper secret management
- Follow OWASP security guidelines
- Ensure compliance with data protection regulations (GDPR, etc.)

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
