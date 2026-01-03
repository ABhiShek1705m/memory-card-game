'use client';

import { useEffect, useState } from 'react';
import NavBar from "../../components/NavBar";

export default function leaderboardPage() {
    const [highscores, setHighscores] = useState([]);

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

    return (
        <>
        <NavBar />
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
        </>
    )
}
