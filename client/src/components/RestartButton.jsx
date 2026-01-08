import React from "react";

const RestartButton = (props) => {
    return (
        <>
        <div className="restart-button">
            <button 
                className="ui-nav-btn bg-purple-500 hover:bg-purple-600 active:bg-purple-900 
                p-3 shadow-lg text-xl text-yellow-100 font-bold 
                absolute left-[42vw] top-[12vh] border-yellow-300 border-2 rounded-full
                focus:outline-2 focus:outline-offset-2 focus:outline-yellow-300" 
                onClick={() => props.onbuttonClick()}>
                Restart Game
            </button>
        </div>
        </>
    )

}

export default RestartButton