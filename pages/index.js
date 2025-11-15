import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopupEl = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopupEl.querySelector(".popup__form");
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const openModal = () => addTodoPopup.open();
const closeModal = () => addTodoPopup.close();

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}
function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(-1);
}

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    if (!addTodoForm.checkValidity()) return;

    const name = inputValues.name;
    const dateInput = inputValues.date;

    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const id = uuidv4();
    const values = { name, date, id };

    renderTodo(values);
    todoCounter.updateTotal(1);
    newTodoFormValidator.resetValidation();
    closeModal();
  },
});

const section = new Section({
  items: initialTodos,
  renderer: (item) => {
    const todo = generateTodo(item);
    section.addItem(todo);
  },
  containerSelector: ".todos__list",
});

const generateTodo = (data) => {
  const todo = new Todo(
    data,
    "#todo-template",
    handleCheck,
    handleDelete,
    todoCounter.updateTotal
  );
  return todo.getView();
};

const renderTodo = (item) => {
  const todo = generateTodo(item);

  section.addItem(todo);
};

addTodoButton.addEventListener("click", () => openModal(addTodoPopupEl));

const newTodoFormValidator = new FormValidator(validationConfig, addTodoForm);
newTodoFormValidator.enableValidation();
section.renderItems();
addTodoPopup.setEventListeners();
