# Current Analytics Tracking Documentation

## Question Interaction Analytics

Event-scoped Custom Dimensions:
1. question_id
2. question_category
3. notes_type
4. user_type
5. feature_name
6. navigation_section
7. error_type
8. completion_status
9. device_info

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

## GA4 Custom Metrics Configuration

The following custom metrics should be configured in your GA4 property to enable deeper analytics insights:

### Question Engagement Metrics
1. **Average Question View Duration**
   - Type: Time (seconds)
   - Events: `question_view_duration`
   - Calculation: Mean of view_duration per question_id

2. **Question Completion Rate**
   - Type: Percentage
   - Events: `question_completion`
   - Calculation: (Completed questions / Total questions attempted) * 100

3. **Question Revisit Rate**
   - Type: Number
   - Events: `question_revisit`
   - Calculation: Average visit_count per question_id

### Learning Progress Metrics
4. **Category Completion Rate**
   - Type: Percentage
   - Events: `completion_rate`
   - Calculation: (completed_count / total_count) * 100

5. **Average Study Session Duration**
   - Type: Time (minutes)
   - Events: `study_session`
   - Calculation: Mean of session_duration

6. **Questions Per Session**
   - Type: Number
   - Events: `study_session`
   - Calculation: Average of questions_attempted per session

### User Engagement Metrics
7. **Notes Usage Frequency**
   - Type: Number
   - Events: `notes_usage`
   - Calculation: Sum of interaction_count per user per session

8. **Average Note Edit Duration**
   - Type: Time (seconds)
   - Events: `note_edit_duration`
   - Calculation: Mean of edit_duration

### Performance Metrics
9. **Average Page Load Time**
   - Type: Time (milliseconds)
   - Events: `page_load`
   - Calculation: Mean of load_duration

10. **Error Rate**
    - Type: Percentage
    - Events: `error`
    - Calculation: (Error count / Total sessions) * 100

### User Retention Metrics
11. **Return User Rate**
    - Type: Percentage
    - Events: `return_visit`
    - Calculation: (Returning users / Total users) * 100

12. **Average Visit Frequency**
    - Type: Number
    - Events: `return_visit`
    - Calculation: Mean of visit_count per user

### Feature Adoption Metrics
13. **Feature Usage Rate**
    - Type: Number
    - Events: `feature_usage`
    - Calculation: Average usage_count per feature_name

14. **Category Engagement Score**
    - Type: Number
    - Events: `category_view_duration`
    - Calculation: Weighted score based on view_duration and interaction_count

Note: Configure these metrics in your GA4 property under Custom Definitions > Create Custom Metrics. Each metric should be associated with the corresponding events and use the appropriate metric type (number, time, or percentage).

---

All analytics events are sent to Google Analytics and can be analyzed through the Google Analytics dashboard. Each event includes standard GA dimensions like timestamp, user ID (if available), and session ID in addition to the custom dimensions listed above.
