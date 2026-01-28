'use client'

import { useMemo } from "react";

export default function GameLayout({ children }){
    //memoized to skip re-rendering (no images for now)
    // const imgArray = useMemo(() => new Array(16).fill(null), [])

    return(
        <>
        <div className="h-[95vh] w-[95vw] border-5 [border-style: outset] border-yellow-700 relative top-4 left-9">
            {children}
        </div>
        </>
    )
} 