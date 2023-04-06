const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require("dotenv").config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tftz42f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//Connecting Database
async function dbConnect() {
    try {
      await client.connect();
      console.log("Database Connected");
    } catch (error) {
      console.log(error.name, error.message);
      res.send({
        success: false,
        error: error.message,
      });
    }
  }
  
dbConnect();

const Tasks = client.db('taskKeeper').collection('tasks');
app.get('/tasks', async(req, res)=>{
  try {
    const email = req.query.email;
    const query = {email: email}
    const cursor = Tasks.find(query);
    const tasks = await cursor.toArray();

    res.send({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.post('/tasks', async(req, res)=>{
  try {
    const task = req.body;
    const result = await Tasks.insertOne(task);

    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        title: task.title,
        details: task.details,
        date: task.date,
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/archive/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        archive: true
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/unarchive/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        archive: false
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/trash/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        trash: true
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/restore/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        trash: false
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.put("/finish/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedTask = {
      $set: {
        finish: true
      },
    };
    const result = await Tasks.updateOne(query, updatedTask, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.delete("/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Tasks.deleteOne(query);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.get("/", (req, res) => {
    try {
      res.send("Task Keeper server is running...");
    } catch (error) {
      res.send(error.message);
    }
  });
  
app.listen(port, () => console.log("Task Keeper Server running on port", port));
