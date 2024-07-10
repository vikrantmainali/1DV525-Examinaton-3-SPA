const BasicWindow = require('./BasicWindow.js')

class Weather extends BasicWindow {
  constructor (callback) {
    super(callback)
    this.container.classList.add('weather-window')

    this.apiKey = ''
    this.baseUrl = ''

    this.bindMethods()
    this.createWeatherElements()
    this.addEventListeners()

    this.addIconToWindow('Weather')

    this.loadConfig()
  }

  bindMethods () {
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.fetchWeatherData = this.fetchWeatherData.bind(this)
  }

  createWeatherElements () { // Create the elements that will be used to display in the weather window
    this.form = this.createElement('form', 'weather-form')
    this.weatherDisplay = this.createElement('div', 'weather-display')
    this.weatherDisplay.style.display = 'none'
    this.locationInput = this.createElement('input', 'location-input', '', { type: 'text', placeholder: 'Enter location' })
    this.submitButton = this.createElement('button', 'submit-button', 'Get Weather')

    this.form.append(this.locationInput, this.submitButton)
    this.container.append(this.form, this.weatherDisplay)
  }

  createElement (tag, className, innerHTML = '', attributes = {}) { // Crete DOM elements
    const element = document.createElement(tag)
    element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
    return element
  }

  addEventListeners () {
    this.form.addEventListener('submit', this.handleFormSubmit)
  }

  loadConfig () { // Fetch API Key and base url from config file instead of hard-coding it
    fetch('resources/config.json')
      .then(response => response.json())
      .then(config => {
        this.apiKey = config.apiKey
        this.baseUrl = config.baseUrl
      })
      .catch(error => console.error('Error loading config:', error))
  }

  handleFormSubmit (event) {
    event.preventDefault()
    const location = this.locationInput.value.trim()
    if (location) {
      this.fetchWeatherData(location)
    }
  }

  fetchWeatherData (location) { // Send request towards external weather API with required payload
    const url = `${this.baseUrl}?q=${location}&days=1&key=${this.apiKey}`
    fetch(url)
      .then(response => response.json())
      .then(data => this.displayWeather(data))
      .catch(error => console.error('Error fetching weather data:', error))
  }

  displayWeather (data) { // Extract necessary information from response like name, region, country, weather condition, temperature etc
    const { name, region, country } = data.location
    const { temp_c: tempC, condition } = data.current
    const { maxtemp_c: maxTempC, mintemp_c: minTempC } = data.forecast.forecastday[0].day

    this.weatherDisplay.innerHTML = `
      <h2>Weather for ${name}, ${region}, ${country}</h2>
      <p>Condition: ${condition.text} <img src="https:${condition.icon}" alt="${condition.text}"></p>
      <p>Current Temperature: ${tempC}°C</p>
      <p>Max Temperature: ${maxTempC}°C</p>
      <p>Min Temperature: ${minTempC}°C</p>
    `
    this.weatherDisplay.style.display = 'block'
  }
}

module.exports = Weather
