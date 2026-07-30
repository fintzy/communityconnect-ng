import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");

  console.log("===================================");

  console.log(" CommunityConnect NG API");

  console.log(` Running on http://localhost:${PORT}`);

  console.log("===================================");

  console.log("");
});