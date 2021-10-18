const express = require("express");
const app = express();

require("./discord.js")();

app.use(express.static(__dirname + "/public/"));

app.get("/", (req,res) => {
	res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT;
app.listen(port, () => console.log(port));