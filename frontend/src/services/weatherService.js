import apiClient from "./apiClient";

export const fetchWeather = async (city) =>{
    const response  = await apiClient.get("/weather", {
        params : {
            city:city,
        }
    })
    return response.data
};

export const fetchForecast = async (city) =>{
    const response = await apiClient.get("/forecast", {
        params : {
            city : city,
        }
    })
    return response.data
};