// Local storage implementation - no server needed
const STORAGE_KEY = 'clothing_items';

// Initialize with default items if local storage is empty
const initializeDefaultItems = () => {
  const existingItems = localStorage.getItem(STORAGE_KEY);
  if (!existingItems) {
    const defaultItems = [
      {
        "_id": "0",
        "name": "Beanie",
        "weather": "cold",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Beanie.png?etag=bc10497cc80fa557f036e94f9999f7b2"
      },
      {
        "_id": "3",
        "name": "Coat",
        "weather": "cold",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Coat.png?etag=298717ed89d5e40b1954a1831ae0bdd4"
      },
      {
        "_id": "4",
        "name": "Dress",
        "weather": "hot",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Dress.png?etag=1f9cd32a311ab139cab43494883720bf"
      },
      {
        "_id": "5",
        "name": "Hoodie",
        "weather": "cold",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Hoodie.png?etag=5f52451d0958ccb1016c78a45603a4e8"
      },
      {
        "_id": "6",
        "name": "Jacket",
        "weather": "cold",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Jacket.png?etag=f4bb188deaa25ac84ce2338be2d404ad"
      },
      {
        "_id": "10",
        "name": "Scarf",
        "weather": "cold",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Scarf.png?etag=74efbee93810c926b5507e862c6cb76c"
      },
      {
        "_id": "11",
        "name": "Shorts",
        "weather": "hot",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Shorts.png?etag=d728c496643f610de8d8fea92dd915ba"
      },
      {
        "_id": "12",
        "name": "Skirt",
        "weather": "hot",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Skirt.png?etag=27a6bea7e1b63218820d615876fa31d1"
      },
      {
        "_id": "16",
        "name": "T-Shirt",
        "weather": "hot",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09"
      },
      {
        "_id": "19",
        "name": "cap",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Cap.png?etag=f3dad389b22909cafa73cff9f9a3d591",
        "weather": "cold"
      },
      {
        "_id": "n76y",
        "name": "Sunglasses",
        "imageUrl": "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sunglasses.png?etag=a1bced9e331d36cb278c45df51150432",
        "weather": "warm"
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  }
};

// Initialize default items on first load
initializeDefaultItems();

const getItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    return Promise.resolve(items ? JSON.parse(items) : []);
  } catch (error) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

const addItem = ({ name, imageUrl, weather }) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const newItem = {
        _id: Date.now().toString(),
        name,
        imageUrl,
        weather,
        owner: "1", // For now, hardcode to user ID 1 since we're using json-server
        likes: []
      };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return Promise.resolve(newItem);
  } catch (error) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

const deleteItem = (_id) => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const itemIndex = items.findIndex(item => item._id === _id);
    if (itemIndex !== -1) {
      const deletedItem = items.splice(itemIndex, 1)[0];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return Promise.resolve(deletedItem);
    } else {
      return Promise.reject('Error: Item not found');
    }
  } catch (error) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

const addCardLike = (id, token) => {
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const itemIndex = items.findIndex(item => item._id === id);
    if (itemIndex !== -1) {
      const item = items[itemIndex];
      if (!item.likes) {
        item.likes = [];
      }
      if (!item.likes.includes("1")) { // Add user ID 1 (hardcoded for json-server)
        item.likes.push("1");
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return Promise.resolve(item);
    } else {
      return Promise.reject('Error: Item not found');
    }
  } catch (error) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

const removeCardLike = (id, token) => {
  if (!token) {
    return Promise.reject('Error: No authorization token');
  }

  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const itemIndex = items.findIndex(item => item._id === id);
    if (itemIndex !== -1) {
      const item = items[itemIndex];
      if (item.likes) {
        item.likes = item.likes.filter(userId => userId !== "1"); // Remove user ID 1
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return Promise.resolve(item);
    } else {
      return Promise.reject('Error: Item not found');
    }
  } catch (error) {
    return Promise.reject(`Error: ${error.message}`);
  }
};

const handleServerResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

export { getItems, addItem, deleteItem, addCardLike, removeCardLike, handleServerResponse };
