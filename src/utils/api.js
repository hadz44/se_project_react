const BASE_URL = 'http://localhost:3001';

const handleServerResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

const getItems = () => {
  return fetch(`${BASE_URL}/items`)
    .then(handleServerResponse);
};

const addItem = ({ name, imageUrl, weather }) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  return fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, imageUrl, weather }),
  }).then(handleServerResponse);
};

const deleteItem = (_id) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  return fetch(`${BASE_URL}/items/${_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleServerResponse);
};

const addCardLike = (id, token) => {
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleServerResponse);
};

const removeCardLike = (id, token) => {
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(handleServerResponse);
};

export { getItems, addItem, deleteItem, addCardLike, removeCardLike, handleServerResponse };
