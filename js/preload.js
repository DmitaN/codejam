import cardsGreen from "../data/mythicCards/green/index.js"
import cardsBlue from "../data/mythicCards/blue/index.js"
import cardsBrown from "../data/mythicCards/brown/index.js"

const loadImage = (cardsData) => {
  cardsData.forEach(card => {
    const img = new Image()
    img.src = `../codejam/assets/MythicCards/${card.color}/${card.id}.png`
  });
}

const getImageCards = () => {
  loadImage(cardsGreen)
  loadImage(cardsBlue)
  loadImage(cardsBrown)
}

const preload = () => {
  getImageCards()
}

window.addEventListener('load', preload())
