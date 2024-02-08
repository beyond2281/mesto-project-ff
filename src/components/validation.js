export { clearValidation, enableValidation };
import { config } from "./config";

function clearValidation(formElement) {
  //функция очистки полей ошибки
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); //создаю массив из всех полей ввода
  inputList.forEach((inputElement) => {
    //прохожусь по ним и для каждого элемента
    hideInputError(formElement, inputElement); //скрываю ошибку
    disableSubmitButton(buttonElement, config, true); //дизейблю кнопку
  });
}

function showInputError(formElement, inputElement, errorMessage) {
  //функция показа ошибки, принимает форму, поле формы и сообщение об ошибке
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.add(config.inputErrorClass); //добавляю класс со стиялми для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.add(config.errorClass); //добавляю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = errorMessage; //устанавливаю текст сообщения об ошибке (errorMessage) внутри элемента ошибки
}

function hideInputError(formElement, inputElement) {
  //функция скрытия ошибки, принимает форму и поле формы
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //поиск элемента, предназначенного для отображения сообщения об ошибке
  inputElement.classList.remove(config.inputErrorClass); //убираю класс со стилями для подсветки поля ввода как недопустимого или с ошибкой.
  errorElement.classList.remove(config.errorClass); //убираю класс со стилями для отображения сообщения об ошибке.
  errorElement.textContent = ""; //устанавливаю пустую строку внутри элемента ошибки
}

function checkInputValidity(formElement, inputElement) {
  //функция для проверки валидности введенных данных в текстовом поле формы
  if (inputElement.validity.patternMismatch) {
    // проверка наличия несоответствий шаблону (pattern)
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); // Если есть несоответствие, устанавливаем data сообщение об ошибке
  } else {
    inputElement.setCustomValidity(""); // Если нет несоответствий, сбрасываем пользовательское сообщение
  }

  if (!inputElement.validity.valid) {
    // Проверка общей валидности поля
    showInputError(formElement, inputElement, inputElement.validationMessage); // Если поле невалидно, вызываем функцию отображения ошибки
  } else {
    hideInputError(formElement, inputElement); // Если поле валидно, вызываем функцию скрытия ошибки
  }
}

function setEventListeners(formElement) {
  //настройка обработчиков событий валидации для формы
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector)); //создаю массив inputList, который содержит все поля формы
  const buttonElement = formElement.querySelector(config.submitButtonSelector); //элемент кнопки в форме с классом popup__button.
  disableSubmitButton(buttonElement, config, true); //вызов функции проверки валидности кнопки
  inputList.forEach((inputElement) => {
    //устанавливаю обработчик события input для каждого элемента в массиве inputList.
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement); //проверяю валидность конкретного поля ввода и обновдяю сообщение об ошибке, если необходимо.
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
    const fieldsetList = Array.from(formElement.querySelectorAll(config.formSetSelector)); //создаю массив fieldsetList для всех элементов формы на странице
    fieldsetList.forEach((fieldSet) => {
      setEventListeners(fieldSet); //для каждого fieldSet вызывается функция обработчика для полей ввода
    });
    setEventListeners(formElement); //вызываю функцию для текущей формы, устанавливая обработчики событий для всех полей ввода внутри нее.
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
    disableSubmitButton(buttonElement, config, true);
  } else {
    disableSubmitButton(buttonElement, config, false);
  }
}

function disableSubmitButton(button, config, disabled) {
  if (disabled === true) {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = disabled;
  } else {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = disabled;
  }
}