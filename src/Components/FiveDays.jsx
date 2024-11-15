import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FiveDays = ({ city }) => {
    const [forecast, setForecast] = useState([]);
console.log(city)
    const getFiveDaysForecast = async () => {
        const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
        const api_key = "f00c38e0279b7bc85480c3fe775d518c";


        try {
            const forecastResponse = await axios.get(forecastUrl, {
                params: {
                    q: city,
                    units: "metric",
                    appid: api_key,
                },
            });

            const dailyForecast = forecastResponse.data.list.filter((reading) =>
                reading.dt_txt.includes("12:00:00")
            );

            setForecast(dailyForecast);
        } catch (error) {
            console.error("Error fetching five days forecast: ", error);
        }
    };

    useEffect(() => {
        getFiveDaysForecast();
    }, [city]);


    

    return (
       
       <>
            {forecast.length > 0 && (
                <div className='flex flex-col gap-4'>
                    <h2 className='text-gray-400 italic underline text-center'>Prévisions sur 5 jours</h2>
                    <div className='flex flex-wrap gap-4 justify-center items-center'>
                        {forecast.map((day, index) => (
                            <div 
                                className='border-2 w-52 rounded-xl shadow-lg shadow-slate-950 border-slate-800 flex flex-col items-center justify-between py-4 hover:scale-110 transition-all ease-linear duration-300'
                            key={index}>
                                <h3 className='capitalize font-bold text-gray-300'>{new Date(day.dt_txt).toLocaleDateString("fr-FR", { weekday: "long" })}</h3>
                                <img
                                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                    alt={day.weather[0].description}
                                    className='w-24 h-24'
                                />
                                <p className='text-gray-300 italic'>{Math.round(day.main.temp)}°C</p>
                                <p className='text-sm text-gray-400 capitalize'>{day.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
       </>
    );
};

export default FiveDays;


