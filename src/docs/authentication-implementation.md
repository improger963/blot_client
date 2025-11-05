# Authentication Implementation Documentation

## Overview

This document describes the complete authentication implementation for the frontend application, covering Telegram WebApp authentication for production and development environments.

## Architecture

The authentication system is built on the following components:

1. **Auth Store** (`src/store/authStore.ts`) - Zustand-based state management for authentication
2. **Auth Service** (`src/services/authService.ts`) - API service layer for authentication endpoints
3. **API Client** (`src/services/api.ts`) - Axios-based HTTP client with interceptors
4. **Login Page** (`src/pages/LoginPageNew.tsx`) - Main authentication UI
5. **Dev Login Form** (`src/components/DevLoginForm.tsx`) - Development login interface

## Implementation Details

### 1. Auth Store (`authStore.ts`)

The auth store manages the global authentication state with the following key functions:

- `checkAuthStatus()` - Called on app startup to verify existing session
- `setUser(user)` - Sets authenticated user and updates state
- `setUnauthenticated()` - Clears authentication state
- `logout()` - Performs logout and redirects to login page

### 2. Auth Service (`authService.ts`)

The auth service provides the following API methods:

- `getCsrfCookie()` - Retrieves CSRF token from server
- `loginWithTelegram(initData)` - Authenticates using Telegram WebApp initData
- `getMe()` - Fetches current user profile
- `logoutUser()` - Sends logout request to server

### 3. API Client (`api.ts`)

The API client includes:

- CSRF token handling in request interceptor
- Automatic redirect to login on 401 responses
- Proper cookie handling with `withCredentials: true`

### 4. Login Flow

#### Telegram Authentication (Production and Development)
1. Telegram WebApp provides `initData` to the app (in production)
2. In development, developer manually enters `initData` in the DevLoginForm
3. `loginWithTelegram` is called with initData
4. On success, user is set in store and redirected to home

### 5. Session Management

- Session validation occurs on app startup via `checkAuthStatus`
- 401 responses automatically clear auth state and redirect to login
- Logout clears both client state and server session

## API Endpoints

### Authentication Endpoints
- `POST /sanctum/csrf-cookie` - Get CSRF token
- `POST /auth/telegram/callback` - Telegram authentication
- `POST /auth/logout` - Logout
- `GET /user` - Get current user profile

## Error Handling

- CSRF token mismatches (419) are logged for debugging
- Authentication failures (401) trigger automatic logout
- Network errors are caught and displayed to user

## Security Considerations

- CSRF protection via Laravel Sanctum
- Secure cookie handling
- Automatic session invalidation on logout
- Token-based authentication for protected routes