# BlockCrafters – Minecraft Building Studio

A responsive five-page client-side web application for a fictional Minecraft building studio. Built as a continuation of our midterm and endterm projects using HTML5, CSS3, Bootstrap, JavaScript (ES6+ OOP), jQuery, `localStorage`, and a public REST API.

## Live Demo & Repository

- **Live Deployed Website:** 	
https://github.com/Polarbee-beep/Final-Web-Technologies
- **GitHub Repository:** https://polarbee-beep.github.io/Final-Web-Technologies/

## Group Members & Contributions

-Project made solo by Safiya Sadykova

## Pages

- `index.html` – Studio introduction, live statistics dashboard, and Minecraft Java server status checker.
- `about.html` – Studio overview, building process, and interactive jQuery FAQ accordion.
- `services.html` – Dynamically rendered service packages and interactive project price estimator.
- `gallery.html` – Searchable, filterable, and sortable build gallery with full CRUD functionality.
- `contact.html` – Contact form with custom client-side validation rules.

## Final-Stage Features

1. **External API Integration (`mcstatus.io`):** Fetches live Minecraft Java server status data using `fetch` and `async/await`, rendering dynamic DOM elements with loading, success, empty/offline, and error states.
2. **Object-Oriented Programming (`Build` Class):** Uses a custom JavaScript `Build` class with a constructor, properties, and methods to instantiate and manage build objects across the application.
3. **Persistent Storage (`localStorage`):** Saves, restores, updates, and clears gallery build records and user theme preferences in JSON format with safe fallback handling for missing or invalid data.
4. **Full CRUD Operations:** Allows users to create new builds, view details, edit existing entries, and delete records directly in the gallery interface.
5. **Advanced Search, Filtering & Sorting:** Enables real-time keyword search, category filtering, and sorting by price, size, or name.
6. **Dashboard & Statistics Panel:** Dynamically calculates and displays build counts and category breakdowns based on stored project data.
7. **Custom Form Validation & jQuery Enhancements:** Includes client-side validation on `contact.html`, plus jQuery-powered FAQ accordions and UI interactions.

## API Information

- **API Used:** [Minecraft Server Status API (`mcstatus.io`)](https://mcstatus.io)
- **Endpoint:** `https://mcstatus.io{server_address}`
- **Authentication:** Public API (no secret API key required).
- **Data Retrieved:** Server online/offline status, player count (`players.online` / `players.max`), server version, and Message of the Day (`motd.clean`).
- **Error & State Handling:** Displays a loading indicator during fetch requests, handles empty input or offline servers cleanly, and catches network/HTTP errors without console crashes.

## Installation & Testing Instructions

1. Clone or download the repository:
   ```bash
   git clone https://github.com.git
   ```
2. Open the project folder in **VS Code**.
3. Launch `index.html` using the **Live Server** extension (or open the live GitHub Pages link above).
4. Ensure an active internet connection is available to load Bootstrap CDN, jQuery CDN, and live data from `mcstatus.io`.

## Important Notes

- Contact form submissions are validated on the client side and are not transmitted to an external backend server.
- Gallery records and theme preferences are stored locally in the user's browser via `localStorage`.
