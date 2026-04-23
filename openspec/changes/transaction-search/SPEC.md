# Spec: Transaction Search (F1)

## ADDED Requirements

### Requirement: Search input MUST appear above table

The transacciones page MUST display a search input field positioned above the transaction table.

#### Scenario: Search input visible
- GIVEN user navigates to transacciones page
- THEN search input is visible above the table

### Requirement: Search MUST filter by descripcion

When searchQuery is not empty, the results MUST be filtered to only transactions where descripcion contains the search text (case-insensitive).

#### Scenario: Search filters results
- GIVEN user types "arriendo" in search
- WHEN results load
- THEN only transactions with "arriendo" in descripcion are shown

### Requirement: Empty search shows all transactions

When searchQuery is empty or blank, the system MUST show all transactions (no filter applied).

#### Scenario: Empty search shows all
- GIVEN search input is empty
- WHEN results load
- THEN all transactions within date range are shown

### Requirement: Search MUST be debounced

The search input MUST debounce input by 300ms before executing the query to prevent excessive API calls.

#### Scenario: Debounce prevents rapid queries
- GIVEN user types "ar" then "arr" then "arre"
- WHEN user pauses for 300ms
- THEN single query executes with "arre"

### Requirement: Empty results state

When search yields 0 results, the UI MUST display an empty state message indicating no transactions match.

#### Scenario: No results message
- GIVEN user searches for "xyznonexistent"
- WHEN results load with 0 matches
- THEN empty state message is displayed
