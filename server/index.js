require("dotenv").config({ path: __dirname + "/.env" });
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
