$(document).ready(function () {
    getWeather('Cairo');

    $('#cityForm').on('submit', function (e) {
        e.preventDefault();
        let city = $('#cityInput').val();
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city');
        }
    });

    function getWeather(city) {
        const apiKey = '19efb5d036ea4d02b54112754242806';
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log('API Response:', data);
                displayWeather(data, city);
            },
            error: function (error) {
                console.error('Error retrieving weather data:', error);
                alert('Error retrieving weather data');
            }
        });
    }

    function displayWeather(data, city) {
        $('#weatherResults').empty().show();
        const row = $('<div class="row no-gutters"></div>');
        data.forecast.forecastday.forEach((weather, index) => {
            const date = new Date(weather.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const fullDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            let extraDetails = '';
            let temperatureClass = '';
            let cityName = '';
            let weatherIcon = `<img src="${weather.day.condition.icon}" class="weather-icon" alt="Weather icon">`;
            if (index === 0) {
                extraDetails = `
                    <div class="icon-text">
                        <i class="fas fa-umbrella"></i>
                        <span>${weather.day.avghumidity}%</span>
                    </div>
                    <div class="icon-text">
                        <i class="fas fa-wind"></i>
                        <span>${weather.day.maxwind_kph} kph</span>
                    </div>
                `;
                temperatureClass = 'temperature';
                cityName = `<div class="city-name">${city}</div>`;
            }
            let cardClass = '';
            if (index === 0) {
                cardClass = 'first-card';
            } else if (index === 1) {
                cardClass = 'middle-card';
            } else if (index === 2) {
                cardClass = 'last-card';
            }

            const headerContent = index === 0 
                ? `<div class="day">${dayName}</div><div class="date">${fullDate}</div>` 
                : `<div>${dayName}</div>`;

            const weatherCard = `
                <div class="col-md-4">
                    <div class="card weather-card ${cardClass}">
                        <div class="card-header">
                            ${headerContent}
                        </div>
                        <div class="card-body">
                            ${cityName}
                            <p class="card-text ${temperatureClass}">${weather.day.avgtemp_c} °C</p>
                            ${weatherIcon}
                            <p class="card-text">${weather.day.condition.text}</p>
                            ${extraDetails}
                        </div>
                    </div>
                </div>
            `;
            row.append(weatherCard);
        });
        $('#weatherResults').append(row);

        const cardHeights = $('.weather-card').map(function() {
            return $(this).height();
        }).get();
        const maxHeight = Math.max.apply(null, cardHeights);
        $('.weather-card').height(maxHeight);
        
        const dateRows = $('.card-header').map(function() {
            return $(this).height();
        }).get();
        const maxDateRowHeight = Math.max.apply(null, dateRows);
        $('.card-header').height(maxDateRowHeight);
    }
});
