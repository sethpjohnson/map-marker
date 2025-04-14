# Phillippi Creek Dredging Tracker

A web application to visualize and track dredging status for Phillippi Creek in Sarasota, Florida.

This could be used in other places, as long as you have the GeoJSON file with all of the geometry. Most of the time you can get this from the county or city's website.

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
```

3. The app will be available at `http://localhost:5173`

## Deployment

The application is configured to deploy to GitHub Pages. The deployment process is automated using GitHub Actions.

### Manual Deployment

1. Export the database to JSON:
```bash
pnpm run export-db
```

2. Build the static site:
```bash
pnpm run build
```

3. The built files will be in the `build` directory.

### Automatic Deployment

1. Push your changes to the `main` branch
2. GitHub Actions will automatically:
   - Export the database to JSON
   - Build the static site
   - Deploy to GitHub Pages

The site will be available at `https://[your-username].github.io/map-marker`

## Data Management

During development, the application uses a SQLite database for data storage. When deploying to GitHub Pages, the data is exported to a JSON file.

To update the data:
1. Make changes in the development environment
2. Export the database to JSON:
```bash
pnpm run export-db
```
3. Commit and push the changes

## Technologies Used

- SvelteKit
- Leaflet
- TailwindCSS + DaisyUI
- SQLite (development)
- GitHub Pages (deployment)
