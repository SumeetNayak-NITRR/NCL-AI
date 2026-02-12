-- ================================================================
-- NITRR FC - Official Website Database Schema
-- Updated: Removed auction logic, added manual team assignment
-- ================================================================

-- Create Players Table
create table players (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  year text not null,
  position text not null,
  pace int not null,
  shooting int not null,
  passing int not null,
  dribbling int not null,
  defending int not null,
  physical int not null,
  photo_url text,
  status text default 'Pending', -- Pending, Ready, Sold
  team_name text, -- Manual team assignment (replaces assigned_team_id)
  jersey_number int,
  season text default '2026',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Teams Table (Simplified - no auction fields)
create table teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  season text default '2026',
  captain_name text,
  wins int default 0,
  losses int default 0,
  player_count int default 0, -- Keep for reference
  created_at timestamp default now()
);

-- Initial Teams Data (Example)
insert into teams (name) values 
('Team Alpha'), ('Team Beta'), ('Team Gamma'), 
('Team Delta'), ('Team Epsilon'), ('Team Zeta');

-- Storage Bucket Policy (You must create 'player-photos' bucket manually in dashboard and make it public)
-- This SQL just reminds you to do it.
