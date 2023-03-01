var weather = {
    apiKey: '0d2e4c04e75976c7222c6d49b49c14ba',
    fetchWeather: function (city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid=" 
        + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        var { name } = data;
        var { icon, description } = data.weather[0];
        var { temp, humidity } = data.main;
        var { speed } = data.wind;
        console.log(name,icon,description,temp,humidity,speed);
        document.querySelector('.city').innerText = 'Weather in' + name;
        document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + icon + '01n@2xpng';
    },
}