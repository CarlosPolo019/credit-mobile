# Register Page

## Purpose
Public screen for creating an account with document and password.

## Key Files
- `RegisterPage.tsx`: form, validation, API error display.

## External Deps
- `SessionContext.register`
- Backend `POST /api/v1/auth/register`

## Risks / TODOs
- Do not persist passwords.
- Keep document as the unique login identifier.
