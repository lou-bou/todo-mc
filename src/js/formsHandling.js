export function clearForms() {
    const forms = document.querySelectorAll('.task-form');
    
    forms.forEach((form) => {
        clearForm(form);
    });
}

export function clearForm(form) {
    form.title.value = '';
    form.Personal.checked = false;
    form.Work.checked = false;
    form.School.checked = false;
    form.Urgent.checked = false;
    form.Optional.checked = false;
}

export function handleFormData(form) {
    let formData = new FormData(form);

    let title;
    let categories = [];

    for (var pair of formData.entries()) {
        // the html form has a title input and categories inputs, the first pair is the title input
        if (pair[0] == 'title') { 
            title = pair[1];
        } else {
            // only the checked categories will be in this iterator, and they have pair[1] = 'on'
            categories.push(pair[0]); 
        }
    }

    return {title, categories};
}