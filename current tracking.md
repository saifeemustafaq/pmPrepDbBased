# Current Analytics Tracking Documentation

## Question Interaction Analytics

### Question Expansion Tracking
- **Event**: `question_expansion`
- **Category**: Question Interaction
- **Dimensions**:
  - Question ID
  - Question Title
  - Category
  - Interaction Count

### Question View Duration
- **Event**: `question_view_duration`
- **Category**: Question Interaction
- **Dimensions**:
  - Question ID
  - Question Category
  - View Duration (seconds)
  - Question Title

### Question Completion Status
- **Event**: `question_completion`
- **Category**: Question Interaction
- **Dimensions**:
  - Question ID
  - Question Title
  - Category
  - Completion Status (boolean)

### Question Revisits
- **Event**: `question_revisit`
- **Category**: Question Interaction
- **Dimensions**:
  - Question ID
  - Question Category
  - Visit Count
  - Question Title

## Navigation & Category Analytics

### Category Time Tracking
- **Event**: `category_view_duration`
- **Category**: Navigation
- **Dimensions**:
  - Category Name
  - View Duration (seconds)
  - Navigation Section

### Sidebar Navigation
- **Event**: `sidebar_section_click`
- **Category**: Navigation
- **Dimensions**:
  - Section Name
  - Interaction Count
  - Navigation Section

## Notes Usage Analytics

### Notes Editing
- **Event**: `note_edit_duration`
- **Category**: Notes
- **Dimensions**:
  - Notes Type (overall/question)
  - Question ID (if applicable)
  - Edit Duration (seconds)
  - Content Length

### Notes Usage Tracking
- **Event**: `notes_usage`
- **Category**: Notes
- **Dimensions**:
  - Notes Type
  - Question ID (if applicable)
  - Interaction Count

## Session Analytics

### Session Tracking
- **Events**: `session_start`, `session_end`
- **Category**: Session
- **Dimensions**:
  - Session Duration
  - Timestamp
  - User Type (new/returning)

### Study Session Metrics
- **Event**: `study_session`
- **Category**: User Journey
- **Dimensions**:
  - Session Duration
  - Questions Attempted
  - Questions Completed
  - Categories Covered

## Learning Journey Analytics

### Learning Path Progress
- **Event**: `learning_path_progress`
- **Category**: User Journey
- **Dimensions**:
  - Question ID
  - Category
  - Time Spent
  - Completion Status

### Question Difficulty Analysis
- **Event**: `question_difficulty`
- **Category**: User Journey
- **Dimensions**:
  - Question ID
  - Time Spent
  - Attempt Count
  - Completion Status

### Category Completion Rate
- **Event**: `completion_rate`
- **Category**: User Journey
- **Dimensions**:
  - Category
  - Sub-Category
  - Completed Count
  - Total Count
  - Completion Percentage

## User Retention Analytics

### Return Visit Tracking
- **Event**: `return_visit`
- **Category**: User Retention
- **Dimensions**:
  - Last Visit Date
  - User Type (returning)
  - Visit Count

## Technical & Performance Analytics

### Page Performance
- **Event**: `page_load`
- **Category**: Performance
- **Dimensions**:
  - Load Duration
  - Page Path

### Device Information
- **Event**: `device_info`
- **Category**: User Environment
- **Dimensions**:
  - Screen Dimensions
  - Viewport Size
  - Device Pixel Ratio
  - Platform
  - User Agent

### Error Tracking
- **Event**: `error`
- **Category**: Error
- **Dimensions**:
  - Error Type
  - Error Message
  - Component Name (if applicable)

## UI/Feature Usage Analytics

### Feature Usage
- **Event**: `feature_usage`
- **Category**: Feature
- **Dimensions**:
  - Feature Name
  - Action
  - Usage Count

### UI Interactions
- **Event**: `ui_interaction`
- **Category**: UI
- **Dimensions**:
  - Component Name
  - Action
  - Interaction Count

---

All analytics events are sent to Google Analytics and can be analyzed through the Google Analytics dashboard. Each event includes standard GA dimensions like timestamp, user ID (if available), and session ID in addition to the custom dimensions listed above.
