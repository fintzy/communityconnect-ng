<p align="center">
  <img src="docs/images/banner.webp" alt="CommunityConnect NG Banner" width="100%">
</p>

<h1 align="center">CommunityConnect NG 🇳🇬</h1>

<p align="center">
A modern full-stack civic engagement and community issue reporting platform that empowers Nigerian citizens to report local issues, collaborate with government authorities, and promote transparent community development.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 📖 Overview

CommunityConnect NG is a civic technology platform designed to bridge the communication gap between citizens and local government authorities.

Residents can report community issues such as:

- 🛣 Road damage
- 💡 Power outages
- 💧 Water supply failures
- 🗑 Waste management
- 🏥 Healthcare concerns
- 🎓 Education issues
- 🚨 Security incidents

while Administrators and Super Administrators can monitor reports, manage users, analyze trends, and oversee community engagement through an interactive dashboard.

---

# ✨ Features

## 👥 Resident Portal

- Secure Authentication
- Community Issue Reporting
- Report Tracking
- Comment System
- Upvoting
- Notification Center
- Personal Dashboard

---

## 🛡 Admin Dashboard

- Report Moderation
- Status Management
- Resolution Workflow
- Community Analytics
- User Management
- Notification Management

---

## 👑 Super Admin

- System-wide Analytics
- Role Management
- Platform Monitoring
- Administrative Controls
- Developer Console

---

# 🏗 Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

---

## Backend

- Node.js
- Express.js
- REST API Architecture
- Middleware
- Controllers
- Services

---

## Database

- PostgreSQL
- Prisma ORM
- Prisma Migrations

---

## Development Tools

- ESLint
- TypeScript
- Vite
- npm
- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```text
communityconnect-ng
│
├── docs/
│   └── images/
│
├── public/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── assets/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/fintzy/communityconnect-ng.git

```bash
cd communityconnect-ng
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Install Backend Dependencies

```bash
cd server
npm install
```

---

## Configure Environment Variables

Frontend

```env
VITE_API_URL=http://localhost:3000
```

Backend

```env
DATABASE_URL="postgresql://username:password@localhost:5432/communityconnect"
JWT_SECRET=your-secret-key
PORT=5000
```

---

## Run Prisma

```bash
npx prisma generate 

npx prisma migrate dev
```

---

## Start Backend

```bash
cd server

npm run dev

===================================
 CommunityConnect NG API
 Running on http://localhost:5000
===================================
```

---

## Start Frontend

```bash
npm run dev
```

---

# 📸 Screenshots

| HOME |
|------------------|
<p align="center">
  <img src="docs/images/home.png" alt="Home" width="100%">
</p>

| DASHBOARD |
|------------------|
<p align="center">
  <img src="docs/images/db.png" alt="Dashboard" width="100%">
</p>

| ADMIN DASHBOARD & ANALYTICS |
|-----------------------------|
| <p align="center">
  <img src="docs/images/admindb.png" alt="Admin Dashboard & Analytics" width="100%">
</p>

---

# 📊 Current Status

## Completed

- Authentication UI
- Resident Dashboard
- Admin Dashboard
- Super Admin Dashboard
- Notifications
- Comment System
- Analytics Dashboard
- Developer Console
- Prisma Database Configuration
- Express Backend Structure
- PostgreSQL Configuration

---

## In Progress

- Backend API Integration
- Production Authentication
- File Uploads
- Email Notifications
- Real-time Updates

---

# 🌍 Future Improvements

- Mobile Application
- Push Notifications
- AI Issue Categorization
- GIS Mapping
- Offline Reporting
- SMS Integration
- Government Portal
- Multi-language Support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Okutu Anthony**

IT Support • Virtual Assistant • Full Stack Developer

Built as part of the **3MTT Nigeria Software Development Programme**.

---

<p align="center">

Made with ❤️ for stronger Nigerian communities 🇳🇬

</p>