# NITRR FC - Official Website

**Official digital presence of NITRR Football Club**

A modern, visually-rich website showcasing the football club's achievements, team members, events, and providing player registration for NCL tournaments.

---

## Features

- **Cinematic Landing Page** - Scrollytelling hero section with club highlights
- **Player Registration** - FIFA-style player cards with stats and photo upload
- **Admin Dashboard** - Player approval and manual team assignment
- **Premium Dark Aesthetic** - Sports-focused design with controlled animations

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Animations**: Framer Motion
- **Backend**: Supabase (Database + Storage)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database and storage)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd "NCL AI"
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PIN=your_admin_pin
```

4. Set up Supabase database

Run the SQL commands in `src/lib/schema.sql` in your Supabase SQL editor to create the required tables.

5. Create storage bucket

In your Supabase dashboard:
- Create a new storage bucket called `player-photos`
- Make it public for read access
- Enable file uploads

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── pages/              # Route pages
│   ├── Landing.jsx     # Homepage (scrollytelling)
│   ├── Register.jsx    # Player registration form
│   ├── Admin.jsx       # Admin dashboard
│   └── NotFound.jsx    # 404 page
│
├── components/
│   ├── common/         # Reusable components
│   │   └── PlayerCard.jsx  # FIFA-style player card (small/medium/large)
│   ├── landing/        # Landing page sections
│   ├── register/       # Registration components
│   └── admin/          # Admin components
│
├── lib/
│   ├── supabase.js     # Supabase client
│   ├── schema.sql      # Database schema
│   └── utils.js        # Helper functions
│
└── App.jsx             # Main routing
```

---

## Database Schema

### Players Table
- Player information, stats, photos
- Status: Pending → Ready (→ Sold if assigned to team)
- Manual team assignment via `team_name` field

### Teams Table
- Team records and performance tracking
- Season-based organization

---

## Admin Access

Access the admin dashboard at `/admin` with the PIN set in your `.env` file.

**Admin Features:**
- Approve/reject player registrations
- Edit player stats and information
- Preview and download player cards
- Manual team assignment (coming soon)

---

## Future Roadmap

### Phase 2: Core Website Pages (In Progress)
- About page (club history)
- Achievements page (trophy showcase)
- Team page (squad display)
- Events page (photo gallery)

### Phase 3: Visual Enhancements
- Blue Lock-inspired color palette
- Enhanced animations and transitions
- Responsive design improvements

---

## License

This project is maintained by the NITRR Football Club team.

## Acknowledgments

- Built with React + Vite
- Powered by Supabase
- Designed for Sumeet
