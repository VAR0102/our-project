const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 3005;
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

app.use(express.json());

client.connect();

app.get("/search", async (req, res) => {
  const db = client.db("engine");
  const collection = db.collection("pages");

  const term = req.query.q;

  const pages = await collection.find({ terms: term }).toArray();
  return res.send(pages);
});

app.post("/crawl", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required.");
  }

  const db = client.db("engine");
  const collection = db.collection("pages");

  await collection.insertOne({ title, terms: content.split(" ") });
  res.send("done");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
