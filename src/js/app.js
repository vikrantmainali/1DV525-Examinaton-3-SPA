import Chat from './Chat.js'
import PairsGame from './PairsGame.js'
import Weather from './Weather.js'

const init = () => {
  initListeners()
}

const initListeners = () => {
  const chatButton = document.getElementById('Chat')
  if (chatButton) {
    chatButton.addEventListener('click', () => { // Upon clicking chat icon in the bottom nagivation bar
      const chatInstance = new Chat() // Create new chat instance
      console.log('Chat instance created: ' + chatInstance)
    })
  }

  const pairsGameButton = document.getElementById('PairsGame')
  if (pairsGameButton) {
    pairsGameButton.addEventListener('click', () => { // Upon clicking pairs game icon in the bottom nagivation bar
      const pairsGameInstance = new PairsGame() // Create new pairs game instance
      console.log('Pairs game instance created: ' + pairsGameInstance)
    })
  }

  const weatherButton = document.getElementById('Weather')
  if (weatherButton) {
    weatherButton.addEventListener('click', () => { // Upon clicking weather icon in the bottom nagivation bar
      const weatherInstance = new Weather() // Create new weather instance
      console.log('Weather instance created: ' + weatherInstance)
    })
  }
}

window.addEventListener('load', init)
