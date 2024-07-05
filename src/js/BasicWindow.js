class BasicWindow {
  constructor () {
    this.container = this.createDivClass('window')
    this.innerContainer = this.createDivClass('windowContent')
    this.nav = this.createDivClass('windowToolbar')

    this.addCloseIconToWindow()

    this.appendElements()

    this.addListeners()

    this.setPosition()
  }

  static initializePosition () { // Initializing a start position for window to help calculate offsets while stacking
    if (!BasicWindow.nextPosition) {
      BasicWindow.nextPosition = { x: 0, y: 0 }
    }
  }

  setPosition () { // Function to stack new window instances
    const offset = 20
    const maxOffset = 300

    // Set the position
    this.container.style.left = `${BasicWindow.nextPosition.x}px`
    this.container.style.top = `${BasicWindow.nextPosition.y}px`

    // Update position for next window
    BasicWindow.nextPosition.x += offset
    BasicWindow.nextPosition.y += offset

    // Reset position
    if (BasicWindow.nextPosition.x > maxOffset || BasicWindow.nextPosition.y > maxOffset) {
      BasicWindow.nextPosition.x = 0
      BasicWindow.nextPosition.y = 0
    }
  }

  addCloseIconToWindow () { // Create close icon to add to each window toolbar
    this.closeIcon = document.createElement('img')
    this.closeIcon.setAttribute('class', 'closeIcon')
    this.closeIcon.src = './../image/PWD-CloseIcon.png'
    this.nav.appendChild(this.closeIcon)
  }

  addIconToWindow (app) {
    if (app === 'Chat') {
      this.chatIcon = document.createElement('img') // Add chat icon to left side of each chat window
      this.chatIcon.setAttribute('class', 'chatIcon')
      this.chatIcon.src = './../image/PWD-Chat.png'
      this.nav.appendChild(this.chatIcon)
    }
    if (app === 'PairsGame') {
      this.pairsGameIcon = document.createElement('img') // Add pairsgame icon to left side of each pairs game window
      this.pairsGameIcon.setAttribute('class', 'pairsGameIcon')
      this.pairsGameIcon.src = './../image/PWD-PairsGame.png'
      this.nav.appendChild(this.pairsGameIcon)
    }
    if (app === 'Weather') {
      this.weatherIcon = document.createElement('img') // Add weather icon to left side of each weather window
      this.weatherIcon.setAttribute('class', 'weatherIcon')
      this.weatherIcon.src = './../image/PWD-Weather.png'
      this.nav.appendChild(this.weatherIcon)
    }
  }

  createDivClass (className) {
    const div = document.createElement('div')
    div.classList.add(className)
    return div
  }

  appendElements () {
    this.container.appendChild(this.nav)
    this.container.appendChild(this.innerContainer)
    document.body.appendChild(this.container)
  }

  addListeners () {
    this.closeIcon.addEventListener('click', this.closeWindow.bind(this))
    this.nav.addEventListener('mousedown', this.onDragStart.bind(this))
    this.container.addEventListener('click', this.setToFront.bind(this))
  }

  closeWindow () {
    document.body.removeChild(this.container)
    console.log('Closed window')
    this.closeIcon.removeEventListener('click', this.closeWindow)
  }

  onDragStart (e) {
    this.isDragging = true // Dragging state flag
    this.startX = e.clientX // Starting X position
    this.startY = e.clientY // Starting Y position
    this.container.style.cursor = 'grabbing'

    // Add event listeners for drag move and mouse release
    document.addEventListener('mousemove', this.onDragMove.bind(this))
    document.addEventListener('mouseup', this.onDragRelease.bind(this))
  }

  onDragMove (e) {
    if (!this.isDragging) {
      return
    }

    const changeInX = e.clientX - this.startX // Change in X position
    const changeInY = e.clientY - this.startY // Change in Y position

    // Update window element position
    this.container.style.left = `${this.container.offsetLeft + changeInX}px`
    this.container.style.top = `${this.container.offsetTop + changeInY}px`

    this.startX = e.clientX // Update with new starting position
    this.startY = e.clientY
  }

  onDragRelease (e) {
    if (!this.isDragging) {
      return
    }

    this.isDragging = false // Reset dragging state
    this.container.style.cursor = 'default'

    // Remove event listeners for drag move and mouse release
    document.removeEventListener('mousemove', this.onDragMove)
    document.removeEventListener('mouseup', this.onDragRelease)
  }

  setToFront () { // Brings window to front and puts it in focus
    this.setFocus()
    const index = new Date().getTime() / 1000
    this.container.style.zIndex = Math.floor(index)
  }

  unFocus () {
    this.focus = false
  }

  setFocus () {
    this.focus = true
  }
}

BasicWindow.initializePosition()

module.exports = BasicWindow
