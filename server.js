import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, 'db.json');

// Helper function to read database
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { items: [] };
  }
}

// Helper function to write database
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// GET all items
app.get('/items', (req, res) => {
  const db = readDB();
  res.json(db.items);
});

// GET item by _id
app.get('/items/:_id', (req, res) => {
  const db = readDB();
  const item = db.items.find(item => item._id === req.params._id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
  const db = readDB();
  const { name, imageUrl, weather } = req.body;
  
  if (!name || !imageUrl || !weather) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Generate a unique _id
  const _id = Math.random().toString(36).substr(2, 4);
  
  const newItem = {
    _id,
    name,
    imageUrl,
    weather
  };
  
  db.items.push(newItem);
  
  if (writeDB(db)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Failed to save item' });
  }
});

// DELETE item by _id
app.delete('/items/:_id', (req, res) => {
  const db = readDB();
  const itemIndex = db.items.findIndex(item => item._id === req.params._id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = db.items.splice(itemIndex, 1)[0];
  
  if (writeDB(db)) {
    res.json(deletedItem);
  } else {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// PUT update item by _id
app.put('/items/:_id', (req, res) => {
  const db = readDB();
  const itemIndex = db.items.findIndex(item => item._id === req.params._id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const { name, imageUrl, weather } = req.body;
  
  if (name) db.items[itemIndex].name = name;
  if (imageUrl) db.items[itemIndex].imageUrl = imageUrl;
  if (weather) db.items[itemIndex].weather = weather;
  
  if (writeDB(db)) {
    res.json(db.items[itemIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET    http://localhost:${PORT}/items`);
  console.log(`  GET    http://localhost:${PORT}/items/:_id`);
  console.log(`  POST   http://localhost:${PORT}/items`);
  console.log(`  DELETE http://localhost:${PORT}/items/:_id`);
  console.log(`  PUT    http://localhost:${PORT}/items/:_id`);
}); 