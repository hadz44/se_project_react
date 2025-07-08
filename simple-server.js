import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Read data from db.json
const getData = () => {
  const data = fs.readFileSync('db.json', 'utf8');
  return JSON.parse(data);
};

// Write data to db.json
const writeData = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

// GET /items - Get all items
app.get('/items', (req, res) => {
  try {
    const data = getData();
    res.json(data.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// GET /items/:id - Get item by _id
app.get('/items/:id', (req, res) => {
  try {
    const data = getData();
    const item = data.items.find(item => item._id === req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// POST /items - Add new item
app.post('/items', (req, res) => {
  try {
    const data = getData();
    const newItem = {
      _id: Date.now().toString(),
      ...req.body
    };
    data.items.unshift(newItem);
    writeData(data);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// DELETE /items/:id - Delete item by _id
app.delete('/items/:id', (req, res) => {
  try {
    const data = getData();
    const itemIndex = data.items.findIndex(item => item._id === req.params.id);
    if (itemIndex !== -1) {
      const deletedItem = data.items.splice(itemIndex, 1)[0];
      writeData(data);
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// PUT /items/:id - Update item by _id
app.put('/items/:id', (req, res) => {
  try {
    const data = getData();
    const itemIndex = data.items.findIndex(item => item._id === req.params.id);
    if (itemIndex !== -1) {
      data.items[itemIndex] = { ...data.items[itemIndex], ...req.body };
      writeData(data);
      res.json(data.items[itemIndex]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET    /items');
  console.log('  GET    /items/:id');
  console.log('  POST   /items');
  console.log('  DELETE /items/:id');
  console.log('  PUT    /items/:id');
}); 