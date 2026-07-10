# Guardian-IO Admin Dashboard

## Overview

The Guardian-IO Admin Dashboard is a web-based portal for moderators and administrators to manage reports, incidents, and system configuration. It provides comprehensive moderation tools, analytics, and settings management.

## Architecture

The admin dashboard is built as a separate Next.js application that connects to the Guardian-IO backend via tRPC API endpoints.

### Technology Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend Integration**: tRPC client for type-safe API calls
- **Authentication**: JWT tokens with role-based access control
- **Database**: PostgreSQL via Drizzle ORM
- **Real-time Updates**: WebSocket connection for live incident updates

## Features

### 1. Report Management

**Dashboard View**
- List all submitted worker reports with filters
- Filter by status (pending, escalated, resolved, closed)
- Filter by severity (low, medium, high, critical)
- Filter by date range and location
- Search by report ID or keywords

**Report Detail View**
- Full report content with all attachments
- Worker anonymity protection (display only report ID)
- Escalation pathway options
- Status update history
- Action buttons: Approve, Escalate, Resolve, Close
- Add internal notes and tags

**Escalation Management**
- Route reports to appropriate organizations
- Send notifications to escalation contacts
- Track escalation status and responses
- Generate escalation reports

### 2. Incident Management

**Incident Dashboard**
- Real-time map view of all incidents
- Filter by type (wildlife, environmental, labor)
- Filter by severity and status
- Cluster incidents by location
- View incident timeline

**Incident Detail View**
- Full incident information with photos/videos
- Reporter information (if not anonymous)
- Verification status
- Community response count
- Action buttons: Verify, Investigate, Resolve, Archive

**Verification System**
- Review incident evidence
- Approve or reject incident reports
- Add verification notes
- Flag suspicious reports

### 3. Analytics Dashboard

**System-Wide Metrics**
- Total reports submitted (with trend)
- Total incidents reported (with trend)
- Report escalation rate
- Average response time
- Community engagement metrics

**Geographic Analytics**
- Heat map of incidents by location
- Top affected regions
- Regional comparison charts
- Trend analysis by region

**Impact Metrics**
- Workers protected (cumulative)
- Species protected (count)
- Forest preserved (acres)
- Wages improved (total)
- Community contributions (count)

**User Analytics**
- Active users (daily, weekly, monthly)
- User retention rates
- Contribution distribution
- Leaderboard data

### 4. Moderation Tools

**Content Moderation**
- Flag inappropriate reports
- Remove reports (with audit trail)
- Suspend abusive users
- Manage user permissions

**Quality Control**
- Review low-quality reports
- Request additional information
- Merge duplicate reports
- Archive resolved reports

### 5. System Configuration

**Settings Management**
- Configure escalation pathways
- Manage organization contacts
- Set report categories and types
- Configure incident severity levels
- Manage notification templates

**User Management**
- Create/edit admin accounts
- Assign roles and permissions
- View user activity logs
- Manage API keys

**Email Configuration**
- Configure SMTP settings
- Manage email templates
- Set notification schedules
- View email delivery logs

## API Endpoints

### Reports

```typescript
// Get all reports with filters
GET /api/admin/reports?status=pending&severity=high&dateFrom=2024-01-01&dateTo=2024-12-31

// Get report details
GET /api/admin/reports/:reportId

// Update report status
POST /api/admin/reports/:reportId/status
Body: { status: "escalated" | "resolved" | "closed", notes: string }

// Escalate report
POST /api/admin/reports/:reportId/escalate
Body: { escalationPath: string, organization: string }

// Add internal note
POST /api/admin/reports/:reportId/notes
Body: { note: string, tags: string[] }
```

### Incidents

```typescript
// Get all incidents with filters
GET /api/admin/incidents?type=wildlife&severity=critical&verified=false

// Get incident details
GET /api/admin/incidents/:incidentId

// Verify incident
POST /api/admin/incidents/:incidentId/verify
Body: { verified: boolean, notes: string }

// Update incident status
POST /api/admin/incidents/:incidentId/status
Body: { status: "active" | "investigating" | "resolved" | "archived" }
```

### Analytics

```typescript
// Get system-wide analytics
GET /api/admin/analytics/overview

// Get geographic analytics
GET /api/admin/analytics/geographic

// Get impact metrics
GET /api/admin/analytics/impact

// Get user analytics
GET /api/admin/analytics/users
```

### Configuration

```typescript
// Get system settings
GET /api/admin/settings

// Update system settings
POST /api/admin/settings
Body: { setting: string, value: any }

// Get email templates
GET /api/admin/email-templates

// Update email template
POST /api/admin/email-templates/:templateId
Body: { subject: string, html: string, text: string }
```

## Role-Based Access Control

### Roles

| Role | Permissions |
|------|-------------|
| **Moderator** | View reports/incidents, update status, add notes, escalate reports |
| **Analyst** | View all analytics, generate reports, export data |
| **Admin** | All moderator + analyst permissions, manage users, configure system |
| **Super Admin** | All permissions, manage other admins |

### Permission Matrix

```typescript
const permissions = {
  moderator: [
    'view_reports',
    'update_report_status',
    'escalate_reports',
    'add_notes',
    'view_incidents',
    'verify_incidents',
  ],
  analyst: [
    'view_analytics',
    'export_data',
    'generate_reports',
    'view_reports',
    'view_incidents',
  ],
  admin: [
    'all_moderator_permissions',
    'all_analyst_permissions',
    'manage_users',
    'configure_settings',
    'manage_email_templates',
  ],
  super_admin: [
    'all_permissions',
    'manage_admins',
  ],
};
```

## Deployment

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/guardian_io

# API
API_URL=https://api.guardian-io.com
API_SECRET=your-secret-key

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@guardian-io.com

# Admin Dashboard
ADMIN_URL=https://admin.guardian-io.com
NEXT_PUBLIC_API_URL=https://api.guardian-io.com
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  admin-dashboard:
    build: .
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/guardian_io
      - JWT_SECRET=your-secret
      - NEXT_PUBLIC_API_URL=http://api:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=guardian_io
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Security Considerations

1. **Authentication**: All admin endpoints require JWT authentication
2. **Authorization**: Role-based access control enforced on all endpoints
3. **Audit Logging**: All admin actions logged with timestamp and user ID
4. **Data Anonymity**: Worker information never exposed to admins
5. **Rate Limiting**: API endpoints rate-limited to prevent abuse
6. **HTTPS**: All connections must use HTTPS in production
7. **CORS**: Admin dashboard only accessible from configured domains

## Monitoring

### Key Metrics to Monitor

- Report submission rate
- Report escalation rate
- Average report review time
- Incident verification rate
- System uptime
- API response times
- Database query performance

### Alerting

Configure alerts for:
- High severity reports (> 10 per day)
- Escalation failures
- API errors (> 5% error rate)
- Database connection issues
- Email delivery failures

## Support

For issues or questions about the admin dashboard, contact the Guardian-IO support team.
