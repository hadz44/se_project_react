const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (in production, this would be a database)
let items = [
  {
    "_id": "1751991932030",
    "name": "Cap",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    "weather": "hot",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "0",
    "name": "Beanie",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Beanie.png?etag=bc10497cc80fa557f036e94f9999f7b2",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "3",
    "name": "Coat",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png?etag=298717ed89d5e40b1954a1831ae0bdd4",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "5",
    "name": "Hoodie",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png?etag=5f52451d0958ccb1016c78a45603a4e8",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "6",
    "name": "Jacket",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "10",
    "name": "Scarf",
    "weather": "cold",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Scarf.png?etag=74efbee93810c926b5507e862c6cb76c",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "16",
    "name": "T-Shirt",
    "weather": "hot",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "19",
    "name": "cap",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
    "weather": "cold",
    "owner": "1",
    "likes": []
  },
  {
    "_id": "n76y",
    "name": "Sunglasses",
    "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sunglasses.png?etag=a1bced9e331d36cb278c45df51150432",
    "weather": "warm",
    "owner": "1",
    "likes": []
  }
];

let users = [
  {
    "_id": "1",
    "name": "Terrence Tegegne",
    "avatar": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/avatar.svg",
    "email": "terrence@example.com",
    "password": "password" // Default password for testing
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Routes

// Authentication endpoints
// Register user
app.post('/signup', (req, res) => {
  const { name, avatar, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    _id: Date.now().toString(),
    name,
    avatar: avatar || 'https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/avatar.svg',
    email,
    password // In production, hash the password
  };

  users.push(newUser);
  const token = generateToken(newUser);
  
  res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email
    },
    token
  });
});

// Login user
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email
    },
    token
  });
});

// Get current user info
app.get('/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u._id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    email: user.email
  });
});

// Update user profile
app.patch('/users/me', authenticateToken, (req, res) => {
  const { name, avatar } = req.body;
  const userIndex = users.findIndex(u => u._id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) users[userIndex].name = name;
  if (avatar) users[userIndex].avatar = avatar;

  res.json({
    _id: users[userIndex]._id,
    name: users[userIndex].name,
    avatar: users[userIndex].avatar,
    email: users[userIndex].email
  });
});

// Get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Add new item
app.post('/items', authenticateToken, (req, res) => {
  const { name, imageUrl, weather } = req.body;
  
  if (!name || !imageUrl || !weather) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newItem = {
    _id: Date.now().toString(),
    name,
    imageUrl,
    weather,
    owner: req.user.id,
    likes: []
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// Delete item
app.delete('/items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const itemIndex = items.findIndex(item => item._id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // Check if user owns the item
  if (items[itemIndex].owner !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this item' });
  }

  items.splice(itemIndex, 1);
  res.status(200).json({ message: 'Item deleted successfully' });
});

// Like item
app.put('/items/:id/likes', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const item = items.find(item => item._id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const userId = req.user.id;
  
  if (!item.likes.includes(userId)) {
    item.likes.push(userId);
  }

  res.json(item);
});

// Unlike item
app.delete('/items/:id/likes', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const item = items.find(item => item._id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const userId = req.user.id;
  item.likes = item.likes.filter(id => id !== userId);

  res.json(item);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Items API: http://localhost:${PORT}/items`);
  console.log(`Users API: http://localhost:${PORT}/users`);
});

module.exports = app;
