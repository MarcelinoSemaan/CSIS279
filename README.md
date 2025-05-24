# Event Management System

A full-stack web application for managing teams, events, and problem reporting built with React, NestJS, and TypeORM.

## Project Setup Instructions

### Backend (API)
1. Navigate to the API directory:
   ```bash
   cd api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file with the following:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_NAME=event_management
     JWT_SECRET=your_jwt_secret
     ```
4. Start the API server:
   ```bash
   npm run start:dev
   ```

### Frontend (React App)
1. Navigate to the app directory:
   ```bash
   cd app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints and Usage

### Authentication
- POST `/auth/login` - User login
  - Body: `{ username: string, password: string }`
  - Returns: `{ access_token: string }`
- POST `/auth/signup` - User registration
  - Body: `{ username: string, password: string, email: string }`

### Events
- GET `/event` - Get all events
- GET `/event/:id` - Get event by ID
- POST `/event` - Create new event
  - Body: `{ eventName, eventStartDate, eventEndDate, eventDescription, eventTeamID }`
- PUT `/event/:id` - Update event
- PATCH `/event/:id/report` - Report a problem for an event
  - Body: `{ problemDescription: string, priority: 'low'|'medium'|'high'|'critical' }`
- DELETE `/event/:id` - Delete event

### Teams
- GET `/team` - Get all teams
- GET `/team/:id` - Get team by ID
- POST `/team` - Create new team
- PUT `/team/:id` - Update team
- DELETE `/team/:id` - Delete team

### Members
- GET `/member` - Get all members
- GET `/member/:id` - Get member by ID
- POST `/member` - Create new member
- PUT `/member/:id` - Update member
- DELETE `/member/:id` - Delete member

## Database Schema

### Event
```typescript
{
  eventID: number (PK)
  eventOfficeID: number (FK)
  eventTeamID: number (FK)
  eventTeamOfficeID: number
  eventName: string
  eventStartDate: Date
  eventEndDate: Date
  eventDescription: string
  eventProblemType: number
  eventProblemDescription: string
  status: EventStatus
}
```

### Team
```typescript
{
  teamID: number (PK)
  teamName: string
  teamOfficeID: number (FK)
  teamStatus: string
}
```

### Member
```typescript
{
  memberID: number (PK)
  memberName: string
  memberEmail: string
  memberRole: string
  memberTeamID: number (FK)
}
```

## Third-Party Libraries

### Backend
- NestJS - Node.js framework
- TypeORM - ORM for database operations
- Passport - Authentication
- JWT - Token-based authentication
- Class Validator - DTO validation
- PostgreSQL - Database

### Frontend
- React - UI library
- Redux Toolkit - State management
- React Router - Routing
- FullCalendar - Calendar component
- Axios - HTTP client
- Bootstrap - CSS framework
- FontAwesome - Icons

## Technical Documentation

### Event Service Methods

#### `createEvent(createEventDto: CreateEventDto)`
- Description: Creates a new event
- Parameters: CreateEventDto containing event details
- Returns: Promise<Event>

#### `findAll()`
- Description: Retrieves all events
- Returns: Promise<Event[]>

#### `findOne(id: number)`
- Description: Retrieves event by ID
- Parameters: id (number)
- Returns: Promise<Event>

#### `update(id: number, updateEventDto: UpdateEventDto)`
- Description: Updates existing event
- Parameters: 
  - id: number
  - updateEventDto: UpdateEventDto
- Returns: Promise<Event>

#### `reportProblem(id: number, problemDetails: ReportProblemDto)`
- Description: Reports a problem for an event
- Parameters:
  - id: Event ID
  - problemDetails: { problemDescription: string, priority: string }
- Returns: Promise<Event>

### Team Service Methods

#### `createTeam(createTeamDto: CreateTeamDto)`
- Description: Creates a new team
- Parameters: CreateTeamDto containing team details
- Returns: Promise<Team>

#### `findAll()`
- Description: Retrieves all teams
- Returns: Promise<Team[]>

### Frontend Components

#### EventCalendar
- Purpose: Main calendar view for events
- Props: None
- State:
  - events: Event[]
  - selectedEvent: Event
  - showReportModal: boolean

#### TeamsList
- Purpose: Displays teams and their availability
- Props: None
- State:
  - teams: Team[]
  - loading: boolean

## Testing

### API Testing
1. Run unit tests:
   ```bash
   cd api
   npm run test
   ```
2. Run e2e tests:
   ```bash
   npm run test:e2e
   ```

### Frontend Testing
1. Run React component tests:
   ```bash
   cd app
   npm test
   ```

## Additional Notes
- The system uses JWT for authentication
- Calendar events support problem reporting with priority levels
- Teams can be marked as available/unavailable
- Real-time updates for team availability and problem reporting
