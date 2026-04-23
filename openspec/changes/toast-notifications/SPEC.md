# Spec: Toast Notifications (F5)

## ADDED Requirements

### Requirement: Sonner MUST be installed

The project MUST have sonner installed via shadcn.

#### Scenario: Sonner installed
- GIVEN `npx shadcn@latest add sonner` is run
- THEN `sonner` appears in package.json dependencies
- AND `src/components/ui/sonner.tsx` exists

### Requirement: Toaster MUST render in dashboard

The dashboard layout MUST render the Sonner Toaster component.

#### Scenario: Toaster visible
- GIVEN dashboard layout is rendered
- THEN `<Toaster richColors />` is rendered in the component tree

### Requirement: Import success shows toast

When Gema import completes successfully, a toast notification MUST be displayed.

#### Scenario: Import success toast
- GIVEN user submits valid Gema import
- WHEN import succeeds (200 response)
- THEN `toast.success()` displays success message

### Requirement: Import error shows toast

When Gema import fails, an error toast MUST be displayed with the error message.

#### Scenario: Import error toast
- GIVEN user submits invalid Gema import
- WHEN import fails (non-200 response)
- THEN `toast.error()` displays error message

### Requirement: Form success shows toast

When transaccion form is submitted successfully, a toast notification MUST be displayed.

#### Scenario: Form success toast
- GIVEN user submits new transaccion form
- WHEN form succeeds
- THEN `toast.success()` displays confirmation

### Requirement: Form error shows toast

When transaccion form validation fails, an error toast MUST be displayed.

#### Scenario: Form error toast
- GIVEN user submits form with invalid fields
- WHEN validation fails
- THEN `toast.error()` displays validation errors

### Requirement: Auth error shows toast

When login fails, an error toast MUST be displayed.

#### Scenario: Auth error toast
- GIVEN user submits invalid credentials
- WHEN auth fails
- THEN `toast.error()` displays error message

### Requirement: Toasts are dismissible

Toast notifications SHOULD auto-dismiss after 5 seconds.

#### Scenario: Auto-dismiss
- GIVEN toast is displayed
- WHEN 5 seconds pass
- THEN toast disappears automatically
