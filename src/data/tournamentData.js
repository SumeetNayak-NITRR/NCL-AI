export const tournaments = [
    {
        id: 'ncl',
        title: "NCL",
        description: "The premier auction-based football league of NIT Raipur. Strategy meets skill.",
        period: "February - March",
        location: "NITRR Football Ground",
        image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800",
        historyType: 'hybrid', // List + Gallery
        history: [
            {
                year: '2025',
                team: 'Athletico de Rajasthan',
                captain: 'Pritesh Kharwal',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },
            {
                year: '2024',
                team: 'KHAU Gang',
                captain: '',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=500',
                stats: 'Unbeaten Run'
            },
            {
                year: '2023',
                team: 'Dynamo NITRR',
                captain: 'Rahul Sharma',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=500',
                stats: 'Penalty Shootout Win'
            }
        ],
        alumni: [
            {
                id: 'alum1',
                name: 'Cristiano Ronaldo',
                position: 'Striker',
                year: 'Alumni',
                branch: 'Mining',
                status: 'Alumni',
                card_variant: 'gold',
                rating: 94,
                pace: 88, shooting: 92, passing: 85, dribbling: 89, defending: 45, physical: 82,
                image_scale: 1, image_x: 0, image_y: 0,
                legacy: 'All-time Top Scorer',
                photo_url: '/assests/legends/ronaldo.jpg' // Placeholder
            },
            {
                id: 'alum2',
                name: 'Amit Mishra',
                position: 'CDM',
                year: 'Alumni',
                branch: 'CSE',
                status: 'Alumni',
                card_variant: 'vintage',
                rating: 91,
                pace: 78, shooting: 80, passing: 94, dribbling: 82, defending: 88, physical: 85,
                image_scale: 1, image_x: 0, image_y: 0,
                legacy: 'Midfield Maestro 2018-22',
                photo_url: ''
            }
        ]
    },
    {
        id: 'inter-nit',
        title: "Inter-NIT Tournament",
        description: "The flagship tournament where NITRR competes against other NITs across India.",
        period: "August - September",
        location: "Various NITs",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800",
        historyType: 'gallery',
        history: [
            {
                year: '2025',
                team: 'NITRR Squad',
                captain: 'Mayank Keshriya',
                result: 'Runners Up',
                location: 'NIT Jamshedpur',
                image: '/memories/new-beginnings-2024.jpg',
                stats: 'Best Performance in consecutive Years'
            },
            {
                year: '2024',
                team: 'NITRR Squad',
                captain: 'Harsh Kumar',
                result: 'Champions',
                location: 'NIT Rourkela',
                image: '/memories/champions-2023.jpg',
                stats: 'Best Performance in college history'
            }
        ],
        alumni: [
            {
                id: 'alum3',
                name: 'Rohan Gupta',
                position: 'GK',
                year: 'Alumni',
                branch: 'CIVIL',
                status: 'Alumni',
                card_variant: 'gold',
                rating: 93,
                pace: 70, shooting: 60, passing: 75, dribbling: 65, defending: 95, physical: 88,
                image_scale: 1, image_x: 0, image_y: 0,
                legacy: 'The Wall of NITRR',
                photo_url: ''
            }
        ]
    },
    {
        id: 'samar',
        title: "Samar",
        description: "Annual sports fest of NIT Raipur. A showcase of talent and intensity.",
        period: "January",
        location: "NITRR Football Ground",
        image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&q=80&w=800",
        historyType: 'hybrid',
        history: [
            {
                year: '2026',
                team: 'META + CIVIL + MCA',
                captain: 'Mayank Keshriya',
                result: 'Champion',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },

            {
                year: '2025',
                team: 'CHEMICAL + CSE',
                captain: 'Ashish',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },

            {
                year: '2024',
                team: '',
                captain: '',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },

            {
                year: '2023',
                team: '',
                captain: '',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },

            {
                year: '2022',
                team: '',
                captain: '',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },

        ],
        alumni: []
    },
    {
        id: 'gc',
        title: "General Championship",
        description: "Departmental rivalries ignite in this high-stakes internal league.",
        period: "October",
        location: "NITRR Football Ground",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
        historyType: 'hybrid',
        history: [
            {
                year: '2025',
                team: 'MINING + META',
                captain: 'Mayank Keshriya',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },
        ],
        alumni: []
    },
    {
        id: 'inter-year',
        title: "Inter-Year Tournament",
        description: "Battle of the Batches. First years to Final years clash for supremacy.",
        period: "November",
        location: "NITRR Football Ground",
        image: "https://images.unsplash.com/photo-1518605342900-a828f6e74f49?auto=format&fit=crop&q=80&w=800",
        historyType: 'hybrid',
        history: [
            {
                year: '2025',
                team: '1st year(2024-28)',
                captain: 'Honey',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },
            {
                year: '2024',
                team: '3rd year(2021-25)',
                captain: 'Harsh Kumar',
                result: 'Champions',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c71?auto=format&fit=crop&q=80&w=500',
                stats: 'Goals: 12 | Conceded: 3'
            },
        ],
        alumni: []
    },
    {
        id: 'inter-college',
        title: "Inter-College",
        description: "Local dominance. NITRR vs other colleges in Raipur and Chhattisgarh.",
        period: "July-April",
        location: "Home & Away",
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800",
        historyType: 'hybrid',
        history: [
            {
                year: '2026',
                team: 'NIT A',
                captain: 'Pritesh Kharwal',
                result: 'Winner',
                location: 'NIT Raipur',
                image: '/memories/samar-2026.jpeg',
                stats: 'A victory at home ground'
            },
            {
                year: '2023',
                team: 'NIT A',
                captain: 'Harsh Kumar',
                result: 'Winner',
                location: 'HNLU',
                image: '/memories/samar-2026.jpeg',
                stats: 'Winner of Coloussus cup organized by HNLU'
            },
        ],
        alumni: []
    }
]
