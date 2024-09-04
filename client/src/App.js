import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/items');
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/items', { name: newItemName });
      setNewItemName('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const startEditing = (item) => {
    setEditingItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:3001/api/items/${editingItem.id}`, { name: editingItem.name });
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="App">
      <h1>My Airtable-like Web App</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter new item name"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      {items.length === 0 ? (
        <p>No items to display</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label="ID">{item.id}</td>
                <td data-label="Name">
                  {editingItem && editingItem.id === item.id ? (
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td data-label="Actions">
                  <div className="actions">
                    {editingItem && editingItem.id === item.id ? (
                      <>
                        <button className="save-button" onClick={saveEdit}>Save</button>
                        <button className="cancel-button" onClick={cancelEditing}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-button" onClick={() => startEditing(item)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteItem(item.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
