import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter =  ({countryString})  => {
    const [filteredCountries, setFilteredCountries] = useState([])
    const [info, setInfo] = useState(null)
    const [geo, setGeo] = useState([])
    const [weather, setWeather] = useState(null)
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
    const api_key = import.meta.env.VITE_SOME_KEY


    useEffect(() => {
        if (countryString) {
            axios
                .get(`${baseUrl}all`)
                .then(response => {
                    const filtered = response.data.filter(country =>
                        country.name.common.toLowerCase().includes(countryString.toLowerCase())
                    );
                    setFilteredCountries(filtered)
                })
                .catch(error => {
                    console.error("Error fetching countries:", error)
                    setFilteredCountries([])
                })
        } else {
            setFilteredCountries([])
        }
    }, [countryString])

    useEffect(() => {
        if (filteredCountries.length === 1) {
            setInfo(filteredCountries[0])
        } else {
            setInfo(null)
        }
    }, [filteredCountries])

    useEffect(() => {
      if (info) {
        const capital = info.capital[0]
        console.log(capital)
        const weatherGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=5&appid=${api_key}`
        axios
          .get(weatherGeo)
          .then(response => {
            if (response.data.length > 0) {
                const lat = response.data[0].lat
                const lon = response.data[0].lon
                setGeo([lat, lon])
                console.log(lat, lon)
            }
          })
          .catch(error => {
            console.log('Error:', error)
          })
      }
    }, [info])

    useEffect(() => {
        if (geo.length === 2){
            const weatherInfo = `https://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${api_key}`
            axios
                .get(weatherInfo)
                .then(response => {
                    setWeather(response.data)
                })
                .catch(error => {
                    console.log('Error:', error)
                })
        }
    }, [geo])

    const handleShowClick = (country) => {
        setInfo(country)
        const showCountry = filteredCountries.find(obj => obj.name.common === country.name.common)
        setFilteredCountries([showCountry])
    }

    return (
        <div>
            {filteredCountries.length > 10 ? (
                <p>Too many matches, specify another filter</p>
            ) : filteredCountries.length === 1 && info ? (
                <CountryInfo info={info} weather={weather}/>
            ) : (
                filteredCountries.map(country => (
                    <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => handleShowClick(country)}>
                        show
                    </button>
                    </div>    
                ))
            )
            }
        </div>
    )
}

const CountryInfo = ({ info, weather }) => (
    <div>
        <h1>{info.name.official}</h1>
        <p>Capital(s): {info.capital.map(c => `${c} `)}</p>
        <p>Area: {info.area}</p>
        <h3>Languages:</h3> 
        <ul>
            {Object.values(info.languages).map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
        <img src={info.flags.png} alt={`${info.name.official} flag`} />
        <h1>{`Weather in ${info.capital[0]}`}</h1>
        {weather ? (
            <>
                <p>{`temparature ${(weather.main.temp - 273.15).toFixed(2)} Celcius`}</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
                <p>{`wind ${weather.wind.speed} m/s`}</p>           
            </>
        ) : (
            <p>No weather data yet</p>
        )
        }

    </div>
)

export default Filter