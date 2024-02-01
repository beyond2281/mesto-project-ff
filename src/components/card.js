import {deleteCard, pushLikeCard } from "../api.js"
// @todo: Темплейт карточки
export const articleTemplate = document.querySelector("#card-template").content;


// @todo: Функция создания карточки
export function createCard(cardData, removeCard, likeCard, openImageModal, currentUserID) {
  const cardElement = articleTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCounter = cardElement.querySelector('.like-counter');
  if(currentUserID === cardData.userId) {
    deleteButton.style.display = 'block';
  } else {
    deleteButton.style.display = 'none';
  }
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardImage.id = cardData.id;
  likeCounter.textContent = cardData.likes.length
  cardElement.querySelector(".card__title").textContent = cardData.name;
  deleteButton.addEventListener("click", function (event) {
    removeCard(cardData.id, event)
  });
  cardImage.addEventListener("click", openImageModal);
  likeButton.addEventListener("click", likeCard);
  return cardElement;
}



// @todo: Функция удаления карточки
export function removeCard(id, event) {
  deleteCard(id)
  .then (() => {
    event.target.closest('.card').remove()
  
  })
  .catch ((error) => {
    console.log(`Ошибка: ${error.message}`)
  }) 
  
}

//функция лайка
export function likeCard(id) {
  pushLikeCard(id)
  event.target.classList.toggle("card__like-button_is-active"); //навешиваю или снимаю лайк
}
