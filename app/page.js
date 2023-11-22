'use client' 
import {useState} from 'react'
const API_KEY = "c98004f517434b049ec152301232211"
const API_URL = "https://api.weatherapi.com/v1/"

const getCurrentWeather = async (city) => {
    const response = await fetch(`${API_URL}current.json?key=${API_KEY}&q=${city}`)
    const data = await response.json()
    console.log(data)
    return data
}

const getForecastWeather = async (city) => {
    const response = await fetch(`${API_URL}forecast.json?key=${API_KEY}&q=${city}&days=3`)
    const data = await response.json()
    return data
}

export default function Home() {
    const [currentWeather, setCurrentWeather] = useState(null)
    const [forecastWeather, setForecastWeather] = useState(null)
    const [city, setCity] = useState("")
    const [currentCity, setCurrentCity] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        setLoading(true)
        setLoaded(false)
        setError(false)
        setErrorMessage("")

        if(!city) {
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
        <main className="flex min-h-screen flex-col items-center justify-between text-black p-24 bg-[#23001E]  bg-[url(https://images7.alphacoders.com/390/390608.jpg)] background-blend-mode: multiply; bg-opacity-50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">La météo avec React</h1>
                <p className="text-xl font-medium mb-4">En utilisant l'API&nbsp;
                    <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
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
                <div className="flex flex-row items-center justify-center">
                    <input type="text"
                        onChange={
                            (e) => setCity(e.target.value)
                        }
                        onKeyDown={
                            (e) => {
                                if (e.key === 'Enter') {
                                    handleSearch()
                                }
                            }
                        }

                        placeholder="Rechercher une ville"
                        className="border border-gray-300 rounded-md p-2 text-black rounded-r-none h-10"/>
                    <button className="bg-[#1B7B78] hover:bg-[#1B7B78] text-white font-bold py-2 px-4 rounded-md rounded-l-none h-10"
                        onClick={handleSearch}>Rechercher</button>
                </div>
            </div>

            <div style={
                  loading ? {display: "block"} : {display: "none"}
                } className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#ffba49]"></div>

            <div className="flex flex-row items-between justify-evenly gap-10 select-none" style={
                {
                    display: loaded ? "flex" : "none"
                }
            }>
                <div className="flex flex-col items-center justify-center bg-black shadow-2xl rounded-2xl p-5 text-white w-1/4">
                    <h2 className="text-2xl font-bold mb-4">Aujourd'hui</h2>
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={
                                currentWeather && currentWeather.current.condition.icon
                            }
                            alt="icon"
                            width={100}
                            height={100}/>
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
                            <div key={index} className="w-3/6 h-80 flex flex-col items-center justify-between backdrop-blur-lg p-5 rounded-2xl bg-white bg-opacity-30 shadow-2xl">
                                <p className="text-xl font-medium mb-4">
                                    {
                                    day.date
                                } </p>
                                <img src={
                                        day.day.condition.icon
                                    }
                                    alt="icon"
                                    width={100}
                                    height={100}/>
                                <p className="text-3xl font-bold mb-4">
                                    {
                                    day.day.avgtemp_c
                                }°C
                                </p>
                                <p className="text-xl font-medium mb-4 text-center h-12">
                                    {
                                    day.day.condition.text
                                } </p>
                            </div>
                        )
                    })
                }
                </div>
                </div>
            </div>

        </main>
    )
}
