# CommunityConnect NG 🇳🇬

> A modern community issue reporting and civic engagement platform that empowers Nigerian residents to report local problems, collaborate with their communities, and monitor government responses.

![CommunityConnect NG](./public/logo.png)

---

## 📖 Project Overview

CommunityConnect NG is a full-stack civic engagement platform designed to bridge the communication gap between citizens and local government authorities.

The platform enables residents to report issues such as:

- 🛣 Road damages
- 💧 Water supply issues
- ⚡ Power outages
- 🗑 Sanitation concerns
- 🏥 Health-related emergencies
- 🏫 Education infrastructure issues
- 🚓 Security incidents
- 📢 Community announcements

Residents can submit reports, track progress, receive notifications, comment on issues, and upvote existing reports to increase their visibility.

Administrators can review reports, update statuses, publish announcements, and manage community activities through a dedicated dashboard.

---

# ✨ Features

## 👤 Authentication

- User Registration
- Secure Login
- Role-Based Authentication
- Resident Accounts
- Administrator Accounts

---

## 📋 Report Management

- Create Reports
- Edit Reports
- View Reports
- Report Categories
- Report Status Tracking
- Upvote Reports
- Comment on Reports

---

## 📢 Community Features

- Community Announcements
- Notifications
- Community Discussions
- Ward-based Reporting
- LGA-based Reporting

---

## 👨‍💼 Admin Dashboard

Administrators can:

- Review reports
- Change report status
- Publish announcements
- Monitor community activity
- View audit logs
- Manage users

---

## 🔐 Security

- JWT Authentication (Simulated)
- Role-based Authorization
- Audit Logging
- Row Level Security Design
- Protected Routes

---

## 🧑‍💻 Developer Console

Includes:

- Database Schema
- Data Browser
- JWT Viewer
- Audit Logs
- API Documentation
- Test Accounts

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Lucide React Icons

---

## State Management

- React Hooks
- Local Store Service

---

## Development Tools

- ESLint
- TypeScript
- Vite
- npm

---

# 📂 Project Structure

```
communityconnect-ng/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/communityconnect-ng.git
```

Move into project folder

```bash
cd communityconnect-ng
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🏗 Build for Production

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

# 🧹 Code Quality

Run ESLint

```bash
npm run lint
```

Run TypeScript checks

```bash
npm run typecheck
```

---

# 🔑 Demo Accounts

## Administrator

Email

```
admin@communityconnect.ng
```

Password

```
password
```

---

## Resident

Email

```
chioma@example.com
```

Password

```
password
```

---

## Resident

Email

```
emeka@example.com
```

Password

```
password
```

---

# 📚 API Overview

Authentication

```
POST /api/auth/login
POST /api/auth/register
```

Reports

```
GET /api/reports
POST /api/reports
PATCH /api/reports/:id/status
POST /api/reports/:id/upvote
```

Comments

```
GET /api/reports/:id/comments
POST /api/reports/:id/comments
```

---

# 🗄 Database Schema

Core Tables

- users
- reports
- comments
- announcements
- notifications
- audit_logs

---

# 🔐 Row Level Security

The project demonstrates Row-Level Security (RLS) concepts including:

- User-specific profile access
- Report ownership
- Administrator privileges
- Protected updates
- Audit logging

---

# 📱 Responsive Design

Designed for:

- Desktop
- Tablet
- Mobile Devices

---

# 🎨 Theme

Primary Colors

- Royal Green (#0F4C3A)
- White
- Gold (#D4AF37)
- Black

---

# 📈 Future Improvements

The following features are planned for future releases:

- Real Backend API
- PostgreSQL Database
- Supabase Integration
- Email Verification
- Password Reset
- Push Notifications
- Image Uploads
- Geolocation Support
- Google Maps Integration
- Real-time Chat
- AI-powered Report Categorization
- Analytics Dashboard
- Offline Support (PWA)
- Multi-language Support
- SMS Notifications
- Government Portal Integration

---

# 📸 Screenshots

Add screenshots after running the application.

Example:

```
screenshots/

├── login.png
├── dashboard.png
├── reports.png
├── developer-console.png
├── admin-dashboard.png
├── notifications.png
```

Example Markdown

```md
## Login

![Login](screenshots/login.png)

## Dashboard

![Dashboard](screenshots/dashboard.png)

## Reports

![Reports](screenshots/reports.png)

## Developer Console

![Developer Console](screenshots/developer-console.png)
```

---

# 🧪 Testing

Current Quality Status

✅ ESLint Passed

✅ TypeScript Passed

✅ Production Build Passed

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Okutu, Ikechukwuka Anthony**

IT Consultant • Virtual Assistant • Full Stack Developer

Built as part of the **3 Million Technical Talent (3MTT) Programme**.

---

# 🙏 Acknowledgements

Special thanks to:

- 3MTT Nigeria
- Federal Ministry of Communications, Innovation & Digital Economy
- React Team
- Vite Team
- Tailwind CSS
- Framer Motion
- Lucide Icons

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

---