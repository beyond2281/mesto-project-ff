// Импорты
import "./pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, removeCard, likeCards } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list"); //список карточек
//попапы
const popupTypeEdit = document.querySelector(".popup_type_edit"); //попап редактирования профиля
const popupTypeNewCard = document.querySelector(".popup_type_new-card"); //попап добавления новой карточки
const popupTypeImage = document.querySelector(".popup_type_image"); //попап фулскрин фото карточки
//кнопки их открытия
const profileEditButton = document.querySelector(".profile__edit-button"); //кнопка редактирования профиля
const profileAddButton = document.querySelector(".profile__add-button"); //кнопка добавления карточки
//наполнение карточки
const popupImage = document.querySelector(".popup__image"); //изображение в попапе
const popupCaption = document.querySelector(".popup__caption"); //текст города в карточке
//текстовые поля в шапке профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
//форма редактирования данных
const formElement = document.forms["edit-profile"];
//форма добавления новой карточки
const formAddCard = document.forms["new-place"];
//поля формы редактирования данных
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

//функция изменения полей формы
function handleFormSubmit(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  nameInput.value = event.target.elements.name.value; //получаю значение (value) из поля name
  jobInput.value = event.target.elements.description.value; //получаю значение (value) из поля description
  profileTitle.textContent = nameInput.value; //присваиваю текстовому значению profileTitle то, что будет в поле nameInput.value
  profileDescription.textContent = jobInput.value; //присваиваю текстовому значению profileDescription то, что будет в поле jobInput.value
  closeModal(popupTypeEdit); //закрываю попап
}

//обработчик события submit
formElement.addEventListener("submit", handleFormSubmit);

//Функция добавление новой карточки из формы
function addNewCard(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  const titleInput = formAddCard.elements["place-name"].value; //получаю значение из поля title
  const linkInput = formAddCard.elements["link"].value; //получаю значение из поля link
  const newCards = createCard(titleInput, linkInput); //создаю новую карточку и кладу в функцию создания всех карточек
  placesList.prepend(newCards); //добавляю карточку в список карточек
  formAddCard.reset(); //сбрасываю форму
  closeModal(popupTypeNewCard); //закрываю модальное окно
}

formAddCard.addEventListener("submit", addNewCard); //вешаю обработчик с функцией добавления новой карточки

//нахожу каждую кнопку в попапе и навешиваю на неё функцию закрытия
popupTypeEdit.querySelector(".popup__close").addEventListener("click", () => {
  //попап редактирования профиля
  closeModal(popupTypeEdit);
});

popupTypeNewCard.querySelector(".popup__close").addEventListener("click", () => {
  //попап новой карточки
  closeModal(popupTypeNewCard);
});

popupTypeImage.querySelector(".popup__close").addEventListener("click", () => {
  //попап фулскрин фото
  closeModal(popupTypeImage);
});

//отслеживаю клик по кнопке попапа и открываю его через функцию
profileEditButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent; //по умолчанию ставлю в поля формы значение из поля профиля
  jobInput.value = profileDescription.textContent; //и дискрипшна
  openModal(popupTypeEdit);
});

profileAddButton.addEventListener("click", function () {
  openModal(popupTypeNewCard);
});

// Функция открытия фото карточки Fullscreen
export function fullScreenCard(event) {
  const clickedCard = event.target.closest(".card"); //кликнутая карточка
  const clickedImage = clickedCard.querySelector(".card__image"); //картинка карточки
  const clickedTitle = clickedCard.querySelector(".card__title"); //элемент с текстом
  if (event.target === clickedImage) {
    popupImage.src = clickedImage.src; //src в попапе = scr в списке карточек
    popupCaption.textContent = clickedTitle.textContent; //текст под карточкой
    openModal(popupTypeImage); //вызвать функцию открытия модельного окна с атрибутом попапа фулскрина
  }
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  placesList.append(createCard(element.name, element.link, removeCard));
});
