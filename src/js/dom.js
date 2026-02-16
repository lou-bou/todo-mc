import { Task, PersistanceManager } from './logic.js';
import { clearForm, clearForms, handleFormData } from './formsHandling.js';

function renderTasksDOM() {
    const tasks = PersistanceManager.retrieveAllTasks();

    for (let i = 0; i < tasks.length; i++) {
        createTaskDOM(tasks[i]);
    }
}

function createTaskContainerDOM(taskObject) {
    const taskContainer = document.createElement('div');
    taskContainer.setAttribute('data-task-id', taskObject.id);

    return taskContainer;
}

function createTaskTitleDOM(taskObject, taskContainer) {
    const taskTitle = document.createElement('span');

    taskTitle.innerText = taskObject.title;
    taskTitle.setAttribute('class', 'task-title');

    taskContainer.appendChild(taskTitle);

    return taskTitle;
}

function createTaskEditButtonEventListener(taskObject, taskEditButton) {
    const editTaskDialog = document.querySelector('#edit-task-dialog');
    const editTaskForm = document.querySelector('#edit-task-form');

    taskEditButton.addEventListener('click', () => {
        editTaskDialog.showModal();

        editTaskForm.setAttribute('data-task-id', taskObject.id);
        editTaskForm.title.value = taskObject.title;

        let editTaskCheckbox; // used to assign each category value looped through
        
        for (let i = 0; i < taskObject.categories.length; i++) {
            editTaskCheckbox = document.querySelector(`#edit-${taskObject.categories[i]}`);
            editTaskCheckbox.checked = true;
        }
    });
}

function createTaskEditButtonDOM(taskObject, taskContainer) {
    const taskEditButton = document.createElement('button');

    taskEditButton.innerText = 'Edit';
    taskEditButton.setAttribute('class', 'edit-task-button');
    taskEditButton.setAttribute('data-task-id', taskObject.id);

    taskContainer.appendChild(taskEditButton);

    createTaskEditButtonEventListener(taskObject, taskEditButton);

    return taskEditButton;
}

function createTaskCategoriesDOM(taskObject, taskContainer) {
    let taskCategory; // used for iteration

    for (const category of taskObject.categories) {
        taskCategory = document.createElement('span');
        taskCategory.innerText = category;
        taskCategory.style.color = 'green';
        taskCategory.style.weight = 'none';
        taskCategory.setAttribute('class', 'task-category');

        taskContainer.appendChild(taskCategory);
    }

    return taskObject.categories; // taskCategory and a category in taskObject.categories are the same lol
}

function createTaskDOM(taskObject) {
    const tasksContainer = document.querySelector('#tasks');

    const taskContainer = createTaskContainerDOM(taskObject);
    
    const taskTitle = createTaskTitleDOM(taskObject, taskContainer);

    const taskCategories = createTaskCategoriesDOM(taskObject, taskContainer);

    const taskEditButton = createTaskEditButtonDOM(taskObject, taskContainer);

    tasksContainer.appendChild(taskContainer);
}

// the only difference between this function and createTaskDOM is that the latter creates and appends taskContainer to tasksContainer, but this one doesn't because the taskContainer already exists.
function editTaskDOM(taskObject, taskContainer) {
    taskContainer.setAttribute('data-task-id', taskObject.id);
    
    createTaskTitleDOM(taskObject, taskContainer);

    createTaskCategoriesDOM(taskObject, taskContainer);

    createTaskEditButtonDOM(taskObject, taskContainer);
}

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