// Импорты
import "./pages/index.css";
import { createCard, removeCard, likeCard } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";
import { clearValidation, enableValidation } from "./components/validation.js";
import { userInfo, getCard, userEdit, newCardAddServer, editUserAvatar } from "./api.js";
import { config } from "./components/config.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list"); //список карточек
//нахожу все элементы с классом попап
const popups = document.querySelectorAll(".popup");
//попапы
const popupTypeEdit = document.querySelector(".popup_type_edit"); //попап редактирования профиля
const popupTypeNewCard = document.querySelector(".popup_type_new-card"); //попап добавления новой карточки
const popupTypeImage = document.querySelector(".popup_type_image"); //попап фулскрин фото карточки
const popupDeleteImage = document.querySelector(".popup_delete_image"); //попап удаления карточки (подтверждение)
const popupTypeEditAvatar = document.querySelector(".popup_type_edit-avatar"); //попап редактирования аватара
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
//поле ввода ссылки для редактирования аватара профиля
const popupInputTypeAvatar = document.querySelector(".popup__input_type_avatar");
const popupAcceptButton = document.querySelector(".popup__accept-button");
//переменные id юзера, карточки и карточки в разметке
let currentUserID;
let cardToRemoveid;
let cardToRemoveElement;

enableValidation(config); //вызываю функцию валидации форм на странице.

Promise.all([userInfo(), getCard()])
  .then(([userData, cardData]) => {
    currentUserID = userData._id;
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

      placesList.append(createCard(cardData, likeCard, openImagePopup, currentUserID, showModalDel, cardToRemoveid, cardToRemoveElement));
    });
  })
  .catch((error) => {
    console.log(`Ошибка: ${error.message}`);
  });

//функция изменения полей формы
function handleProfileFormSubmit(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  const buttonAssept = event.target.querySelector(".popup__button");
  setLoadingSave(true, buttonAssept);
  popupInputTypeName.value = event.target.elements.name.value; //получаю значение (value) из поля name
  popupInputTypeDescription.value = event.target.elements.description.value; //получаю значение (value) из поля description

  const user = {
    name: popupInputTypeName.value,
    about: popupInputTypeDescription.value,
  };
  userEdit(user)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      setLoadingSave(false, buttonAssept);
    });

  profileTitle.textContent = popupInputTypeName.value; //присваиваю текстовому значению profileTitle то, что будет в поле popupInputTypeName.value
  profileDescription.textContent = popupInputTypeDescription.value; //присваиваю текстовому значению profileDescription то, что будет в поле popupInputTypeDescription.value
  closeModal(popupTypeEdit); //закрываю попап
}

//обработчик события submit
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

//Функция смены аватара юзера
function updateAvatar(event) {
  event.preventDefault();
  const buttonAsseptSave = event.target.querySelector(".popup__button");
  setLoadingSave(true, buttonAsseptSave);

  const linkImgAvatar = popupInputTypeAvatar.value;

  editUserAvatar(linkImgAvatar)
    .then((link) => {
      profileImage.style.backgroundImage = `url(${link.avatar})`;
      closeModal(popupTypeEditAvatar);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      setLoadingSave(false, buttonAsseptSave);
    });
}

//Ловлю клик по иконке аватара
profileImage.addEventListener("click", function () {
  openModal(popupTypeEditAvatar);
});

//отправляю сабмит по кнопке и обновляю аватар
popupTypeEditAvatar.addEventListener("submit", updateAvatar);

//Функция добавление новой карточки из формы
function addNewCard(event) {
  event.preventDefault(); //отменяю стандартное поведение браузера
  const buttonSave = event.target.querySelector(".popup__button");
  setLoadingSave(true, buttonSave);
  const titleInput = addCardForm.elements["place-name"].value; //получаю значение из поля title
  const linkInput = addCardForm.elements["link"].value; //получаю значение из поля link

  const card = {
    name: titleInput,
    link: linkInput,
  };
  newCardAddServer(card)
    .then((data) => {
      const cardData = {
        name: data.name,
        link: data.link,
        likes: data.likes,
        id: data._id,
        userId: data.owner._id,
      };
      const newCards = createCard(cardData, likeCard, openImagePopup, currentUserID, showModalDel, cardToRemoveid, cardToRemoveElement); //создаю новую карточку и кладу в функцию создания всех карточек + атрибуты
      placesList.prepend(newCards); //добавляю карточку в начало списка карточек
      addCardForm.reset(); //сбрасываю форму
      closeModal(popupTypeNewCard); //закрываю модальное окно
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    })
    .finally(() => {
      setLoadingSave(false, buttonSave);
    });
}

addCardForm.addEventListener("submit", addNewCard); //вешаю обработчик с функцией добавления новой карточки

//обработчик клика по оверлею и крестику
popups.forEach((popup) => {
  //прохожусь массивом по каждому
  popup.addEventListener("mousedown", (event) => {
    //на каждый найденный элемент попап вешаю событие клика НАД элементом
    if (event.target.classList.contains("popup_is-opened") || event.target.classList.contains("popup__close")) {
      //проверяю, есть ли в элементе события класс
      closeModal(popup); //если есть закрываю окно
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

popupTypeImage.addEventListener("click", function () {
  openModal(popupTypeImage);
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

popupAcceptButton.addEventListener("click", () => {
  removeCard(cardToRemoveid, cardToRemoveElement)
    .then(() => {
      cardToRemoveElement.remove();
      closeModal(popupDeleteImage);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error.message}`);
    });
});

// функция открытия попапа с подтверждением удаления карточки
export function showModalDel(idCard, eventElement) {
  openModal(popupDeleteImage);
  cardToRemoveid = idCard;
  cardToRemoveElement = eventElement;
}

//Функция изменения надписи в кнопке
function setLoadingSave(loading, buttonPopup) {
  buttonPopup.textContent = loading ? "Сохранение..." : "Сохранить";
}