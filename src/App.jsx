import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, toggleTodo, deleteTodo, setFilter, editTodo } from './todoSlice';
import './App.scss';

function App() {
  const [text, setText] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const dispatch = useDispatch();
  
  const { items, status, filter } = useSelector((state) => state.todos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, text: editText }));
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
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
            
            {editingId === todo.id ? (
              <div className="edit-mode">
                <input 
                  type="text" 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
                <button className="save-btn" onClick={() => handleSaveEdit(todo.id)}>Save</button>
                <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => dispatch(toggleTodo(todo))}
                />
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                
                <div className="actions">
                  <button className="edit-btn" onClick={() => startEditing(todo)}>Edit</button>
                  <button className="delete-btn" onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;