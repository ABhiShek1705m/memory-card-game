import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { execute, query } from "./sql.js"

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

app.get("/", (req, res) => {
    res.send("Memory card game backend")
})

// Initialize SQLite database
const db = new sqlite3.Database('memory_game.db', (err) => {
        if (err) {
            console.error("Error opening database " + err.message);
        } else {
            console.log("Connected to SQLite database.");
        }
    }) 

const createPlayerTable = async() => {
    try{
        await execute(db,
            `CREATE TABLE IF NOT EXISTS player_highscores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                date_achieved TEXT NOT NULL)`
        )
        // Create index on player_name for faster lookups
        await execute(db, `CREATE INDEX IF NOT EXISTS idx_player_name ON player_highscores (player_name)`)
    } catch(error){
        console.error("Error creating table:", error)
    }
}

// Create the player_highscores table
createPlayerTable();

// Helper to format dates correctly
const formateDateTime = (date = new Date()) => {
    const pad = (num) => String(num).padStart(2, "0")
    const y = date.getFullYear()
    const m = pad(date.getMonth() + 1)
    const d = pad(date.getDate())
    const hour = pad(date.getHours())
    const min = pad(date.getMinutes())
    const sec = pad(date.getSeconds())
    return `${y}/${m}/${d}  ${hour}:${min}:${sec}`
}


// Paths for handling highscores

app.use("/save-score", async (req, res, next) => {
    const { playerName, score } = req.body;
    
    if (!playerName || score == null) {
        return res.status(400).json({ error: "playerName and score are required" });
    }

    try {
        // console.log("Executing database query now to check existing highscore")
        const row = await query(db, "SELECT score FROM player_highscores WHERE player_name = ? LIMIT 1", [playerName]);
        // console.log("Database query result:", row);
        const date = formateDateTime()
        if(!row || row.length === 0){
        // Insert new entry if no previous highscore exists
        const result = await execute(db, "INSERT INTO player_highscores (player_name, score, date_achieved) VALUES (?, ?, ?)", [playerName, score, date]);
        return res.json({ message: "New highscore recorded", name: playerName, score: score });
        }
        
        // If exists get the current highscore
        const currentHighscore = row[0].score;
        //Need to update highscore if lower than existing one
        if(score < currentHighscore){
            next();
        } else {
            return res.json({ message: "Score not higher than current highscore", name: playerName, currentHighscore: currentHighscore });
        }

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Update db with new highscore
app.put("/save-score", async (req, res) => {
    const { playerName, score } = req.body;
    const date = formateDateTime();
    
    try {
        await execute(db, "UPDATE player_highscores SET score = ?, date_achieved = ? WHERE player_name = ?", [score, date, playerName]);
        res.json({ message: "New highscore updated successfully", name: playerName, score: score });
    } catch (error) {
        console.error("Failed to save score:", error);
        res.status(500).json({ error: "Failed to save score" });
    }
});

app.get("/highscores", async (req, res) => {
    try {
        const result = await query(db, "SELECT * FROM player_highscores ORDER BY score ASC");
        res.json(result);
    } catch (error) {
        console.error("Failed to fetch highscores:", error);
        res.status(500).json({ error: "Failed to fetch highscores" });
    }
})

// Highscore search by name filter
app.get("/highscores/:name", async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ error: "Name parameter is required" });
    }

    try {
        const result = await query(db, "SELECT * FROM player_highscores WHERE player_name LIKE ? ORDER BY score ASC", [`%${name}%`]);
        res.json(result);
    } catch (error) {
        console.error("Failed to search highscores:", error);
        res.status(500).json({ error: "Failed to search highscores" });
    }
});

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)})