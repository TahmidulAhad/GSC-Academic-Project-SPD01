# Grameen Service Connect - Project Structure

## Root Directory
```
grameen-service-connect/
├── components/          # React components (Header, Footer, etc.)
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API service
├── pages/              # Page components (Home, Login, Dashboard, etc.)
├── public/             # Static assets (images, logos)
├── server/             # Backend Node.js/Express server
│   ├── src/
│   │   ├── config/     # Database config and migrations
│   │   ├── controllers/# API controllers
│   │   ├── middleware/ # Express middleware
│   │   ├── models/     # Database models (if any)
│   │   └── routes/     # API routes
│   ├── uploads/        # Uploaded files (avatars, documents)
│   └── .env           # Server environment variables
├── store/              # Zustand state management
├── App.tsx             # Main React app component
├── index.tsx           # React entry point
├── index.html          # HTML template
├── .env                # Frontend environment variables
├── package.json        # Frontend dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation

## Server Directory
server/
├── src/
│   ├── config/
│   │   ├── database.ts    # MySQL connection
│   │   └── migrate.ts     # Database migrations
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── message.controller.ts
│   │   ├── request.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── message.routes.ts
│   │   ├── request.routes.ts
│   │   └── user.routes.ts
│   └── index.ts          # Server entry point
├── uploads/
│   ├── avatars/          # User profile pictures
│   └── documents/        # Service request documents
├── .env                  # Database and server config
├── package.json          # Backend dependencies
└── tsconfig.json         # TypeScript config

## Key Features
- ✅ MySQL database (XAMPP compatible)
- ✅ Profile picture upload for users
- ✅ Service request management
- ✅ Role-based dashboards (Help Seeker/Volunteer)
- ✅ JWT authentication
- ✅ File uploads (Multer)
- ✅ TypeScript full-stack

## Database
- MySQL via XAMPP
- Database name: grameen_service_connect
- Tables: users, service_requests, messages, testimonials
