import { fullScreenCard } from "../index.js";

// @todo: Темплейт карточки
export const articleTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(name, link, delCard, fullScreenCards, likeCard) {
  const cardElement = articleTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  cardElement.querySelector(".card__image").src = link;
  cardElement.querySelector(".card__image").alt = name;
  cardElement.querySelector(".card__title").textContent = name;
  deleteButton.addEventListener("click", delCard);
  cardElement.addEventListener("click", fullScreenCard);
  cardElement.addEventListener("click", likeCards);
  return cardElement;
}

// @todo: Функция удаления карточки
export function removeCard(event) {
  const listElement = event.target.closest(".places__item");
  listElement.remove();
}

//функция лайка
export function likeCards(event) {
  const likeButton = event.target.closest(".card__like-button"); //получаю event.target лайка
  if (event.target === likeButton) {
    likeButton.classList.toggle("card__like-button_is-active"); //навешиваю или снимаю лайк
  }
}
