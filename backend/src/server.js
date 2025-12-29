import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import { execute } from "./sql.js"

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

// Paths for handling highscores

app.use("/save-score", async (req, res, next) => {
    const { playerName, score } = req.body;
    
    if (!playerName || score == null) {
        return res.status(400).json({ error: "playerName and score are required" });
    }

    try {
        const result = await execute(db, "SELECT MAX(score) as highscore FROM player_highscores WHERE player_name = ?", [playerName]);
        const currentHighscore = result[0].highscore;

        // Insert new entry if no previous highscore exists
        if(currentHighscore == null){
            const result = await execute(db, "INSERT INTO player_highscores (player_name, score, date_achieved) VALUES (?, ?, ?)", [playerName, score, new Date().toISOString()]);
        } else {
            //Need to update highscore
            if(score > currentHighscore){
                next();
            } else {
                return res.json({ message: "Score not higher than current highscore" });
            }
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Update db with new highscore
app.put("/save-score", async (req, res) => {
    const { playerName, score } = req.body;
    const date = new Date().toISOString();
    
    try {
        await execute(db, "UPDATE player_highscores SET score = ?, date_achieved = ? WHERE player_name = ?", [score, date, playerName]);
        res.json({ message: "Highscore saved successfully" });
    } catch (error) {
        console.error("Failed to save score:", error);
        res.status(500).json({ error: "Failed to save score" });
    }
});

app.get("/highscores", async (req, res) => {
    try {
        const result = await execute(db, "SELECT * FROM player_highscores ORDER BY score ASC");
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
        const result = await execute(db, "SELECT * FROM player_highscores WHERE player_name LIKE ? ORDER BY score ASC", [`%${name}%`]);
        res.json(result);
    } catch (error) {
        console.error("Failed to search highscores:", error);
        res.status(500).json({ error: "Failed to search highscores" });
    }
});

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)})