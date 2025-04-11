# Project Task Checklist

### 1. Project Initialization

- [x] Create a new SvelteKit (v5) project in the root of this repository using pnpm:  
  • `pnpm create svelte@latest .`  
  • Overwrite when prompted (if desired) or place in a new folder if needed.  
  • `pnpm install`

### 2. Tailwind + DaisyUI Setup

- [x] Install and configure TailwindCSS.  
- [x] Integrate DaisyUI according to its setup instructions.  
- [x] Verify Tailwind and DaisyUI classes are applied correctly in a sample component.

### 3. Leaflet Integration

- [x] Install Leaflet and add its CSS/JS in your SvelteKit app.  
- [x] Confirm that a basic map renders on the home page with OpenStreetMap tiles.  
- [x] Verify basic Leaflet functionality, such as zooming and panning.

### 4. GeoJSON Filtering

- [x] Create or identify the large GeoJSON file for Sarasota's bodies of water.  
- [x] Write logic (in a server or endpoint) to filter out non-Phillippi Creek features.  
- [x] Ensure that only Phillippi Creek polygons are sent to or loaded by the client.

### 5. Database Setup (SQLite)

- [x] Create (or reference) a local SQLite database file in the root of this project.  
- [x] Implement a `dredging_sections` table with adequate fields:  
  • `id` (PRIMARY KEY)  
  • `feature_id`  
  • `status` (planned, funded, etc.)  
  • `notes` (short text)  
  • `last_updated` (for record-keeping)  
- [x] Decide your approach to migrations or initial table creation.  

### 6. Data Access Layer & API Endpoints

- [x] Use server-side code or endpoints in SvelteKit to manage reads/writes to `dredging_sections`.  
- [x] Implement a GET endpoint to serve GeoJSON data (optionally pre-filtered).  
- [x] Implement CRUD endpoints for dredging sections:  
  • `GET /api/dredging_sections` to list statuses  
  • `POST /api/dredging_sections` to create/update status & notes

### 7. Frontend UI & Components

- [x] Create a main page displaying the Leaflet map with Phillippi Creek polygons.  
- [x] For polygons, implement click or hover events that display a status-edit form.  
- [x] Build a modal or side panel (using DaisyUI) to show:  
  • A dropdown for dredging status (planned, funded, etc.)  
  • A text field for notes  
  • A save action that calls `/api/dredging_sections`
- [x] Update polygon color dynamically, reflecting the saved status.

### 8. Status Coloring & Legend

- [x] Assign specific colors to each dredging status (planned, funded, not funded, completed).  
- [x] Add a small legend component or card explaining the status-color mapping.

### 9. Exporting & Capturing Map Images

- [ ] Evaluate Leaflet plugins or direct screenshot methods if you need automated captures.  
- [ ] Otherwise, note that manual screenshots might suffice for local usage.

### 10. Testing & Validation

- [ ] Verify DB operations: create, read, update, delete.  
- [ ] Confirm that updated statuses and notes persist across application restarts.  
- [ ] Validate that polygons reflect changes immediately in color and user notes.

### 11. Local Usage & Demo

- [x] Finalize the local startup command:
  • `pnpm run dev`
- [ ] Ensure the site is accessible on localhost with no errors.
- [ ] Walk through a sample dredging update, note changes, and confirm data is stored in SQLite.

### 12. Potential Enhancements (Optional)

- [ ] Handle multi-polygons if Phillippi Creek is composed of multiple segments.  
- [ ] Add partial name-matching filters for other bodies of water if needed.  
- [ ] Implement user roles or login if future needs arise.

---

