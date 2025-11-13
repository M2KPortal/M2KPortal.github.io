# Mount 2K Housing Management System

A modern, professional React-based housing management dashboard built with the same design principles as the Seminary Bar POS system.

## Features

- **Beautiful, Modern UI** - Clean design with Tailwind CSS
- **Username/Password Login** - Professional authentication system
- **Auto-Save to GitHub** - Automatic data syncing (no manual save buttons!)
- **Real-time Updates** - Changes saved automatically every 2 seconds
- **Public Dashboard** - Read-only public view for participants
- **Comprehensive Management**:
  - Youth Groups
  - Room Management (Housing & Small Groups)
  - Housing Assignments
  - Meal Color Groups
  - ADA Individual Tracking
  - And more!

## Access the Dashboard

### Admin Access
1. Visit: https://m2kportal.online/login
2. Login with credentials:
   - Username: `admin`
   - Password: `Mount2K2026`
   - (Alternative: `m2kadmin` / `189838`)

### Public View
Visit: https://m2kportal.online/public

## How Auto-Save Works

Unlike the old system where you had to click "Save to GitHub", the new system:

1. **Auto-saves every change** after 2 seconds of inactivity
2. **Shows save status** in the header (green checkmark when saved)
3. **Only requires GitHub token ONCE** - set it in Settings and forget it!

## First-Time Setup

### Configure GitHub Token (One-Time Setup)

1. Login to the admin dashboard
2. Go to **Settings** (in the sidebar)
3. Follow the instructions to create a GitHub Personal Access Token:
   - Go to GitHub.com → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
4. Paste the token in Settings and click Save
5. **Done!** Auto-save is now enabled forever (or until you clear browser data)

## Development

### Project Structure
```
M2KPortal.github.io/
├── housing-dashboard/     # React source code
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # GitHub API service
│   │   ├── context/      # React contexts (Auth, Data)
│   │   └── utils/        # Utility functions
│   ├── public/          # Static assets
│   └── package.json     # Dependencies
├── assets/              # Built CSS/JS files
├── index.html           # Main HTML file (built from React)
├── m2k_2026_housing_data (1).json  # Data file
├── m2k_config.json      # System config
└── old-system/          # Backup of old HTML files
```

### Making Changes to the Code

1. Navigate to the project:
   ```bash
   cd housing-dashboard
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Make your changes in `src/` folder

5. Build for production:
   ```bash
   npm run build
   ```

6. Deploy (copy built files to root):
   ```bash
   cp -r dist/* ../
   ```

7. Commit and push:
   ```bash
   git add .
   git commit -m "Update dashboard"
   git push
   ```

## Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS (Seminary Bar POS color scheme)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: GitHub repository (via GitHub API)
- **Authentication**: Session-based (sessionStorage)

## User Credentials

### Admin Accounts
| Username | Password | Role |
|----------|----------|------|
| admin | Mount2K2026 | Administrator |
| m2kadmin | 189838 | Administrator |

To add more users, edit: `housing-dashboard/src/context/AuthContext.jsx`

## Data Management

### Data Location
All housing data is stored in: `m2k_2026_housing_data (1).json`

### Data Structure
```json
{
  "version": "3.0",
  "lastUpdated": "ISO timestamp",
  "youthGroups": [...],
  "rooms": [...],
  "housingAssignments": {...},
  "smallGroupAssignments": {...},
  "mealColorAssignments": {...},
  "mealTimes": {...},
  "adaIndividuals": [...],
  "defaultNotes": {...},
  "groupNotes": {...}
}
```

### Auto-Save Behavior
- Changes are debounced (waits 2 seconds after last change)
- Saves automatically to GitHub using the configured token
- Status shown in header: "Just now", "Xm ago", etc.
- Error handling with user notifications

## Backup & Restore

### Old System Files
The previous HTML-based system files are backed up in `old-system/`:
- `old-system/master.html` - Old admin dashboard
- `old-system/index.html` - Old public view

### Restore Old System (if needed)
```bash
cp old-system/* .
```

## Troubleshooting

### Auto-save not working?
1. Go to Settings
2. Check if GitHub token is configured (green checkmark)
3. If not, add your GitHub Personal Access Token
4. Make sure token has `repo` permissions

### Can't login?
- Default credentials: `admin` / `Mount2K2026`
- Check browser console for errors
- Clear browser cache and try again

### Data not loading?
- Check that `m2k_2026_housing_data (1).json` exists in root
- Verify file has valid JSON
- Check browser console for errors

## Support

For issues or questions:
- Check the browser console for error messages
- Verify GitHub token is configured in Settings
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

## License

Private repository for M2K Portal use only.
