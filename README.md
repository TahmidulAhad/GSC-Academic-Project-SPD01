# Grameen Service Connect

## Overview

Grameen Service Connect is a full-stack web platform connecting rural citizens (help seekers) with urban volunteers and service providers. Built to bridge the gap between village needs and city resources through digital service requests, messaging, and file sharing.

## Features

- User Authentication (JWT-based)
- Role-Based Access (Help Seeker, Volunteer, Admin)
- Service Requests with file attachments
- Real-time Messaging
- File Uploads (Multer)
- Responsive UI
- Admin Dashboard

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0+) - XAMPP recommended for local development
- **npm** or **yarn** package manager

## Installation

1. Clone the repository
2. Set up MySQL database and import schema from `server/sql/schema_with_description.sql`
3. Install backend dependencies: `cd server && npm install`
4. Install frontend dependencies: `cd .. && npm install`
5. Configure environment files (.env for frontend, server/.env for backend)
6. Start servers: `npm run dev` (frontend) and `cd server && npm run dev` (backend)

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/profile` - Get current user profile (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (with avatar upload)

### Service Requests
- `POST /api/requests` - Create new request (with file attachments)
- `GET /api/requests` - List all requests (with filters)
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request status
- `GET /api/requests/my-requests` - Get user's own requests

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages?requestId=` - List messages for a request

### Testimonials
- `POST /api/testimonials` - Submit testimonial
- `GET /api/testimonials` - List testimonials

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for robust component development
- **Vite** for fast build tooling and development server
- **Zustand** for efficient state management
- **Axios** for HTTP client operations
- **Tailwind CSS** with custom styling for responsive design

### Backend
- **Node.js** with Express framework
- **TypeScript** for type-safe server-side development
- **MySQL** database with mysql2 driver
- **JWT** for secure token-based authentication
- **Multer** for handling file uploads
- **bcrypt** for password hashing and security

### Development Tools
- **XAMPP** for local MySQL development environment
- **npm** for dependency management

## 📂 Project Structure

```
grameen-service-connect/
├── components/              # Reusable React components
├── pages/                   # Page-level components
├── context/                 # React Context providers
├── hooks/                   # Custom React hooks
├── lib/                     # API client and utility functions
├── store/                   # Zustand state management stores
├── public/                  # Static assets and images
├── server/                  # Backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Database and app configuration
│   │   └── models/          # Data models
│   ├── uploads/             # File upload storage
│   └── sql/                 # Database schemas and migrations
├── types.ts                 # TypeScript type definitions
└── README.md
```

## 🧪 Testing

Perform manual testing for critical functionality:

- ✅ User registration and authentication flow
- ✅ Service request creation with file uploads
- ✅ Profile updates with avatar changes
- ✅ Inter-user messaging system
- ✅ Role-based access and permissions
- ✅ Admin dashboard operations

## 📚 Documentation

- **Database Schema**: Refer to `server/sql/schema_with_description.sql`
- **API Documentation**: See the API Reference section above
- **Project Report**: Available in the project documentation folder

## 👥 Team

### Project Leadership
- **Md. Tahmidul Alam Ahad** - Project Lead
- **Abdur Rahman** - Co-Lead

### Development Team
- **M. Tawsif Hossain**
- **Md. Saiful Islam Fahim**
- **Mehrub Hossen**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For questions, issues, or support requests, please contact the development team or create an issue in this repository.

---

**Built with ❤️ for rural-urban connectivity**
