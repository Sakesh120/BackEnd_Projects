import express from "express";

const app = express();

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("list");
});
app.get("/add", (req, res) => {
  res.render("taskAdd");
});
app.get("/update", (req, res) => {
  res.render("taskUpdate");
});
app.listen(3200);
