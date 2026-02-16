export class Task {
    id;
    title;
    categories = [];
    status;

    constructor(title, categories) { // the categories parameter here must be implemented as an array
        this.id = crypto.randomUUID();
        this.title = title;
        this.categories = CategoriesManager.addCategories(this.categories, categories);
        this.status = 'pending';
    }
}

class CategoriesManager { // class for handling categories
    static validCategories = ['Personal', 'Work', 'School', 'Urgent', 'Optional'];

    static addCategories(categorieslist, categories) {
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                if (this.validCategories.includes(categories[i])) {
                    categorieslist.push(categories[i]);
                } else {
                    console.log(`Category '${categories[i]}' is not a valid category.`);
                }
            }
        }

        return categorieslist;
        
    }
}

export class PersistanceManager { // utility class for all localStorage related functions
    static storeTask(task) {
        const stringifiedTask = JSON.stringify(task); // at this point, the task object has lost all of its methods
        localStorage.setItem(task.id, stringifiedTask);
    }

    static retrieveTask(taskId) { // the retrieved task object doesn't have its methods, so we'll create a new task and assign its methods to the retrieved task object
        const plainTaskObject = localStorage.getItem(taskId);
        const parsedTask = JSON.parse(plainTaskObject);
        const reconstructedTaskObject = new Task();
        Object.assign(reconstructedTaskObject, parsedTask);
        return reconstructedTaskObject;
    }

    static retrieveAllTasks() {
        let tasks = [];
        let task; // to use in iteration for each task in the list
        const tasksIds = Object.keys(localStorage); // gets all localStorage keys (the tasks ids in this case)
        
        for (let i = 0; i < tasksIds.length; i++) {
            task = this.retrieveTask(tasksIds[i]);
            tasks.push(task);
        }

        return tasks;
    }
}