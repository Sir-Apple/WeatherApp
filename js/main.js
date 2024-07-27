const apiKey = "236e47c223de8587a14ea29fa3551798";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const unitToggle = document.querySelector("#unitToggle");

let isMetric = true;

function convertToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function convertToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function convertToMph(kmh) {
    return kmh * 0.621371;
}

function convertToKmh(mph) {
    return mph / 0.621371;
}

function scrambleText(element, newText, duration) {
    let currentText = element.innerHTML;
    let maxLength = Math.max(currentText.length, newText.length);
    let scrambleDuration = duration || 500; 
    let scrambleInterval = 50; 
    let totalSteps = scrambleDuration / scrambleInterval;
    let step = 0;

    function randomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function updateText() {
        let updatedText = '';
        for (let i = 0; i < maxLength; i++) {
            if (i < currentText.length && i < newText.length) {
                if (Math.random() < (step / totalSteps)) {
                    updatedText += newText.charAt(i);
                } else {
                    updatedText += randomChar();
                }
            } else if (i < newText.length) {
                updatedText += randomChar();
            } else if (i < currentText.length) {
                updatedText += randomChar();
            }
        }
        element.innerHTML = updatedText;
        step++;

        if (step < totalSteps) {
            setTimeout(updateText, scrambleInterval);
        } else {
            element.innerHTML = newText;
        }
    }

    updateText();
}

function updateWeatherDisplay(data) {
    const cityElem = document.querySelector(".city");
    const weatherStatElem = document.querySelector(".weather-stat");
    const tempElem = document.querySelector(".temp");
    const humidityElem = document.querySelector(".humidity");
    const windElem = document.querySelector(".wind");

    scrambleText(cityElem, data.name, 500);
    scrambleText(weatherStatElem, data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1), 500);

    if (isMetric) {
        scrambleText(tempElem, Math.round(data.main.temp) + "°C", 500);
        scrambleText(windElem, Math.round(data.wind.speed) + " km/h", 500);
    } else {
        scrambleText(tempElem, Math.round(convertToFahrenheit(data.main.temp)) + "°F", 500);
        scrambleText(windElem, Math.round(convertToMph(data.wind.speed)) + " mi/h", 500);
    }

    scrambleText(humidityElem, data.main.humidity + "%", 500);

    if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "images/day_clear.png";
    } else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/day_rain.png";
    } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    weatherIcon.classList.add("glitch");
    weatherIcon.addEventListener('animationend', () => {
        weatherIcon.classList.remove("glitch");
    }, { once: true });
}

async function checkWeather(city) {
    const units = isMetric ? 'metric' : 'imperial';
    const response = await fetch(apiUrl + city + `&units=${units}&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        console.log(data);
        updateWeatherDisplay(data);
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

unitToggle.addEventListener("change", () => {
    isMetric = !isMetric;
    if (searchBox.value) {
        checkWeather(searchBox.value);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const storedUnitPreference = localStorage.getItem('isMetric');
    if (storedUnitPreference !== null) {
        isMetric = (storedUnitPreference === 'true');
    } else {
        isMetric = true;
    }
    unitToggle.checked = !isMetric; 
});