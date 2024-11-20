// import { Oval } from 'react-loader-spinner';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFrown } from '@fortawesome/free-solid-svg-icons';
// import './App.css';
// function Grp204WeatherApp() {
//     const [input, setInput] = useState('');
//     const [weather, setWeather] = useState({
//         loading: false,
//         data: {},
//         error: false,
//     });
//     const toDateFunction = () => {
//         const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
//             'Septembre', 'Octobre', 'Novembre', 'Décembre'];
//         const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
//         const currentDate = new Date();
//         const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
//         return date;
//     };
//     const search = async (event) => {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//             setInput('');
//             setWeather({ ...weather, loading: true });
//             const url = 'https://api.openweathermap.org/data/2.5/weather';
//             const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
//             await axios
//                 .get(url, {
//                     params: {
//                         q: input,
//                         units: 'metric',
//                         appid: api_key,
//                     },
//                 })
//                 .then((res) => {
//                     setWeather({ data: res.data, loading: false, error: false });
//                 })
//                 .catch((error) => {
//                     setWeather({ ...weather, data: {}, error: true });
//                     setInput('');
//                 });
//         }
//     };
//     return (
//         <div className="App main">
//             <h1 className="app-name">Application Météo grp204</h1>
//             <div className="search-bar">
//                 <input
//                     type="text"
//                     className="city-search"
//                     placeholder="Entrez le nom de la ville..."
//                     name="query"
//                     value={input}
//                     onChange={(event) => setInput(event.target.value)}
//                     onKeyPress={search}
//                 />
//             </div>
//             {weather.loading && (
//                 <>
//                     <Oval type="Oval" color="black" height={100} width={100} />
//                 </>
//             )}
//             {weather.error && (
//                 <>
//                     <span className="error-message">
//                         <FontAwesomeIcon icon={faFrown} />
//                         <span>Ville introuvable</span>
//                     </span>
//                 </>
//             )}
//             {weather && weather.data && weather.data.main && (
//                 <div>
//                     <h2>{weather.data.name}, {weather.data.sys.country}</h2>
//                     <span>{toDateFunction()}</span>
//                     <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
//                         alt={weather.data.weather[0].description} />
//                     <p>{Math.round(weather.data.main.temp)}°C</p>
//                     <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
//                 </div>
//             )}
//         </div>
//     );
// }
// export default Grp204WeatherApp;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faStar, faTrash, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import './App.css';

function Grp204WeatherApp() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: null,
        forecast: null,
        error: false,
    });
    const [favorites, setFavorites] = useState([]);

    const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
// mode 
const checkDarkMode = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 20) {
        setIsDarkMode(true);
    }
};
    // Charger les favoris depuis le localStorage
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
        // Vérifier et appliquer le mode nuit à 20:00 ou après
          checkDarkMode();   
    }, []);

    // Sauvegarder les favoris dans le localStorage
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Détection automatique de localisation
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Erreur de géolocalisation:', error);
            }
        );
    }, []);

    const fetchWeatherByCoords = async (lat, lon) => {
        setWeather({ ...weather, loading: true, error: false });
        try {
            const currentWeatherResponse = await axios.get(
                'https://api.openweathermap.org/data/2.5/weather',
                {
                    params: {
                        lat,
                        lon,
                        units: 'metric',
                        appid: apiKey,
                    },
                }
            );

            const forecastResponse = await axios.get(
                'https://api.openweathermap.org/data/2.5/forecast',
                {
                    params: {
                        lat,
                        lon,
                        units: 'metric',
                        appid: apiKey,
                    },
                }
            );

            setWeather({
                loading: false,
                data: currentWeatherResponse.data,
                forecast: forecastResponse.data,
                error: false,
            });
        } catch (error) {
            console.error('Erreur API:', error);
            setWeather({ loading: false, data: null, forecast: null, error: true });
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return `${days[date.getDay()]} ${date.getDate()}`;
    };

    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!input.trim()) return;

            setWeather({ ...weather, loading: true, error: false });

            try {
                const currentWeatherResponse = await axios.get(
                    'https://api.openweathermap.org/data/2.5/weather',
                    {
                        params: {
                            q: input.trim(),
                            units: 'metric',
                            appid: apiKey,
                        },
                    }
                );

                const forecastResponse = await axios.get(
                    'https://api.openweathermap.org/data/2.5/forecast',
                    {
                        params: {
                            q: input.trim(),
                            units: 'metric',
                            appid: apiKey,
                        },
                    }
                );

                setWeather({
                    loading: false,
                    data: currentWeatherResponse.data,
                    forecast: forecastResponse.data,
                    error: false,
                });
            } catch (error) {
                console.error('Erreur API:', error);
                setWeather({ loading: false, data: null, forecast: null, error: true });
            }
        }
    };

    const addToFavorites = () => {
        if (
            weather.data &&
            !favorites.some((city) => city.toLowerCase() === weather.data.name.toLowerCase())
        ) {
            setFavorites([...favorites, weather.data.name]);
        }
    };

    const loadFavorite = (city) => {
        setInput(city);
        setWeather({ ...weather, loading: true, error: false });
        search({ key: 'Enter' });
    };

    const removeFavorite = (city) => {
        const updatedFavorites = favorites.filter((favorite) => favorite.toLowerCase() !== city.toLowerCase());
        setFavorites(updatedFavorites);
    };

    return (
        <>
        <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 className="app-name">Application Météo</h1>
            <button 
                className="toggle-mode" 
                onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? 'Mode Jour ☀️' : 'Mode Nuit 🌙'}
            </button>
            <div className="search-bar">
                <input
                    type="text"
                    className="city-search"
                    placeholder="Entrez le nom de la ville..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={search}
                />
                <button className="add-favorite" onClick={addToFavorites}>
                    <FontAwesomeIcon icon={faStar} /> Ajouter aux favoris
                </button>
                <button className="use-location" onClick={() => navigator.geolocation.getCurrentPosition(
                    (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
                    (error) => console.error('Erreur de localisation:', error)
                )}>
                    <FontAwesomeIcon icon={faLocationArrow} /> Utiliser ma localisation
                </button>
            </div>

            <div className="favorites-container">
                <h3>Villes favorites :</h3>
                <ul>
                    {favorites.map((city, index) => (
                        <li key={index}>
                            <span onClick={() => loadFavorite(city)}>{city}</span>
                            <button
                                className="remove-favorite"
                                onClick={() => removeFavorite(city)}
                                title={`Supprimer ${city}`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {weather.loading && (
                <div className="loading">
                    <Oval color="blue" height={50} width={50} />
                </div>
            )}

            {weather.error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faFrown} />
                    <span> Ville introuvable. Veuillez réessayer. </span>
                </div>
            )}

            {weather.data && (
                <div className="weather-info">
                    <h2>
                        {weather.data.name}, {weather.data.sys.country}
                    </h2>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                        alt={weather.data.weather[0].description}
                    />
                    <p>{Math.round(weather.data.main.temp)}°C</p>
                    <p>{weather.data.weather[0].description}</p>
                    <p>Vent : {weather.data.wind.speed} m/s</p>
                </div>
            )}

            {weather.forecast && (
                <div className="forecast-container">
                    <h3>Prévisions sur 5 jours :</h3>
                    <div className="forecast-list">
                        {weather.forecast.list
                            .filter((_, index) => index % 8 === 0)
                            .map((forecast, index) => (
                                <div className="forecast-item" key={index}>
                                    <p>{formatDate(forecast.dt)}</p>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                        alt={forecast.weather[0].description}
                                    />
                                    <p>{Math.round(forecast.main.temp)}°C</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Grp204WeatherApp;