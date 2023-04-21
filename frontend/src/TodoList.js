import React, { useState } from "react";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setTodos([...todos, { text: inputValue, status: "pending" }]);
    setInputValue("");
  };

  const handleDelete = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleStatusChange = (index, status) => {
    const newTodos = [...todos];
    newTodos[index].status = status;
    setTodos(newTodos);
  };

  return (
    <div className="container">
      <h1>Todo List App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add task"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <input className="button" type="submit" value={"Add"}/>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li className={`task ${todo.status}`} key={index}>
            {/* <div className="div-task-cont"> */}
            {/* <div className="div-task">
            <strong>Task</strong>
            <p>{todo.text}</p>
            </div>
            <div>
            <strong>Status</strong>
            <p>{todo.status}</p>
            </div> */}
            {/* </div> */}
            <span><strong> Task: </strong><span> {todo.text} </span></span>
            <span><strong> Status: </strong><span> {todo.status} </span></span>
            
            <div className="buttons">
              <button className="delete" onClick={() => handleDelete(index)}>
                Delete
              </button>
              <button className="status done" onClick={() => handleStatusChange(index, "done")}>
                Done
              </button>
              <button className="status pending" onClick={() => handleStatusChange(index, "pending")}>
                Pending
              </button>
              <button className="status in-progress" onClick={() => handleStatusChange(index, "in progress")}>
                In Progress
              </button>
              <button className="status completed" onClick={() => handleStatusChange(index, "completed")}>
                Completed
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

