import app from "./app.js";
import "dotenv/config";
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => console.log(`Listening on port ${port}...`));
