const apiKey = "236e47c223de8587a14ea29fa3551798";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

function scrambleText(element, newText, duration) {
    let currentText = element.innerHTML;
    let maxLength = Math.max(currentText.length, newText.length);
    let scrambleDuration = duration || 100; 
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

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        var data = await response.json();

        console.log(data);

        const cityElem = document.querySelector(".city");
        const weatherStatElem = document.querySelector(".weather-stat");
        const tempElem = document.querySelector(".temp");
        const humidityElem = document.querySelector(".humidity");
        const windElem = document.querySelector(".wind");

        scrambleText(cityElem, data.name, 1000);
        scrambleText(weatherStatElem, data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1), 1000);
        scrambleText(tempElem, Math.round(data.main.temp) + "°C", 1000);
        scrambleText(humidityElem, data.main.humidity + "%", 1000);
        scrambleText(windElem, data.wind.speed + " km/h", 1000);

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
}
searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
});