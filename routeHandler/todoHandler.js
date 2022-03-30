const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");

const Todo = new mongoose.model("Todo", todoSchema);
// get all todo
router.get("/", (req, res) => {
  Todo.find({ status: "active" }, (err, data) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error" });
    } else {
      res
        .status(200)
        .json({ count: data.length, message: "Success", result: data });
    }
  });
});

// get active todo using mongodb custom instance methods
router.get("/active", async (req, res) => {
  // to use custom instance, need to first create object from model like following line
  const todo = new Todo();
  try {
    const data = await todo.findActive();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

// get active todo using mongodb custom instance methods
router.get("/active-using-callback", (req, res) => {
  // to use custom instance, need to first create object from model like following line
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    res.status(200).json({ data });
  });
});

// find todos containing 'js' in
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByJS();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ error: "There was a server side error" });
  }
});


// find todos by language
router.get("/language/:lang", async (req, res) => {
    try {
      const data = await Todo.find().byLanguage(req.params.lang);
      res.status(200).json({ data: data });
    } catch (err) {
      res.status(500).json({ error: "There was a server side error" });
    }
  });

// get a todo
router.get("/:id", (req, res) => {
  Todo.find({ _id: req.params.id })
    .then((todo) => {
      res.status(200).json({ todo: todo });
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a server side error" });
    });
});

// post a todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error" });
    } else {
      res.status(200).json({ message: "Todo inserted successfully" });
    }
  });
});

// post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({ error: "There was a server side error" });
    } else {
      res.status(200).json({ message: "Todos were inserted successfully" });
    }
  });
});

// put todo; only update- updateOne; update and get updated values-findByIdAndUpdate
router.put("/:id", async (req, res) => {
  try {
    await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
          title: "just updated again",
        },
      }
    );
    res.status(200).json({ message: "Todo was updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "There was a server side error" });
  }
});

// delete todo
router.delete("/:id", async (req, res) => {
  Todo.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "todo deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: "There was a server side error" });
    });
});

module.exports = router;
