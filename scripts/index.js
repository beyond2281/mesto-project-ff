// @todo: Темплейт карточки
const articleTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(name, link, delCard) {
  const cardElement = articleTemplate.querySelector('.card').cloneNode(true); 
  const deleteButton = cardElement.querySelector('.card__delete-button');
  cardElement.querySelector('.card__image').src = link;
  cardElement.querySelector('.card__image').alt = name;
  cardElement.querySelector('.card__title').textContent = name;
  deleteButton.addEventListener('click', delCard);
  return cardElement;
}

// @todo: Функция удаления карточки
function removeCard (event) {
  const listElement = event.target.closest('.places__item');
  listElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  placesList.append(createCard(element.name, element.link, removeCard));
})