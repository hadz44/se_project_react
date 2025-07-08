import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before json-server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST request, you'll need to use a body-parser
// You can use the one used by json-server
server.use(jsonServer.bodyParser);

// Add custom middleware before router
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  next();
});

// Custom route for DELETE with _id
server.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const items = db.get('items');
  
  // Find item by _id
  const itemIndex = items.findIndex(item => item._id === id).value();
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Remove the item
  const deletedItem = items.splice(itemIndex, 1).value();
  db.write();
  
  res.json(deletedItem[0]);
});

// Custom route for GET single item with _id
server.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const items = db.get('items');
  
  const item = items.find(item => item._id === id).value();
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// Custom route for PUT with _id
server.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const items = db.get('items');
  
  const itemIndex = items.findIndex(item => item._id === id).value();
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const updatedItem = { ...items.get(itemIndex).value(), ...req.body };
  items.set(itemIndex, updatedItem).write();
  
  res.json(updatedItem);
});

// Use default router
server.use(router);

server.listen(3002, () => {
  console.log('JSON Server is running on http://localhost:3002');
  console.log('Custom routes:');
  console.log('  DELETE /items/:id (uses _id)');
  console.log('  GET    /items/:id (uses _id)');
  console.log('  PUT    /items/:id (uses _id)');
}); 