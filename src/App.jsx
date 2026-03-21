// src/App.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, toggleTodo, deleteTodo, setFilter } from './todoSlice';
import './App.scss';

function App() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  
  const { items, status, filter } = useSelector((state) => state.todos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const filteredItems = items.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;  
  });

  return (
    <div className="todo-app">
      <h2>Tasks</h2>
      
      <form className="todo-form" onSubmit={handleAddTodo}>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => dispatch(setFilter('all'))}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => dispatch(setFilter('active'))}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => dispatch(setFilter('completed'))}
        >
          Completed
        </button>
      </div>

      {status === 'loading' && <p className="status-text">Loading...</p>}
      {status === 'failed' && <p className="status-text" style={{color: 'red'}}>Failed to load tasks.</p>}

      <ul className="todo-list">
        {filteredItems.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => dispatch(toggleTodo(todo))}
            />
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.text}
            </span>
            <button className="delete-btn" onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;