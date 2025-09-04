import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import ItemModal from "../ItemModal/ItemModal";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../context/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../context/CurrentUserContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, deleteItem, addItem, addCardLike, removeCardLike } from "../../utils/api";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { register, login, checkToken, updateProfile } from "../../utils/auth";

const APIkey = "a55a98aaee04d0285bcba725026a08a1";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
  });

  const cardToDelete = useRef(null);
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    if (!isLoggedIn) {
      setActiveModal("login");
      return;
    }
    setActiveModal("add-garment");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weatherType }) => {
    setIsLoading(true);
    return addItem({ name, weather: weatherType, imageUrl })
      .then((res) => {
        setClothingItems((prevItems) => [
          { name, imageUrl, weather: weatherType, _id: res._id },
          ...prevItems,
        ]);
      })
      .then(closeActiveModal)
      .catch((err) => {
        console.error("Error adding item:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCardDelete = (card) => {
    setActiveModal("delete");
    cardToDelete.current = card;
  };

  const handleConfirmCardDelete = () => {
    console.log("Card to delete:", cardToDelete.current);
    if (!cardToDelete.current || !cardToDelete.current._id) {
      console.error("No card to delete or missing _id");
      return;
    }
    setIsLoading(true);
    deleteItem(cardToDelete.current._id)
      .then((res) => {
        console.log("Item deleted successfully:", res);
        setClothingItems((items) =>
          items.filter((item) => item._id !== cardToDelete.current._id)
        );
        closeActiveModal();
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
        alert("Failed to delete item. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditProfile = () => {
    setActiveModal("edit-profile");
  };

  const handleEditProfileSubmit = ({ name, avatar }) => {
    setIsLoading(true);
    return updateProfile({ name, avatar })
      .then((res) => {
        setCurrentUser(res);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    // Check if this card is not currently liked
    !isLiked
      ? // if so, send a request to add the user's id to the card's likes array
        addCardLike(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item))
            );
          })
          .catch((err) => console.log(err))
      : // if not, send a request to remove the user's id from the card's likes array
        removeCardLike(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item))
            );
          })
          .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleRegister = ({ name, avatar, email, password }) => {
    setIsLoading(true);
    return register({ name, avatar, email, password })
      .then((res) => {
        // After successful registration, automatically log in
        return login({ email, password });
      })
      .then((res) => {
        // For json-server, the response is the user object directly
        localStorage.setItem("jwt", "fake-jwt-token"); // json-server doesn't generate real tokens
        setIsLoggedIn(true);
        setCurrentUser(res); // res is the user object directly from json-server
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogin = ({ email, password }) => {
    setIsLoading(true);
    return login({ email, password })
      .then((res) => {
        // For json-server, the response is the user object directly
        // In a real backend, it would be res.user and res.token
        localStorage.setItem("jwt", "fake-jwt-token"); // json-server doesn't generate real tokens
        setIsLoggedIn(true);
        setCurrentUser(res); // res is the user object directly from json-server
      })
      .catch((err) => {
        console.error("Error during login:", err);
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({
            latitude: 38.8918,
            longitude: -76.8894,
          });
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setUserLocation({
        latitude: 38.8918,
        longitude: -76.8894,
      });
    }
  }, []);

  // Update weather data when location changes
  useEffect(() => {
    if (userLocation) {
      getWeather(userLocation, APIkey)
        .then((data) => {
          const filteredData = filterWeatherData(data);
          console.log("Weather data set:", filteredData);
          setWeatherData(filteredData);
        })
        .catch(console.error);
    }
  }, [userLocation]);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res);
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
          setCurrentUser(null);
        });
    }
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        console.log("Fetched clothing items:", data);
        setClothingItems(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error.message);
      });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleSwitchChange }}
      >
        <div className="page">
          <div className="page__container">
            <Header 
              handleAddClick={handleAddClick} 
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              onLoginClick={() => setActiveModal("login")}
              onRegisterClick={() => setActiveModal("register")}
              onLogout={handleLogout}
            />
            <Routes>
              <Route
                path="/"
                element={
                                  <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                  onCardLike={handleCardLike}
                />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      onAddClick={handleAddClick}
                      onCardClick={handleCardClick}
                      onEditProfile={handleEditProfile}
                      onLogout={handleLogout}
                      weatherType={weatherData.type}
                      onSelectCard={handleCardClick}
                      isLoggedIn={isLoggedIn}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer year={new Date().getFullYear()} />
          </div>
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItemModalSubmit={handleAddItemModalSubmit}
            isLoading={isLoading}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onClose={closeActiveModal}
            onRegister={handleRegister}
            isLoading={isLoading}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onClose={closeActiveModal}
            onLogin={handleLogin}
            isLoading={isLoading}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeActiveModal}
            onEditProfile={handleEditProfileSubmit}
            isLoading={isLoading}
          />
          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDelete={handleCardDelete}
          />
          <DeleteItemModal
            activeModal={activeModal}
            card={cardToDelete.current}
            onConfirm={handleConfirmCardDelete}
            onClose={closeActiveModal}
            isOpen={activeModal === "delete"}
            isLoading={isLoading}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
