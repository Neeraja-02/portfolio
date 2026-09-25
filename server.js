const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Create messages folder if it doesn't exist
const messagesFolder = path.join(__dirname, "messages");

if (!fs.existsSync(messagesFolder)) {
    fs.mkdirSync(messagesFolder);
}

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Neeru@2004",
    database: "portfolio"
});

db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
        return;
    }

    console.log("MySQL Connected Successfully");
});

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Contact Route
app.post("/contact", (req, res) => {

    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql =
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(
        sql,
        [name, email, message],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // Save message in file
            const fileName = `${Date.now()}.txt`;

            const fileContent = `
Name: ${name}
Email: ${email}
Message: ${message}
Date: ${new Date().toLocaleString()}
`;

            fs.writeFile(
                path.join(messagesFolder, fileName),
                fileContent,
                (fileErr) => {

                    if (fileErr) {
                        console.error(fileErr);
                    }
                }
            );

            res.status(200).json({
                message: "Message saved successfully!"
            });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});