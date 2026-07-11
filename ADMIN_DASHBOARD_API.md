# Guardian-IO Admin Dashboard API

## Overview

The Admin Dashboard is a web-based portal for moderators and administrators to manage Guardian-IO. This document outlines the API endpoints, authentication, and implementation guidelines.

## Architecture

The admin dashboard consists of:

1. **Frontend**: Next.js web application with React components
2. **Backend**: tRPC API routes with role-based access control
3. **Database**: PostgreSQL with Drizzle ORM
4. **Authentication**: JWT tokens with role verification

## API Endpoints

### Authentication

#### POST /api/admin/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@guardian-io.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "admin_id",
    "email": "admin@guardian-io.com",
    "role": "admin",
    "permissions": ["view_reports", "approve_reports", "view_analytics"]
  }
}
```

#### POST /api/admin/auth/logout
Logout and invalidate token.

### Report Management

#### GET /api/admin/reports
Fetch reports with filtering and pagination.

**Query Parameters:**
- `status`: "submitted" | "escalated" | "resolved" | "dismissed"
- `type`: "harassment" | "wage_theft" | "unsafe_conditions" | "trafficking" | "discrimination" | "child_labor"
- `severity`: "low" | "medium" | "high" | "critical"
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `sortBy`: "date" | "severity" | "status"

**Response:**
```json
{
  "reports": [
    {
      "id": 1,
      "reportType": "wage_theft",
      "description": "...",
      "location": "...",
      "status": "escalated",
      "severity": "high",
      "submittedAt": "2026-07-10T12:00:00Z",
      "userId": "user_id",
      "anonymous": true,
      "attachments": ["url1", "url2"],
      "escalationPath": "NGO"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

#### GET /api/admin/reports/:id
Get detailed report information.

#### PATCH /api/admin/reports/:id
Update report status and notes.

**Request:**
```json
{
  "status": "resolved",
  "notes": "Successfully escalated to NGO",
  "resolution": "case_closed"
}
```

#### POST /api/admin/reports/:id/approve
Approve a report for escalation.

#### POST /api/admin/reports/:id/dismiss
Dismiss a report with reason.

**Request:**
```json
{
  "reason": "duplicate_report",
  "notes": "Already reported as case #123"
}
```

### Incident Management

#### GET /api/admin/incidents
Fetch biodiversity incidents with filtering.

**Query Parameters:**
- `severity`: "low" | "medium" | "high" | "critical"
- `type`: "endangered" | "habitat" | "pollution" | "poaching" | "deforestation"
- `status`: "reported" | "investigating" | "resolved" | "dismissed"
- `page`: number
- `limit`: number

**Response:**
```json
{
  "incidents": [
    {
      "id": 1,
      "incidentType": "poaching",
      "description": "...",
      "location": {
        "latitude": 12.34,
        "longitude": 56.78
      },
      "severity": "critical",
      "speciesAffected": ["Bengal Tiger", "Asian Elephant"],
      "status": "investigating",
      "reportedAt": "2026-07-10T12:00:00Z",
      "attachments": ["url1", "url2"]
    }
  ],
  "total": 45,
  "page": 1
}
```

#### PATCH /api/admin/incidents/:id
Update incident status and investigation notes.

**Request:**
```json
{
  "status": "resolved",
  "investigationNotes": "...",
  "actionTaken": "..."
}
```

### Analytics

#### GET /api/admin/analytics/overview
Get high-level analytics dashboard data.

**Response:**
```json
{
  "totalReports": 1250,
  "reportsThisMonth": 145,
  "reportsByStatus": {
    "submitted": 50,
    "escalated": 120,
    "resolved": 1050,
    "dismissed": 30
  },
  "reportsByType": {
    "harassment": 400,
    "wage_theft": 350,
    "unsafe_conditions": 300,
    "trafficking": 100,
    "discrimination": 80,
    "child_labor": 20
  },
  "totalIncidents": 320,
  "incidentsByStatus": {
    "reported": 45,
    "investigating": 120,
    "resolved": 150,
    "dismissed": 5
  },
  "globalImpactMetrics": {
    "workersProtected": 15000,
    "speciesProtected": 250,
    "forestPreserved": 5000,
    "wagesImproved": 2500000,
    "communityFund": 500000
  }
}
```

#### GET /api/admin/analytics/reports
Get detailed report analytics.

**Query Parameters:**
- `period`: "day" | "week" | "month" | "year"
- `groupBy`: "type" | "status" | "severity" | "location"

**Response:**
```json
{
  "period": "month",
  "data": [
    {
      "date": "2026-07-01",
      "count": 12,
      "escalated": 8,
      "resolved": 3
    }
  ],
  "trends": {
    "upTrend": true,
    "percentChange": 15
  }
}
```

#### GET /api/admin/analytics/impact
Get impact metrics and trends.

**Response:**
```json
{
  "currentMetrics": {
    "workersProtected": 15000,
    "speciesProtected": 250,
    "forestPreserved": 5000,
    "wagesImproved": 2500000,
    "communityFund": 500000
  },
  "monthlyTrends": [
    {
      "month": "2026-06",
      "workersProtected": 14500,
      "speciesProtected": 240
    }
  ],
  "topContributors": [
    {
      "userId": "user_1",
      "contributions": 150,
      "impact": "high"
    }
  ]
}
```

### User Management

#### GET /api/admin/users
Get list of users with filtering.

**Query Parameters:**
- `role`: "worker" | "community_guardian" | "business" | "consumer"
- `status`: "active" | "suspended" | "banned"
- `page`: number
- `limit`: number

#### POST /api/admin/users/:id/suspend
Suspend a user account.

**Request:**
```json
{
  "reason": "violation_of_terms",
  "duration": 7
}
```

#### POST /api/admin/users/:id/ban
Ban a user permanently.

**Request:**
```json
{
  "reason": "repeated_violations"
}
```

### System Configuration

#### GET /api/admin/config
Get system configuration.

**Response:**
```json
{
  "features": {
    "reportingEnabled": true,
    "communityForumEnabled": true,
    "rewardsEnabled": true
  },
  "escalationPaths": [
    {
      "id": "ngo",
      "name": "NGO Partners",
      "enabled": true
    }
  ],
  "notificationSettings": {
    "emailNotificationsEnabled": true,
    "pushNotificationsEnabled": true
  }
}
```

#### PATCH /api/admin/config
Update system configuration.

**Request:**
```json
{
  "features": {
    "reportingEnabled": true
  },
  "escalationPaths": []
}
```

## Role-Based Access Control

### Admin Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | All permissions |
| **Report Moderator** | View/approve/dismiss reports, view analytics |
| **Incident Coordinator** | View/investigate incidents, update status |
| **Analytics Viewer** | View analytics and metrics only |
| **System Admin** | Manage configuration, users, system settings |

### Permission Matrix

```
                          Super Admin | Report Mod | Incident Coord | Analytics | System Admin
View Reports              ✓           | ✓          | -              | -         | -
Approve Reports           ✓           | ✓          | -              | -         | -
Dismiss Reports           ✓           | ✓          | -              | -         | -
View Incidents            ✓           | -          | ✓              | -         | -
Update Incidents          ✓           | -          | ✓              | -         | -
View Analytics            ✓           | ✓          | ✓              | ✓         | -
Manage Users              ✓           | -          | -              | -         | ✓
System Configuration      ✓           | -          | -              | -         | ✓
View Audit Logs           ✓           | ✓          | ✓              | -         | ✓
```

## Authentication & Security

### JWT Token Structure

```json
{
  "sub": "admin_id",
  "email": "admin@guardian-io.com",
  "role": "report_moderator",
  "permissions": ["view_reports", "approve_reports"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Security Headers

All API responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
- Burst limit: 20 requests per second

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User does not have permission to approve reports",
    "details": {
      "requiredPermission": "approve_reports",
      "userRole": "analytics_viewer"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Authentication failed |
| FORBIDDEN | 403 | User lacks required permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request parameters |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Implementation Checklist

- [ ] Set up Next.js project with TypeScript
- [ ] Implement authentication with JWT
- [ ] Create report management interface
- [ ] Create incident management interface
- [ ] Build analytics dashboard with charts
- [ ] Implement user management
- [ ] Add system configuration panel
- [ ] Set up role-based access control
- [ ] Add audit logging
- [ ] Implement error handling and validation
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

## Deployment

### Environment Variables

```
NEXT_PUBLIC_API_URL=https://api.guardian-io.com
NEXT_PUBLIC_APP_NAME=Guardian-IO Admin
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://user:password@host:port/db
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

### Docker Deployment

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

## Monitoring & Logging

- All admin actions are logged with timestamp and user ID
- Failed authentication attempts are tracked
- API response times are monitored
- Error rates are tracked per endpoint
- Alerts for suspicious activity (multiple failed logins, rapid status changes)

## Support & Documentation

For additional support, contact: admin-support@guardian-io.com
