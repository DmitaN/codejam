import { } from './preload.js' // презагрузка изображений
import { } from './message.js' // Сообщения
import ancientsData from '../data/ancients.js'
import cardsDataGreen from '../data/mythicCards/green/index.js'
import cardsDataBlue from '../data/mythicCards/blue/index.js'
import cardsDataBrown from '../data/mythicCards/brown/index.js'

const audioMain = new Audio()
audioMain.volume = 0.4
audioMain.src = '../codejam/assets/sounds/main.mp3'

audioMain.addEventListener('ended', () => {
  audioMain.play()
})

const audioMute = document.querySelector('.audio__mute')
audioMute.addEventListener('click', () => {
  if (audioMain.paused) {
    audioMain.play()
    audioMute.innerHTML = 'Mute'
  } else {
    audioMain.pause()
    audioMute.innerHTML = 'Play'
  }
})

//общие элементы DOM
//древние
const ancients = document.querySelectorAll('.ancients__item')
const levelContainer = document.querySelector('.level__container')
const startContainer = document.querySelector('.start__container')
const deckContainer = document.querySelector('.deck__container')

const message = document.querySelector('.message')

const showMessage = () => {
  message.classList.add('opacity--active')
}

setTimeout(showMessage, 500)

const messageButton = document.querySelector('.message__button')
const ancientsContainer = document.querySelector('.ancients__container')

messageButton.addEventListener('click', () => {
  message.classList.remove('opacity--active')
  ancientsContainer.classList.remove('opacity--hidden')
  ancientsContainer.classList.add('opacity-ancient--active')
  audioMain.play()
})

const enumStage = {
  0: 'first',
  1: 'second',
  2: 'third'
}

const enumColor = {
  0: 'green',
  1: 'blue',
  2: 'brown'
}

let ancient = ancientsData[0]
let levelGame = 0

let greenDeck = []
let blueDeck = []
let brownDeck = []

let needCountGreen = 0
let needCountBlue = 0
let needCountBrown = 0

let firstStage = []
let secondStage = []
let thirdStage = []

let mixFirstStage = []
let mixSecondStage = []
let mixThirdStage = []

let countFirst = 0
let countSecond = 0
let countThird = 0

//1 шаг. формирование рандомных колод по цвету карты в зависимости
//от количество необходимых карт у древнего и уровня сложности игры

//составление колоды для уровня супер легкий и супер высокий
const makeDeskSuperLevel = (level, cards, needCards) => {

  const countLevel = cards.filter(card => card.difficulty === level)
  const countNormal = cards.filter(card => card.difficulty === 'normal')

  const returnDeck = []

  while (returnDeck.length != needCards) {
    if (countLevel.length === 0) {
      let rnd = Math.floor(Math.random() * countNormal.length)
      checkAndIncludes(returnDeck, countNormal, rnd)
    } else {
      let rnd = Math.floor(Math.random() * countLevel.length)
      checkAndIncludes(returnDeck, countLevel, rnd)
    }
  }

  return returnDeck
}

//составление колоды для уровня легкий и высокий
const makeDeskWithoutLevel = (level, cards, needCards) => {
  const countWithoutLevel = cards.filter(card => card.difficulty !== level)
  const returnDeck = []

  while (returnDeck.length != needCards) {
    let rnd = Math.floor(Math.random() * countWithoutLevel.length)
    checkAndIncludes(returnDeck, countWithoutLevel, rnd)
  }

  return returnDeck
}

//составление колоды среднего уровня
const makeDeskMiddle = (cards, needCards) => {
  const returnDeck = []

  while (returnDeck.length != needCards) {
    let rnd = Math.floor(Math.random() * cards.length)
    if (!returnDeck.includes(cards[rnd])) {
      returnDeck.push(cards[rnd])
    }
  }

  return returnDeck
}

//Вспомогательная: функция для проверки повторяющейся карты
const checkAndIncludes = (desk, count, rnd) => {
  if (!desk.includes(count[rnd])) {
    desk.push(count[rnd])
    const index = count.indexOf(count[rnd])
    count.splice(index, 1)
  }
}
//-----------------------------------------------------------------

//2 шаг. формируем колоды на каждый этап игры

//формирование стейджа
const makeStage = (ancient, greenCards, blueCards, brownCards, stage) => {
  const returnStageDeck = []

  for (let i = 0; i < ancient[stage].greenCards; i++) {
    returnStageDeck.push(greenCards.pop())
  }

  for (let i = 0; i < ancient[stage].blueCards; i++) {
    returnStageDeck.push(blueCards.pop())
  }

  for (let i = 0; i < ancient[stage].brownCards; i++) {
    returnStageDeck.push(brownCards.pop())
  }

  return returnStageDeck
}

//3 шаг. перемешиваем карты в колодах этапов
const mixingDeck = (countStage, beginDeck) => {
  const returnDesk = []

  while (returnDesk.length != countStage) {
    let rnd = Math.floor(Math.random() * beginDeck.length)
    if (!returnDesk.includes(beginDeck[rnd])) {
      returnDesk.push(beginDeck[rnd])
      const index = beginDeck.indexOf(beginDeck[rnd])
      beginDeck.splice(index, 1)
    }
  }

  return returnDesk
}
//--------------------------------------------------------------

//отображение информации о картах на треке

//функция заполнения трекер уровня
const fillTracker = () => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const htmlTracker = document.querySelector(`.deck__count--${enumStage[i]}.deck__count--${enumColor[j]}`)
      const number = ancient[`${enumStage[i]}Stage`][`${enumColor[j]}Cards`]
      htmlTracker.innerHTML = number
      if (number === 0) {
        htmlTracker.style.opacity = '0.5'
      } else {
        htmlTracker.style.opacity = '1'
      }
    }
  }
}

//функция для отображения изменения состояния трекера
const changeTracker = (stage, color) => {
  const htmlElement = document.querySelector(`.deck__count--${stage}.deck__count--${color}`)
  const count = parseInt(htmlElement.innerHTML)
  const number = count - 1
  htmlElement.innerHTML = number
  if (number === 0) {
    htmlElement.style.opacity = '0.5'
  } else {
    htmlElement.style.opacity = '1'
  }
}
//-------------------------------------------------------------

// основная функция подготовки колоды мифов к игре
const mixDeck = () => {
  needCountGreen = 0
  needCountBlue = 0
  needCountBrown = 0

  //получаем общее количество карт у древнего
  for (const key in ancient) {
    if (key !== 'id' && key !== 'name' && key !== 'cardFace') {
      needCountGreen += ancient[key].greenCards
      needCountBlue += ancient[key].blueCards
      needCountBrown += ancient[key].brownCards
    }

    //получаем необходимое количество карт у древнего по уровням
    if (key === 'firstStage') {
      countFirst = ancient[key].greenCards + ancient[key].blueCards + ancient[key].brownCards
    }

    if (key === 'secondStage') {
      countSecond = ancient[key].greenCards + ancient[key].blueCards + ancient[key].brownCards
    }

    if (key === 'thirdStage') {
      countThird = ancient[key].greenCards + ancient[key].blueCards + ancient[key].brownCards
    }
  }

  //собираем рандомно колоды согласно карты древнего и уровня сложности
  if (levelGame === 0) {
    greenDeck = makeDeskSuperLevel('easy', cardsDataGreen, needCountGreen)
    blueDeck = makeDeskSuperLevel('easy', cardsDataBlue, needCountBlue)
    brownDeck = makeDeskSuperLevel('easy', cardsDataBrown, needCountBrown)
  } else if (levelGame === 1) {
    greenDeck = makeDeskWithoutLevel('hard', cardsDataGreen, needCountGreen)
    blueDeck = makeDeskWithoutLevel('hard', cardsDataBlue, needCountBlue)
    brownDeck = makeDeskWithoutLevel('hard', cardsDataBrown, needCountBrown)
  } else if (levelGame === 2) {
    greenDeck = makeDeskMiddle(cardsDataGreen, needCountGreen)
    blueDeck = makeDeskMiddle(cardsDataBlue, needCountBlue)
    brownDeck = makeDeskMiddle(cardsDataBrown, needCountBrown)
  } else if (levelGame === 3) {
    greenDeck = makeDeskWithoutLevel('easy', cardsDataGreen, needCountGreen)
    blueDeck = makeDeskWithoutLevel('easy', cardsDataBlue, needCountBlue)
    brownDeck = makeDeskWithoutLevel('easy', cardsDataBrown, needCountBrown)
  } else if (levelGame === 4) {
    greenDeck = makeDeskSuperLevel('hard', cardsDataGreen, needCountGreen)
    blueDeck = makeDeskSuperLevel('hard', cardsDataBlue, needCountBlue)
    brownDeck = makeDeskSuperLevel('hard', cardsDataBrown, needCountBrown)
  }

  //формируем колоду первый стейдж
  firstStage = makeStage(ancient, greenDeck, blueDeck, brownDeck, 'firstStage')

  //формируем колоду второй стейдж
  secondStage = makeStage(ancient, greenDeck, blueDeck, brownDeck, 'secondStage')

  //формируем колоду третий стейдж
  thirdStage = makeStage(ancient, greenDeck, blueDeck, brownDeck, 'thirdStage')

  //замешиваем колоду первого стейджа
  mixFirstStage = mixingDeck(countFirst, firstStage)

  //замешиваем колоду второго стейджа
  mixSecondStage = mixingDeck(countSecond, secondStage)

  //замешиваем колоду третьего стейджа
  mixThirdStage = mixingDeck(countThird, thirdStage)
}

//---------------------------------------------------------------

//выбор древнего
ancients.forEach((choiseAnsient, key) => {
  choiseAnsient.addEventListener('click', () => {
    ancients.forEach(anc => {
      anc.classList.add('ancients__item--notactive')
      anc.classList.remove('ancients__item--active-transform')
      anc.classList.remove('ancients__item--active')
    })

    choiseAnsient.classList.remove('ancients__item--notactive')
    choiseAnsient.classList.add('ancients__item--active-transform')

    const audioChoise = new Audio()
    audioChoise.src = '../codejam/assets/sounds/choise.mp3'
    audioChoise.play()
  })

  choiseAnsient.addEventListener('dblclick', () => {
    ancients.forEach(ancient => {
      ancient.classList.remove('ancients__item--start')
      ancient.classList.remove('ancients__item--active-transform')
    })

    choiseAnsient.classList.add('ancients__item--active')

    ancient = ancientsData[key]

    levelContainer.classList.remove('opacity--hidden')
    levelContainer.classList.add('opacity-level--active')

    deck.style.visibility = 'hidden'
    startButton.style.visibility = 'inherit'
    openCard.style.visibility = 'hidden'

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const htmlTracker = document.querySelector(`.deck__count--${enumStage[i]}.deck__count--${enumColor[j]}`)
        htmlTracker.innerHTML = 0
      }
    }

    levelButtons.forEach(button => {
      if (!button.classList.contains('level__button--active')) {
        button.classList.remove('opacity--hidden')
      }
    })

    const ancientsMessage = document.querySelector('.ancients__message')

    ancientsMessage.classList.add('opacity--hidden')
  })
})

//выбор уровня сложности
const levelButtons = document.querySelectorAll('.level__button')

levelButtons.forEach((levelButton, key) => {
  levelButton.addEventListener('click', () => {
    levelButtons.forEach(button => {
      button.classList.remove('level__button--active')
    })

    levelButton.classList.add('level__button--active')
    levelGame = key
    startContainer.classList.remove('opacity--hidden')
    startContainer.classList.add('opacity-start--active')
    const levelMessage = document.querySelector('.level__message')
    levelMessage.classList.add('opacity--hidden')

    const audioChoise = new Audio()
    audioChoise.src = '../codejam/assets/sounds/choise.mp3'
    audioChoise.play()
  })
})

const startButton = document.querySelector('.start__button')
//запускаем формирование колоды игры
startButton.addEventListener('click', () => {
  const audioMix = new Audio()
  audioMix.src = '../codejam/assets/sounds/mix.mp3'
  audioMix.play()

  //замешивание колоды
  mixDeck()
  startButton.style.visibility = 'hidden'
  deck.style.visibility = 'inherit'
  openCard.style.visibility = 'hidden'

  //заполнение трекера
  fillTracker()

  //отображение трекера и колоды на поле
  deckContainer.classList.remove('opacity--hidden')
  deckContainer.classList.add('opacity-deck--active')

  levelButtons.forEach(button => {
    if (!button.classList.contains('level__button--active')) {
      button.classList.add('opacity--hidden')
    }
  })

})

const deck = document.querySelector('.deck__close-card')
const openCard = document.querySelector('.deck__open-card')
const openCardFront = document.querySelector('.open-card__front')
const movingCard = document.querySelector('.move')


//листаем колоду
deck.addEventListener('click', () => {
  const audioFlip = new Audio()
  audioFlip.src = '../codejam/assets/sounds/flip.mp3'
  audioFlip.play()

  movingCard.style.visibility = 'inherit'
  movingCard.style.zIndex = '11'
  movingCard.classList.add('moving')
  openCard.style.visibility = 'hidden'
  openCard.classList.remove('open-card--flip')

  if (mixFirstStage.length !== 0) {
    const open = mixFirstStage.pop()
    flipAndMoveCard(open)
    changeTracker('first', open.color)

  } else if (mixFirstStage.length === 0 && mixSecondStage.length !== 0) {
    const open = mixSecondStage.pop()
    flipAndMoveCard(open)
    changeTracker('second', open.color)
  } else if (mixFirstStage.length === 0 && mixSecondStage.length === 0 && mixThirdStage.length !== 0) {
    const open = mixThirdStage.pop()
    flipAndMoveCard(open)
    changeTracker('third', open.color)
  }

  if (mixThirdStage.length === 0) {
    deck.style.visibility = 'hidden'
    startButton.style.visibility = 'inherit'
    levelButtons.forEach(button => {
      button.classList.remove('opacity--hidden')
    })
  }
})

const flipAndMoveCard = (open) => {
  setTimeout(() => {
    movingCard.style.visibility = 'hidden'
    openCard.style.visibility = 'inherit'
    movingCard.classList.remove('moving')
    movingCard.style.zIndex = '0'
    openCard.classList.add('open-card--flip')
    openCardFront.style.backgroundImage = `url('../codejam/assets/MythicCards/${open.color}/${open.id}.png')`
  }, 300)
}
