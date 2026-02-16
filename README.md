# NITRR FC - Official Website

**Official digital presence of NITRR Football Club**

A modern, visually-rich website showcasing the football club's achievements, team members, events, and providing player registration for NCL tournaments.

---

## Features

- **Cinematic Landing Page** - Scrollytelling landing page with Football memories 
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


3. Create a `.env` file
   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Then add your project credentials:

   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```





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




## License

This project is maintained by the Sumeet.

## Acknowledgments

- Built with React + Vite
- Powered by Supabase
- Designed for Sumeet
