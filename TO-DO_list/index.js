import express, { urlencoded } from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";

const app = express();
app.use(urlencoded({ extended: false }));
const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.set("view engine", "ejs");

const dbName = "node_project";
const collectionName = "todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};

app.get("/", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();
  res.render("list", { result });
});
app.get("/add", (req, res) => {
  res.render("taskAdd");
});

app.post("/add", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(req.body);

  result ? res.redirect("/") : res.redirect("/add");
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  result ? res.redirect("/") : res.send("some error");
});

app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(id) });
  result ? res.render("taskUpdate", { result }) : res.send("some error");
});

app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const db = await connection();
  const collection = db.collection(collectionName);
  const filter = { _id: new ObjectId(id) };
  const updatedData = {
    $set: { title: req.body.title, massege: req.body.massege },
  };
  const result = await collection.updateOne(filter, updatedData);
  result ? res.redirect("/") : res.send("some error");
});

app.post("/multi-delete", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  if (Array.isArray(req.body.selectedTask)) {
    const selectedTasks = req.body.selectedTask.map((id) => new ObjectId(id));
    const result = await collection.deleteMany({ _id: { $in: selectedTasks } });
    result ? res.redirect("/") : res.send("some error");
  } else {
    const result = await collection.deleteOne({
      _id: new ObjectId(req.body.selectedTask),
    });
    result ? res.redirect("/") : res.send("some error");
  }
});

app.listen(3200);
