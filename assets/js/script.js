let searchCityEl = $("#search-form");
let cityInputEl = $("#city-input")
let stateInputEl = $("#state-input")
let mainCityEl = $("#what-city");
let mainTempEl = $("#main-temp");
let mainWindEl = $("#main-wind");
let mainHumidityEl = $("#main-humidity");
let mainUvEl = $("#main-uvindex");
let emojiEl = $("#emoji")
let fiveDaysEl = $("#fivedays")
let savedCityGroupEl= $("#saved-city-list")
let tempArr = [];

let getLatLong = function(city, state) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city +","+ state +",US&limit=5&appid=2eacf62cf199bafebe466a60a0158092"
    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                // getWeatherForecasts(data)
                getWeatherForecasts(data)
            })
        } else {
            alert("Error: City Not Found")
        }
    })
}


let getWeatherForecasts = function(location) {
    if(location.length === 0) {
        alert("No cities found")
    }
    let latitude = location[0].lat.toFixed(2)
    let longitude = location[0].lon.toFixed(2)
    console.log(latitude)
    console.log(longitude)

    
    let apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely&appid=2eacf62cf199bafebe466a60a0158092&units=imperial"
    fetch(apiUrl2).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data)
                displayForecasts(data)
                displayFiveDayCards(data)
            })
        }else {
            alert("Error: Forecasts Not Found")
        }
        })
    };

let displayForecasts = function(forecasts) {
    if (forecasts.length===0) {
        alert("No forecasts found")
        return;
    }

    let emoji =""
    let emojiDisplay = function() {
        if (forecasts.current.weather[0].id < 300){
            emoji="⛈"
        }
        else if (forecasts.current.weather[0].id >299 && forecasts.current.weather[0].id <500){
            emoji="🌦"
        }
        else if (forecasts.current.weather[0].id >499 && forecasts.current.weather[0].id <600){
            emoji="🌧"
        }
        else if (forecasts.current.weather[0].id >599 && forecasts.current.weather[0].id <700){
            emoji="❄"
        }
        else if (forecasts.current.weather[0].id >699 && forecasts.current.weather[0].id <800){
            emoji="🌫"
        }
        else if (forecasts.current.weather[0].id === 800){
            emoji="☀"
        }
        else if (forecasts.current.weather[0].id >799 && forecasts.current.weather[0].id <900){
            emoji="☁"
        }}
    emojiDisplay()
    
    let temperature = forecasts.current.temp.toFixed(0)
    let wind = forecasts.current.wind_speed
    let humidity = forecasts.current.humidity
    let uvindex = forecasts.current.uvi

    console.log(cityInputEl.val())
    console.log(stateInputEl.val())
    mainCityEl.text(cityInputEl.val() + ", " + stateInputEl.val() + " (" + moment().format('MM/DD/YY') + ") " + emoji )
    mainTempEl.text(temperature+ " °F")
    mainWindEl.text(wind+ " MPH")
    mainHumidityEl.text(humidity+ " %")
    mainUvEl.text(uvindex);

    if (uvindex<3) {
        mainUvEl.addClass("uv-favorable")
    }
    else if (uvindex>2.99 && uvindex<6) {
        mainUvEl.addClass("uv-moderate")
    }
    else if (uvindex>5.99) {
        mainUvEl.addClass("uv-severe")
    }
    console.log(temperature)

}


let displayFiveDayCards = function(forecast) {
    fiveDaysEl.html("")
    for (i=1; i<=6; i++){
        let futureTemperature = forecast.daily[i].temp.day
        let futureWind = forecast.daily[i].wind_speed
        let futureHumidity = forecast.daily[i].humidity
        let futureWeatherId = forecast.daily[i].weather[0].id

        let forecastCardEl = document.createElement("div")
        forecastCardEl.classList = "weather-card"

        let forecastDay = document.createElement("p")
        forecastDay.classList = "font-weight-bold"
        $(forecastDay).text(moment().add(i, 'days').format('MM/DD/YY'))
        forecastCardEl.appendChild(forecastDay);

        let forecastEmojiEl = document.createElement("p")
        forecastEmojiEl.classList = "font-20"
        let emoji =""
        let emojiDisplay = function() {
            if (futureWeatherId < 300){
                emoji="⛈"
            }
            else if (futureWeatherId >299 && futureWeatherId <500){
                emoji="🌦"
            }
            else if (futureWeatherId >499 && futureWeatherId <600){
                emoji="🌧"
            }
            else if (futureWeatherId >599 && futureWeatherId <700){
                emoji="❄"
            }
            else if (futureWeatherId >699 && futureWeatherId <800){
                emoji="🌫"
            }
            else if (futureWeatherId === 800){
                emoji="☀"
            }
            else if (futureWeatherId >799 && futureWeatherId <900){
                emoji="☁"
            }}
        emojiDisplay()
        $(forecastEmojiEl).text(emoji)
        forecastCardEl.appendChild(forecastEmojiEl);


        let forecastTemp = document.createElement("p")
        $(forecastTemp).text("Temp:" + futureTemperature.toFixed(0) + " °F")
        forecastCardEl.appendChild(forecastTemp);


        let forecastWind = document.createElement("p")
        $(forecastWind).text("Wind: " + futureWind.toFixed(0) + " MPH")
        forecastCardEl.appendChild(forecastWind);


        let forecastHumidity = document.createElement("p")
        $(forecastHumidity).text("Humidity: " + futureHumidity + " %")
        forecastCardEl.appendChild(forecastHumidity);

        fiveDaysEl.append(forecastCardEl)
    }
}

let formSubmitHandler = function(event) {
    event.preventDefault();
    let cityName = cityInputEl.val();
    let stateName = stateInputEl.val();

    tempArr.push({
        city: cityName,
        state: stateName
    });
    localStorage.setItem("cities", JSON.stringify(tempArr))

    if (cityName && stateName) {
        getLatLong(cityName, stateName);
        cityInputEl.value = ""
        stateInputEl.value = ""
    } else {
        alert("Please enter both city name and state name in US")
    }
    citySaveList(cityName, stateName)
}

let citySaveList = function(city, state) {
    let citySearched = document.createElement("button")
    citySearched.classList = "city-list btn btn-secondary"
    
    $(citySearched).text(city + ", " + state)
    savedCityGroupEl.append(citySearched)
}

let fillUpInput = function() {
    let info = $(this)[0].outerText
    let citystate = info.split(", ")
    console.log(citystate[0])
    console.log(citystate[1])

    city = citystate[0]
    state = citystate[1]

    cityInputEl.val(city)
    stateInputEl.val(state)

    getLatLong(city, state)
}

var loadTasks = function() {
    tempArr = JSON.parse(localStorage.getItem("cities"))
    for (i=0; i<tempArr.length; i++) {
        citySaveList(tempArr[i].city, tempArr[i].state)
    }
}
loadTasks()

searchCityEl.on("submit", formSubmitHandler)

$(".city-list").click(fillUpInput)
