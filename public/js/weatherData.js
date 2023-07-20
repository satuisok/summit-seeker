const weatherAppKey = process.env.WEATHER_API_KEY; // import the weather app key

const weather = async (data) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherAppKey}&q=${data.geometry.coordinates[1]},${data.geometry.coordinates[0]}&days=3&aqi=no&alerts=no`;
    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        // format date for forecast 
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return daysOfWeek[date.getDay()];
        };

        // forecast data
        const forecast = {
            currentDate: formatDate(weatherData.forecast.forecastday[0].date),
            currentTemp: weatherData.forecast.forecastday[0].day.avgtemp_c,
            currentIcon: weatherData.forecast.forecastday[0].day.condition.icon,
            tomorrow: formatDate(weatherData.forecast.forecastday[1].date),
            tomorrowTemp: weatherData.forecast.forecastday[1].day.avgtemp_c,
            tomorrowIcon: weatherData.forecast.forecastday[1].day.condition.icon,
            dayAfter: formatDate(weatherData.forecast.forecastday[2].date),
            dayAfterTemp: weatherData.forecast.forecastday[2].day.avgtemp_c,
            dayAfterIcon: weatherData.forecast.forecastday[2].day.condition.icon
        }

        return forecast;
    } catch (error) {
        console.log(error);
    }
}

export default weather;