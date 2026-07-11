# Guardian-IO Admin Dashboard - Component Architecture

## Overview

The Admin Dashboard is a Next.js web application for moderators to manage Guardian-IO. This document outlines the component structure and implementation guidelines.

## Project Structure

```
admin-dashboard/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard home
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── logout/page.tsx      # Logout handler
│   ├── reports/
│   │   ├── page.tsx             # Reports list
│   │   ├── [id]/page.tsx        # Report detail
│   │   └── [id]/edit/page.tsx   # Report editor
│   ├── incidents/
│   │   ├── page.tsx             # Incidents list
│   │   ├── [id]/page.tsx        # Incident detail
│   │   └── [id]/verify/page.tsx # Incident verification
│   ├── analytics/
│   │   ├── page.tsx             # Analytics dashboard
│   │   ├── reports/page.tsx     # Report analytics
│   │   └── impact/page.tsx      # Impact metrics
│   ├── users/
│   │   ├── page.tsx             # Users list
│   │   ├── [id]/page.tsx        # User detail
│   │   └── [id]/actions/page.tsx # User actions (suspend/ban)
│   ├── config/
│   │   └── page.tsx             # System configuration
│   └── audit/
│       └── page.tsx             # Audit logs
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Top navigation
│   │   ├── Sidebar.tsx          # Left sidebar
│   │   └── Footer.tsx           # Footer
│   ├── reports/
│   │   ├── ReportCard.tsx       # Report card component
│   │   ├── ReportList.tsx       # Reports list view
│   │   ├── ReportDetail.tsx     # Report detail view
│   │   ├── ReportActions.tsx    # Approve/dismiss buttons
│   │   └── ReportFilters.tsx    # Filter controls
│   ├── incidents/
│   │   ├── IncidentCard.tsx     # Incident card
│   │   ├── IncidentList.tsx     # Incidents list
│   │   ├── IncidentDetail.tsx   # Incident detail
│   │   ├── IncidentMap.tsx      # Map view
│   │   └── IncidentVerify.tsx   # Verification form
│   ├── analytics/
│   │   ├── MetricsCard.tsx      # Metric card
│   │   ├── Chart.tsx            # Chart wrapper
│   │   ├── TrendChart.tsx       # Trend visualization
│   │   └── ImpactMetrics.tsx    # Impact display
│   ├── users/
│   │   ├── UserCard.tsx         # User card
│   │   ├── UserList.tsx         # Users list
│   │   ├── UserActions.tsx      # Suspend/ban actions
│   │   └── UserStats.tsx        # User statistics
│   ├── common/
│   │   ├── Button.tsx           # Button component
│   │   ├── Modal.tsx            # Modal dialog
│   │   ├── Pagination.tsx       # Pagination
│   │   ├── SearchBar.tsx        # Search input
│   │   ├── DatePicker.tsx       # Date selection
│   │   ├── StatusBadge.tsx      # Status indicator
│   │   └── Loading.tsx          # Loading spinner
│   └── audit/
│       ├── AuditLog.tsx         # Audit log table
│       ├── AuditFilters.tsx     # Audit filters
│       └── AuditDetail.tsx      # Audit entry detail
├── lib/
│   ├── api.ts                   # API client
│   ├── auth.ts                  # Authentication
│   ├── types.ts                 # TypeScript types
│   ├── utils.ts                 # Utility functions
│   └── hooks/
│       ├── useAuth.ts           # Auth hook
│       ├── useReports.ts        # Reports data hook
│       ├── useIncidents.ts      # Incidents data hook
│       ├── useAnalytics.ts      # Analytics hook
│       └── useAudit.ts          # Audit logs hook
├── styles/
│   ├── globals.css              # Global styles
│   ├── variables.css            # CSS variables
│   └── components.css           # Component styles
├── public/
│   ├── icons/                   # Icon assets
│   └── images/                  # Image assets
├── .env.local                   # Local environment variables
├── .env.production              # Production environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## Key Components

### Header Component

```typescript
// components/layout/Header.tsx
import { useAuth } from "@/lib/hooks/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Guardian-IO Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Report List Component

```typescript
// components/reports/ReportList.tsx
import { useReports } from "@/lib/hooks/useReports";
import ReportCard from "./ReportCard";
import ReportFilters from "./ReportFilters";

export function ReportList() {
  const { reports, filters, setFilters, loading } = useReports();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <ReportFilters filters={filters} onChange={setFilters} />
      <div className="grid gap-4">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
```

### Analytics Dashboard

```typescript
// components/analytics/AnalyticsDashboard.tsx
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import MetricsCard from "./MetricsCard";
import TrendChart from "./TrendChart";

export function AnalyticsDashboard() {
  const { metrics, trends, loading } = useAnalytics();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricsCard title="Total Reports" value={metrics.totalReports} />
        <MetricsCard title="This Month" value={metrics.reportsThisMonth} />
        <MetricsCard title="Resolved" value={metrics.resolved} />
        <MetricsCard title="Pending" value={metrics.pending} />
      </div>
      <TrendChart data={trends} />
    </div>
  );
}
```

## Authentication Flow

```typescript
// lib/auth.ts
import { jwtDecode } from "jwt-decode";

export interface AuthToken {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  const { token } = await response.json();
  localStorage.setItem("authToken", token);
  return token;
}

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function decodeToken(token: string): AuthToken {
  return jwtDecode(token);
}

export function hasPermission(token: string, permission: string): boolean {
  const decoded = decodeToken(token);
  return decoded.permissions.includes(permission);
}
```

## Data Hooks

```typescript
// lib/hooks/useReports.ts
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    page: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await api.get("/admin/reports", { params: filters });
      setReports(data.reports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }

  return { reports, filters, setFilters, loading };
}
```

## Styling with Tailwind CSS

```typescript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a7ea4",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        forest: "#15803d",
        ocean: "#0369a1",
      },
    },
  },
  plugins: [],
};
```

## Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.guardian-io.com
NEXT_PUBLIC_APP_NAME=Guardian-IO Admin
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@host/db
```

## Setup Instructions

### 1. Create Next.js Project

```bash
npx create-next-app@latest admin-dashboard --typescript --tailwind
cd admin-dashboard
```

### 2. Install Dependencies

```bash
npm install axios jwt-decode recharts react-icons
```

### 3. Create Project Structure

```bash
mkdir -p app/{auth,reports,incidents,analytics,users,config,audit}
mkdir -p components/{layout,reports,incidents,analytics,users,common,audit}
mkdir -p lib/hooks
```

### 4. Implement Components

Follow the component structure outlined above, starting with:
- Authentication (login/logout)
- Layout (header, sidebar)
- Report management
- Analytics dashboard

### 5. Deploy

```bash
npm run build
npm start
```

## Security Considerations

1. **JWT Validation**: Verify token signature and expiration
2. **Role-Based Access**: Check permissions before rendering components
3. **HTTPS Only**: Use secure cookies and HTTPS in production
4. **CORS**: Configure CORS properly on backend
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **Input Validation**: Validate all user inputs
7. **XSS Protection**: Sanitize HTML content
8. **CSRF Protection**: Use CSRF tokens for state-changing operations

## Performance Optimization

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: Implement client-side caching with React Query
4. **Pagination**: Paginate large datasets
5. **Lazy Loading**: Load data on demand

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel

```bash
vercel deploy --prod
```

## Support

For questions or issues, contact: admin-support@guardian-io.com
