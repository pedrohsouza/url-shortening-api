// open-close menu when the toggle icon is clicked
const menu = document.querySelector('.menu')
const toggle = document.querySelector('nav .toggle')

toggle.addEventListener('click', function () {
  menu.classList.toggle('show')
  toggle.classList.toggle('icon-menu-clicked')
})

// hide the menu when a menu item is clicked
const links = document.querySelectorAll('nav ul li a')

for (const link of links) {
  link.addEventListener('click', function () {
    menu.classList.remove('show')
    toggle.classList.toggle('icon-menu-clicked')
  })
}

// Hide the error message when the text input is focused
const textInput = document.querySelector('#text_input')
const errorMessage = document.querySelector('.form span')

textInput.addEventListener('focus', () => {
  textInput.classList.remove('text-input-error')
  errorMessage.style.display = 'none'
})

// Capture the url in the form
const btn = document.querySelector('#send')

btn.addEventListener('click', function (e) {
  e.preventDefault()
  const urlInput = textInput.value

  if (urlInput === '') {
    textInput.classList.add('text-input-error')
    errorMessage.innerText = 'Please add a link'
    errorMessage.style.display = 'block'
    console.log('Please add a link')
  } else {
    document.querySelector('#text_input').value = ''
    // console.log(urlInput)

    const api_url = 'https://api.shrtco.de/v2/shorten?url='

    const url = api_url + urlInput

    // connectToApi(url)
    //   .then(response => {
    //     console.log('yay')
    //   })
    //   .catch(error => {
    //     console.log('error!')
    //     console.log(error)
    //   })

    connectToApi(url).then(data => {
      storeData(data)
      createCard(data)
    })
  }
})

async function connectToApi(url) {
  const response = await fetch(url)
  const data = await response.json()

  if (data.ok) {
    return data
  } else {
    const { error } = data

    textInput.classList.add('text-input-error')
    errorMessage.innerText = error
    errorMessage.style.display = 'block'
  }
}

function storeData(data) {
  // const { code } = data.result

  const dateTime = getDateTime()

  // let id = `card-${dateTime}-${code}`
  let id = `card-${dateTime}`

  const stringfiedData = JSON.stringify(data)
  window.localStorage.setItem(id, stringfiedData)
}

function getData(id) {
  let stringfiedData = window.localStorage.getItem(id)
  let data = JSON.parse(stringfiedData)
  return data
}

window.onload = () => {
  if (window.localStorage.length > 0) {
    const sortedArray = sortLocalStorage()
    loadFromStorage(sortedArray)
  }
}

function loadFromStorage(sortedArray) {
  // const storage = window.localStorage
  let data
  // for (let id in storage) {
  //   data = getData(id)
  //   createCard(data)
  // }
  for (let i = 0; i < sortedArray.length; i++) {
    data = getData(sortedArray[i])
    createCard(data)
  }
}

function sortLocalStorage() {
  const storage = window.localStorage
  const localStorageArray = []
  for (let i = 0; i < storage.length; i++) {
    localStorageArray[i] = storage.key(i)
  }
  const sortedArray = localStorageArray.sort()
  console.log(sortedArray)
  return sortedArray
}

function createElement(
  elementType,
  textContent,
  className,
  idName,
  parentNode
) {
  const element = document.createElement(elementType)

  if (elementType === 'a') {
    element.setAttribute('href', textContent)
    element.setAttribute('target', '_blank')
  }

  if (textContent != '') {
    element.textContent = textContent
  }

  if (className != '') {
    element.className = className
  }

  if (idName != '') {
    element.id = idName
  }

  if (className === 'button') {
    // element.setAttribute('onClick', 'copyToClipboard()')

    element.addEventListener('click', function () {
      // element.classList.toggle('clipboard-button-clicked')
      element.classList.add('clipboard-button-clicked')
      element.innerText = 'Copied!'
      copyToClipboard(parentNode)
      setTimeout(async () => {
        await element.classList.remove('clipboard-button-clicked')
        element.innerText = 'Copy'
      }, 900)
    })
  }

  // document.querySelector(parentNode).appendChild(element)

  if (elementType === 'div' && className === 'url-info-card') {
    document.querySelector(parentNode).prepend(element)
  } else {
    document.querySelector(parentNode).appendChild(element)
  }
}

function createCard(data) {
  // let { code, full_short_link, original_link } = data.result
  let { full_short_link, original_link } = data.result
  const dateTime = getDateTime()

  // let id = `card-${dateTime}-${code}`
  let id = `card-${dateTime}`

  createElement('div', '', 'url-info-card', id, '.url-short')
  createElement('p', original_link, '', '', `#${id}`)
  createElement('div', '', 'div', '', `#${id}`)
  createElement('a', full_short_link, '', '', `#${id}`)
  createElement('button', 'Copy', 'button', '', `#${id}`)
}

function copyToClipboard(cardId) {
  const copyText = document.querySelector(`${cardId} a`).innerText
  navigator.clipboard.writeText(copyText)
}

function getDateTime() {
  let today = new Date()
  let date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  let time =
    today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds()

  let dateTime = date + '-' + time

  return dateTime
}
