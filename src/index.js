import app from "./app.js";
import scheduleDBCleanup from "./util/dbCleanup.js";
import "dotenv/config";
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => console.log(`Listening on port ${port}...`));

// Start DB cleanup util
scheduleDBCleanup();
