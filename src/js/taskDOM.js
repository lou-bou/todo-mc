import { PersistanceManager } from './logic.js';

export function renderTasksDOM() {
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

function createTaskDOMElements(taskObject, taskContainer) {
    // these three DOM elements aren't really used so there's no need for their respective functions to return them but just in case yknow for potential future updates
    const taskTitle = createTaskTitleDOM(taskObject, taskContainer);

    const taskCategories = createTaskCategoriesDOM(taskObject, taskContainer);

    const taskEditButton = createTaskEditButtonDOM(taskObject, taskContainer);

    return { taskTitle, taskCategories, taskEditButton };
}

export function createTaskDOM(taskObject) {
    const tasksContainer = document.querySelector('#tasks');

    const taskContainer = createTaskContainerDOM(taskObject);
    
    const { taskTitle, taskCategories, taskEditButton } = createTaskDOMElements(taskObject, taskContainer);

    tasksContainer.appendChild(taskContainer);
}

// the only difference between this function and createTaskDOM is that the latter creates and appends taskContainer to tasksContainer, but this one doesn't because the taskContainer already exists.
export function editTaskDOM(taskObject, taskContainer) {
    taskContainer.setAttribute('data-task-id', taskObject.id);
    
    const { taskTitle, taskCategories, taskEditButton } = createTaskDOMElements(taskObject, taskContainer);
}