import React, { useState, useEffect } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  const API_URL =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/todos`
    : "http://localhost:5000/api/todos";


  const getTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });
      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setNewTask("");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTodos(todos.map((t) => (t.id === id ? updated : t)));
      }
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div className="container">
      <h1>To Do App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a task here"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button className="save" onClick={addTask}>SAVE</button>
        <button className="refresh" onClick={getTasks}>GET TASKS</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Todo item</th>
              <th>Status</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <tr key={todo.id}>
                  <td>{index + 1}</td>
                  <td>
                    {todo.done && (
                      <span className="check-icon">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {todo.task}
                  </td>
                  <td className={todo.done ? "status finished" : "status"}>
                    {todo.done ? "Finished" : "In progress"}
                  </td>
                  <td className="actions">
                    <button className="delete" onClick={() => deleteTask(todo.id)}>
                      DELETE
                    </button>
                    <button className="finish" onClick={() => toggleDone(todo.id)}>
                      {todo.done ? "UNDO" : "FINISHED"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty">No tasks yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}