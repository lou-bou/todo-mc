import { Task, PersistanceManager } from './logic.js';

function renderTasksDOM() {
    const tasks = PersistanceManager.retrieveAllTasks();

    for (let i = 0; i < tasks.length; i++) {
        createTaskDOM(tasks[i]);
    }
}

function clearForms() {
    const forms = document.querySelectorAll('.task-form');
    
    forms.forEach((form) => {
        clearForm(form);
    })
}

function clearForm(form) {
    form.title.value = '';
    form.Personal.checked = false;
    form.Work.checked = false;
    form.School.checked = false;
    form.Urgent.checked = false;
    form.Optional.checked = false;
}

function createTaskDOM(taskObject) {
    const tasksContainer = document.querySelector('#tasks');
    const taskContainer = document.createElement('div');
    const taskTitle = document.createElement('span');
    const taskEditButton = document.createElement('button');

    taskTitle.innerText = taskObject.title;
    taskEditButton.innerText = 'Edit';
    taskEditButton.setAttribute('class', 'edit-task-button');
    taskEditButton.setAttribute('data-task-id', taskObject.id);

    taskContainer.appendChild(taskTitle);
    taskContainer.appendChild(taskEditButton);
    tasksContainer.appendChild(taskContainer);
}

function handleFormData(form) {
    let formData = new FormData(form);

    let title;
    let categories = [];

    for (var pair of formData.entries()) {
        // the html form has a title input and categories inputs, it checks if the pair is for the title input (the first one)
        if (pair[0] == 'title') { 
            title = pair[1];
        } else {
            // the categories selected will have pair[1] = on, and only the selected categories will be iterated.
            categories.push(pair[0]); 
        }
    }

    return {title, categories};
}

renderTasksDOM(); // gets called each time the page is loaded to display all tasks in localStorage
clearForms(); // gets called each time the page is loaded to clear all forms from old values


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
let editTaskButtons; // these buttons may not exist if no tasks are created yet
if (document.querySelector('.edit-task-button')) {
    editTaskButtons = document.querySelectorAll('.edit-task-button');
}

editTaskButtons.forEach((editTaskButton) => {
    editTaskButton.addEventListener('click', () => {
        editTaskDialog.showModal();

        const taskId = editTaskButton.getAttribute('data-task-id');
        const taskObject = PersistanceManager.retrieveTask(taskId);

        editTaskForm.title.value = taskObject.title;

        let editTaskCheckbox; // used to assign each category value looped through
        
        for (let i = 0; i < taskObject.categories.length; i++) {
            editTaskCheckbox = document.querySelector(`#edit-${taskObject.categories[i]}`);
            editTaskCheckbox.checked = true;
        }
    });
});

editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    clearForm(editTaskForm);
    editTaskDialog.close();
});