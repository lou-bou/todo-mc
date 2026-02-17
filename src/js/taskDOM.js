import { PersistanceManager } from './logic.js';

export function renderTasksDOM() {
    const tasks = PersistanceManager.retrieveAllTasks();

    for (let i = 0; i < tasks.length; i++) {
        createTaskDOM(tasks[i]);
    }
}

function createTaskContainerDOM(taskObject) {
    const taskContainer = document.createElement('div');

    taskContainer.setAttribute('class', 'task-container');
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

function createTaskCategoriesDOM(taskObject, taskContainer) {
    let taskCategory; // used for iteration

    for (const category of taskObject.categories) {
        taskCategory = document.createElement('span');
        taskCategory.innerText = category;
        taskCategory.setAttribute('class', 'task-category');

        taskContainer.appendChild(taskCategory);
    }

    return taskObject.categories; // taskCategory and a category in taskObject.categories are the same lol
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

function createTaskDeleteButtonDOM(taskObject, taskContainer) {
    const taskDeleteButton = document.createElement('button');

    taskDeleteButton.innerText = 'Delete';
    taskDeleteButton.setAttribute('class', 'delete-task-button');
    taskDeleteButton.setAttribute('data-task-id', taskObject.id);

    taskContainer.appendChild(taskDeleteButton);

    createTaskDeleteButtonEventListener(taskObject, taskDeleteButton);

    return taskDeleteButton;
}

function createTaskDeleteButtonEventListener(taskObject, taskDeleteButton) {
    taskDeleteButton.addEventListener('click', () => {
        PersistanceManager.deleteTask(taskObject.id);

        const tasksContainer = document.querySelector('#tasks');
        const taskContainer = document.querySelector(`div[data-task-id='${taskObject.id}']`);

        tasksContainer.removeChild(taskContainer);
    });
}

function changeTaskStatus(taskObject) {
    // this swaps the current status to its opposite
    if (taskObject.status == 'pending') {
        return 'completed';
    } else {
        return 'pending';
    }
}

function setTaskStatusButtonColorDOM(taskObject) {
    // this doesnt swap, just returns the corresponding style for each status
    if (taskObject.status == 'pending') {
        return 'transparent';
    } else {
        return 'white';
    }
}

function createTaskStatusButtonDOM(taskObject, taskContainer) {
    const taskStatusButton = document.createElement('div');

    taskStatusButton.style.backgroundColor = setTaskStatusButtonColorDOM(taskObject);

    taskStatusButton.setAttribute('class', 'status-task-button');
    taskStatusButton.setAttribute('data-task-id', taskObject.id);

    taskContainer.appendChild(taskStatusButton);

    createTaskStatusButtonEventListener(taskObject, taskStatusButton);

    return taskStatusButton;
}

function createTaskStatusButtonEventListener(taskObject, taskStatusButton) {
    taskStatusButton.addEventListener('click', () => {
        taskObject.status = changeTaskStatus(taskObject);
        
        PersistanceManager.storeTask(taskObject);

        taskStatusButton.style.backgroundColor = setTaskStatusButtonColorDOM(taskObject);
    });
}

function createTaskDOMElements(taskObject, taskContainer) {
    // these three DOM elements aren't really used so there's no need for their respective functions to return them but just in case yknow for potential future updates

    const titleNStatusContainer = document.createElement('div');
    titleNStatusContainer.setAttribute('class', 'title-status-container');

    const taskStatusButton = createTaskStatusButtonDOM(taskObject, titleNStatusContainer);

    const taskTitle = createTaskTitleDOM(taskObject, titleNStatusContainer);

    const categoriesNButtonsContainer = document.createElement('div');
    categoriesNButtonsContainer.setAttribute('class', 'categories-buttons-container');

    const taskCategories = createTaskCategoriesDOM(taskObject, categoriesNButtonsContainer);

    const taskEditButton = createTaskEditButtonDOM(taskObject, categoriesNButtonsContainer);

    const taskDeleteButton = createTaskDeleteButtonDOM(taskObject, categoriesNButtonsContainer);

    taskContainer.appendChild(titleNStatusContainer);
    taskContainer.appendChild(categoriesNButtonsContainer);

    return { taskStatusButton, taskTitle, taskCategories, taskEditButton, taskDeleteButton };
}

export function createTaskDOM(taskObject) {
    const tasksContainer = document.querySelector('#tasks');

    const taskContainer = createTaskContainerDOM(taskObject);
    
    const { taskStatusButton, taskTitle, taskCategories, taskEditButton, taskDeleteButton } = createTaskDOMElements(taskObject, taskContainer);

    tasksContainer.appendChild(taskContainer);
}

// the only difference between this function and createTaskDOM is that the latter creates and appends taskContainer to tasksContainer, but this one doesn't because the taskContainer already exists.
export function editTaskDOM(taskObject, taskContainer) {
    taskContainer.setAttribute('data-task-id', taskObject.id);
    
    const { taskTitle, taskCategories, taskEditButton } = createTaskDOMElements(taskObject, taskContainer);
}