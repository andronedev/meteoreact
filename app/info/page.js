'use client'
import { useState } from 'react'
import WeatherTable from '../monthTable'
const API_KEY = "c98004f517434b049ec152301232211"
const API_URL = "https://api.weatherapi.com/v1/"
import Link from 'next/link'
import SearchBar from '../searchBar'

const getCurrentWeather = async (city, lang = 'fr') => {
    const response = await fetch(`${API_URL}current.json?key=${API_KEY}&q=${city}&lang=${lang}`)
    const data = await response.json()
    console.log(data)
    return data
}

const getForecastWeather = async (city, lang = 'fr') => {
    const response = await fetch(`${API_URL}forecast.json?key=${API_KEY}&q=${city}&days=30&lang=${lang}`)
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


    const handleSearch = async (input) => {
        console.log(input)
        setCity(input)
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

        <main className="flex min-h-screen flex-col items-center justify-between text-white p-24 bg-[#23001E]  bg-[url(https://cdn.discordapp.com/attachments/1169323362271641620/1177386071600922644/image.png?ex=6572513a&is=655fdc3a&hm=e82df3105ba7b13d20ac4e252a094694be2be284b1bc876ecc6da61c98ed1421&)] bg-center bg-no-repeat bg-cover background-blend-mode: multiply; bg-opacity-50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">La météo avec React (14 jours)</h1>
                <p className="text-xl font-medium mb-4">En utilisant l'API&nbsp;
                    <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
                </p>
                <p>
                    <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Météo pour classique (aujourd'hui)
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
                <SearchBar onCitySelect={handleSearch} />


            </div>

            <div style={
                loading ? { display: "block" } : { display: "none" }
            } className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#ffba49]"></div>

            <div className="flex flex-row items-between justify-evenly gap-10 select-none" style={
                {
                    display: loaded ? "flex" : "none"
                }
            }>
                
                   
                </div>
                {loaded && <div className="flex flex-col justify-between w-3/4 mt-10">
                    <h2 className="text-2xl font-bold mb-4">La météo des 14 prochains jours à <b>{currentCity}</b></h2>
                    <div className="flex flex-row items-center justify-center gap-5">

                        {/* Intégration du composant WeatherTable */}
                        {forecastWeather && <WeatherTable forecastWeather={forecastWeather} />}
                    </div>
                </div>
}

        </main>
    )
}
