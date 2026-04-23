# Spec: Import Validation (F2)

## ADDED Requirements

### Requirement: API MUST validate fecha format

The API MUST accept date strings in `DD/MM/YYYY` format and parse them to `YYYY-MM-DD` for Supabase storage.

#### Scenario: Valid date import
- GIVEN transactions with valid fecha in DD/MM/YYYY format
- WHEN import is submitted
- THEN API returns 200 and transactions are stored with parsed dates

#### Scenario: Invalid date format rejected
- GIVEN transaction with fecha "2025-13-45" (invalid)
- WHEN import is submitted
- THEN API returns 400 with error "Invalid date format"

### Requirement: API MUST validate monto is positive number

The API MUST reject transactions where monto is not a valid positive number.

#### Scenario: Valid monto import
- GIVEN transactions with monto as valid positive numbers
- WHEN import is submitted
- THEN transactions are stored successfully

#### Scenario: Invalid monto rejected
- GIVEN transaction with monto "abc" or -100
- WHEN import is submitted
- THEN API returns 400 with error about monto

### Requirement: API MUST validate tipo enum

The API MUST only accept tipo values of exactly "Ingreso" or "Egreso".

#### Scenario: Valid tipo import
- GIVEN transactions with tipo "Ingreso" or "Egreso"
- WHEN import is submitted
- THEN transactions are stored

#### Scenario: Invalid tipo rejected
- GIVEN transaction with tipo "ingreso" (lowercase) or "Entrada"
- WHEN import is submitted
- THEN API returns 400 with error about tipo

### Requirement: API MUST return structured errors

The API MUST return 400 status with a JSON object containing error details when validation fails.

#### Scenario: Validation error response
- GIVEN transaction with multiple invalid fields
- WHEN import is submitted
- THEN API returns 400 with JSON: `{ error: "Validation failed", details: [...] }`
