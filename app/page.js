'use client'
import { useState } from 'react'
import DayCard from './daycard'
const API_KEY = "c98004f517434b049ec152301232211"
const API_URL = "https://api.weatherapi.com/v1/"
import Link from 'next/link'

const getCurrentWeather = async (city, lang = 'fr') => {
    const response = await fetch(`${API_URL}current.json?key=${API_KEY}&q=${city}&lang=${lang}`)
    const data = await response.json()
    console.log(data)
    return data
}

const getForecastWeather = async (city, lang = 'fr') => {
    const response = await fetch(`${API_URL}forecast.json?key=${API_KEY}&q=${city}&days=3&lang=${lang}`)
    const data = await response.json()
    return data
}
const getAutocompleteSuggestions = async (inputText) => {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputText}&limit=5`);
    const data = await response.json();
    return data.features.map(feature => feature.properties.label);
}






export default function Page() {
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecastWeather, setForecastWeather] = useState(null)
    const [city, setCity] = useState("")
    const [currentCity, setCurrentCity] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        if (e.target.value.length === 0) {
            setLoaded(false);
            setCurrentWeather(null);
            setForecastWeather(null);
        }
        const inputText = e.target.value;
        setCity(inputText);
        if (inputText.length > 2) {
            const newSuggestions = await getAutocompleteSuggestions(inputText);
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    }

    const selectSuggestion = (suggestion) => {
        setCity(suggestion);
        setSuggestions([]);

    }

    const clearInput = () => {
        setCity("");
        setSuggestions([]);
        setCurrentWeather(null);
        setForecastWeather(null);
        setLoaded(false);

    };


    const handleSearch = async () => {
        setLoading(true)
        setLoaded(false)
        setError(false)
        setErrorMessage("")
        setSuggestions([])

        if (!city) {
            setError(true)
            setErrorMessage("Veuillez saisir une ville")
            setLoading(false)
            return
        }

        const currentWeather = await getCurrentWeather(city)
        const forecastWeather = await getForecastWeather(city)

        // verification de la réponse de l'API
        if (currentWeather.error) {
            setError(true)
            setErrorMessage(currentWeather.error.message)
            setLoading(false)
            return
        }
        setCurrentCity(city)
        setCurrentWeather(currentWeather)
        setForecastWeather(forecastWeather)
        setLoaded(true)
        setLoading(false)
    }

    return (

        <main className="flex min-h-screen flex-col items-center justify-between text-black p-24 bg-[#23001E]  bg-[url(https://cdn.discordapp.com/attachments/1169323362271641620/1177385856223420456/image.png?ex=65725106&is=655fdc06&hm=8712b18b294e92f344b4303180c8b3097aa049cfbb9ccb9c8ac4f75aebe82c9b&)] bg-no-repeat bg-cover background-blend-mode: multiply; bg-opacity-50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">La météo avec React</h1>
                <p className="text-xl font-medium mb-4">En utilisant l'API&nbsp;
                    <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
                </p>
                <p>
                    <Link href="/info" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Météo pour 14 jours
                    </Link>
                </p>


                <span className="text-red-500 font-bold mb-4" style={
                    {
                        display: error ? "block" : "none"
                    }
                }>
                    {
                        error && errorMessage
                    }
                </span>
                <div className="flex flex-row items-center justify-center gap-2">
                    <div className="relative flex">
                        <input type="text"
                            value={city}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch()
                                }
                            }}
                            placeholder="Rechercher une ville"
                            className="w-48 h-12 border border-gray-300 rounded-l-2xl py-2 px-4 text-black placeholder:text-gray-800 focus:ring-0 h-10  bg-white bg-opacity-30 shadow-2xl"

                        />
                        {loaded && (
                            <span className="h-12 w-12 border border-gray-300 cursor-pointer bg-red-500 text-white flex items-center justify-center h-10 w-10 rounded-r-2xl" onClick={clearInput}>
                                &#x2715;
                            </span>
                        )}
                        {!loaded && (
                            <button className="bg-[#1B7B78] hover:bg-[#1B7B78] text-white font-bold py-2 px-4 rounded-r-2xl h-12 border border-gray-300"
                                onClick={handleSearch}>Rechercher</button>
                        )}

                        <div className="absolute z-10 mt-1 mt-10 w-full rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <div key={index}
                                    onClick={() => selectSuggestion(suggestion)}
                                    className="cursor-pointer hover:bg-gray-100 px-4 py-2">
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>


            </div>

            <div style={
                loading ? { display: "block" } : { display: "none" }
            } className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#ffba49]"></div>

            <div className="flex flex-row items-between justify-evenly gap-10 select-none" style={
                {
                    display: loaded ? "flex" : "none"
                }
            }>
                <div className="flex flex-col items-center justify-center bg-black shadow-2xl rounded-2xl p-5 text-white w-1/4 hover:shadow-none duration-150">
                    <h2 className="text-2xl font-bold mb-4">Aujourd'hui</h2>
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={
                            currentWeather && currentWeather.current.condition.icon
                        }
                            alt="icon"
                            width={100}
                            height={100} />
                        <p className="text-3xl font-bold mb-4">
                            {
                                currentWeather && currentWeather.current.temp_c
                            }°C
                        </p>
                        <p className="text-xl font-medium mb-4">
                            {
                                currentWeather && currentWeather.current.condition.text
                            } </p>
                        <p className="text-xl font-medium mb-4">
                            {
                                currentWeather && currentWeather.current.wind_kph
                            } km/h</p>
                        <p className="text-xl font-medium mb-4">
                            {
                                currentWeather && currentWeather.current.precip_mm
                            } mm 💧</p>


                    </div>
                </div>
                <div className="flex flex-col justify-between w-3/4">
                    <h2 className="text-2xl font-bold mb-4">La météo des 3 prochains jours à <b>{currentCity}</b></h2>
                    <div className="flex flex-row items-center justify-center gap-5">
                        {
                            forecastWeather && forecastWeather.forecast.forecastday.map((day, index) => {
                                return (
                                    <DayCard key={index} day={day} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </main>
    )
}
