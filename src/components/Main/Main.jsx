import "./Main.css";
import ItemCard from "../ItemCard/ItemCard";
import WeatherCard from "../WeatherCard/WeatherCard";
import { defaultClothingItems } from "../../utils/constants";
import React from "react";

function Main({weatherData, handleCardClick}) {
     return (
          <main>
              <WeatherCard weatherData={weatherData}/>
              <section className="cards"   >
               <p className="cards__text"> Today is {weatherData.temp.F} &deg; F / You may want to wear:
               </p>
               </section>
                    <ul className="cards__list">
                           {defaultClothingItems
                           .filter((item) => {
                               return item.weather === weatherData?.type;
                               }) 
                                   .map((item) => {
                               return  <ItemCard  
                                 key={item._id} 
                                 item={item} 
                                 onCardClick={handleCardClick} />;
                               })}
                               </ul>  
            </main>
          );
     }
      export default Main;
