# Grameen Service Connect
## Village to City Help Platform

A full-stack web platform connecting rural citizens (help seekers) with urban volunteers and service providers. Built to bridge the gap between village needs and city resources through digital service requests, messaging, and file sharing.

## 🚀 Features

- **User Authentication** - Secure JWT-based registration and login
- **Role-Based Access** - Help Seeker, Volunteer, and Admin roles
- **Service Requests** - Create, manage, and track help requests with attachments
- **Real-time Messaging** - Request-linked messaging between users
- **File Uploads** - Avatar and document uploads (Multer)
- **Responsive UI** - Mobile-first design with accessible components
- **Admin Dashboard** - User and request management

## 📋 Prerequisites

- Node.js (v16+)
- MySQL (XAMPP recommended for local development)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
cd grameen-service-connect/grameen-service-connect
```

### 2. Database Setup

Start XAMPP and ensure MySQL is running, then import the schema:

```bash
mysql -u root -p < server/sql/schema_with_description.sql
```

Or manually create the database:
- Open phpMyAdmin
- Create database: `grameen_service_connect`
- Import SQL from `server/sql/schema_with_description.sql`

### 3. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=grameen_service_connect
JWT_SECRET=your-secret-key-change-in-production
```

Start the backend server:

```bash
npm run dev
```

Backend will run at `http://localhost:5000`

### 4. Frontend Setup

From the project root:

```bash
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

## 🎯 Quick Start Commands

**Run both servers:**

Terminal 1 (Frontend):
```bash
cd /c/Users/HP/Downloads/grameen-service-connect/grameen-service-connect
npm run dev
```

Terminal 2 (Backend):
```bash
cd /c/Users/HP/Downloads/grameen-service-connect/grameen-service-connect/server
npm run dev
```


## 📡 API Endpoints

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

## 🏗️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- Axios (HTTP client)
- Tailwind CSS / Custom CSS

**Backend:**
- Node.js + Express
- TypeScript
- MySQL (via mysql2)
- JWT (jsonwebtoken)
- Multer (file uploads)
- bcrypt (password hashing)

**Database:**
- MySQL 8.0+
- XAMPP (local development)

## 📂 Project Structure

```
grameen-service-connect/
├── components/          # React components
├── pages/              # Page components
├── context/            # React Context
├── hooks/              # Custom hooks
├── lib/                # API client & utilities
├── store/              # Zustand stores
├── public/             # Static assets
├── server/             # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.ts
│   ├── uploads/        # File storage
│   └── sql/            # Database schemas
└── README.md
```

## 🧪 Testing

Run manual tests for core features:
- User registration and login
- Create service request with file upload
- Update profile with avatar
- Send and receive messages
- View requests by role (Seeker/Volunteer)

## 📝 Documentation

Project documentation available in:
- **SQL Schema**: `server/sql/schema_with_description.sql`
- **API Documentation**: See API Endpoints section above
- **Project Report**: Available in project docs

## 👥 Team

**Project Leadership:**
- MD. Tahmidul Alam Ahad
- Abdur Rahman

**Development Team:**
- M. Tawsif Hossain
- Md. Saiful Islam Fahim
- Mehrub Hossen

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

## 📞 Support

For issues and questions, please contact the development team.
