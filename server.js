const express = require("express");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const app = express();

const PORT = process.env.PORT || 5050;
const uri = process.env.URI;
const client = new MongoClient(uri);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
const bucket = new GridFSBucket(db, { bucketName: "fs" });

app.get("/files", async (req, res) => {
  try {
    const files = await db.collection("fs.files").find().toArray();
    res.json(files);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/files/first-year", async (req, res) => {
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

app.get("/files/second-year", async (req, res) => {
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

app.get("/files/third-year", async (req, res) => {
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

app.get("/file/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const encoded = encodeURIComponent(filename).replace(/'/g, "%27");

    const file = await db.collection("fs.files").findOne({
      "metadata.original_name": filename,
    });

    const bucket = new GridFSBucket(db);
    const downloadStream = bucket.openDownloadStream(new ObjectId(file._id));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename*=UTF-8''${encoded}"`
    );

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
