# Semsary Real Estate Platform

<div align="center">
  <img src="./src/assets/logo.svg" alt="Semsary Logo" width="200"/>
  <h3>A Modern Real Estate Web Application</h3>
  
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.x-646CFF.svg)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  [![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
</div>

A comprehensive real estate web application built with **React**, **TypeScript**, **Redux Toolkit**, **React Hook Form**, and **Vite**. Semsary provides a complete ecosystem for property management, enabling users to buy, rent, and manage properties with an intuitive, modern interface.

## 🚀 Live Demo

- **Production**: [https://semsary.com](https://semsary.com)
- **Staging**: [https://staging.semsary.com](https://staging.semsary.com)
- **API Documentation**: [https://api.semsary.com/docs](https://api.semsary.com/docs)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Development Guidelines](#-development-guidelines)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Routing System](#-routing-system)
- [Authentication Flow](#-authentication-flow)
- [Testing Strategy](#-testing-strategy)
- [Performance Optimization](#-performance-optimization)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [Changelog](#-changelog)
- [License](#-license)

---

## ✨ Features

### 🏠 Core Features
- **Advanced Property Search**: Multi-criteria filtering with location-based search
- **Interactive Property Maps**: Integrated mapping with property markers
- **Virtual Property Tours**: 360° view and image galleries
- **Real-time Chat**: Direct communication between buyers and sellers
- **Property Comparison**: Side-by-side property analysis
- **Market Analytics**: Price trends and neighborhood insights

### 👤 User Management
- **Multi-role Authentication**: Buyers, Sellers, Agents, and Admin roles
- **Social Login**: Google, Facebook, and LinkedIn integration
- **Email/SMS Verification**: Two-factor authentication support
- **Profile Customization**: Comprehensive user profiles with preferences
- **Document Management**: Secure ID and document upload system

### 🏢 Property Management
- **Smart Property Listings**: AI-powered property description generation
- **Bulk Import/Export**: CSV and Excel property data management
- **Property Analytics**: View statistics and performance metrics
- **Automated Pricing**: Dynamic pricing recommendations
- **Multi-media Support**: High-resolution images, videos, and virtual tours

### 💼 Business Features
- **Commission Tracking**: Automated commission calculations
- **Lead Management**: CRM-style lead tracking and nurturing
- **Contract Management**: Digital contract creation and e-signatures
- **Payment Integration**: Secure payment processing with multiple gateways
- **Reporting Dashboard**: Comprehensive business intelligence

### 📱 Technical Features
- **Progressive Web App (PWA)**: Offline functionality and app-like experience
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Dark/Light Mode**: User preference-based theming
- **Internationalization (i18n)**: Multi-language support
- **SEO Optimized**: Server-side rendering and meta tag management

---

## 🛠 Tech Stack

### Frontend Core
- **React 18.x** - Component-based UI library with concurrent features
- **TypeScript 5.x** - Static type checking and enhanced developer experience
- **Vite 4.x** - Lightning-fast build tool and development server
- **React Router v6** - Declarative routing for single-page applications

### State Management & Forms
- **Redux Toolkit (RTK)** - Predictable state container with modern Redux patterns
- **RTK Query** - Data fetching and caching solution
- **React Hook Form** - Performant, flexible forms with minimal re-renders
- **Zod** - TypeScript-first schema validation

### UI & Styling
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Bootstrap 5.x** - Component library for rapid prototyping
- **Framer Motion** - Production-ready motion library for animations
- **React Icons** - Popular icon library with tree-shaking support

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting and consistency
- **Husky** - Git hooks for pre-commit quality checks
- **Conventional Commits** - Standardized commit message format

### Testing & Quality
- **Vitest** - Fast unit test runner built on Vite
- **React Testing Library** - Testing utilities focused on user behavior
- **Cypress** - End-to-end testing framework
- **Storybook** - Component development and documentation

### Monitoring & Analytics
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics 4** - User behavior analytics
- **Hotjar** - User experience analytics and heatmaps

---

## 📁 Project Structure

```
semsary/
├── 📁 public/                          # Static assets
│   ├── favicon.ico
│   ├── manifest.json                   # PWA manifest
│   └── robots.txt
│
├── 📁 src/
│   ├── 📁 api/                         # API layer and endpoints
│   │   ├── endpoints/
│   │   │   ├── auth.ts
│   │   │   ├── properties.ts
│   │   │   └── users.ts
│   │   ├── types/                      # API response types
│   │   └── client.ts                   # API client configuration
│   │
│   ├── 📁 assets/                      # Static resources
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── 📁 components/                  # Reusable UI components
│   │   ├── ui/                         # Basic UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   ├── forms/                      # Form components
│   │   │   ├── LoginForm/
│   │   │   ├── PropertyForm/
│   │   │   └── SearchForm/
│   │   ├── layout/                     # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   └── features/                   # Feature-specific components
│   │       ├── PropertyCard/
│   │       ├── PropertyGallery/
│   │       ├── MapView/
│   │       └── UserProfile/
│   │
│   ├── 📁 context/                     # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── 📁 features/                    # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── properties/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useBooking.tsx
│   │   └── useProperty.ts
│   │
│   ├── 📁 layouts/                     # Page layout components
│   │   ├── MainLayout.tsx
│   │   ├── UserLayout.tsx
│   │   ├── OwnerLayout.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── 📁 lib/                         # Third-party library configurations
│   │   ├── axios.ts
│   │   ├── dayjs.ts
│   │   ├── i18n.ts
│   │   └── validation.ts
│   │
│   ├── 📁 pages/                       # Page components
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.test.tsx
│   │   │   └── components/
│   │   ├── PropertyDetails/
│   │   ├── Profile/
│   │   ├── Dashboard/
│   │   └── Auth/
│   │
│   ├── 📁 routes/                      # Routing configuration
│   │   ├── AppRouter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── routes.config.ts
│   │
│   ├── 📁 services/                    # Business logic services
│   │   ├── axios-global.ts
│   │   ├── ownerDashboard.ts
│   │   ├── PropertyListServices.tsx
│   │   ├── Wishlist.ts
│   │   └── PropertyReviewService.tsx
│   │
│   ├── 📁 store/                       # Redux store configuration
│   │   ├── index.ts                    # Store setup
│   │   ├── rootReducer.ts
│   │   ├── Auth/
│   │   │   ├── AuthSlice.ts
│   │   │   ├── authAPI.ts
│   │   │   └── authTypes.ts
│   │   ├── Owner/
│   │   │   └── ownerDashboardSlice.ts
│   │   └── Properties/
│   │       └── propertiesSlice.ts
│   │
│   ├── 📁 styles/                      # Global styles and themes
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── utilities.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   │
│   ├── 📁 types/                       # TypeScript type definitions
│   │   ├── global.d.ts
│   │   ├── api.ts
│   │   ├── user.ts
│   │   ├── property.ts
│   │   └── common.ts
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   ├── formatters.ts               # Data formatting utilities
│   │   ├── validators.ts               # Validation functions
│   │   ├── constants.ts                # Application constants
│   │   ├── helpers.ts                  # General helper functions
│   │   └── storage.ts                  # Local storage utilities
│   │
│   ├── 📁 validations/                 # Form validation schemas
│   │   ├── authSchemas.ts
│   │   ├── propertySchemas.ts
│   │   └── userSchemas.ts
│   │
│   ├── App.tsx                         # Main App component
│   ├── main.tsx                        # Application entry point
│   └── vite-env.d.ts                   # Vite type declarations
│
├── 📁 tests/                           # Test configuration and utilities
│   ├── setup.ts
│   ├── mocks/
│   └── utilities/
│
├── 📁 docs/                            # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
│
├── .env.example                        # Environment variables template
├── .env.local                          # Local environment variables
├── .gitignore                          # Git ignore rules
├── .eslintrc.json                      # ESLint configuration
├── .prettierrc                         # Prettier configuration
├── cypress.config.ts                   # Cypress configuration
├── index.html                          # HTML template
├── package.json                        # Dependencies and scripts
├── tailwind.config.js                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite configuration
└── README.md                           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download here](https://git-scm.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/semsary.git
cd semsary

# 2. Install dependencies
npm install
# or with yarn
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev
# or with yarn
yarn dev

# 5. Open your browser
# Navigate to http://localhost:5173
```

### Development Setup

1. **Install recommended VS Code extensions:**
   ```json
   {
     "recommendations": [
       "bradlc.vscode-tailwindcss",
       "esbenp.prettier-vscode",
       "dbaeumer.vscode-eslint",
       "ms-vscode.vscode-typescript-next",
       "steoates.autoimport-es6-ts"
     ]
   }
   ```

2. **Configure Git hooks:**
   ```bash
   npx husky install
   npx husky add .husky/pre-commit "npm run lint:fix && npm run test"
   npx husky add .husky/commit-msg "npx commitlint --edit $1"
   ```

3. **Set up your IDE:**
   - Enable TypeScript strict mode
   - Configure auto-formatting on save
   - Set up ESLint integration

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.semsary.com/v1
VITE_API_TIMEOUT=10000
VITE_ENVIRONMENT=development

# Authentication
VITE_JWT_SECRET=your_jwt_secret_here
VITE_REFRESH_TOKEN_LIFETIME=7d
VITE_ACCESS_TOKEN_LIFETIME=1h

# Third-party Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Analytics & Monitoring
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=your_sentry_dsn
VITE_HOTJAR_ID=your_hotjar_id

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=true

# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

### Environment-specific configurations:

- **Development**: `.env.local` or `.env.development`
- **Testing**: `.env.test`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

---

## 📜 Available Scripts

### Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Start development server with HTTPS
npm run dev:https

# Start development server with network access
npm run dev:network

# Start development server with specific port
npm run dev -- --port 3000
```

### Build Scripts

```bash
# Build for production
npm run build

# Build and analyze bundle size
npm run build:analyze

# Build for staging environment
npm run build:staging

# Preview production build locally
npm run preview
```

### Code Quality Scripts

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Type check with TypeScript
npm run type-check
```

### Testing Scripts

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm run test:all
```

### Database & API Scripts

```bash
# Generate API types from OpenAPI spec
npm run generate:types

# Validate API schema
npm run validate:api

# Seed development data
npm run seed:dev
```

### Utility Scripts

```bash
# Clean build artifacts
npm run clean

# Clean node_modules and reinstall
npm run fresh-install

# Generate component boilerplate
npm run generate:component

# Generate page boilerplate
npm run generate:page

# Update dependencies
npm run update:deps
```

---

## 🏗 Development Guidelines

### Code Style

We follow industry-standard practices:

```typescript
// ✅ Good: Use descriptive names and proper typing
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ Bad: Vague names and any types
const fetchUser = async (id: any): Promise<any> => {
  // Implementation
};
```

### Component Guidelines

```typescript
// ✅ Good: Proper component structure
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Import/Export Conventions

```typescript
// ✅ Preferred: Named exports for better tree-shaking
export const UserProfile = () => { /* ... */ };
export const UserSettings = () => { /* ... */ };

// Index file for barrel exports
export { UserProfile } from './UserProfile';
export { UserSettings } from './UserSettings';

// ✅ Good: Consistent import grouping
import React from 'react';
import { useRouter } from 'react-router-dom';

import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { UserProfile } from '@/types';

import './UserProfile.css';
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── PublicRoutes
│   │   ├── Home
│   │   ├── PropertyListing
│   │   └── Auth
│   └── ProtectedRoutes
│       ├── Dashboard
│       ├── Profile
│       └── OwnerPanel
├── GlobalProviders
│   ├── ThemeProvider
│   ├── AuthProvider
│   └── NotificationProvider
└── GlobalComponents
    ├── Header
    ├── Footer
    └── LoadingSpinner
```

### Reusable Component Examples

```typescript
// Form Input Component
interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, type = 'text', error, ...props }, ref) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        className={`w-full p-3 border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);
```

```typescript
// Property Card Component
interface PropertyCardProps {
  property: Property;
  onLike?: (id: string) => void;
  onView?: (id: string) => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onLike,
  onView,
  className = '',
}) => {
  const { id, title, price, location, images, bedrooms, bathrooms } = property;
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <button
          onClick={() => onLike?.(id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-gray-600 mb-2">{location}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-600">
            ${price.toLocaleString()}
          </span>
          <div className="flex space-x-3 text-sm text-gray-500">
            <span>{bedrooms} bed</span>
            <span>{bathrooms} bath</span>
          </div>
        </div>
        <Button
          onClick={() => onView?.(id)}
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
```

---

## 🗄 State Management

### Redux Store Structure

```typescript
// store/index.ts
export interface RootState {
  auth: AuthState;
  properties: PropertiesState;
  owner: OwnerState;
  ui: UIState;
  filters: FiltersState;
}

// Auth Slice Example
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});
```

### RTK Query API Slices

```typescript
// api/propertiesApi.ts
export const propertiesApi = createApi({
  reducerPath: 'propertiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/properties',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Property', 'Review'],
  endpoints: (builder) => ({
    getProperties: builder.query<PropertiesResponse, PropertyFilters>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<Property, CreatePropertyRequest>({
      query: (property) => ({
        url: '',
        method: 'POST',
        body: property,
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});
```

---

## 🌐 API Integration

### Axios Configuration

```typescript
// services/axios-global.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### API Service Examples

```typescript
// services/PropertyService.ts
export class PropertyService {
  static async getProperties(filters: PropertyFilters): Promise<Property[]> {
    const response = await axiosInstance.get('/properties', { params: filters });
    return response.data;
  }
  
  static async getProperty(id: string): Promise<Property> {
    const response = await axiosInstance.get(`/properties/${id}`);
    return response.data;
  }
  
  static async createProperty(property: CreatePropertyRequest): Promise<Property> {
    const response = await axiosInstance.post('/properties', property);
    return response.data;
  }
  
  static async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const response = await axiosInstance.patch(`/properties/${id}`, updates);
    return response.data;
  }
  
  static async deleteProperty(id: string): Promise<void> {
    await axiosInstance.delete(`/properties/${id}`);
  }
  
  static async uploadPropertyImages(id: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    
    const response = await axiosInstance.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.urls;
  }
}
```

---

## 🛣 Routing System

### Route Configuration

```typescript
// routes/routes.config.ts
export const routes = {
  home: '/',
  properties: '/properties',
  property: '/property/:id',
  search: '/search',
  
  // Auth routes
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  
  // User routes
  profile: '/profile',
  profileSection: '/profile/:section',
  wishlist: '/profile/wishlist',
  
  // Owner routes
  ownerDashboard: '/owner-dashboard',
  ownerProperties: '/owner-dashboard/properties',
  addProperty: '/owner-dashboard/properties/add',
  editProperty: '/owner-dashboard/properties/:id/edit',
  
  // Admin routes
  admin: '/admin',
  adminUsers: '/admin/users',
  adminProperties: '/admin/properties',
  