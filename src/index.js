import app from "./server.js";

const port = "8000";
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

// TODO: changer les send par des JSON
// TODO: changer les json avec un message en +