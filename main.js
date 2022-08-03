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

// Capture the url in the form
const btn = document.querySelector('#send')

btn.addEventListener('click', function (e) {
  e.preventDefault()

  const urlInput = document.querySelector('#name').value
  // console.log(urlInput)

  const api_url = 'https://api.shrtco.de/v2/shorten?'

  const url = api_url + 'url=' + urlInput

  connectToApi(url)
    .then(response => {
      console.log('yay')
    })
    .catch(error => {
      console.log('error!')
      console.log(error)
    })
})

let idNumber = 0

async function connectToApi(url) {
  const response = await fetch(url)
  const data = await response.json()
  const { code, full_short_link, original_link } = data.result

  console.log(full_short_link)
  console.log(original_link)

  console.log(data)

  let id = `div-${idNumber}-${code}`

  createElement('div', '', 'url-info-card', id, '.url-short')
  createElement('p', original_link, '', '', `#${id}`)
  createElement('div', '', 'div', '', `#${id}`)
  createElement('a', full_short_link, '', '', `#${id}`)
  createElement('button', 'Copy', 'button', '', `#${id}`)

  idNumber++
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
      element.classList.toggle('clipboard-button-clicked')

      if (element.innerText === 'Copy') {
        element.innerText = 'Copied!'
      } else {
        element.innerText = 'Copy'
      }

      copyToClipboard(parentNode)
    })
  }

  document.querySelector(parentNode).appendChild(element)
}

function copyToClipboard(parentNode) {
  // const copyText = document.querySelector(`${parentNode} a`).innerText
  // navigator.clipboard.writeText(copyText)
  var copyText = document.querySelector(`${parentNode} a`)

  var range = document.createRange()
  range.selectNode(copyText)
  window.getSelection().addRange(range)

  try {
    document.execCommand('copy')
  } catch (err) {
    ChromeSamples.log('execCommand Error', err)
  }
  window.getSelection().removeAllRanges()

  // window.clipboardData.setData('Text', copyText)
  // console.log(copyText)
}
