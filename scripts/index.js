// @todo: Темплейт карточки
const articleTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function addCards(name, link, delCard) {
  const articleElement = articleTemplate.querySelector('.card').cloneNode(true); 
  const deleteButton = articleElement.querySelector('.card__delete-button');
  articleElement.querySelector('.card__image').src = link;
  articleElement.querySelector('.card__image').alt = name;
  articleElement.querySelector('.card__title').textContent = name;
  deleteButton.addEventListener('click', function(event) {
    delCard(event);
  });
  return articleElement;
}

// @todo: Функция удаления карточки
function removeCard (event) {
  const listElement = event.target.closest('.places__item');
  listElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (element) {
  placesList.append(addCards(element.name, element.link, removeCard));
})