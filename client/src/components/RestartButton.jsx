import React from "react";

const RestartButton = (props) => {
    return (
        <>
        <div className="restart-button">
            <button 
                className="bg-purple-500 hover:bg-purple-600 active:bg-purple-900 
                active:outline-2 active: outline-offset-1 
                p-3 shadow-lg text-xl text-yellow-500 font-bold 
                absolute left-[42vw] top-[12vh] border-yellow-300 border-2 rounded-full" 
                onClick={() => props.onbuttonClick()}>
                Restart Game
            </button>
        </div>
        </>
    )

}

export default RestartButton