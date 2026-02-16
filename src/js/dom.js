import { Task, PersistanceManager } from './logic.js';
import { clearForm, clearForms, handleFormData } from './formsHandling.js';
import { renderTasksDOM, createTaskDOM, editTaskDOM } from './taskDOM.js';

renderTasksDOM(); // gets called each time the page is loaded to display all tasks in localStorage
clearForms(); // gets called each time the page is loaded to clear all forms from old values

// this handles pressing escape on a dialog form. Without it, the form would still have the old values.
document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        clearForms();
    }
});

// adding a task

const addTaskButton = document.querySelector('#add-task-button');
const addTaskDialog = document.querySelector('#add-task-dialog');
const addTaskForm = document.querySelector('#add-task-form');

addTaskButton.addEventListener('click', () => {
    addTaskDialog.showModal();
}); // the add task button's sole purpose

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const {title, categories} = handleFormData(addTaskForm);

    // this is logic stuff not supposed to be in dom, be careful with future imports to avoid circular dependencies
    const task = new Task(title, categories);
    PersistanceManager.storeTask(task);

    createTaskDOM(task);

    clearForm(addTaskForm);

    addTaskDialog.close();
});

// editing a task
const editTaskDialog = document.querySelector('#edit-task-dialog');
const editTaskForm = document.querySelector('#edit-task-form');

// there are many edit task buttons, one for each task, so their event listeners are created with their tasks' DOM elements.

editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskId = editTaskForm.getAttribute('data-task-id');

    const taskObject = PersistanceManager.retrieveTask(taskId);

    const taskContainer = document.querySelector(`div[data-task-id='${taskId}']`);

    taskObject.title = editTaskForm.title.value;
    taskObject.categories = [];

    const checkboxes = document.querySelectorAll('.edit-checkbox');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            taskObject.categories.push(checkbox.name);
        }
    });

    PersistanceManager.storeTask(taskObject);

    taskContainer.innerHTML = ''; // deconstruct the current task's DOM

    editTaskDOM(taskObject, taskContainer); // reconstruct it

    clearForm(editTaskForm);

    editTaskDialog.close();
});