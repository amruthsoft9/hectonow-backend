# Yoo Backend

This is the backend for **Yoo**, a food delivery platform similar to Swiggy. It handles user authentication, order management, payments, and product listings.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** Firebase Auth / JWT
- **Payment Gateway:** Razorpay

---

## 📌 Setup & Installation

### 1️⃣ Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/yoo-backend.git
cd yoo-backend
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=yoo_db
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 5️⃣ Run the Server
```bash
npm start
```
The backend will be running at `http://localhost:5000`.

---

## 📂 Project Structure
```
📦 yoo-backend
 ┣ 📂 controllers      # Handles business logic
 ┣ 📂 models           # Database models (MySQL)
 ┣ 📂 routes           # API routes
 ┣ 📂 middleware       # Authentication & validation
 ┣ 📂 config           # Database & environment setup
 ┣ 📜 server.js        # Main entry point
 ┣ 📜 package.json     # Dependencies & scripts
 ┗ 📜 .env.example     # Environment variable example
```

---

## 🔥 API Endpoints
| Method | Endpoint           | Description              |
|--------|-------------------|--------------------------|
| POST   | `/auth/signup`    | Register a new user      |
| POST   | `/auth/login`     | Login and get JWT token  |
| GET    | `/products`       | Get all products         |
| GET    | `/orders`         | Get user orders          |
| POST   | `/orders/create`  | Place an order           |
| POST   | `/payment`        | Handle Razorpay payments |

---

## 🚀 Deployment

### Deploy with PM2 (Production)
```bash
npm install -g pm2
pm run build
pm start
pm2 start server.js --name yoo-backend
```

### Deploy to a Cloud Server
- Use **AWS EC2**, **DigitalOcean**, or **Vercel**.
- Setup **Nginx** as a reverse proxy.
- Use **Docker** for containerization.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

---



