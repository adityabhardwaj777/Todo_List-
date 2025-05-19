import { useState } from 'react';
import { Container, Paper, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      
      if (response.ok) {
        setNewTodo('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.text);
  };

  const updateTodo = async () => {
    if (!editText.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${editingTodo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editText }),
      });
      
      if (response.ok) {
        setEditingTodo(null);
        setEditText('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addTodo}
          sx={{ mr: 2 }}
        >
          Add Todo
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo._id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => startEdit(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => deleteTodo(todo._id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              {editingTodo === todo._id ? (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateTodo()}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateTodo}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <ListItemText primary={todo.text} />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
