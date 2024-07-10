const BasicWindow = require('./BasicWindow.js')

class Chat extends BasicWindow {
  constructor (callback) {
    super(callback)
    this.container.classList.add('chat-window')
    this.username = ''
    this.webSocket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')

    this.bindMethods()

    this.initializeChat()
    this.addIconToWindow('Chat')
  }

  bindMethods () {
    this.handleSubmit = this.handleSubmit.bind(this)
    this.logWebSocketOpen = this.logWebSocketOpen.bind(this)
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this)
    this.saveUsername = this.saveUsername.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.toggleEmojiPanel = this.toggleEmojiPanel.bind(this)
  }

  initializeChat () { // Initialize chat by creating elements and checking for a stored username
    this.createChatElements()
    const storedUsername = window.localStorage.getItem('chatUsername')
    if (storedUsername) {
      this.username = storedUsername
      this.setupChatUI()
      this.addEventListeners()
    } else {
      this.promptForUsername()
    }
  }

  createChatElements () { // Create the elements that will be used to display in the chat window
    this.form = this.createElement('form', 'chat-form')
    this.emojiButton = this.createElement('div', 'emoji-button', '😃')
    this.emojiContainer = this.createElement('div', 'emoji-container')
    this.sendButton = this.createElement('button', 'send-button ')
    this.messageInput = this.createElement('input', 'message-input', null, { type: 'text' })
    this.form.append(this.messageInput, this.emojiButton, this.sendButton)
    this.container.append(this.emojiContainer, this.form)

    this.fetchAndPopulateEmojis()
  }

  createElement (tag, className, innerHTML = '', attributes = {}) { // Create DOM elements
    const element = document.createElement(tag)
    element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))
    return element
  }

  promptForUsername () { // Prompt for username if it's not stored
    this.form.classList.add('username-form')
    this.form.addEventListener('submit', this.saveUsername)

    const instructionText = this.createElement('p', 'instruction-text', 'Please set a username:')
    this.form.insertBefore(instructionText, this.messageInput)

    const emojiButton = this.form.querySelector('.emoji-button')
    if (emojiButton) {
      emojiButton.remove()
    }
  }

  saveUsername (e) { // Store the username and setup the chat UI
    e.preventDefault()
    if (this.messageInput.value.trim()) {
      this.username = this.messageInput.value.trim()
      window.localStorage.setItem('chatUsername', this.username)
      this.setupChatUI()
      this.form.classList.remove('username-form')
      const instructionText = this.form.querySelector('.instruction-text')
      if (instructionText) {
        instructionText.remove()
      }
      this.messageInput.value = ''
      this.form.removeEventListener('submit', this.saveUsername)
      this.addEventListeners()
    }
  }

  setupChatUI () {
    this.innerContainer.classList.add('chat-messages')
    this.messageList = this.createElement('ul', 'message-list')
    this.innerContainer.appendChild(this.messageList)
  }

  addEventListeners () {
    this.webSocket.addEventListener('open', this.logWebSocketOpen)
    this.webSocket.addEventListener('message', (e) => this.handleWebSocketMessage(JSON.parse(e.data)))
    this.form.addEventListener('submit', this.handleSubmit)
    this.emojiButton.addEventListener('click', this.toggleEmojiPanel)
    document.addEventListener('click', (event) => {
      if (!this.emojiContainer.contains(event.target) && !this.emojiButton.contains(event.target)) {
        this.closeEmojiContainer()
      }
    })
  }

  logWebSocketOpen () {
    console.log('Connected to WebSocket server')
  }

  handleSubmit (e) {
    e.preventDefault()
    this.sendMessage()
  }

  sendMessage () { // Send message via websocket
    const message = this.messageInput.value.trim()
    if (message) {
      this.webSocket.send(JSON.stringify({
        type: 'message',
        data: message,
        username: this.username,
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
      this.messageInput.value = ''
    }
  }

  handleWebSocketMessage (data) { // Handle incoming messages
    if (data.type === 'message') {
      const messageItem = this.createElement('li', 'message-item', `${data.username}: ${data.data}`)
      this.messageList.appendChild(messageItem)
    }
  }

  fetchAndPopulateEmojis () { // Fetch emojis from json file and populate emojis
    fetch('resources/emojis.json')
      .then(response => response.json())
      .then(emojis => {
        emojis.forEach(emoji => {
          const emojiElement = this.createElement('span', 'emoji', emoji)
          emojiElement.addEventListener('click', () => {
            this.messageInput.value += emoji
          })
          this.emojiContainer.appendChild(emojiElement)
        })
      })
      .catch(error => console.error('Error loading emojis:', error))
  }

  toggleEmojiPanel (e) { // Toggle visibility of emoji panel
    e.stopPropagation()
    if (this.emojiContainer.style.display === 'block') {
      this.closeEmojiContainer()
    } else {
      this.emojiContainer.style.display = 'block'
    }
  }

  closeEmojiContainer () { // Close the emoji container
    this.emojiContainer.style.display = 'none'
  }
}

module.exports = Chat
