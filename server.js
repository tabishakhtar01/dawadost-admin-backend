require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5002;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Admin server is running on port ${PORT}`);
  });
}

startServer();
