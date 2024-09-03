import 'dotenv/config'
import express, { Router } from 'express'
const app = express ();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send("Server running");
})

import routes from "./routes/index.js";
app.use(routes);
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));