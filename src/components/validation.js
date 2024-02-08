export { clearValidation, enableValidation };

function clearValidation(formElement, config) {
  //функция очистки полей ошибки
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); //создаю массив из всех полей ввода
  inputList.forEach((inputElement) => {
    //прохожусь по ним и для каждого элемента
    hideInputError(formElement, inputElement, config); //скрываю ошибку
    disableSubmitButton(buttonElement, config); //дизейблю кнопку
  });
}

function showInputError(formElement, inputElement, errorMessage, config) {
  //функция показа ошибки, принимает форму, поле формы и сообщение об ошибке
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.add(config.inputErrorClass); //добавляю класс со стиялми для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.add(config.errorClass); //добавляю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = errorMessage; //устанавливаю текст сообщения об ошибке (errorMessage) внутри элемента ошибки
}

function hideInputError(formElement, inputElement, config) {
  //функция скрытия ошибки, принимает форму и поле формы
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.remove(config.inputErrorClass); //убираю класс со стилями для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.remove(config.errorClass); //убираю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = ""; //устанавливаю пустую строку внутри элемента ошибки
}

function checkInputValidity(formElement, inputElement, config) {
  //функция для проверки валидности введенных данных в текстовом поле формы
  if (inputElement.validity.patternMismatch) {
    // проверка наличия несоответствий шаблону (pattern)
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); // Если есть несоответствие, устанавливаем data сообщение об ошибке
  } else {
    inputElement.setCustomValidity(""); // Если нет несоответствий, сбрасываем пользовательское сообщение
  }

  if (!inputElement.validity.valid) {
    // Проверка общей валидности поля
    showInputError(formElement, inputElement, inputElement.validationMessage, config); // Если поле невалидно, вызываем функцию отображения ошибки
  } else {
    hideInputError(formElement, inputElement, config); // Если поле валидно, вызываем функцию скрытия ошибки
  }
}

function setEventListeners(formElement, config) {
  //настройка обработчиков событий валидации для формы
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); //создаю массив inputList, который содержит все поля формы
  const buttonElement = formElement.querySelector(config.submitButtonSelector); //элемент кнопки в форме с классом popup__button.
  disableSubmitButton(buttonElement, config); //вызов функции проверки валидности кнопки
  inputList.forEach((inputElement) => {
    //устанавливаю обработчик события input для каждого элемента в массиве inputList.
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config); //проверяю валидность конкретного поля ввода и обновдяю сообщение об ошибке, если необходимо.
      toggleButtonState(inputList, buttonElement, config); //вызов функции проверки валидности кнопки
    });
  });
}

function enableValidation(config) {
  //включения валидации форм на странице.
  const formList = Array.from(document.querySelectorAll(config.formSelector)); //массив formList, содержащий все элементы форм на странице
  formList.forEach((formElement) => {
    //на каждую форму в массиве вешаю обработчик сабмит и убираю стандарное поведение браузера
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, config); //вызываю функцию для текущей формы, устанавливая обработчики событий для всех полей ввода внутри нее.
  });
}

function hasInvalidInput(inputList) {
  //проверяю массив элементов ввода на наличие хотя бы одного невалидного элемента.
  return inputList.some((input) => {
    //прохожусь методом some по каждому импуту.
    return !input.validity.valid; //возвращаю true, если хотя бы один не валиден
  });
}

function toggleButtonState(inputList, buttonElement, config) {
  //функция изменяет состояние кнопки
  if (hasInvalidInput(inputList)) {
    //если хотя бы одно поле не валидно
    disableSubmitButton(buttonElement, config);
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function disableSubmitButton(button, config) {
  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}
