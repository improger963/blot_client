# Extending the Authentication System

## Adding New Authentication Methods

To add a new authentication method, follow these steps:

### 1. Update Auth Service (`src/services/authService.ts`)

Add a new function for your authentication method:

```typescript
export const loginWithOAuth = async (provider: string, token: string): Promise<LoginResponse> => {
    await getCsrfCookie();
    const { data } = await api.post<LoginResponse>(`/auth/${provider}/callback`, { token });
    return data;
};
```

Then update the `loginWithTelegram` function to handle multiple authentication methods:

```typescript
export const authenticateUser = async (method: 'telegram' | 'oauth', credentials: any): Promise<LoginResponse> => {
    switch (method) {
        case 'telegram':
            return loginWithTelegram(credentials.initData);
        case 'oauth':
            return loginWithOAuth(credentials.provider, credentials.token);
        default:
            throw new Error('Unsupported authentication method');
    }
};
```

### 2. Update Login Page (`src/pages/LoginPageNew.tsx`)

Add a new mutation hook:

```typescript
const { mutate: oauthLogin, isPending: isOAuthPending, error: oauthError } = useMutation({
    mutationFn: async ({ provider, token }: { provider: string; token: string }) => {
        return loginWithOAuth(provider, token);
    },
    onSuccess: (data) => {
        useAuthStore.getState().setUser(data.user);
        navigate('/');
    },
    onError: (error) => {
        console.error("OAuth login error:", error);
    }
});
```

### 3. Update Dev Login Form (`src/components/DevLoginForm.tsx`)

Add a new form for your authentication method:

```typescript
// Add to state
const [oauthToken, setOauthToken] = useState('');
const [oauthProvider, setOauthProvider] = useState('google');

// Add to handleSubmit function
const handleOAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onOAuthLogin(oauthProvider, oauthToken);
};

// Add new form in JSX
{showOAuthForm && (
    <form onSubmit={handleOAuthSubmit} className="space-y-4">
        <SelectField
            label="Provider"
            value={oauthProvider}
            onChange={(e) => setOauthProvider(e.target.value)}
            options={[
                { value: 'google', label: 'Google' },
                { value: 'facebook', label: 'Facebook' }
            ]}
        />
        <InputField
            label="Token"
            placeholder="Enter OAuth token"
            value={oauthToken}
            onChange={(e) => setOauthToken(e.target.value)}
        />
        <Button type="submit">Login with OAuth</Button>
    </form>
)}
```

## Adding New User Profile Fields

To add new fields to the user profile:

### 1. Update User Type (`src/types/user.ts`)

Add new fields to the User interface:

```typescript
export interface User {
    id: number;
    username: string;
    email: string | null;
    referral_code: string;
    // Add new fields
    first_name?: string;
    last_name?: string;
    avatar?: string;
}
```

### 2. Update Backend

Ensure the backend API returns the new fields in the user object.

## Adding Role-Based Access Control

To implement role-based access control:

### 1. Update User Type

```typescript
export interface User {
    id: number;
    username: string;
    email: string | null;
    referral_code: string;
    role: 'user' | 'admin' | 'moderator'; // Add role field
}
```

### 2. Create Protected Routes

Create a component that checks user roles:

```typescript
// src/components/RoleProtectedRoute.tsx
import { useAuthStore } from '../store/authStore';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <>{children}</>;
};
```

### 3. Use in Router

```typescript
<Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
    <Route path="/admin" element={<AdminDashboard />} />
</Route>
```

## Adding Two-Factor Authentication

To implement 2FA:

### 1. Add New Endpoints to Auth Service

```typescript
export const setup2FA = async (): Promise<{ qr_code: string; secret: string }> => {
    const { data } = await api.post('/auth/2fa/setup');
    return data;
};

export const verify2FA = async (code: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/2fa/verify', { code });
    return data;
};

export const disable2FA = async (): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/2fa/disable');
    return data;
};
```

### 2. Add New Components

Create components for 2FA setup and verification:

```typescript
// src/components/TwoFactorSetup.tsx
// src/components/TwoFactorVerification.tsx
```

### 3. Update Auth Store

Add 2FA state to the auth store:

```typescript
interface AuthState {
    // existing fields...
    is2FAEnabled: boolean;
    is2FAVerified: boolean;
    setup2FA: () => Promise<void>;
    verify2FA: (code: string) => Promise<void>;
}
```

## Troubleshooting Common Issues

### 1. CSRF Token Issues

If you encounter CSRF token errors:

1. Ensure the backend is properly configured to set the `XSRF-TOKEN` cookie
2. Check that `withCredentials: true` is set in the API client
3. Verify that the `X-XSRF-TOKEN` header is being sent with requests

### 2. Session Not Persisting

If sessions aren't persisting:

1. Check that cookies are being set with the correct domain and path
2. Ensure the backend session configuration is correct
3. Verify that the frontend is properly handling session validation

### 3. Redirect Loops

If you experience redirect loops:

1. Check that the 401 interceptor isn't causing infinite redirects
2. Ensure that the login page is excluded from authentication checks
3. Verify that the auth state is being properly managed

## Best Practices

1. **Always validate input** before sending authentication requests
2. **Handle errors gracefully** and provide meaningful feedback to users
3. **Use environment variables** for API endpoints and configuration
4. **Implement proper loading states** during authentication flows
5. **Log authentication events** for security monitoring
6. **Use HTTPS in production** to protect authentication data
7. **Implement rate limiting** on authentication endpoints
8. **Regularly rotate CSRF tokens** for enhanced security