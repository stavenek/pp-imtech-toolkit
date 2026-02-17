# Web Toolkit - Old System Analysis

Comprehensive system documentation deduced from the Administrator Manual, User Manual, and Requirements Specifications (Kravspec v1 & v2).

---

## 1. System Overview

**Web Toolkit** is a web-based IT solution developed by **Integ Partner AB**. It supports a structured way of working aligned to the principles of **Integral Management**. The system is hosted at `tools.integpartner.com`.

The application serves as a team collaboration and strategic execution platform, enabling organizations to:
- Define strategic direction and desired states
- Break strategy into actionable best contributions
- Track action plans with responsible owners
- Measure progress toward goals with visual graphs
- Facilitate structured team meetings via an agenda framework
- Capture and convert ideas into actions

**Supported languages:** English, Swedish

---

## 2. User Roles & Permissions

| Role | Scope | Key Capabilities |
|------|-------|-----------------|
| **Super Administrator** | Entire system | Manage companies, all teams, promote users, full access to everything. Added manually to the database (no self-signup). |
| **Company Administrator** | Own company | Manage teams within their company, manage users, edit agenda, promote regular users to company admin. |
| **Team Administrator** | Own team | Invite users, edit user info within their team. |
| **Regular User** | Own team | Full access to team content: actions, ideas, targets, measurements, documents, attendance. Cannot edit agenda or access admin panels. |

### Permission Matrix

| Function | Super Admin | Company Admin | Team Admin | Regular User |
|----------|:-----------:|:-------------:|:----------:|:------------:|
| Manage companies (CRUD) | Yes | No | No | No |
| Create/edit/delete teams | Yes (all) | Yes (own company) | No | No |
| Invite users | Yes | Yes | Yes | Yes |
| Edit user info | Yes (all) | Yes (lower roles) | Yes | No |
| Soft-delete user | Yes | Yes (lower roles) | No | No |
| Remove user from team | Yes | Yes | No | No |
| Promote user to Company Admin | Yes | Yes | No | No |
| Mark user as Team Lead | Yes | Yes | No | No |
| Edit agenda (sections/modules) | Yes | Yes | No | No |
| Create/edit actions | Yes | Yes | Yes | Yes |
| Create/edit ideas | Yes | Yes | Yes | Yes |
| Manage best contributions | Yes | Yes | Yes | Yes |
| Manage attendance | Yes | Yes | Yes | Yes |
| Manage document links | Yes | Yes | Yes | Yes |
| Manage targets/measurements | Yes | Yes | Yes | Yes |
| Edit text modules | Yes | Yes | Yes | Yes |
| See edit/delete columns in Users table | Yes | Yes | No (implied) | No |
| See gear icon on agenda | Yes | Yes | No | No |
| See floating action/idea button | Yes | Yes | Yes | Yes |

### Key Role Constraints
- Admins cannot delete themselves
- Admins cannot edit/delete users of higher status
- Super admins are added manually to the database (no email invitation flow)
- All invited users start as regular users and must be promoted
- Users can belong to multiple teams (noted in v2 spec)

---

## 3. Domain Objects & Attributes

### 3.1 Company

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | Sortable (asc/desc) |
| Details | Text | Displayed in company table |

**Relationships:** A company has many teams. A company has many users (through teams).

---

### 3.2 Team

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | Sortable |
| Company | Reference (Company), required | Read-only after creation in edit view. Sortable. |

**Relationships:** A team belongs to one company. A team has many users. A team has one agenda. A team has many best contributions, actions, ideas, meetings, etc.

**Business Rules:**
- A team can only be deleted if it has no users
- When a team is created, a default agenda with sections and modules is auto-generated

---

### 3.3 User

| Attribute | Type | Notes |
|-----------|------|-------|
| First Name | String, required | Set during sign-up |
| Last Name | String, required | Set during sign-up |
| Email | String, required | Set during invitation, read-only after |
| Phone | String, optional | |
| Password | String, required | Set during sign-up |
| Register Date | Date, read-only | Auto-set on registration |
| Register Status | Enum | `registered`, `pending` |
| Role/User Type | Enum | `super_admin`, `company_admin`, `regular_user` |
| Is Team Lead | Boolean | Set via Edit User form |
| Description | Text, optional | |
| Company | Reference (Company) | Set during sign-up (prefilled) |
| Team | Reference (Team) | Set during sign-up (prefilled), user can belong to multiple teams |

**Business Rules:**
- Users are invited via email, not created directly
- CSV bulk upload of email addresses is supported
- Soft delete anonymizes data (replaces with `*` characters), user still appears in system
- Users log into last accessed team by default
- Multi-tab single sign-on: logging into one tab logs into all tabs
- To log into a different team, use incognito window

---

### 3.4 Agenda

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String | Editable by admins |
| Description | Text | Editable by admins |
| Team | Reference (Team), read-only | Displayed in edit form |

**Relationships:** An agenda has many sections. Each section has many modules.

**Business Rules:**
- Auto-generated with default sections and modules upon team creation
- Changes to one team's agenda do not affect other teams
- Displayed as sidebar navigation

**Default Agenda Structure (from v2 spec):**
1. **Where are we headed and why?**
   - Strategic Reasoning (external link - updated semi-annually by customer SuperUser)
   - Progress with Strategic Focus (external link - updated monthly by customer SuperUser)
   - Newsflash / Chat with NLT
2. **What are we aiming for?**
   - Our Desired State (text module)
   - Our Goals and Metrics (targets & measurements module)
3. **What is our next step? / Are we making progress?**
   - Action Plan (actions module)
   - Team Documents (links module)
   - Log of Ideas (ideas module)
   - Completed Steps (archive)
4. **Are we learning & growing?**
   - Attendance (attendance module)
   - Our Teamwork Rules (text module)
   - Reflections & Learnings (text module)

---

### 3.5 Section (Agenda Section)

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | Editable inline |

**Relationships:** Belongs to an agenda. Has many modules.

---

### 3.6 Module (Agenda Module)

| Attribute | Type | Notes |
|-----------|------|-------|
| Name | String, required | Editable (type is not editable after creation) |
| Type | Enum, required | `ideas`, `actions`, `attendance`, `links`, `text`, `targets_measurements` |

**Business Rules:**
- Module type cannot be changed after creation (must delete and re-create)
- `text` and `targets_measurements` types are auto-generated, not manually addable
- Manually addable types: `ideas`, `actions`, `attendance`, `links`
- Deleting a module permanently deletes all data within it
- Modules cannot be added if no section exists

---

### 3.7 Best Contribution

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | |
| Current State | Text, optional | |
| Desired State | Text, optional | |
| Completion Rate | Percentage (slider) | 0-100% |

**Relationships:** Has many areas of improvement. Has many actions (through areas of improvement). Can be linked to targets & measurements.

**Business Rules:**
- When created, an automatic "No area of improvement" entry is added
- Deleting a best contribution cascades to all its areas of improvement and actions
- Displayed in action plan as expandable/collapsible items

---

### 3.8 Area of Improvement

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | Can be "No area of improvement" (auto-generated) |

**Relationships:** Belongs to one best contribution. Has many actions.

**Business Rules:**
- When deleted, all associated actions are moved to the "No area of improvement" section (not deleted)
- "No area of improvement" is a special catch-all category

---

### 3.9 Action

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | |
| Description | Text, optional | |
| Responsible | Reference (User), optional | Drop-down of all team members |
| Support By | Reference (User), optional | Drop-down of all team members |
| Deadline | Date, optional | Sortable (asc/desc) |
| Comment | Text, optional | |
| Status | Enum, optional | `not_started`, `in_progress`, `delayed`, `done` |
| Best Contribution | Reference (Best Contribution), required | |
| Area of Improvement | Reference (Area of Improvement), optional | Limited to areas from selected best contribution |

**Business Rules:**
- Created via floating action button (available app-wide) or from idea conversion
- Area of improvement choices are filtered by selected best contribution
- Filterable by person (responsible or support) and/or status
- Actions appear in "My actions" dashboard widget if user is responsible or support and deadline is within 14 days or overdue

---

### 3.10 Idea

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | |
| Description | Text, optional | |
| Module | Reference (Ideas Module) | Which idea module to add to |

**Business Rules:**
- Displayed as post-it notes
- Can be converted to an action (fills action creation form with idea data)
- Converting an idea to an action removes it from ideas and adds it to the action plan
- Created via floating action button (available app-wide)

---

### 3.11 Meeting (Attendance)

| Attribute | Type | Notes |
|-----------|------|-------|
| Date | Date | Auto-set on creation |
| Attendees | List of References (User) | Checkbox selection |
| Notes | Text, optional | Notes regarding attendance |
| Attendee Count | Computed | e.g., "2 of 4" |

**Business Rules:**
- Sorted most recent first
- Expandable/collapsible to show attendees
- Team lead is visually marked with an icon

---

### 3.12 Document Link

| Attribute | Type | Notes |
|-----------|------|-------|
| Title | String, required | Sortable |
| URL | String, required | Validated formats: `www.url.com`, `https://url.com`, `https://www.url.com`, `http://url.com`, `http://www.url.com`, `url.com` |
| Document Type | Enum | `doc`, `docx`, `pdf`, `ppt`, `pptx`, `xls`, `xlsx`, `csv`, `other` |
| Created Date | Date | Auto-set, sortable |

**Business Rules:**
- Document type auto-detected from URL extension, defaults to `other`
- User can override auto-detected type
- Appropriate icon displayed based on type
- Can open in new tab or copy URL to clipboard

---

### 3.13 Text Module Content (Our Current State / Our Desired State / Learning)

| Attribute | Type | Notes |
|-----------|------|-------|
| Content | Rich Text | Single textbox per module |

**Specific Modules:**
- **Our Current State**: Prompt: "Enter a description of how you feel that the situation is today, where to start from?"
- **Our Desired State**: Prompt: "Enter a detailed description of your envisioned situation upon achieving your goal for this period."
- **Learning**: Prompt: "Please document your learnings per meeting in chronological order."

---

### 3.14 Targets & Measurements - Tracked Best Contribution

| Attribute | Type | Notes |
|-----------|------|-------|
| Best Contribution | Reference (Best Contribution), required | Drop-down of unadded best contributions |
| End Goal | Number, required | Numeric target value |
| Color | Color (picker) | For graph representation |
| Current State | Number | Updated via inputs |
| Previous State | Number, read-only | Computed from last input |

---

### 3.15 Measurement Input

| Attribute | Type | Notes |
|-----------|------|-------|
| Date | Date, required | Selected via date picker |
| Values | Map of Best Contribution -> Current State | Numeric current state per tracked contribution |

**Business Rules:**
- Typically created every ~14 days (meeting cadence)
- Previous inputs are listed in reverse chronological order (collapsible)
- Inputs update the "current state" and "previous state" of tracked contributions
- Displayed in a bar graph
- Graph Y-axis: absolute values (single contribution) or percentages (multiple contributions)
- Hover on graph bar shows: input date, title, value, percentage, end goal
- Deleted contributions show as "Deleted best contribution" in graph

---

## 4. Screen Flow & Navigation

### 4.1 Application Layout

```
+---------------------------------------------------------------+
| Header: [Logo]           [User Name v] (Language, Help, Logout)|
+----------+----------------------------------------------------+
| Sidebar  |  Main Content Area                                  |
| (Agenda) |                                                     |
|          |                                                     |
| Section 1|  [Dashboard / Module Content]                       |
|  Module A|                                                     |
|  Module B|                                                     |
| Section 2|                                                     |
|  Module C|                                                     |
|  Module D|                                                     |
|  ...     |                                                     |
|          |                              [+ Floating Button]     |
+----------+----------------------------------------------------+
```

### 4.2 Navigation Map

```
Sign In Page
  |-- Forgot Password -> Reset Password Email -> Change Password -> Sign In
  |-- Login -> Dashboard (Home)

Dashboard (Home)
  |-- Our Current State (preview + edit link)
  |-- Our Desired State (preview + edit link)
  |-- Team's Best Contributions (scrollable list + "Go to Action Plan" link)
  |-- My Actions (upcoming/overdue + "Go to Action Plan" link)
  |-- Targets and Measurements (graph)

Sidebar Navigation (Agenda-driven)
  |-- Section: "Why are we here?" / "Where are we headed and why?"
  |   |-- Attendance
  |   |-- Strategic Direction (Links module)
  |   |-- Newsflash / Chat with NLT
  |
  |-- Section: "Our best contribution to the strategy" / "What are we aiming for?"
  |   |-- Our Current State (Text module)
  |   |-- Our Desired State (Text module)
  |   |-- Team Documents (Links module)
  |   |-- Goals and Metrics / Targets & Measurements
  |
  |-- Section: "Our actions and next steps" / "Are we making progress?"
  |   |-- Action Plan (Actions module)
  |   |-- Log of Ideas (Ideas module)
  |
  |-- Section: "Are we learning and growing?"
  |   |-- Learning (Text module)
  |   |-- Our Teamwork Rules (Text module)
  |   |-- Reflections & Learnings (Text module)

User Menu (top-right dropdown)
  |-- Language (English / Swedish)
  |-- Help (opens email to support@tools.integpartner.com)

Administrator Menu (gear icon / admin sub-menu)
  |-- Company (Super Admin only)
  |-- Teams
  |-- Users

Floating Action Button (bottom-right, visible app-wide except in admin views)
  |-- Action -> Create Action form
  |-- Idea -> Create Idea form
```

### 4.3 Authentication Flows

```
Invitation Flow:
  Admin invites via email (single or CSV bulk)
  -> User receives email
  -> Clicks "Join the team"
  -> Sign-up form (first name, last name, phone, email[prefilled],
     password, confirm password, company[prefilled], team[prefilled])
  -> Clicks "Sign up"
  -> Auto-logged into invited team

Sign-In Flow:
  -> Enter email + password
  -> Click "Login"
  -> Redirected to Dashboard of last accessed team

Password Reset Flow:
  -> Click "Forgot password"
  -> Enter email
  -> Click "Send password reset email"
  -> "Check your email" screen
  -> Click "Reset password" in email
  -> Enter new password + confirm
  -> Click "Change password"
  -> Success message + link to login
```

---

## 5. Key User Actions by Module

### 5.1 Action Plan Module

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Create Best Contribution | "Add new best contribution" link | Title, Current State, Desired State, Completion Rate (slider) | Title |
| Edit Best Contribution | Edit icon on title | Same as create (prefilled) | Title |
| Delete Best Contribution | Delete icon on title | Confirmation dialog | -- |
| Create Area of Improvement | "Add new area of improvement" link under a best contribution | Title | Title |
| Delete Area of Improvement | Edit best contribution -> delete icon on area | Confirmation dialog (actions moved to "No area of improvement") | -- |
| Create Action | Floating + button -> "Action" | Title, Description, Responsible, Support By, Deadline, Comment, Status, Best Contribution, Area of Improvement | Title, Best Contribution |
| Edit Action | Click action row | Same as create (prefilled), slides in from right | Title, Best Contribution |
| Delete Action | Delete icon on action row | Confirmation dialog | -- |
| Filter by Person | Person filter button | Dropdown of team members | -- |
| Filter by Status | Status filter button | Dropdown: not started, in progress, delayed, done | -- |

### 5.2 Ideas Module

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Create Idea | Floating + button -> "Idea" | Idea Module (dropdown), Title, Description | Title |
| Edit Idea | Edit icon on post-it | Title, Description (tab: "This will stay an idea") | Title |
| Delete Idea | Delete icon on post-it | Confirmation dialog | -- |
| Convert to Action | Edit icon -> "Convert to action" tab | Title, Description, Responsible, Support By, Deadline, Status, Best Contribution, Area of Improvement, Comment | Title, Best Contribution |

### 5.3 Targets & Measurements Module

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Add Best Contribution to Track | "Add best contribution to measurements" button | Best Contribution (dropdown of unadded), End Goal, Color (picker) | Best Contribution, End Goal |
| Edit End Goal | "Edit" button on tracked contribution | End Goal (numeric) | End Goal |
| Create New Input | "Create new input" button | Date (picker), Current State per tracked contribution | Date, Current State values |
| Delete Input | Delete icon on previous input | Confirmation dialog | -- |
| Toggle Graph Contribution | Checkbox on tracked contribution | -- | -- |

### 5.4 Attendance Module

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Create Meeting | Checkboxes + "Save attendance" | Attendee checkboxes, Notes | At least one attendee |
| Delete Meeting | Delete icon on meeting list | Confirmation dialog | -- |
| Expand/Collapse Meeting | Arrow icon on meeting | -- | -- |

### 5.5 Document Links Module

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Create Link | Inline form + "Save link" | Title, URL, Document Type (dropdown) | Title, URL |
| Edit Link | Edit icon in table | Title, URL, Document Type | Title, URL |
| Delete Link | Delete icon in table | Confirmation dialog | -- |
| Open Link | Open icon | Opens in new tab | -- |
| Copy Link | Copy icon | Copies to clipboard | -- |

### 5.6 Text Modules

| Action | Trigger | Form Fields | Mandatory Fields |
|--------|---------|-------------|-----------------|
| Save Content | "Save" button | Textbox content | -- |
| Edit Content | Change text + "Save" | Textbox content | -- |

---

## 6. UI Patterns & Conventions

### 6.1 Confirmation Dialogs
All destructive actions (delete, remove) follow a consistent pattern:
- Warning message explaining consequences
- Two buttons: **"Cancel"** and **"Delete anyway"** (or "Remove anyway")
- The phrasing varies by context but always includes the impact

### 6.2 Success Notifications
- Pop-up messages confirm successful save/update/delete
- Examples: "The data successfully saved!", "The data has been successfully updated!", "Action successfully deleted!"

### 6.3 Tables
- Sortable columns with arrow icons (ascending/descending)
- Only one column can be sorted at a time
- Initial sort order varies by context (e.g., registered first for users, newest first for meetings)

### 6.4 Inline Editing
- Hover to reveal edit/delete icons (sections, modules)
- Checkmark icon to confirm, X icon to cancel
- Editing mode auto-exits on confirm

### 6.5 Modal Windows (Forms)
- Used for: create/edit entities (teams, users, actions, ideas, best contributions, etc.)
- Standard buttons: "Close"/"Cancel" and "Save"/"Create"/"Save changes"
- Pre-filled fields for edit operations
- Read-only fields where appropriate (e.g., email, company, register date)

### 6.6 Floating Action Button
- Circular "+" button in bottom-right corner
- Always visible except in admin/agenda edit views
- Expands to show "Action" and "Idea" options

### 6.7 Sidebar Navigation
- Left side of application
- Driven by agenda structure (sections -> modules)
- Gear icon visible only to admins for agenda editing
- Always visible during normal operation

---

## 7. Data Relationships (Entity-Relationship Summary)

```
Company 1---* Team
Team 1---* User (through membership)
Team 1---1 Agenda
Agenda 1---* Section
Section 1---* Module

Team 1---* Best Contribution
Best Contribution 1---* Area of Improvement
Area of Improvement 1---* Action
Action *---1 User (Responsible)
Action *---1 User (Support By)

Team 1---* Idea
Idea *---1 Module (Ideas type)

Team 1---* Meeting
Meeting *---* User (Attendees)

Module (Links type) 1---* Document Link

Team 1---* Tracked Best Contribution (Targets & Measurements)
Tracked Best Contribution *---1 Best Contribution
Team 1---* Measurement Input
Measurement Input 1---* Input Value (per tracked contribution)
```

---

## 8. Business Rules Summary

### Authentication & Authorization
1. Super admins are added manually to the database
2. All other users join via email invitation
3. New users always start as regular users
4. Only admins can promote users
5. Multi-tab SSO within the same browser session
6. Users log into the last accessed team by default
7. Soft delete anonymizes user data but preserves system references

### Data Integrity
1. Teams cannot be deleted if they have users
2. Deleting a best contribution cascades to areas of improvement and actions
3. Deleting an area of improvement moves its actions to "No area of improvement"
4. Deleting a module permanently deletes all its data
5. Module type cannot be changed after creation
6. Agenda changes to one team do not affect other teams

### Measurement Logic
1. Graph shows absolute values for single-contribution view, percentages for multi-contribution view
2. Measurement inputs are typically bi-weekly (aligned with meeting cadence)
3. Deleted contributions still appear in historical graphs as "Deleted best contribution"

### Action Plan Logic
1. Area of improvement choices are scoped to the selected best contribution
2. Responsible and Support By fields list all team members
3. Filtering can combine person + status filters
4. Dashboard "My Actions" shows items where user is responsible or support, with deadlines in next 14 days or overdue

---

## 9. Future/Desired Features (from Kravspec)

The requirements specifications mention planned enhancements not yet in the old system:

### AI Assistant ("IntegChatte")
- Button to activate AI assistant
- Fed with all team data from Toolkit at runtime
- Co-pilot style: can listen to everything being discussed
- Formulation support on demand (primarily Action Plan + Desired State)
- Can write suggestions directly into Toolkit (must be approved by responsible person)
- On request, can:
  - Summarize the day's meeting and highlight/acknowledge progress
  - Summarize company progress on strategic focus areas
  - Provide 1-2 reflection questions for the "Learnings" agenda item
  - Reference/suggest other teams working on similar issues

### Meeting Vitality Indicators (planned data collection)
**Positive indicators:**
1. % of participants giving verbal contributions
2. Instances of building on colleague's input
3. Perspective clashes that land in consensus
4. Action steps checked off + added
5. Confirmed consensus on Best Contributions, Goals, and Desired State
6. Collegial acknowledgements
7. High attendance

**Negative indicators (vitality drains):**
1. Action steps slipping past original deadlines
2. Perspective clashes leaving frustration/friction
3. Signals that meeting/topics don't feel important
4. High absence rate

### Additional v2 Requirements
- Users can be part of several teams
- "Completed Steps" archive for finished action plans
- "Newsflash / Chat with NLT" section
- "Our Teamwork Rules" text module
- "Reflections & Learnings" text module
- SuperUser/SMK uploads strategic reasoning (semi-annually) and strategic locomotive goals (monthly)
- Web Toolkit can be self-hosted by customer or hosted by Integ

---

## 10. Tracking Toolkits (Measurement Frameworks)

The system supports three complementary measurement approaches:

### Tracking Toolkit #0: PDCA Completion Rate
- Measures progress degree of completion per best contribution
- Uses PDCA cycle: Plan -> Do -> Check -> Act
- Each phase gets a completion percentage
- When all phases complete = 100%

### Tracking Toolkit #1: Performance Indicators (Graphs)
- Tracks quantitative metrics over time
- Components: Starting Point, Target Level, Critical Line, Actual Value, End Target Level
- Visual graph with time on X-axis and metric values on Y-axis
- Desired State description contextualizes the metric

### Tracking Toolkit #3: External KPI Links
- Links to existing organizational KPI libraries
- Provides lagging confirmation that Best Contribution work has been effective
- Simple link/address to the correct internal KPI library

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **Best Contribution** | A team's key strategic objective or assignment, broken down into areas for improvement and tracked actions |
| **Area of Improvement** | A focus area within a best contribution that groups related actions |
| **Action (Step)** | A specific task assigned to a team member with deadline, status, and support |
| **Idea** | A captured thought/suggestion displayed as a post-it, convertible to an action |
| **Agenda** | The structured meeting framework that drives sidebar navigation |
| **Section** | A top-level grouping in the agenda (e.g., "Why are we here?") |
| **Module** | A functional component within a section (e.g., action plan, ideas, attendance) |
| **Input** | A measurement data point recorded at a specific date for tracked best contributions |
| **Soft Delete** | Anonymizing a user's data while preserving their system references |
| **Team Lead** | A designated user marked with an icon, set via the Edit User form |
| **Integral Management** | The management methodology the toolkit is designed to support |
| **PDCA** | Plan-Do-Check-Act improvement cycle used for measuring completion |
| **Locomotive Goal** | Strategic focus goal updated monthly, driving the organization's direction |
| **Strategic Reasoning** | Semi-annual strategic narrative that frames the organization's direction |
| **IntegChatte** | Planned AI assistant feature for real-time meeting support |
