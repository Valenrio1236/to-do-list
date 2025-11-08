const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let todos = [];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ message: "Task is required" });
  todos.push({ task, done: false });
  res.status(201).json({ message: "Added!" });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
