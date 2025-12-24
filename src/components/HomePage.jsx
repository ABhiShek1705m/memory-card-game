'use client'

import React from "react";
import { useState } from "react";

const HomePage = () => {
    const [name, setname] = useState("");
    
    function handleStartClick(){
        if(name.trim() !== ""){
            localStorage.setItem("playerName", name)
            window.location.href = "/play"
        } else{
            alert("Please enter a valid name")
        }
    }
    return(
        <>
        <h1 className="font-bold text-center text-yellow-600 text-6xl">
            Memory game
        </h1>
        <div className="absolute top-1/3 left-[38vw]">
            <label htmlFor="name-input" className="font-bold text-xl text-yellow-600 inline-block">Enter your name and press start</label><br />
            <input type="text" id="name-input" onChange={(e) => setname(e.target.value)} className="border-solid m-[7px] border-black rounded-lg bg-white p-4"/>
            <button onClick={handleStartClick} className="border-solid border-black rounded-lg bg-red-600 p-4 font-bold text-white">
                Start Game
            </button>
        </div>
        </>
    )
}
export default HomePage