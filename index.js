import './styles/index.css'

const display = document.querySelector('.screen')
const screenContent = display.querySelector('#screen-content')

let runningTotal = 0
let buffer = '0'
let prevOperator = null
let shouldClearBuffer = false
let memory = {
  plus: 0,
  minus: 0,
  result: false,
}

const symbols = {
  memoryResult: 'memoryResult',
  memoryPlus: 'memoryPlus',
  memoryMinus: 'memoryMinus',
  backspace: 'backspace',
  clearScreen: 'clearScreen',
  plusMinus: 'plusMinus',
  percent: 'percent',
  divide: 'divide',
  multiply: 'multiply',
  add: 'add',
  subtract: 'subtract',
  dot: 'dot',
  equal: 'equal'
}

function handleButtonClick(value) {
  if (isNaN(value)) {
    handleSymbol(value)
  } else {
    handleNumber(value)
  }

  screenContent.textContent = buffer.toString()
}

function handleSymbol(symbol) {
  switch(symbol) {
    case symbols.clearScreen:
      buffer = '0'
      runningTotal = 0
      shouldClearBuffer = false
      break

    case symbols.percent:
      buffer = runningTotal * parseFloat(buffer) / 100
      break

    case symbols.equal:
      if (prevOperator === null) return

      calculate()
      prevOperator = null
      buffer = runningTotal.toString()
      runningTotal = 0
      break

    case symbols.backspace:
      if (buffer.length === 1) {
        buffer = '0'
      } else {
        buffer = buffer.substring(0, buffer.length - 1)
      }
      break

    case symbols.plusMinus:
      if (buffer.startsWith('-')) {
        buffer = buffer.substring(1)
      } else {
        buffer = '-' + buffer
      }
      break

    case symbols.dot:
      if (!buffer.includes('.')) {
        buffer += '.'
      }
      break

    case symbols.memoryPlus:
      memory.plus += parseFloat(buffer)
      break

    case symbols.memoryMinus:
      memory.minus += parseFloat(buffer)
      break

    case symbols.memoryResult:
      if (!memory.result) {
        buffer = String(memory.plus - memory.minus)
        memory.result = true
      } else {
        memory.plus = 0
        memory.minus = 0
        memory.result = false
        buffer = '0'
      }
      break

    case symbols.add:
    case symbols.subtract:
    case symbols.multiply:
    case symbols.divide:
      handleMath(symbol)
      break
    default:

  }
}

function handleMath(symbol) {
  if (!prevOperator) {
    runningTotal = parseFloat(buffer)
  } else {
    calculate()
    buffer = runningTotal.toString()
  }

  prevOperator = symbol
  shouldClearBuffer = true
}

function calculate() {
  const intBuffer = parseFloat(buffer)

  switch(prevOperator){
    case symbols.add:
      runningTotal += intBuffer
      break

    case symbols.subtract:
      runningTotal -= intBuffer
      break

    case symbols.multiply:
      runningTotal *= intBuffer
      break
    case symbols.divide:
      runningTotal /= intBuffer
      break
    default:
  }
}

function handleNumber(numberString) {
  if (shouldClearBuffer) {
    buffer = '0'
    shouldClearBuffer = false
  }

  if (buffer === '0') {
    buffer = numberString
  } else {
    buffer += numberString
  }
}

function init() {
  screenContent.textContent = buffer
  document
    .querySelector('.buttons')
    .addEventListener('click', (event) => {
      handleButtonClick(event.target.id)
    })

  document.addEventListener('keydown', (event) => {
    let key = ''

    switch (event.key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        key = event.key
        break
      case 'Enter':
        key = symbols.equal
        break
      case "-":
        key = symbols.subtract
        break
      case "+":
        key = symbols.add
        break
      case "/":
        key = symbols.divide
        break
      case "*":
        key = symbols.multiply
        break
      case ".":
        key = symbols.dot
        break
      case "Backspace":
        key = symbols.backspace
        break
      case "Escape":
        key = symbols.clearScreen
        break
      case '%':
        key = symbols.percent
        break
      default:
        break
    }

    if (key) {
      handleButtonClick(key)
    }
  })

}

init()
