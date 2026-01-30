# Grameen Service Connect

## 🌟 Overview

Grameen Service Connect is a comprehensive full-stack web platform designed to bridge the digital divide between rural communities and urban resources. This innovative solution empowers help seekers in villages to connect with urban volunteers and service providers through secure digital service requests, real-time messaging, and file sharing capabilities.

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT-based user registration and login system
- **👥 Role-Based Access Control**: Distinct roles for Help Seekers, Volunteers, and Administrators
- **📋 Service Request Management**: Create, track, and manage help requests with file attachments
- **💬 Real-Time Messaging**: Integrated messaging system linked to service requests
- **📁 File Upload System**: Support for avatar and document uploads using Multer
- **📱 Responsive Design**: Mobile-first UI with accessibility considerations
- **👨‍💼 Admin Dashboard**: Comprehensive user and request management interface
- **🌐 Multi-language Support**: Built-in translation capabilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0+) - XAMPP recommended for local development
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd grameen-service-connect
```

### 2. Database Configuration

1. Start XAMPP and ensure MySQL is running on port 3306.
2. Create a new database named `grameen_service_connect`.
3. Import the database schema:

```bash
mysql -u root -p grameen_service_connect < server/sql/schema_with_description.sql
```

Alternatively, use phpMyAdmin to import the SQL file.

### 3. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create the environment configuration file:

```bash
# server/.env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=grameen_service_connect
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

Start the backend server:

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`.

### 4. Frontend Setup

Return to the project root and install frontend dependencies:

```bash
cd ..
npm install
```

Create the frontend environment file:

```bash
# .env
VITE_API_BASE_URL=http://localhost:5000/api
```

Launch the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## 🎯 Quick Start

For simultaneous development, open two terminals:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server && npm run dev
```

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
- **MD. Tahmidul Alam Ahad** - Project Lead
- **Abdur Rahman** - Co-Lead

### Development Team
- **M. Tawsif Hossain** - Full-Stack Developer
- **Md. Saiful Islam Fahim** - Frontend Developer
- **Mehrub Hossen** - Backend Developer

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
