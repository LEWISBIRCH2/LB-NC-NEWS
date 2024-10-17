const app = require("./app.js");
const { PORT = 10000 } = process.env;

app.listen(10000, () => console.log(`Listening on ${PORT}...`));