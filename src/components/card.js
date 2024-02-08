import { deleteCard, pushLikeCard, delLikeCard } from "../api.js";

// @todo: Темплейт карточки
export const articleTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(cardData, likeCard, openImageModal, currentUserID, showModalDel, cardToRemoveid, cardToRemoveElement) {//без этих двух параметров не работает удаление. если есть возможность, дайте комментарий, почему.
  const cardElement = articleTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCounter = cardElement.querySelector(".like-counter");

  if (currentUserID === cardData.userId) {
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", function () {
      cardToRemoveid = cardData.id;
      cardToRemoveElement = cardElement;
      showModalDel(cardData.id, cardToRemoveElement);
    });
  } else {
    deleteButton.style.display = "none";
  }

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardImage.id = cardData.id;
  likeCounter.textContent = cardData.likes.length;

  if (cardData.likes.some((element) => element._id === currentUserID)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardImage.addEventListener("click", openImageModal);
  likeButton.addEventListener("click", function () {
    likeCard(cardData.id, likeCounter, likeButton);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
export function removeCard(id) {
  return deleteCard(id)
    .then(() => {
      document.querySelector(".card").remove();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    });
}

//функция лайка
export function likeCard(id, likeCounter, likeButton) {
  if (!likeButton.classList.contains("card__like-button_is-active")) {
    pushLikeCard(id)
      .then((data) => {
        likeButton.classList.add("card__like-button_is-active");
        likeCounter.textContent = Object.keys(data.likes).length;
      })
      .catch((error) => {
        console.log(`Ошибка: ${error.message}`);
      });
  } else if (likeButton.classList.contains("card__like-button_is-active")) {
    delLikeCard(id)
      .then((data) => {
        likeButton.classList.remove("card__like-button_is-active");
        likeCounter.textContent = Object.keys(data.likes).length;
      })
      .catch((error) => {
        console.log(`Ошибка: ${error.message}`);
      });
  }
}
