// @todo: Темплейт карточки
export const articleTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(name, link, removeCard, likeCard, openImageModal) {
  const cardElement = articleTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = link;
  cardImage.alt = name;
  cardElement.querySelector(".card__title").textContent = name;
  deleteButton.addEventListener("click", removeCard);
  cardImage.addEventListener("click", openImageModal);
  likeButton.addEventListener("click", likeCard);
  return cardElement;
}

// @todo: Функция удаления карточки
export function removeCard(event) {
  const listElement = event.target.closest(".places__item");
  listElement.remove();
}

//функция лайка
export function likeCard(event) {
  event.target.classList.toggle("card__like-button_is-active"); //навешиваю или снимаю лайк
}
