# People's Library

## 1. About the Project

- **Name:** People’s Library
- **What it is:** A web app for managing personal books, virtual shelves, and reading lists with a nice wooden library vibe.
- **Purpose:** Helps users organize their books, track reading status, and keep personal notes.

## 2. User Access & Roles

- **Guests (Not logged in):** Can view the home page and public book catalog.
- **Logged-in users:** Have full access to their own shelves (`/my-shelf`) and personal library (`/my-books`), where they can add/delete books, shelves, and notes.

## 3. Auth & Session

- Uses **Supabase Auth** for email/password login and registration.
- The session is saved in `localStorage` so you don't get logged out on page refresh.

## 4. Routing

- Protected routes ensure only logged-in users can access private pages.
- Modals are used for book details and notes without reloading the page.

## 5. Database & CRUD Operations

- **Create:** Add a new shelf or add a book from the catalog.
- **Read:** Fetch book lists and shelves from Supabase.
- **Update:** Quickly change a book's status (e.g. Read / Currently Reading / Want to Read) or edit notes.
- **Delete:** Remove shelves, books, or notes with a single click.

## 6. Forms & Validation

- Includes forms for login, registration, searching, and new shelves.
- Requires a valid email and a password with a minimum length.

## 7. Tech Stack

- **React (Vite)** for the UI.
- **Supabase** for the database and auth.
- **CSS Modules** for styling and the custom wooden theme.

## 8. Error Handling

- Shows friendly alerts on login errors, and empty shelves display a simple notice.
