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
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, deleteItem, addItem } from "../../utils/api";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";

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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
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
    // Add profile editing functionality
    console.log("Edit profile clicked");
  };

  const handleLogout = () => {
    // Add logout functionality
    console.log("Logout clicked");
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
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleSwitchChange }}
    >
      <div className="page">
        <div className="page__container">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
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
  );
}

export default App;
