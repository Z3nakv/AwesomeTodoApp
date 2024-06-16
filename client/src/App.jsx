import React from "react";
import { useEffect, useState } from "react";
import Todo from "./Todo";

const App = () => {
const [todos, setTodos] = useState([]);
const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch("http://localhost:5000/api/todos")
        const todos = await res.json()
        setTodos(todos)
      } catch (error) {
        console.log(error.message);
      }
      
    }
    getTodos();
  },[])

  const createNewTodo = async (e) => {
    e.preventDefault();
    if(content.length > 3){
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        body: JSON.stringify({todo: content}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo])
    }
  }

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Enter a new todo"
        className="form__input"
        required
        />
        <button className="form__button" type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {
        (todos.length > 0) &&
        todos.map( todo => (
          <Todo key={todo._id} todo={todo} setTodos={setTodos} />
        ))
        }
      </div>
    </main>
  );
};

export default App;
