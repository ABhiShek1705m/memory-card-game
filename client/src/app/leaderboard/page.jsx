'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function leaderboardPage() {
    const [highscores, setHighscores] = useState([]);
    const[name, setPlayerName] = useState("");

    useEffect(() => {
        const fetchHighscores = async () => {
            // Fetch highscores from backend API on mount
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
            try {
                const result = await fetch(`${baseUrl}/highscores`, { method: 'GET' })
                const rows = await result.json()
                console.log("Highscores fetched from database:", rows)
                setHighscores(rows)
            } catch (error) {
                console.error("Error fetching highscores from database", error)
            }
        }

        fetchHighscores();
    }, [])

    async function searchResults(key){
        if(key !== "Enter") return;

        try{
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
            const response = await fetch(`${baseUrl}/highscores/${name}`, { method: "GET" })
            if(!response.ok) throw new Error (`Error occured status: ${response.status}`)
            const data = await response.json()
            if(data) console.log("Player fetched:", data)
            else console.log("No player found with that name")
            setHighscores(data)
        } catch (error){
            console.error(`Error finding player in the database: ${error}`)
        }
    }

    return (
        <>
        <div className="absolute top-6 left-6 z-20">
            <Link
                href="/play"
                className="ui-nav-btn bg-amber-100 text-amber-900 border-2 border-yellow-700 inline-block"
            >
                ← Back to Game
            </Link>
        </div>
        <div className="grid place-items-center text-5xl font-bold text-yellow-300 mb-10">
            Highest Scorers
        </div>
        <div className="flex justify-center w-[30vw] h-[80vh] absolute left-[35vw] top-[20vh]">
            <div className="w-full h-full overflow-y-auto"> 
                <table className="w-full table-auto text-center">
                    <thead className="bg-black">
                        <tr>
                            <th className="border px-4 py-2 text-yellow-300">Rank</th>
                            <th className="border px-4 py-2 text-yellow-300">Player Name</th>
                            <th className="border px-4 py-2 text-yellow-300">Score</th>
                            <th className="border px-4 py-2 text-yellow-300">Date Achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highscores.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="border px-4 py-2 text-yellow-200">
                                    No highscores yet.
                                </td>
                            </tr>
                        ) : (
                            highscores.map((entry, index) => (
                                <tr key={`${entry.player_name}-${entry.score}-${index}`}>
                                    <td className="border px-4 py-2 text-yellow-200">{index + 1}</td>
                                    <td className="border px-4 py-2 text-yellow-200">{entry.player_name}</td>
                                    <td className="border px-4 py-2 text-yellow-200">{entry.score}</td>
                                    <td className="border px-4 py-2 text-yellow-200">{entry.date_achieved}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {/* Search bar for searching highscores by name */}
        <label htmlFor="search-input" className="font-bold text-yellow-300 text-xl inline relative left-20">Search player by name</label>
        <input type="text" id="search-input" onKeyUp={(e) => searchResults(e.key)} 
        className="bg-amber-50 outline-2 block rounded-[5px] p-0.5 relative left-20"
        value={name} onChange={(e) => setPlayerName(e.target.value)} placeholder='Player name' />

        </>
    )
}
