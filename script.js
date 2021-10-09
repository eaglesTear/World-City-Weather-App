// Get the element where the user client enters their chosen city
let userInputValue = document.querySelector(".input-value");

// Access elements where API data objects will be displayed
let city = document.querySelector(".city");
let country = document.querySelector(".country");
let mainWeather = document.querySelector(".main-weather");
let description = document.querySelector(".desc");
let showTemp = document.querySelector(".temp");
let feelsLike = document.querySelector(".feels-like");
let windSpeed = document.querySelector(".wind-speed");
let visibility = document.querySelector(".visibility");

// Get button elements showing metric or imperial units
let showMetricsBtn = document.querySelector(".show-metrics");
let showImperialsBtn = document.querySelector(".show-imperials");

// Initialise a boolean controlling the toggle between metric & imperial data
let metric = true;

// Display current date and time inside HTML for user client
function displayCurrentDate() {

    // Set new date object
    let today = new Date();
    // Grab element node for date insertion
    let dateTimeSection = document.querySelector(".date-time");
    // Output date first, then time
    dateTimeSection.innerHTML = `${today.toDateString()} ${today.toLocaleTimeString()}`;

}

// OpenWeatherMap API button. Display metric or imperial units
showMetricsBtn.addEventListener("click", function () {
    
    const apiKey = config.api_key;
    
    // Fetch data request
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInputValue.value}&APPID=${apiKey}`)

        // Convert data to json
        .then(res => res.json())
        // Main function: store / display data from API
        .then(data => {

            // Show weather card with data & display date and time
            showWeatherCard();
            displayCurrentDate();

            // Store API data in vars
            let cityName = data.name;
            let domain = data.sys.country;
            let weather = data.weather[0].main;
            let desc = data.weather[0].description;
            let temperature = data.main.temp;
            let feels_Like = data.main.feels_like;
            let wind_Speed = data.wind.speed;
            let visibilityDistance = data.visibility;

            // Output API data into weather card section
            city.innerHTML = cityName;
            country.innerHTML = domain;
            mainWeather.innerHTML = weather;
            description.innerHTML = desc;
            windSpeed.innerHTML = `${wind_Speed} kn`;
            visibility.innerHTML = `${visibilityDistance}m`;

            // Convert temp from K to C
            kelvinToCelsius(temperature, feels_Like);
            // Select bg image and icons that match weather conditions
            dynamic_MainWeather();

            // Display imperial units, resetting 'metric' bool to true
            showImperialsBtn.addEventListener("click", function () {

                metric = false;
                // Pass metric units through conversion function
                metricToImperial(temperature, feels_Like, wind_Speed, visibilityDistance);
                metric = true;
            });
        })

        // Error checking: monitor for server down, wrong city name entered etc.
        .catch(err => alert("Sorry. Either this city is not recognised, or the link to OpenWeatherMap has failed. \n\nPlease try again."));

});

// Immediately convert temps from K to C - main temp and feels like are parameters
function kelvinToCelsius(cTemp, cFeels) {

    // C = K - 273.15

    let convertKelvinToCelsius_Temp = cTemp - 273.15;
    let convertKelvinToCelsius_FeelsLike = cFeels - 273.15;
    showTemp.innerHTML = `${Math.round(convertKelvinToCelsius_Temp)}&deg;`;
    feelsLike.innerHTML = `Feels like: ${Math.round(convertKelvinToCelsius_FeelsLike)}&deg;`;

    // Call function & check temp in celsius (=> celsius value as parameter)
    addTempWarning(Math.round(convertKelvinToCelsius_FeelsLike));

}

// Technically converting K to imperial units here, despite function name
function metricToImperial(fTemp, fFeels, wind, vis) {

    // F = K * 9/5 - 459.67

    let convertKelvinToFahrenheit_Temp = fTemp * 9 / 5 - 459.67;
    let convertKelvinToFahrenheit_FeelsLike = fFeels * 9 / 5 - 459.67;
    showTemp.innerHTML = `${Math.round(convertKelvinToFahrenheit_Temp)}&#x2109;`;
    feelsLike.innerHTML = `Feels like: ${Math.round(convertKelvinToFahrenheit_FeelsLike)}&#x2109;`;

    // miles per hour = knots × 1.150779

    let convertKnotsToMph = wind * 1.150779;
    windSpeed.innerHTML = `${convertKnotsToMph.toFixed(2)} mph`;

    // miles = meters × 0.000621

    let convertMetresToMiles = vis * 0.000621;
    visibility.innerHTML = `${convertMetresToMiles.toFixed(2)} miles`;

}

// Change bg image depending on current weather conditions
function dynamic_MainWeather() {

    // Grab HTML icon image element
    let mainWeatherIcon = document.querySelector(".main-weather-icon");
    // Clear weather icons by default to allow others to be set
    mainWeatherIcon.removeAttribute("src");

    // Ensure any previous bg classes are removed before next data call
    removeClasses();

    // Set var to monitor what's displayed as the weather
    let weatherConditions = mainWeather.innerHTML;

    // Get body element ready for bg change 
    let addBgImage = document.body.classList;

    // Monitor main weather conditions & display dynamic bg, icons and alts
    switch (weatherConditions) {

        case "Clouds":
            addBgImage.add("cloud");
            mainWeatherIcon.setAttribute("src", "media/images/svg/002-cloud.svg");
            mainWeatherIcon.setAttribute("alt", "cloud icon");
            break;

        case "Rain":
        case "Drizzle":
            addBgImage.add("rain");
            mainWeatherIcon.setAttribute("src", "media/images/svg/001-rain.svg");
            mainWeatherIcon.setAttribute("alt", "rain icon");
            break;

        case "Clear":
            addBgImage.add("clear");
            mainWeatherIcon.setAttribute("src", "media/images/svg/007-clear.svg");
            mainWeatherIcon.setAttribute("alt", "clear icon");
            break;

        case "Snow":
            addBgImage.add("snow");
            mainWeatherIcon.setAttribute("src", "media/images/svg/003-snowflake.svg");
            mainWeatherIcon.setAttribute("alt", "snowflake icon");
            break;

        case "Thunderstorm":
            addBgImage.add("storm");
            mainWeatherIcon.setAttribute("src", "media/images/svg/008-lightning.svg");
            mainWeatherIcon.setAttribute("alt", "lightning icon");
            break;

        case "Fog":
        case "Smoke":
        case "Haze":
            addBgImage.add("fog");
            mainWeatherIcon.setAttribute("src", "media/images/svg/009-foggy.svg");
            mainWeatherIcon.setAttribute("alt", "foggy icon");
            break;

        case "Mist":
            addBgImage.add("mist");
            mainWeatherIcon.setAttribute("src", "media/images/svg/009-foggy.svg");
            mainWeatherIcon.setAttribute("alt", "foggy icon");
            break;

        default:
            console.log("No matching conditions found");
    }

}

// Removes all body classes to allow other bg images to be applied dynamically 
function removeClasses() {

    // Bg image array that contains dynamic classes for weather
    const BG_CLASS_LIST = ["cloud", "snow", "clear", "rain", "mist", "fog", "storm"];

    // Iterate through body classes and remove before other classes are applied
    for (let i = 0; i < BG_CLASS_LIST.length; i++) {
        document.body.classList.remove(BG_CLASS_LIST[i]);
    }

}

// Monitor temp & add warning icon for excessive heat or cold
function addTempWarning(feelsLike) {

    // Grab empty HTML img element / remove icon ready for next data call
    let warningIcon = document.querySelector(".weather-warning-icon");
    warningIcon.classList.remove("weather-warning-icon-display");

    // Guidance taken from British Met Office (www.metoffice.gov.uk/weather)

    // Monitors the celsius temp value. If over 32, show hot icon
    if (feelsLike > 32) {
        warningIcon.setAttribute("src", "media/images/svg/005-hot.svg");
        warningIcon.setAttribute("alt", "heat warning, red thermometer");
        // If 2 or less, show cold icon
    } else if (feelsLike <= 2) {
        warningIcon.setAttribute("src", "media/images/svg/006-cold.svg");
        warningIcon.setAttribute("alt", "cold warning, blue thermometer");
        // No icon necessary if none of the above are true
    } else {
        warningIcon.removeAttribute("src");
        warningIcon.removeAttribute("alt");
    }

}

// When city data is called, reveal the weather card for it
function showWeatherCard() {

    // Grab weather card element
    let weatherCard = document.querySelector(".weather-card");
    // Add the 'opaque' CSS class, increasing opacity to 1
    weatherCard.classList.add("opaque");

}