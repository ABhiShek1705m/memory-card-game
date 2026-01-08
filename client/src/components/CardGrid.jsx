'use client'

import { useContext, useEffect, useState } from "react";
import Card from "./Card";
import RestartButton from "./RestartButton";


// Creating a number grid and shuffling them for the game.
const CardGrid = () => {
    const [playerName, setPlayerName] = useState(null);
    const[shuffledArray, setShuffledArray] = useState([])
    const[compareValues, setcompareValues] = useState({})
    const[turnNumber, setturnNumber] = useState(0)

    useEffect(() => {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8]
        let newArray = [...numbers, ...numbers]
        shuffleArray(newArray)
        setShuffledArray(newArray)
        // Also set the player name here
        if(typeof window !== 'undefined'){
            setPlayerName(window.localStorage.getItem("playerName"));
        }
    }, [])

    function shuffleArray(arr){
        for(let i = arr.length-1; i > 0; i--){
            //Generate random index from 0 to i
            const j = Math.floor(Math.random() * (i+1))
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }

    const storeResult = async (score, playerName) => {
        if (!playerName) {
            console.error("Player name is not set. Cannot save score.");
            return;
        }
        // Use local express server for now
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
        try{
            const result = await fetch(`${baseUrl}/save-score`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ playerName, score })
            })
            const data = await result.json()
            console.log("Score is saved -->", data)
        } catch(error){
            console.error("Error saving score -->", error)
            alert("Error saving score to the database. Please try again later.")
        }
    }


    // Check for the win condition
    useEffect(() => {
        //Check if all the cards are flipped?
        if(Object.keys(compareValues).length == 0){
            const rows = document.querySelectorAll(".row")
            let allCards = []
            rows.forEach((row) => {
                const cards = row.querySelectorAll(".card-box")
                cards.forEach((card) => {
                    if(card.classList.contains("card-box-flipped")){
                        allCards = [...allCards, card]
                    }
                })
            })
            // console.log("All flipped cards -->", allCards)
            //Check if all cards are flipped
            const allFlipped = allCards.length == 16 && allCards.every(card => card.classList.contains("card-box-flipped"))
            if(allFlipped){
                const winnerText = document.createElement('h2')
                winnerText.innerText = `You won, press restart to play again`
                winnerText.className = "text-2xl font-bold text-white relative top-4 left-3"
                const container = document.getElementById('grid-container')
                container.appendChild(winnerText)
                // Store result into database, fetch call can be added here.
                storeResult(turnNumber, playerName);
            }
        }
    }, [compareValues])


    useEffect(() => {
        //If there was only one key in the object, nothing to compare 
        if(Object.keys(compareValues).length <= 1){
            return
        }
        if (Object.keys(compareValues).length === 2) {
            // Check if both cards are flipped and compare them
            const { first, second } = compareValues;
            const prevCard = document.querySelector(`.card-box-${first.id}`);
            const currentCard = document.querySelector(`.card-box-${second.id}`);
            if (first.value === second.value) {
                // Cards match - clear the compareValues state
                setcompareValues({});
                return;
            } else {
                // Cards don't match, flip them back after a delay
                setTimeout(() => {
                    if (prevCard) {
                        prevCard.classList.remove("card-box-flipped");
                        prevCard.innerHTML = "<h3><b>?</b></h3>";
                    }
                    if (currentCard) {
                        currentCard.classList.remove("card-box-flipped");
                        currentCard.innerHTML = "<h3><b>?</b></h3>";
                    }
                    setcompareValues({}); // Reset compareValues after flipping back
                }, 1000); // Delay for showing cards before flipping back
            }
            prevCard.disabled = false
            currentCard.disabled = false
        }
    }, [compareValues])

    /*
    TODO: Add mouse hover effects and further Tailwind CSS styling
    */

    const handleClick = (id, value) => {
        //If 2 cards have already been flipped wait for the comparision to end
        //User would have to wait to see if the cards are the same or different before clicking the next card
        if(Object.keys(compareValues).length == 2){
            return
        }

        const cardBox = document.querySelector(`.card-box-${id}`)
        cardBox.disabled = true
        //Count number of turns taken per game
        setturnNumber(prev => prev+1)

        cardBox.classList.add("card-box-flipped")
        cardBox.innerText = `Card ${value} flipped`
        //Add the card id and value to the object
        setcompareValues(prev => {
            if(Object.keys(prev).length === 0){
                return { first: { id, value } }
            } else {
                return { ...prev, second: { id, value } };
            }
        })
    }

    const handleRestartBtnClick = () => {
        // console.log("Inside restart btn click handle!")
        setturnNumber(0)
        const cardRows = document.querySelectorAll(".row")
        //remove the flipped CSS class from cards on restart
        cardRows.forEach((row) => {
            const cards = row.querySelectorAll(".card-box")
            cards.forEach((card) => {
                // console.log("****Card -->", card)
                if(card.disabled){
                    card.disabled = false
                }
                if(card.classList.contains("card-box-flipped")){
                    card.classList.remove("card-box-flipped")
                    card.innerHTML = "<h3><b>?</b></h3>"
                }
            })
        })
        const container = document.getElementById('grid-container')
        //if the winner text exists, then remove it when the game is restarted
        const lastEl = container.lastElementChild
        if(lastEl && lastEl.tagName === "H2" || lastEl.tagName ==="h3") {
            container.removeChild(container.lastChild)
        }
        //Also shuffle the array once more
        shuffleArray(shuffledArray)
        setShuffledArray(shuffledArray)
    }

    const handleDevModeClick = () => {
        const cardRows = document.querySelectorAll(".row")
        // Flip all cards to show their values
        let i = 0;
        cardRows.forEach((row) => {
            const cards = row.querySelectorAll(".card-box")
            cards.forEach((card) => {
                // console.log("****Card -->", card)
                card.disabled = true
                card.classList.add("card-box-flipped")
                card.innerText = `Card ${shuffledArray[i++]} flipped`
            })
        })
        setcompareValues({}) // This is to trigger useEffect for win condition
    }

    return(
        <>
        <button className="ui-nav-btn bg-red-500 hover:bg-red-600 active:bg-red-900 
                p-3 shadow-lg text-xl 
                text-yellow-100 font-bold absolute left-[57vw] top-[12vh] 
                border-yellow-300 border-2 rounded-full hidden
                focus:outline-2 focus:outline-offset-2 focus:outline-yellow-300"  // Hiding the dev mode button, only show when needed.
                onClick={handleDevModeClick}>
            Dev Mode (flip all cards)
        </button>
        <RestartButton onbuttonClick={handleRestartBtnClick} />
        <div id="information-text" className="absolute top-[15vh] left-[8vw]">
            <label htmlFor="turn-count" className="font-bold text-white">Number of turns</label><br />
            <input 
            id="turn-count" 
            type="text" 
            className="p-1 bg-white rounded-sm border-2 border-solid border-black z-10" 
            value={turnNumber}
            readOnly />
        </div>
        <div className="absolute left-[34vw] top-52" id="grid-container">
            <div className="row">
                <Card id={1} value={shuffledArray[0]}  onsquareclick={handleClick} />
                <Card id={2} value={shuffledArray[1]}  onsquareclick={handleClick} />
                <Card id={3} value={shuffledArray[2]}  onsquareclick={handleClick} />
                <Card id={4} value={shuffledArray[3]}  onsquareclick={handleClick} />
            </div>
            <div className="row">
                <Card id={5} value={shuffledArray[4]}  onsquareclick={handleClick} />
                <Card id={6} value={shuffledArray[5]}  onsquareclick={handleClick} />
                <Card id={7} value={shuffledArray[6]}  onsquareclick={handleClick} />
                <Card id={8} value={shuffledArray[7]}  onsquareclick={handleClick} />
            </div>
            <div className="row">
                <Card id={9} value={shuffledArray[8]}  onsquareclick={handleClick} />
                <Card id={10} value={shuffledArray[9]} onsquareclick={handleClick} />
                <Card id={11} value={shuffledArray[10]} onsquareclick={handleClick} />
                <Card id={12} value={shuffledArray[11]} onsquareclick={handleClick} />
            </div>
            <div className="row">
                <Card id={13} value={shuffledArray[12]} onsquareclick={handleClick} />
                <Card id={14} value={shuffledArray[13]} onsquareclick={handleClick} />
                <Card id={15} value={shuffledArray[14]} onsquareclick={handleClick} />
                <Card id={16} value={shuffledArray[15]} onsquareclick={handleClick} />
            </div>
        </div>   
    </>
    )
}


export default CardGrid