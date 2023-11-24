export default function WeatherTable({ forecastWeather }) {
    return (
        <table className="min-w-full table-auto border-collapse shadow-lg">
            <thead className="backdrop-blur-lg p-5 rounded-2xl bg-white bg-opacity-30 shadow-2xl hover:bg-white hover:text-black duration-50">
                <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Temp. Max</th>
                    <th className="p-3 text-left">Temp. Min</th>
                    <th className="p-3 text-left">Condition</th>
                </tr>
            </thead>
            <tbody>
                {forecastWeather && forecastWeather.forecast.forecastday.map((day, index) => (
                    <tr key={index} className=" border-b border-black backdrop-blur-lg p-5 rounded-2xl bg-white bg-opacity-30 shadow-2xl hover:bg-white hover:text-black duration-50">
                        <td className="p-3">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="p-3">{day.day.maxtemp_c}°C</td>
                        <td className="p-3">{day.day.mintemp_c}°C</td>
                        <td className="p-3 flex items-center">
                            <img src={day.day.condition.icon} alt="Weather icon" className="mr-2" style={{ width: '20px', height: '20px' }} />
                            {day.day.condition.text}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}