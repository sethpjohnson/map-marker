# Project Specification for Phillippi Creek Dredging Tracker

This specification outlines the requirements and architecture for a web application to visualize and update dredging status for water bodies in Sarasota, with a focus on Phillippi Creek. The app is built on the following technologies:
- **SvelteKit** (version 5) with Svelte components
- **Leaflet** for the web mapping interface (displaying OpenStreetMap tiles)
- **TailwindCSS** + **DaisyUI** for UI styling
- **SQLite** database for local data persistence
- **pnpm** as the package manager

---

## 1. Goal

Create a minimal but interactive single-page application for local use. The app should:
1. Load a large GeoJSON file containing bodies of water in the Sarasota area.
2. Filter and display only Phillippi Creek on the Leaflet map by default.
3. Allow color customization of polygons based on dredging status (e.g., planned, funded, not planned, etc.).
4. Support text notes for each targeted dredging section.
5. Save dredging information and notes to a local SQLite database.

The user flow:
1. Launch the app locally (via `pnpm run dev`).
2. See a Leaflet map centered around Phillippi Creek.
3. Toggle or click on areas within the creek to set or update dredging status and notes.
4. Automatically store updated status and notes in the local SQLite database.

---

## 2. Data Flow & Filtering

### 2.1 Data Sources
- A large GeoJSON file containing multiple bodies of water in the Sarasota FL area.
- Only the Phillippi Creek features need to be displayed. All other polygons can be filtered out either on the server side or upon processing in SvelteKit.

### 2.2 Filtering Logic
- On app startup, read the large GeoJSON file from a local file or a designated endpoint.
- Extract features whose property (e.g., `name` or other relevant field) matches “Phillippi Creek.” 
- Structures relevant to dredging should be color-coded according to their status (planned, funded, not funded, completed, etc.).

---

## 3. Database & Schema (SQLite)

Use SQLite for persistent data storage. A proposed schema:

```
Table: dredging_sections
id integer (primary key, auto-increment)
feature_id text (a unique identifier from GeoJSON feature properties)
status text (e.g., 'planned', 'funded', 'not funded', 'completed')
notes text (short free-text)
last_updated datetime (stores last update time for reference)
```

Key points:
- Each record references a feature ID (such as a specific polygon segment).
- Status is stored as text but can be constrained to known status strings if desired.
- Notes are short text—no special formatting is needed.
- This table can be created in a SvelteKit endpoint, a migration script, or only once at the load time if not already present.

---

## 4. Application Structure

### 4.1 SvelteKit Pages & Routes
- **`+layout.svelte`** / **`+layout.ts`**: Global layout and config. 
- **`/ (home)`**: Main page that displays the Leaflet map and user interface for dredging updates.
- **API Endpoints**: 
  - `GET /api/geojson`: Returns the Phillippi Creek subset or the entire dataset if needed.
  - `POST /api/dredging_sections`: Update or insert dredging status in the SQLite database.
  - `GET /api/dredging_sections`: Retrieve current dredging data.

### 4.2 Main Components

1. **Map Component (Leaflet integration)**
   - Loads filtered GeoJSON data.
   - Renders polygons for Phillippi Creek sections.
   - Listens for user interactions (click or hover) to display a small pop-up or side panel with status and notes.
   - Dynamically updates polygon styles (color, opacity) based on the status from the database.

2. **Status Edit Form**
   - A small UI element (possibly a modal or side panel) using DaisyUI components that lets the user select a status from a dropdown and type a short note.
   - Submits or updates records in the SQLite database via a SvelteKit endpoint.

3. **Color Legend**
   - A small custom legend (could be a DaisyUI card) that shows the relationship between the dredging status and the polygon colors.

---

## 5. UI & Styling

- **Tailwind CSS** + **DaisyUI**
- Basic layout: 
  - **Header**: Title and possibly a legend. 
  - **Main content**: The Leaflet map. 
  - **Side/Bottom panel**: A collapsible widget to list or edit polygons, status, and notes.

### 5.1 DaisyUI Components
- **Buttons** for saving updates or resetting.
- **Cards** or **Modals** to handle the status form.
- **Alerts** for feedback on save success/failure.

---

## 6. Implementation Steps

1. **Initialize SvelteKit project** (using pnpm):
   ```
   pnpm create svelte@latest <project-name>
   cd <project-name>
   pnpm install
   ```
2. **Configure Tailwind + DaisyUI** in SvelteKit.
3. **Install Leaflet** and add relevant CSS/JS.
4. **Set up SQLite**: 
   - For local development, create or reference a `.db` file in the SvelteKit project.
   - Add an ORM or direct `better-sqlite3`/`sqlite3` usage in your SvelteKit server files.
5. **Map page**: 
   - Import Leaflet, load the filtered GeoJSON, and display polygons.
   - Implement a standard Leaflet `onEachFeature` to bind click events.
6. **API Endpoints**:
   - `/api/geojson`: Serves filtered data. Could be pre-filtered on server or in client code as needed.
   - `/api/dredging_sections`: CRUD endpoints or a single endpoint for updates.
7. **UI Integration**:
   - When user clicks a polygon, open a DaisyUI modal or side panel to update status/notes.
   - Reflect color changes on the polygon immediately and persist to the database.

---

## 7. Deployment/Local Use

- **Local usage**: 
  - Run migrations or have a startup script to ensure the `dredging_sections` table exists.
  - Start development with:
    ```
    pnpm run dev
    ```
  - Your app is accessible on `localhost:5173` (or another specified port).
- **Exporting images**: 
  - Leaflet offers various ways to capture map screenshots. 
  - Alternatively, manually capture the screen if that suffices. 
  - If you need an automated method, consider a plugin or a Node-based approach with Puppeteer.

---

## 8. Future Enhancements

- **Multi-polygons**: If Phillippi Creek is multi-segmented, ensure each segment is handled.
- **Advanced filtering**: Potentially allow partial name matches or property-based queries for other water bodies if needed.
- **User roles**: If access control is needed in the future, add simple login or roles for read/write permissions.

---

## 9. References & Tools

1. **SvelteKit Docs**:  
   [https://kit.svelte.dev/docs](https://kit.svelte.dev/docs)
2. **Leaflet**:  
   [https://leafletjs.com/](https://leafletjs.com/)
3. **Tailwind CSS**:  
   [https://tailwindcss.com/](https://tailwindcss.com/)
4. **DaisyUI**:  
   [https://daisyui.com/](https://daisyui.com/)
5. **SQLite**:  
   [https://www.sqlite.org/index.html](https://www.sqlite.org/index.html)

