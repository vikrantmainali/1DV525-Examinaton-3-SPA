const BasicWindow = require('./BasicWindow.js')

class PairCard { // Inner class to create card for the game
  constructor (id, parent, callback) {
    this.id = id
    this.parent = parent
    this.callback = callback
    this.isActive = true

    this.container = this.createCardContainer()
    this.parent.appendChild(this.container)

    this.hideCard()
    this.bindMethods()
    this.addEventListeners()
  }

  createCardContainer () { // Create card container element
    const container = document.createElement('img')
    container.setAttribute('class', 'pairsCard')
    container.classList.add('hidden')
    return container
  }

  bindMethods () {
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  addEventListeners () {
    this.container.addEventListener('click', this.handleClick)
  }

  handleClick (e) { // Handle mouse click event on cards
    e.preventDefault()
    if (this.isActive) {
      this.showCard()
      this.callback(this)
    }
  }

  handleKeyPress () { // Handle key press event on cards
    if (this.isActive) {
      this.showCard()
      this.callback(this)
    }
  }

  removeClick () {
    this.container.removeEventListener('click', this.handleClick)
  }

  showCard () { // Flip card to reveal corresponding image
    this.isActive = false
    const src = `./../image/PairsGameIcons/${this.id}.png`
    this.rotateCard(src)
  }

  hideCard () { // Flip card back to show the default hidden image
    console.log('Hiding card:', this)
    const src = './../image/PairsGameIcons/Pairs-Hidden.png'
    this.container.classList.add('hidden')
    this.rotateCard(src)
  }

  rotateCard (src) { // Simulate card flip animation on the X axis
    this.container.classList.add('spinOnXAxisClockwise')
    setTimeout(() => {
      this.container.setAttribute('src', src)
      this.container.classList.remove('spinOnXAxisClockwise')
      this.container.classList.add('spinOnXAxisCouterClockwise')
      setTimeout(() => this.container.classList.remove('spinOnXAxisCouterClockwise'), 200)
    }, 200)
  }

  disable () { // Used to disable card
    this.isActive = false
  }

  enable () { // Used to enable card
    this.isActive = true
  }
}

class PairsGame extends BasicWindow {
  constructor () {
    super()
    this.cards = []
    this.turnedCards = []
    this.turns = 0
    this.cardObjects = []
    this.selectedCard = null
    this.container.classList.add('pairs')
    this.bindMethods()
    this.showSelectionScreen()
    this.addIconToWindow('PairsGame')
  }

  bindMethods () {
    this.handleClick = this.handleClick.bind(this)
    this.enableCards = this.enableCards.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
    this.startGame = this.startGame.bind(this)
  }

  createElement (tag, className, innerHTML = '', attributes = {}) { // Create DOM element
    const element = document.createElement(tag)
    element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
    return element
  }

  showSelectionScreen () { // Set difficulty (grid-size) for the game
    this.selectionScreen = this.createElement('div', 'selection-screen')
    this.selectionScreen.innerHTML = `
      <h2>Select Board Size</h2>
      <button data-rows="2" data-cols="2">2x2</button>
      <button data-rows="2" data-cols="4">2x4</button>
      <button data-rows="4" data-cols="4">4x4</button>
    `
    this.container.appendChild(this.selectionScreen)
    this.selectionScreen.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const rows = parseInt(e.target.getAttribute('data-rows'), 10)
        const cols = parseInt(e.target.getAttribute('data-cols'), 10)
        this.startGame(rows, cols)
      }
    })
  }

  startGame (rows, cols) { // Start game with the picked grid size
    this.rows = rows
    this.cols = cols
    this.container.removeChild(this.selectionScreen)
    this.initializeGame()
  }

  initializeGame () { // Initialize game by loading cards and adding keyboard navigations
    this.loadCards()
    this.addKeyboardNavigation()
  }

  loadCards () { // Loads the cards into the game
    const pairsGameIcon = this.container.querySelector('.pairsGameIcon')
    if (pairsGameIcon) {
      pairsGameIcon.style.display = 'inline-block'
    }
    const numPairs = (this.rows * this.cols) / 2
    this.cards = []
    this.cardObjects = []
    this.turnedCards = []
    this.turns = 0

    for (let i = 1; i <= numPairs; i++) {
      this.cards.push(i, i)
    }

    this.shuffleCards()
    this.cards.forEach(cardId => {
      const card = new PairCard(cardId, this.innerContainer, this.handleClick)
      this.cardObjects.push(card)
    })

    if (this.cardObjects.length > 0) {
      this.selectedCard = this.cardObjects[0]
      this.selectedCard.container.classList.add('selectedCard')
    }
  }

  handleClick (card) {
    this.turnedCards.push(card)
    if (this.turns < 1) {
      this.turns++
    } else {
      this.disableAllCards()
      this.checkForMatch()
      this.turns = 0
      setTimeout(this.enableCards, 1000)
    }
  }

  disableAllCards () {
    this.cardObjects.forEach(card => card.disable())
  }

  enableCards () {
    this.cardObjects.forEach(card => card.enable())
  }

  checkForMatch () { // Check if the turned cards match
    if (this.turnedCards[0].id === this.turnedCards[1].id) {
      this.handleMatch()
    } else {
      this.handleMismatch()
    }
  }

  handleMatch () { // Remove click event listeners from matched cards
    this.turnedCards[0].removeClick()
    this.turnedCards[1].removeClick()
    this.cardObjects = this.cardObjects.filter(card => !this.turnedCards.includes(card))
    this.turnedCards = []
  }

  handleMismatch () { // Hide turned cards with delay if they don't match
    setTimeout(() => {
      this.turnedCards.forEach(card => card.hideCard())
      this.turnedCards = []
    }, 1000)
  }

  shuffleCards () { // Randomly shuffle the cards
    this.cards.sort(() => Math.random() - 0.5)
  }

  addKeyboardNavigation () {
    document.addEventListener('keydown', this.handleKeypress)
  }

  handleKeypress (e) { // Handle key press events for keyboard navigation and card selection
    const moveMap = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowUp: -this.cols,
      ArrowDown: this.cols
    }

    if (moveMap[e.key] !== undefined) {
      this.moveSelection(moveMap[e.key])
    } else if (e.key === ' ') {
      this.selectedCard.handleKeyPress()
    }
  }

  moveSelection (offset) { // Move card selection based on keyboard input
    const currentIndex = this.cardObjects.indexOf(this.selectedCard)
    const newIndex = (currentIndex + offset + this.cardObjects.length) % this.cardObjects.length
    this.selectedCard.container.classList.remove('selectedCard')
    this.selectedCard = this.cardObjects[newIndex]
    this.selectedCard.container.classList.add('selectedCard')
  }
}

module.exports = PairsGame
