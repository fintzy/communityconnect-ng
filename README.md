<p align="center">
  <img src="docs/images/banner.webp" alt="CommunityConnect NG Banner" width="100%">
</p>

<h1 align="center">CommunityConnect NG</h1>

<p align="center">
A modern full-stack civic engagement platform that empowers Nigerian citizens to report local issues, engage with their communities, and enable transparent communication between residents and community administrators.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 📖 OVERVIEW

CommunityConnect NG is a full-stack civic technology platform built to bridge the communication gap between citizens, community leaders, and government authorities.

Residents can easily report issues affecting their communities, while administrators monitor reports, manage users, analyze trends, and coordinate community engagement from a centralized dashboard.

---

# ✨ Features

## 👥 Citizen Portal

- Secure Authentication
- Community Issue Reporting
- Issue Tracking
- Comment System
- Upvote Reports
- Notifications
- Personal Dashboard
- Profile Management

---

## 🛡 Administrator Portal

- Report Moderation
- Report Approval
- Status Management
- User Management
- Community Analytics
- User Management
- Notification Management

---

## 👑 Super Administrator

- Platform-wide Analytics
- Role Management
- Community Management
- System Monitoring
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
- REST API
- JWT Authentication
- Prisma ORM

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
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
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
│   ├── package.json
│   └── .env
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# To Get Started

## Clone Repository

```bash
git clone https://github.com/fintzy/communityconnect-ng.git

```bash
cd communityconnect-ng
```

---

## Install Frontend

```bash
npm install
```

---

## Install Backend

```bash
cd server

npm install
```

---

# ⚙ Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Backend (server/.env)

```env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key

PORT=5000
```

---

# 🗄 Prisma

Generate the Prisma Client

```bash
cd server

npx prisma generate
```

Run Migrations

```bash
npx prisma migrate dev
```

---

# ▶ Running the Backend

```bash
cd server

npm run dev
```

Server

```
http://localhost:5000
```

---

# ▶ Running the Frontend

```bash
npm run dev
```

Application

```
http://localhost:3000
```

---

# 📸 Screenshots

## Home Page

<p align="center">
<img src="docs/images/home.png" width="100%">
</p>

---

## Resident Dashboard

<p align="center">
<img src="docs/images/db.png" width="100%">
</p>

---

## Admin Analytics Dashboard

<p align="center">
<img src="docs/images/admindb.png" width="100%">
</p>

---

# 📊 Project Status

## ✅ Completed

- Responsive User Interface
- Resident Dashboard
- Administrator Dashboard
- Super Admin Dashboard
- Authentication Flow
- Notifications
- Report Management
- Comment System
- Analytics Dashboard
- Express Backend
- PostgreSQL Integration
- Prisma ORM Configuration

---

## 🚧 In Progress

- API Integration
- File Uploads
- Email Notifications
- Live Updates
- Production Deployment

---

# 🌍 Roadmap

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

1. Fork this repository

2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Okutu Ikechukwuka Anthony**

IT Support • Virtual Assistant • Full Stack Developer

Built as part of the **3MTT Nigeria Software Development Programme**.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

<p align="center">

Made with ❤️ for stronger Nigerian communities.

</p>