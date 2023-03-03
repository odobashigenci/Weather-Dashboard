// array of var weather
var weather = {
    apiKey: '0d2e4c04e75976c7222c6d49b49c14ba',

    // get Coordinates
    getCoords: function (city) {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`).then(res => res.json()).then(data => this.fetchWeather(data))
    },
    // fetching the weather url
    fetchWeather: function (data){
        var lat = data[0].lat
        var lon = data[0].lon
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric` 
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },

    // displaying the weather on screen
    displayWeather: function(data){
        console.log(data)
        var cityName  = data.city.name;
        // console.log(cityName)
        var  description = data.list[0].weather[0].description;
        var  icon = data.list[0].weather[0].icon;
        var  temp = data.list[0].main.temp;
        var  humidity = data.list[0].main.humidity;
        var  speed = data.list[0].wind.speed;

    //selecting elements from html file
        document.querySelector('.city').innerText = 'Weather in ' + cityName;
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = Math.floor(temp) + '°C';
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
        document.querySelector('.wind').innerText = 'Wind speed ' + Math.floor(speed) + ' km/h';
        document.querySelector('.weather').classList.remove('loading')
        document.body.style.backgroundImage = "url('https://source.unsplash.com/2000x1000/?" + cityName + "')";
        this.fiveDay(data)
    },

    //setting up the 5 day forecast function
fiveDay: function (data) {
    var fiveDayContainer = document.querySelector('.fiveDay')
    fiveDayContainer.innerHTML = '';
for (var i = 7; i < data.list.length; i += 7) {
    var div = document.createElement('div')
    div.className = ('col')
    var iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
    div.innerHTML = `<p> ${data.list[i].dt_txt}<p>
    <img src="${iconUrl}" alt="Weather Icon">
    <p> Temperature: ${Math.floor(data.list[i].main.temp)}°C </p>
    <p> Humidity: ${data.list[i].main.humidity}% </p>
    <p> Wind Speed: ${Math.floor(data.list[i].wind.speed)} km/h </p>`
    fiveDayContainer.append(div)
      
}
},

    // getting input value from search bar
    search: function(){
        this.getCoords(document.querySelector('.search-bar').value);
},
}

// setting up the search history and saving it to localstorage
var checkHistory = JSON.parse(localStorage.getItem('search')) || [];
var historyEl = document.querySelector('.history')
function searchCity() {
    var searchItem = searchBar.value;
    checkHistory.push(searchItem);
    localStorage.setItem('search', JSON.stringify(checkHistory));
    showHistory();
    weather.search();
}

//keeps the history on screen after page reload
window.addEventListener('load', function() {
    showHistory();
  });

// setting up the search button to render the info about the required city, 
// and return the value on screen from local storage
var searchBtn = document.querySelector('.search button'); 
searchBtn.addEventListener('click', function(){
    var searchItem = searchBar.value;
    checkHistory.push(searchItem);
    showHistory();
    
       weather.search(); 
});

//setting up the Enter key from keyboard to do the same job as the search button
var searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('keyup', function(event){
    if(event.key == 'Enter'){
        searchCity();
    }
});

//adding Clear History button on screen after the history is saved and rendered,
//and removing it after the history is clear
function showHistory() {
    historyEl.innerHTML = '';
    if (checkHistory.length > 0) {
      var historyButton = document.createElement('button');
      historyButton.classList.add('history-btn')
      historyButton.textContent = 'Clear History';
      historyButton.addEventListener('click', function() {
        localStorage.clear();
        checkHistory = [];
        showHistory();
      });
      historyEl.append(historyButton);
    }

 //adding html elements to display history on screen   
    for (var j = 0; j < checkHistory.length; j++) {
      var historyCity = document.createElement('input');
      historyCity.classList.add('city-history');
      historyCity.setAttribute('type', 'text');
      historyCity.setAttribute('readonly', true);
      historyCity.setAttribute('value', checkHistory[j]);
      historyCity.addEventListener('click', function() {
        weather.getCoords(this.value);
      });
      historyEl.append(historyCity);
    }
    if (checkHistory.length === 0) {
      historyButton.remove();
    }
  }

// calling the function
weather.getCoords('New York')