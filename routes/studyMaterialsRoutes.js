const { MongoClient } = require("mongodb");

const express = require("express");
const app = express();

const uri = process.env.URI;
const client = new MongoClient(uri);

async function connectMongoDB() {
  try {
    await client.connect();
    console.log("Connected");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}

connectMongoDB();

const db = client.db("Lecture");

app.get("/all", async (req, res) => {
  try {
    const files = await db.collection("fs.files").find().toArray();
    res.json(files);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/first-year", async (req, res) => {
  try {
    const files = await db
      .collection("fs.files")
      .find({
        filename: { $regex: "1 Курс" },
      })
      .toArray();
    res.json(files);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/second-year", async (req, res) => {
  try {
    const files = await db
      .collection("fs.files")
      .find({
        filename: { $regex: "2 Курс" },
      })
      .toArray();
    res.json(files);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/third-year", async (req, res) => {
  try {
    const files = await db
      .collection("fs.files")
      .find({
        filename: { $regex: "3 Курс" },
      })
      .toArray();
    res.json(files);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
