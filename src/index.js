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





const showInputError = (formElement, inputElement, errorMessage) => { //функция показа ошибки, принимает форму, поле формы и сообщение об ошибке
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`) //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.add('popup__input-type-error') //добавляю класс со стиялми для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.add('form__input-error_active') //добавляю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = errorMessage; //устанавливаю текст сообщения об ошибке (errorMessage) внутри элемента ошибки
}

const hideInputError = (formElement, inputElement) => { //функция скрытия ошибки, принимает форму и поле формы 
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`) //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.remove('popup__input-type-error') //убираю класс со стилями для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.remove('form__input-error_active')//убираю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = '' //устанавливаю пустую строку внутри элемента ошибки
}

const checkInputValidity = (formElement, inputElement) => { //функция для проверки валидности введенных данных в текстовом поле формы
  if(inputElement.validity.patternMismatch) { // проверка наличия несоответствий шаблону (pattern)
    inputElement.setCustomValidity('Поле может содержать только латинские и кириллические буквы, знаки дефиса и пробелы') // Если есть несоответствие, устанавливаем пользовательское сообщение об ошибке
  } else {
    inputElement.setCustomValidity('') // Если нет несоответствий, сбрасываем пользовательское сообщение
  }


  if(!inputElement.validity.valid) { // Проверка общей валидности поля
    showInputError(formElement, inputElement, inputElement.validationMessage); // Если поле невалидно, вызываем функцию отображения ошибки
  } else {
    hideInputError(formElement, inputElement) // Если поле валидно, вызываем функцию скрытия ошибки
  }

}


const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'))
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement)
    })
  })
}

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'))
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    })
    setEventListeners(formElement)
  })
}

enableValidation()

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
  placesList.prepend(newCards); //добавляю карточку в начало списка карточек
  addCardForm.reset(); //сбрасываю форму
  closeModal(popupTypeNewCard); //закрываю модальное окно
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

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  placesList.append(createCard(element.name, element.link, removeCard, likeCard, openImagePopup));
});
