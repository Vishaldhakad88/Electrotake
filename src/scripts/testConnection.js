require("dotenv").config();
const { connectDB } = require("../config/db");

(async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // DEBUG
    await connectDB();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
})();
