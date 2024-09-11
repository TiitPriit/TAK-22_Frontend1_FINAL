import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  const statusOptions = ['pending', 'in-progress', 'completed', 'on-hold'];

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3007/todos', {
          headers: { 'x-access-token': token },
        });
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };
    fetchTodos();
  }, [token]);

  const handleAddTodo = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3007/todos',
        { title, description, status: 'pending' },
        { headers: { 'x-access-token': token } }
      );
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo', error);
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(
        `http://localhost:3007/todos/${id}`,
        updatedTodo,
        { headers: { 'x-access-token': token } }
      );
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      setEditId(null);
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3007/todos/${id}`, {
        headers: { 'x-access-token': token },
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const handleEditClick = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditStatus(todo.status);
  };

  const handleSaveClick = (id) => {
    handleUpdateTodo(id, { title: editTitle, description: editDescription, status: editStatus });
  };

  return (
    <div>
      <h2>TODO List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleSaveClick(todo.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <p>Status: {todo.status}</p>
                <button onClick={() => handleUpdateTodo(todo.id, { ...todo, status: 'completed' })}>
                  Mark as Completed
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                <button onClick={() => handleEditClick(todo)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add TODO</button>
      </div>
    </div>
  );
};

export default TodoApp;