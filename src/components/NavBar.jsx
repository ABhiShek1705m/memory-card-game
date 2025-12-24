import React from "react";
import Link from "next/link";


export default function NavBar() {

    return(
        <>
        <div className="flex flex-row justify-evenly bg-amber-100 rounded-full w-1/2 relative left-[25vw] p-3 mb-4 mt-2" id="navbar">
            <Link href={'/'}>Homepage</Link>
            <Link href={'/play'}>Play</Link>
            <Link href={'/leaderboard'}>Leaderboard</Link>
        </div>
        </>
    )
}