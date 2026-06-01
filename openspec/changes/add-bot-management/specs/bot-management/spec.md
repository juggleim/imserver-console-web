## ADDED Requirements

### Requirement: Bot list page accessible from sidebar

The system SHALL provide a "Bot Management" page under the User Management menu group, at the same level as User Management and Group Management.

#### Scenario: Navigate to bot list

- **WHEN** user selects "Bot Management" in the sidebar for an app
- **THEN** the system navigates to `/argument_botlist/:app_key` and displays the bot list page

### Requirement: Query bot list with pagination

The system SHALL fetch bots via `GET /admingateway/apps/bots/list` with `app_key`, optional `user_id`, optional `name`, `offset`, and `count` query parameters.

#### Scenario: Initial load

- **WHEN** the bot list page loads
- **THEN** the system requests the first page of bots and renders them in a table

#### Scenario: Search by bot id and nickname

- **WHEN** user enters bot id or nickname and clicks search
- **THEN** the system resets pagination and displays matching bots

#### Scenario: Load next page

- **WHEN** user clicks next page and more data exists
- **THEN** the system appends the next batch using the returned `offset` cursor

### Requirement: Create bot

The system SHALL create a bot via `POST /admingateway/apps/bots/add` with JSON body containing `app_key`, `nickname` (required), and optional `avatar`, `pinyin`, `bot_conf`, `bot_settings`.

#### Scenario: Successful creation

- **WHEN** user submits the create form with a valid nickname
- **THEN** the system calls the add API, shows success feedback, closes the dialog, and refreshes the list

#### Scenario: Missing nickname

- **WHEN** user submits the create form without nickname
- **THEN** the system shows validation error and does not call the API

### Requirement: Update bot

The system SHALL update a bot via `POST /admingateway/apps/bots/update` with JSON body containing `app_key`, `bot_id` (required), and optional `nickname`, `avatar`, `pinyin`, `bot_conf`, `bot_settings`.

#### Scenario: Successful update

- **WHEN** user edits an existing bot and saves
- **THEN** the system calls the update API, shows success feedback, closes the dialog, and refreshes the list

### Requirement: Bot list displays key fields

The bot list table SHALL display at minimum: avatar and nickname, bot_id, created time, webhook URL (from bot_conf), and only_mentioned setting.

#### Scenario: Render bot row

- **WHEN** bot data is returned from the API
- **THEN** each row shows the bot's identity and primary configuration summary

### Requirement: Internationalization

The system SHALL provide Chinese and English translations for all bot management UI labels, placeholders, table headers, and feedback messages.

#### Scenario: Locale switch

- **WHEN** user switches application locale
- **THEN** bot management page text updates to the selected language
