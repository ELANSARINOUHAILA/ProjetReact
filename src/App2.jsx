import React, { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import FiveDays from "./Components/FiveDays";

function Grp204WeatherApp() {
    const [input, setInput] = useState("");
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });
    // const [forecast, setForecast] = useState([]); // Nouvel état pour les prévisions

    const toDateFunction = () => {
        const months = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
        ];
        const WeekDays = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
        ];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]
            }`;
        return date;
    };

    const search = async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setInput("");
            setWeather({ ...weather, loading: true });
            const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
            const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
            const api_key = "f00c38e0279b7bc85480c3fe775d518c";

            try {
                // Récupérer les données actuelles
                const currentWeatherResponse = await axios.get(currentWeatherUrl, {
                    params: {
                        q: input,
                        units: "metric",
                        appid: api_key,
                    },
                });

                setWeather({
                    data: currentWeatherResponse.data,
                    loading: false,
                    error: false,
                });

                // Récupérer les prévisions
                // const forecastResponse = await axios.get(forecastUrl, {
                //     params: {
                //         q: input,
                //         units: "metric",
                //         appid: api_key,
                //     },
                // });

                // Filtrer les prévisions pour avoir une prévision par jour
                // const dailyForecast = forecastResponse.data.list.filter((reading) =>
                    // reading.dt_txt.includes("12:00:00")
                // );

                // setForecast(dailyForecast);
            } catch (error) {
                setWeather({ ...weather, data: {}, error: true });
                setInput("");
            }
        }
    };

    return (
        <div className="bg-slate-950 w-screen flex flex-col justify-start items-center gap-4 py-4">
            <h1 className="w-screen text-gray-200 font-bold text-2xl italic underline text-center ">Application Météo grp204</h1>
            {/* <div > */}
                <input
                    type="text"
                    placeholder="Entrez le nom de la ville..."
                    value={input}
                    className="rounded-lg px-8 w-1/2 py-1 bg-transparent border-2 border-slate-700 text-gray-200 outline-none placeholder:text-slate-800 shadow-lg shadow-slate-800 "
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={search}
                />
            {/* </div> */}

            {weather.loading && (
                <>
                    <Oval type="Oval" color="black" height={100} width={100} />
                </>
            )}

            {weather.error && (
                <>
                    <span>
                        <FontAwesomeIcon icon={faFrown} />
                        <span>Ville introuvable</span>
                    </span>
                </>
            )}

            {weather.data.main && (
                <div className="flex flex-col">
                    <h2  className="text-center">
                        {weather.data.name}, <span className="text-lg italic text-gray-600 mx-auto">{weather.data.sys.country}</span>
                    </h2>
                        <span className="text-slate-600 text-center mx-auto">{toDateFunction()}</span>
                    <div className="flex gap-7 items-center"> 
                        <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt={weather.data.weather[0].description} />
                        <p>{Math.round(weather.data.main.temp)}°C</p>
                        <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
                    </div>
                </div>
            )}

            {/* Affichage des prévisions */}
            <FiveDays city={input} />
        </div>
    );
}

export default Grp204WeatherApp