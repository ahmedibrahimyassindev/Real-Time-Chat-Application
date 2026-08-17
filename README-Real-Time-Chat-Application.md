# Real-Time Chat Application

## Frontend-Only Project Plan

A modern frontend-only real-time chat application inspired by Slack.

The project is intended to demonstrate advanced frontend engineering
with Vue 3, TypeScript, real-time UI behavior, state management,
server-state synchronization, testing, responsive design, and
component-driven development.

> **Current Status:** Phase 9 quality tooling implemented
>
> The repository contains a Vue 3 + TypeScript + Vite frontend foundation
> with routing, Pinia, TanStack Query, Axios, Zod, Tailwind CSS, ESLint,
> Prettier, MSW REST mocks, typed mock data, a mock WebSocket client,
> authentication screens, protected routes, mock session handling, and a
> profile page. The core chat screen now supports conversation selection,
> message rendering, message composition, editing, deletion, and loading
> older messages. Simulated real-time events now drive incoming messages,
> typing indicators, presence, connection state, reconnection behavior, and
> read-receipt updates. Advanced messaging now includes reactions, replies,
> attachment selection, message search, and mention rendering. Channel
> management now supports channel listing, creation, editing, join/leave,
> member management, and permission-aware controls. Notifications now include
> a notification center, unread badge, mark-as-read actions, and simulated
> real-time delivery.
> Quality tooling now includes Vitest, Playwright, Storybook, accessibility
> review notes, performance review notes, and responsive test coverage.

---

## Project Goals

The application will provide a realistic chat experience while keeping
the repository focused on frontend development.

The project will demonstrate:

- Vue 3 application architecture
- TypeScript
- Reusable component design
- Client-side state management
- Server-state management
- REST API integration patterns
- WebSocket client integration
- Mock API and real-time services
- Optimistic UI updates
- Infinite scrolling
- Form and payload validation
- Responsive design
- Unit and component testing
- End-to-end testing
- Storybook component documentation
- Dockerized frontend development after implementation

---

## Planned Features

### Authentication UI

Planned authentication-related screens and behavior:

- Login
- Registration
- Logout
- Protected routes
- User profile
- Profile editing
- Avatar upload UI
- Session-expiration handling

Authentication will initially use mocked API responses because backend
implementation is outside the scope of this repository.

---

### Direct Conversations

Users will be able to interact with one-to-one conversations.

Planned functionality:

- Conversation list
- Open a conversation
- Send messages
- Receive simulated real-time messages
- Edit messages
- Delete messages
- Reply to messages
- React to messages
- Attachment UI
- Read status
- Typing indicators
- Online/offline presence

Example flow:

```text
User A
  |
  | Send Message
  v
Frontend State
  |
  | Mock API / WebSocket Event
  v
Conversation UI
```

---

### Channels and Groups

The application will include Slack-style channels.

Example:

```text
Workspace
|
+-- #general
+-- #backend
+-- #frontend
+-- #random
+-- #announcements
```

Planned functionality:

- Create channel UI
- Edit channel UI
- Delete channel UI
- Join channel
- Leave channel
- Add members
- Remove members
- Public channels
- Private channels
- Channel description
- Member list
- Permission-aware UI

---

### Real-Time Messaging

The frontend will simulate or consume WebSocket events to provide a
real-time user experience.

Planned events:

```text
message.created
message.updated
message.deleted
message.read

user.online
user.offline

typing.started
typing.stopped

reaction.created
reaction.deleted

notification.created
```

The frontend will be responsible for:

- Opening and closing the WebSocket connection
- Subscribing to events
- Updating cached data
- Updating presence state
- Handling reconnect behavior
- Avoiding duplicate messages
- Handling temporary optimistic messages
- Displaying connection state when appropriate

A real backend WebSocket implementation is outside the initial scope of
this repository.

---

### Online Presence

Planned user presence states:

```text
Online
Away
Busy
Offline
```

Presence will initially be simulated using mock real-time events.

---

### Typing Indicators

Example:

```text
Ahmed is typing...
```

For channels:

```text
Ahmed and Sarah are typing...
```

Typing events should be debounced to avoid unnecessary event traffic.

---

### Read Receipts

Planned message states:

```text
Sent
Delivered
Read
```

For group conversations, a future enhancement may show how many members
have read a message.

---

### Message Reactions

Users will be able to:

- Add a reaction
- Remove a reaction
- See reaction counts
- View users associated with a reaction

Example:

```text
Great job on the release!

Like: 4
Love: 2
Celebrate: 6
```

---

### File Attachments

The frontend will provide attachment selection, preview, validation,
upload-state, and error-state UI.

Planned supported examples:

- Images
- PDFs
- Documents
- Videos
- ZIP files

Because the initial project is frontend-only, actual file persistence
may be mocked.

---

### Message Search

Planned search filters:

- Keyword
- Sender
- Channel
- Date
- File type
- Has attachment

Search should include:

- Loading state
- Empty state
- Error state
- Debounced input
- Highlighted results where useful

---

### Infinite Scrolling

Older messages will be loaded as the user scrolls upward.

Example:

```text
Latest Messages
      ^
      |
   Scroll Up
      |
Load Previous Page
      |
      v
Older Messages
```

TanStack Query's infinite-query functionality can be used with mocked
cursor-based pagination.

Example mock response:

```json
{
  "data": [],
  "next_cursor": "abc123"
}
```

---

### Notifications

Planned notification functionality:

- Notification list
- Unread count
- Mark as read
- Mark all as read
- Simulated real-time notification delivery
- Mentions
- Direct-message notifications
- Channel invitation notifications
- Reaction notifications

---

### Mentions

Users will be able to mention other users in messages.

Example:

```text
@ahmed can you review this pull request?
```

The UI should visually distinguish mentions and generate a mock
notification event.

---

### Optional Message Threads

Threads are a planned advanced feature.

Example:

```text
Main Message
|
+-- Reply 1
+-- Reply 2
+-- Reply 3
```

---

## Planned Technology Stack

### Vue 3

Primary frontend framework.

Planned usage:

- Composition API
- Reactive UI
- Reusable components
- Composables

### TypeScript

Used for:

- Domain models
- Component props
- API response types
- Store typing
- Safer refactoring

### Vite

Planned development and build tooling.

### Pinia

Planned for client-side/global application state.

Possible stores:

```text
authStore
presenceStore
uiStore
webSocketStore
```

### Vue Router

Planned routes may include:

```text
/login
/register
/chat
/chat/:conversationId
/channels/:channelId
/search
/notifications
/settings
/profile
```

### Tailwind CSS

Planned for responsive layouts, utility-first styling, dark mode, and
consistent design tokens.

### Axios

Planned HTTP client for REST API and mock API communication.

### TanStack Query

Planned for remote/server-style state:

- Conversations
- Messages
- Channels
- Search results
- Notifications
- Infinite pagination
- Cache invalidation
- Background refetching

### Zod

Planned for runtime validation and form schemas.

Example:

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

### Vitest

Planned for unit and component tests.

### Playwright

Planned for end-to-end browser testing.

### Storybook

Planned for isolated development and documentation of reusable UI
components.

Potential stories:

```text
Button
Avatar
MessageBubble
MessageInput
ChannelItem
UserStatus
NotificationItem
Modal
Dropdown
FilePreview
ReactionPicker
SkeletonLoader
```

### Docker

Docker is part of the planned technology stack, but Docker support has
**not been implemented yet**.

A Dockerfile and related commands will only be documented after they
exist and have been verified.

---

## Mocking Strategy

Because this repository is intended to remain frontend-focused, external
backend behavior will initially be mocked.

### REST API Mocking

A tool such as **Mock Service Worker (MSW)** can be used to simulate
endpoints for:

- Authentication
- Users
- Conversations
- Messages
- Channels
- Notifications
- Search

This allows the frontend to exercise realistic HTTP states without
requiring a backend repository.

### Real-Time Mocking

Real-time behavior can initially be simulated through a lightweight mock
WebSocket layer.

It should be capable of simulating:

- Incoming messages
- Typing events
- Presence changes
- Read receipts
- Reactions
- Notifications
- Connection loss and reconnection

The WebSocket client should be isolated behind a service/composable so a
real WebSocket server can be connected later without rewriting the UI.

---

## Proposed Frontend Architecture

```text
src/
|
+-- api/
|   +-- auth.api.ts
|   +-- channels.api.ts
|   +-- conversations.api.ts
|   +-- messages.api.ts
|   +-- notifications.api.ts
|   +-- users.api.ts
|
+-- assets/
|
+-- components/
|   +-- common/
|   +-- chat/
|   +-- channels/
|   +-- notifications/
|   +-- users/
|
+-- composables/
|   +-- useAuth.ts
|   +-- useChat.ts
|   +-- usePresence.ts
|   +-- useTyping.ts
|   +-- useWebSocket.ts
|
+-- layouts/
|   +-- AuthLayout.vue
|   +-- ChatLayout.vue
|
+-- mocks/
|   +-- handlers/
|   +-- data/
|   +-- websocket/
|
+-- pages/
|   +-- LoginPage.vue
|   +-- RegisterPage.vue
|   +-- ChatPage.vue
|   +-- ChannelPage.vue
|   +-- SearchPage.vue
|   +-- NotificationsPage.vue
|   +-- SettingsPage.vue
|
+-- router/
|   +-- index.ts
|
+-- schemas/
|   +-- auth.schema.ts
|   +-- channel.schema.ts
|   +-- message.schema.ts
|
+-- stores/
|   +-- auth.store.ts
|   +-- presence.store.ts
|   +-- ui.store.ts
|   +-- websocket.store.ts
|
+-- types/
|   +-- user.ts
|   +-- message.ts
|   +-- channel.ts
|   +-- notification.ts
|
+-- utils/
|
+-- App.vue
+-- main.ts
```

This is a proposed structure and may change during implementation.

---

## State Management Strategy

A clear separation between client state and remote state is planned.

### Pinia

Use Pinia for state such as:

```text
Authentication session
Current user
UI state
Presence state
WebSocket connection state
Theme/preferences
```

### TanStack Query

Use TanStack Query for:

```text
Messages
Conversations
Channels
Search
Notifications
Paginated data
```

This avoids putting all API data into large global stores.

---

## Optimistic UI

The project will demonstrate optimistic updates for suitable actions.

Example message flow:

```text
User sends message
      |
      v
Create temporary local message
      |
      v
Show it immediately
      |
      v
Send mock/API request
      |
      +-- Success --> Replace temporary state
      |
      +-- Failure --> Show failed state and Retry action
```

Optimistic behavior can also be considered for:

- Reactions
- Marking notifications as read
- Editing messages

---

## Proposed UI Layout

Desktop concept:

```text
+--------------------------------------------------------------+
| Top Navigation                                               |
+---------------+---------------------------+------------------+
|               |                           |                  |
| Sidebar       | Conversation              | Details Panel    |
|               |                           |                  |
| Channels      | Messages                  | Members          |
|               |                           |                  |
| Direct        |                           | Files            |
| Messages      |                           |                  |
|               |                           | Pinned Messages  |
|               |                           |                  |
+---------------+---------------------------+------------------+
|                        Message Input                          |
+--------------------------------------------------------------+
```

---

## Responsive Design

The project should support:

- Desktop
- Tablet
- Mobile

On smaller screens, sidebars and detail panels can become drawers or
separate routed views.

---

## Dark Mode

Planned themes:

```text
Light Mode
Dark Mode
```

The selected preference can be stored locally.

---

## Loading, Empty, and Error States

Every important data-driven screen should account for:

- Initial loading
- Background loading
- Empty results
- API errors
- WebSocket disconnection
- Failed message delivery
- Retry behavior

Skeleton components should be used where they improve perceived
performance.

---

## Accessibility

Planned accessibility considerations:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible form labels
- Appropriate ARIA attributes
- Sufficient contrast
- Screen-reader-friendly status messages
- Reduced-motion considerations

---

## Security Considerations

Even though this is a frontend-only project, the UI should follow good
security practices:

- Do not expose real secrets or private API keys
- Treat all user-generated content as untrusted
- Avoid unsafe HTML rendering
- Validate client-side forms and payload shapes
- Validate attachment type and size in the UI
- Handle expired sessions
- Protect client-side routes
- Avoid insecure token-handling patterns

Client-side validation and route protection are not replacements for
backend security. A future real backend must perform authentication,
authorization, validation, and file-security checks independently.

---

## Performance Goals

Planned performance techniques:

- Lazy-loaded routes
- Code splitting
- Infinite scrolling
- Virtualized message lists for large conversations
- Debounced search
- Debounced typing events
- Query caching
- Optimistic updates
- Lazy-loaded images
- Efficient WebSocket event handling
- Skeleton loading states

A virtualization solution such as Vue Virtual Scroller may be evaluated
during implementation.

---

## Testing Strategy

### Unit Tests

Vitest can cover:

- Utility functions
- Composables
- Pinia stores
- Zod schemas
- Message formatting
- Presence logic

### Component Tests

Important components to test:

```text
MessageBubble
MessageInput
ChannelList
ReactionPicker
UserStatus
NotificationItem
SearchInput
FilePreview
```

### End-to-End Tests

Playwright scenarios can include:

```text
Login with mock account
        |
        v
Open conversation
        |
        v
Send message
        |
        v
Receive simulated message
        |
        v
Add reaction
        |
        v
Search messages
        |
        v
Logout
```

---

## Development Roadmap

### Phase 1 - Project Foundation

- [x] Initialize Vue 3 + TypeScript project
- [x] Configure Vite
- [x] Configure Tailwind CSS
- [x] Configure Vue Router
- [x] Configure Pinia
- [x] Configure Axios
- [x] Configure TanStack Query
- [x] Configure Zod
- [x] Add formatting and linting rules

### Phase 2 - Mock Infrastructure

- [x] Configure MSW or equivalent REST mocking
- [x] Create mock users
- [x] Create mock conversations
- [x] Create mock channels
- [x] Create mock messages
- [x] Implement mock WebSocket service

### Phase 3 - Authentication UI

- [x] Login page
- [x] Registration page
- [x] Protected routes
- [x] Mock session handling
- [x] User profile

### Phase 4 - Core Chat UI

- [x] Conversation list
- [x] Message list
- [x] Message composer
- [x] Send message
- [x] Edit message
- [x] Delete message
- [x] Infinite scrolling

### Phase 5 - Real-Time UI

- [x] Simulated incoming messages
- [x] Typing indicators
- [x] Online presence
- [x] Read receipts
- [x] Connection state
- [x] Reconnection behavior

### Phase 6 - Advanced Messaging

- [x] Reactions
- [x] Replies
- [x] Attachment UI
- [x] Message search
- [x] Mentions

### Phase 7 - Channels

- [x] Channel list
- [x] Create channel
- [x] Edit channel
- [x] Join channel
- [x] Leave channel
- [x] Member management UI
- [x] Permission-aware controls

### Phase 8 - Notifications

- [x] Notification center
- [x] Unread counter
- [x] Mark as read
- [x] Mark all as read
- [x] Simulated real-time notifications

### Phase 9 - Quality

- [x] Vitest test suite
- [x] Playwright E2E tests
- [x] Storybook stories
- [x] Accessibility review
- [x] Performance review
- [x] Responsive testing

### Phase 10 - Docker

- [ ] Add Dockerfile
- [ ] Verify development/production container workflow
- [ ] Add Docker documentation only after commands are tested

---

## Current Repository Status

Current implementation status:

- Phase 1 project foundation is implemented.
- Phase 2 mock infrastructure is implemented.
- Phase 3 authentication UI is implemented.
- Phase 4 core chat UI is implemented.
- Phase 5 real-time UI is implemented.
- Phase 6 advanced messaging is implemented.
- Phase 7 channels are implemented.
- Phase 8 notifications are implemented.
- Phase 9 quality tooling is implemented.
- The app can be installed, built, linted, formatted, and previewed.
- Docker has not yet been implemented.
- No Docker commands are documented because a Dockerfile has not yet
  been added.
- The folder structure above now exists as the baseline application
  structure and may evolve during implementation.

This section should be updated as implementation progresses.

### Setup

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

### Verification

```bash
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
npm run build-storybook
```

---

## Future Improvements

Potential features after the core frontend is complete:

- Message threads
- Pinned messages
- Saved messages
- Voice-message UI
- Video-call UI
- Scheduled messages
- Multiple workspaces
- Custom emojis
- GIF integration
- Slash commands
- Bot UI
- AI assistant UI
- Message translation
- Audit-log UI

---

## Skills This Project Is Intended to Demonstrate

```text
Vue 3
TypeScript
Composition API
Frontend Architecture
Component Design
Pinia
TanStack Query
Vue Router
Tailwind CSS
Axios
Zod
REST API Integration
WebSocket Client Integration
Real-Time UI
Optimistic Updates
Infinite Scrolling
Responsive Design
Accessibility
Vitest
Playwright
Storybook
Docker
Performance Optimization
```

---

## Why This Project Is Valuable

This project is intended to go beyond a basic CRUD frontend.

A polished chat interface requires careful handling of:

- Complex component interactions
- Real-time state changes
- Local and remote state synchronization
- Optimistic updates
- Pagination
- Presence
- Typing indicators
- Notifications
- Search
- Attachments
- Error recovery
- Responsive layouts
- Accessibility
- Performance

The completed project can serve as a strong frontend portfolio example
once the roadmap items are implemented and the README is updated to
accurately reflect completed work.

---

## License

No license has been selected yet.

If the project is later released under the MIT License, a `LICENSE` file
should be added to the repository and this section should be updated
accordingly.
