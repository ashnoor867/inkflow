# ✨ InkFlow
[🚀 Live Demo](https://inkflow-2r0b.onrender.com/)

_A simple and elegant blogging platform for developers to share their thoughts._

---

## 🚀 Features

- ✍️ Create and publish blog posts  
- 🔐 Log in securely with GitHub  
- 📖 Read and explore blogs written by others  

---

## 🛠️ Getting Started

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongo_connection_string
   SESSION_SECRET=your_session_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Start the application**

   Run in production mode:
   ```bash
   npm start
   ```

   Or in development mode:
   ```bash
   npm run dev
   ```

---

## 🧰 Built With

- **Express** – Fast and minimalist Node.js web framework  
- **MongoDB** – NoSQL database for storing blogs and users  
- **Handlebars** – Simple templating engine for dynamic pages  
- **Passport.js** – Authentication middleware (using GitHub strategy)  

---

## 📸 Preview

[![InkFlow Screenshot][product-screenshot]](https://inkflow-2r0b.onrender.com/)

[product-screenshot]: ./screenshot.png
