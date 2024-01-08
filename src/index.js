// Импорты
import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, removeCard, likeCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

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
//форма редактирования данных
const editProfileForm = document.forms["edit-profile"];
//форма добавления новой карточки
const addCardForm = document.forms["new-place"];
//поля формы редактирования данных
const popupInputTypeName = document.querySelector(".popup__input_type_name");
const popupInputTypeDescription = document.querySelector(".popup__input_type_description");

//функция изменения полей формы
function handleProfileFormSubmit(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  popupInputTypeName.value = event.target.elements.name.value; //получаю значение (value) из поля name
  popupInputTypeDescription.value = event.target.elements.description.value; //получаю значение (value) из поля description
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
  const newCards = createCard(titleInput, linkInput, removeCard, likeCard, openImagePopup); //создаю новую карточку и кладу в функцию создания всех карточек + атрибуты
  placesList.prepend(newCards); //добавляю карточку в список карточек
  addCardForm.reset(); //сбрасываю форму
  closeModal(popupTypeNewCard); //закрываю модальное окно
}

addCardForm.addEventListener("submit", addNewCard); //вешаю обработчик с функцией добавления новой карточки

//обработчик клика по оверлею и крестику (спасибо за интересный способ, запомню <3)
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

//отслеживаю клик по кнопке попапа и открываю его через функцию
profileEditButton.addEventListener("click", function () {
  popupInputTypeName.value = profileTitle.textContent; //по умолчанию ставлю в поля формы значение из поля профиля
  popupInputTypeDescription.value = profileDescription.textContent; //и дискрипшна
  openModal(popupTypeEdit);
});

profileAddButton.addEventListener("click", function () {
  openModal(popupTypeNewCard);
});

// Функция открытия фото карточки Fullscreen
export function openImagePopup(event) {
  const clickedCard = event.target.closest(".card"); //кликнутая карточка
  const clickedImage = clickedCard.querySelector(".card__image"); //картинка карточки
  const clickedTitle = clickedCard.querySelector(".card__title"); //элемент с текстом
  if (event.target === clickedImage) {
    popupImagePopup.src = clickedImage.src; //src в попапе = scr в списке карточек
    popupImagePopup.alt = clickedImage.alt; //alt в img попапа = alt в img картинки
    popupCaptionPopup.textContent = clickedTitle.textContent; //текст под карточкой
    openModal(popupTypeImage); //вызвать функцию открытия модельного окна с атрибутом попапа фулскрина
  }
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  placesList.append(createCard(element.name, element.link, removeCard, likeCard, openImagePopup));
});
