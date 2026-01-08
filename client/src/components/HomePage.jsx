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

    function enterClick(key){
        if(key === "Enter"){
            handleStartClick()
        }
    }

    return(
        <>
        <h1 className="font-bold text-center text-yellow-600 text-6xl">
            Memory game
        </h1>
        <div className="absolute top-2/5 left-[37vw]">
            <label htmlFor="name-input" className="font-bold text-2xl text-yellow-600 block mx-1">Enter your name and press start</label>
            <input type="text" id="name-input" onChange={(e) => setname(e.target.value)} onKeyUp={(e) => enterClick(e.key)} className="border-solid m-[6px] border-black rounded-lg bg-white p-2 block relative left-19 top-5"/>
            <button onClick={handleStartClick} className="ui-nav-btn border-solid border-black rounded-lg bg-red-500 p-2 font-bold text-white relative left-32 top-6 hover:cursor-pointer hover:border-black focus:outline-2 focus:outline-offset-2 focus:outline-yellow-300">
                Start Game
            </button>
        </div>
        </>
    )
}
export default HomePage