// Импорты
import "./pages/index.css";
// import { initialCards } from "./components/cards.js";
import { createCard, removeCard, likeCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { clearValidation, enableValidation } from "./components/validation.js";
import { userInfo, getCard, userEdit, newCardAddServer } from "./api.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list"); //список карточек
//нахожу все элементы с классом попап
const popups = document.querySelectorAll(".popup");
//попапы
const popupTypeEdit = document.querySelector(".popup_type_edit"); //попап редактирования профиля
const popupTypeNewCard = document.querySelector(".popup_type_new-card"); //попап добавления новой карточки
const popupTypeImage = document.querySelector(".popup_type_image"); //попап фулскрин фото карточки
//кнопки их открытия
const profileEditButton = document.querySelector(".profile__edit-button"); //кнопка редактирования профиля
const profileAddButton = document.querySelector(".profile__add-button"); //кнопка добавления карточки
//наполнение карточки
const popupImagePopup = document.querySelector(".popup__image"); //изображение в попапе
const popupCaptionPopup = document.querySelector(".popup__caption"); //текст города в карточке
//текстовые поля в шапке профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
//форма редактирования данных
const editProfileForm = document.forms["edit-profile"];
//форма добавления новой карточки
const addCardForm = document.forms["new-place"];
//поля формы редактирования данных
const popupInputTypeName = document.querySelector(".popup__input_type_name");
const popupInputTypeDescription = document.querySelector(".popup__input_type_description");
enableValidation(); //вызываю функцию валидации форм на странице.

let currentUser;

Promise.all([userInfo(), getCard()])
  .then(([userData, cardData]) => {
    const currentUserID = userData._id;
    currentUser = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    cardData.forEach(function (element) {
      const cardData = {
        name: element.name,
        link: element.link,
        likes: element.likes,
        id: element._id,
        userId: element.owner._id,
      };

      placesList.append(createCard(cardData, removeCard, likeCard, openImagePopup, currentUserID));
    });
  })
  .catch((error) => {
    console.log(`Ошибка: ${error.message}`);
  });



//функция изменения полей формы
function handleProfileFormSubmit(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  popupInputTypeName.value = event.target.elements.name.value; //получаю значение (value) из поля name
  popupInputTypeDescription.value = event.target.elements.description.value; //получаю значение (value) из поля description

  const user = {
    name: popupInputTypeName.value,
    about: popupInputTypeDescription.value,
  };
  userEdit(user)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
    })
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    });

  profileTitle.textContent = popupInputTypeName.value; //присваиваю текстовому значению profileTitle то, что будет в поле popupInputTypeName.value
  profileDescription.textContent = popupInputTypeDescription.value; //присваиваю текстовому значению profileDescription то, что будет в поле popupInputTypeDescription.value
  closeModal(popupTypeEdit); //закрываю попап
}

//обработчик события submit
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

//Функция добавление новой карточки из формы
function addNewCard(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  const titleInput = addCardForm.elements["place-name"].value; //получаю значение из поля title
  const linkInput = addCardForm.elements["link"].value; //получаю значение из поля link

  const card = {
    name: titleInput,
    link: linkInput,
  };
  newCardAddServer(card)
    .then((cardData) => {
      const dataCard = {
        name: cardData.name,
        link: cardData.link,
        likes: cardData.likes,
        id: cardData._id,
        userId: cardData.owner._id,
      };
      const newCards = createCard(dataCard, removeCard, likeCard, openImagePopup, currentUser); //создаю новую карточку и кладу в функцию создания всех карточек + атрибуты
      placesList.prepend(newCards); //добавляю карточку в начало списка карточек
      addCardForm.reset(); //сбрасываю форму
      closeModal(popupTypeNewCard); //закрываю модальное окно
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    });
}

addCardForm.addEventListener("submit", addNewCard); //вешаю обработчик с функцией добавления новой карточки

//обработчик клика по оверлею и крестику
popups.forEach((popup) => {
  //прохожусь массивом по каждому
  popup.addEventListener("mousedown", (event) => {
    //на каждый найденный элемент попап вешаю событие клика НАД элементом
    if (event.target.classList.contains("popup_is-opened")) {
      //проверяю, есть ли в элементе события класс
      closeModal(popup); //если есть закрываю окно
    }
    if (event.target.classList.contains("popup__close")) {
      //если в элементе есть класс крестика
      closeModal(popup); //закрываю модалку
    }
  });
});

//отслеживаю клик по кнопке попапа редактирования профиля и открываю его через функцию
profileEditButton.addEventListener("click", function () {
  popupInputTypeName.value = profileTitle.textContent; //по умолчанию ставлю в поля формы значение из поля профиля
  popupInputTypeDescription.value = profileDescription.textContent; //и дискрипшна
  clearValidation(popupTypeEdit); //скрываю прошлые ошибки валидации
  openModal(popupTypeEdit);
});

//отслеживаю клик по кнопке попапа добавления новой карточки и открываю его через функцию
profileAddButton.addEventListener("click", function () {
  openModal(popupTypeNewCard);
});

// Функция открытия фото карточки Fullscreen
export function openImagePopup(event) {
  const clickedCard = event.target.closest(".card"); //кликнутая карточка (общий класс)
  const clickedImage = clickedCard.querySelector(".card__image"); //картинка карточки
  const clickedTitle = clickedCard.querySelector(".card__title"); //элемент с текстом
  if (event.target === clickedImage) {
    popupImagePopup.src = clickedImage.src; //src в попапе = scr в списке карточек
    popupImagePopup.alt = clickedImage.alt; //alt в img попапа = alt в img картинки
    popupCaptionPopup.textContent = clickedTitle.textContent; //текст под карточкой
    openModal(popupTypeImage); //вызвать функцию открытия модельного окна с атрибутом попапа фулскрина
  }
}
