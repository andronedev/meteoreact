export default function WeatherTable({ forecastWeather }) {
    return (
        <table className="min-w-full table-auto border-collapse shadow-lg">
            <thead className="bg-gray-700">
                <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Temp. Max</th>
                    <th className="p-3 text-left">Temp. Min</th>
                    <th className="p-3 text-left">Condition</th>
                </tr>
            </thead>
            <tbody>
                {forecastWeather && forecastWeather.forecast.forecastday.map((day, index) => (
                    <tr key={index} className=" bg-gray-700 border-b border-black">
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