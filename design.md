# Guardian-IO Mobile App Design

## Design Philosophy

Guardian-IO communicates stewardship, trust, and dignity through a visual language that merges natural systems with digital intelligence. The interface avoids fear-based experiences and instead cultivates collective responsibility, radical transparency, hopeful action, local empowerment, and global collaboration.

**Core Design Principles:**
- River networks informing navigation flows
- Ecosystem-inspired animations
- Earth-centered color palettes
- Living maps rather than static dashboards
- Stories of guardians, workers, and species as primary content

---

## Screen Architecture

### Onboarding & Authentication Flow

#### 1. **Splash Screen**
- Guardian-IO logo with tagline: "Transparent. Resilient. Regenerative."
- Auto-transition to role selection after 2 seconds
- Earth-centered color palette (emerald, ocean blue, natural greens)

#### 2. **Role Selection Screen**
- Four primary user roles as large, tappable cards:
  - **Worker** (icon: person with badge)
  - **Community Guardian** (icon: leaf/nature)
  - **Business** (icon: building/network)
  - **Consumer** (icon: shopping bag)
- Each card includes brief description of role
- Selection persists to local storage

#### 3. **Authentication Screen**
- Anonymous login option for workers
- Email/phone for community guardians and businesses
- OAuth integration for consumers
- Biometric authentication support

---

### Core Navigation Structure

**Tab Bar (Bottom Navigation)**
- Home
- Discover/Explore
- My Activity/Reports
- Community/Network
- Settings/Profile

---

## Role-Specific Screens

### WORKER ROLE

#### Home Dashboard
- **Anonymous Identity Badge** (hexadecimal ID)
- **Quick Actions:**
  - Report Rights Violation
  - View Labor Passport
  - Access Emergency Support
- **Recent Activity Feed:**
  - Status of previous reports
  - Wage verification updates
  - Community messages

#### Rights Reporting Screen
- **Anonymous Report Form:**
  - Incident type selector (harassment, wage theft, unsafe conditions, trafficking indicators)
  - Date/time picker
  - Location (optional, map-based or text)
  - Description (text + voice recording option)
  - Attachment support (photos, documents)
  - Escalation pathway selector (trusted NGO, government, internal)
- **Submission Confirmation:**
  - Report ID for tracking
  - Expected response timeline
  - Support resources

#### Labor Passport Screen
- **Digital Identity:**
  - Work history (anonymized)
  - Skills and certifications
  - Wage records (verified)
  - Contract terms
  - Rights acknowledgments
- **Verification Status:**
  - Trusted organizations that have verified this worker
  - Badges for certifications

#### Emergency Support Screen
- **Quick Access to:**
  - Crisis hotlines (multilingual)
  - Legal aid resources
  - Medical assistance
  - Safe housing networks
  - Trafficking rescue services

---

### COMMUNITY GUARDIAN ROLE

#### Home Dashboard
- **Biodiversity Monitoring Summary:**
  - Recent wildlife sightings
  - Ecosystem health indicators
  - Community contribution score
- **Quick Actions:**
  - Report Wildlife Incident
  - Log Biodiversity Observation
  - View Ecological Stewardship Programs
  - Access Community Rewards

#### Wildlife Incident Reporting
- **Incident Form:**
  - Species identification (with visual guide/AI recognition)
  - Incident type (poaching, habitat destruction, trafficking signs, human-wildlife conflict)
  - Location (map-based, GPS, or manual)
  - Photos/videos
  - Urgency level
  - Witness information (optional)
- **Real-Time Hotspot Map:**
  - Heatmap of recent incidents
  - Endangered species locations
  - Protected areas
  - Community response zones

#### Biodiversity Monitoring Screen
- **Observation Log:**
  - Species sightings with photos
  - Habitat condition notes
  - Population trends
  - Seasonal patterns
- **Indigenous Knowledge Preservation:**
  - Stories and traditional practices
  - Seasonal calendars
  - Ecological wisdom documentation

#### Community Rewards Screen
- **Reward Mechanisms:**
  - Points for verified reports
  - Conservation credits
  - Community grants
  - Incentive programs
- **Leaderboard:**
  - Top contributors (anonymized)
  - Community milestones
  - Collective impact metrics

---

### BUSINESS ROLE

#### Home Dashboard
- **Supply Chain Overview:**
  - Supplier verification status
  - Risk indicators (red/yellow/green)
  - ESG/SDG progress
  - Compliance score
- **Quick Actions:**
  - Verify Supplier
  - Run Risk Assessment
  - Generate ESG Report
  - View Ethical Procurement Tools

#### Supplier Verification Screen
- **Supplier Search/Add:**
  - Search by name, ID, or location
  - Add new supplier
- **Verification Workflow:**
  - Identity verification
  - Labor practices assessment
  - Environmental compliance check
  - Financial stability review
  - Third-party certifications
- **Verification Status:**
  - Verified badge
  - Risk level
  - Audit history
  - Remediation plans

#### Risk Intelligence Screen
- **Predictive Risk Dashboard:**
  - Emerging risks (trafficking, forced labor, corruption, ecological degradation)
  - Risk scores by supplier/region
  - Trend analysis
  - Alerts and notifications
- **Risk Mitigation Tools:**
  - Recommended actions
  - Due diligence templates
  - Escalation pathways

#### ESG & SDG Reporting
- **Metrics Dashboard:**
  - Labor conditions improvements
  - Environmental impact reduction
  - Community development outcomes
  - Biodiversity protection gains
- **Report Generation:**
  - Automated ESG reports
  - SDG alignment tracking
  - Stakeholder communication templates

---

### CONSUMER ROLE

#### Home Dashboard
- **Product Discovery:**
  - Featured ethical products
  - Trending sustainable items
  - Personalized recommendations
- **Quick Actions:**
  - Scan QR Code
  - Search Products
  - View Impact Stories
  - Make Contribution

#### QR Code Scanner
- **Product Information:**
  - Origin story (farm/factory)
  - Worker profiles and wages
  - Environmental impact
  - Biodiversity protection efforts
  - Community benefits
- **Impact Visualization:**
  - Where your purchase goes
  - Lives impacted
  - Ecosystems protected
  - Stories of guardians and workers

#### Impact Stories Screen
- **Narrative Content:**
  - Worker testimonials (anonymized)
  - Community guardian updates
  - Species protection stories
  - Regeneration outcomes
- **Engagement:**
  - Like/share stories
  - Comment and support
  - Contribute to causes

#### Community Contribution Screen
- **Participation Options:**
  - Direct support to workers
  - Conservation fund contributions
  - Community projects
  - Ethical marketplace participation
- **Impact Tracking:**
  - Personal contribution history
  - Collective impact dashboard
  - Rewards and recognition

#### Ethical Purchasing Recommendations
- **Smart Recommendations:**
  - Products aligned with values
  - Comparison of ethical scores
  - Price vs. impact analysis
- **Marketplace Integration:**
  - Direct purchase links
  - Trusted retailer partnerships
  - Exclusive ethical products

---

## Shared Screens

### Settings & Profile
- **User Profile:**
  - Role and identity
  - Preferences and language
  - Notification settings
  - Privacy controls
- **Account Security:**
  - Biometric authentication
  - Session management
  - Data privacy controls
- **Support & Resources:**
  - Help center
  - FAQ
  - Contact support
  - Report app issues

### Notifications Center
- **Notification Types:**
  - Report status updates
  - Community alerts
  - Reward notifications
  - Impact milestones
  - Emergency alerts
- **Notification Management:**
  - Customize by type
  - Quiet hours
  - Delivery preferences

---

## Color Palette (Earth-Centered)

| Color | Hex | Usage |
|-------|-----|-------|
| **Emerald** | #10B981 | Primary actions, success states, nature elements |
| **Ocean Blue** | #0EA5E9 | Secondary actions, water elements, information |
| **Forest Green** | #047857 | Accents, emphasis, protected areas |
| **Warm Earth** | #D97706 | Warnings, caution, alerts |
| **Coral Red** | #EF4444 | Errors, urgent alerts, trafficking indicators |
| **Cream** | #FFFBF0 | Light backgrounds, cards |
| **Charcoal** | #1F2937 | Text, dark backgrounds |
| **Muted Sage** | #9CA3AF | Secondary text, disabled states |

---

## Typography & Spacing

- **Primary Font:** System font (SF Pro Display on iOS, Roboto on Android)
- **Heading:** Bold, 24-32px
- **Body:** Regular, 16-18px
- **Caption:** Regular, 12-14px
- **Spacing:** 8px grid system

---

## Interaction Patterns

### Navigation
- **Tab bar** for primary role-specific navigation
- **Stack navigation** for detailed flows
- **Modal sheets** for forms and secondary actions
- **Deep linking** for external integrations

### Feedback
- **Haptic feedback** on critical actions
- **Loading indicators** for async operations
- **Toast notifications** for confirmations
- **Error states** with actionable guidance

### Animations
- **Subtle transitions** between screens (200-300ms)
- **Ecosystem-inspired micro-interactions** (river flows, leaf movements)
- **No excessive motion** (respects accessibility)

---

## Accessibility Considerations

- **High contrast** for all text and interactive elements
- **Large touch targets** (minimum 44x44pt)
- **Screen reader support** for all content
- **Multilingual support** (especially for worker role)
- **Offline functionality** for critical features
- **Data privacy** by design (no unnecessary tracking)

---

## Success Metrics

- Users can complete their primary flows in under 5 taps
- Report submission takes less than 3 minutes
- All information is scannable and digestible
- Visual hierarchy guides users to most important actions
- Animations enhance, not distract from, functionality
