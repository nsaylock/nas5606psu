let workoutIndex = '';
let completedWorkoutsDict = {
    "Legs": [],
    "Chest": [],
    "Shoulders": [],
    "Triceps": [],
    "Back": [],
    "Biceps": [],
    "Abs": [],
    "Bodyweight": []
};

let workoutSelection = '';
let setsArr = [];
let repsArr = [];
let workoutsDict = {};
let currentMG = '';
let size;
let currentName = '';
let currentSets = '';
let currentReps = '';
let first = true;
let numCompleted = 0;

const pageTitleElement = document.getElementById('page-title-text');

// Side Bar
const sideBarButton = document.getElementById('side-bar-button');
const sideBar = document.getElementById('side-bar');
sideBarButton.addEventListener('click', () => {
    sideBar.classList.toggle('open');
});

// Text Display the current workout, sets, and reps
const currentWorkout = {
    name: document.getElementById('name'),
    sets: document.getElementById('sets'),
    reps: document.getElementById('reps')
}
const currentMuscleGroup = document.getElementById('muscle-group');

// Buttons
const button = {
    skip: document.getElementById('skip'),
    done: document.getElementById('done'),
    begin: document.getElementById('begin')
}

// Bottom
const completedWorkoutsList = document.getElementById('completed-list');
   
//////

// ------- EVENT LISTENERS

button.skip.addEventListener('click', (e) => {
    if (first == true) {
        //Do nothing
    } else {
        get_new();
    }
});
button.done.addEventListener('click', done);
button.begin.addEventListener('click', get_new);



const fullBodyButton = document.getElementById('full-body');
const pushButton = document.getElementById('push');
const pullButton = document.getElementById('pull');
const legsButton = document.getElementById('legs');
const absButton = document.getElementById('abs');
const bodyweightButton = document.getElementById('bodyweight');

// -------------------- FUNCTIONS

window.addEventListener('load', function() {
    button.done.classList.add('hidden');
    button.skip.classList.add('hidden');
    workoutSelection = 'full-body';
    reload_page();
    sideBar.classList.toggle('open');
});

fetch('data/workouts.json')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
    })
    .then(workouts => {
        setsArr = workouts.sets;
        repsArr = workouts.reps;
        workoutsDict = workouts.workouts;

    })
    .catch(error => console.error('Error loading JSON:', error));

function get_new() {
    if (first == true) {
        button.begin.classList.toggle('hidden');
        button.skip.classList.remove('hidden');
        button.done.classList.remove('hidden');
        first = false;
    }
    // for full body
    select_muscle_group(); // Gets key and size
    new_workout(workoutsDict[currentMG]);
}

function select_muscle_group() {
    // Total of 136 Workouts
    switch (workoutSelection) {
        case 'full-body':
            i = Math.ceil(Math.random() * 8);
            break;
        case 'push':
            i = Math.ceil(Math.random() * 3) + 1;
            break;
        case 'pull':
            i = Math.ceil(Math.random() * 2) + 4;
            break;
        case 'legs':
            i = 1;
            break;
        case 'abs':
            i = 7;
            break;
        case 'bodyweight':
            i = 8;
            break;
    }
    
    switch (i) {
        case 1:
            currentMG = "Legs";
            size = 18;
            break;
        case 2:
            currentMG = "Chest";
            size = 22;
            break;
        case 3:
            currentMG = "Shoulders";
            size = 21;
            break;
        case 4:
            currentMG = "Triceps";
            size = 19;
            break;
        case 5:
            currentMG = "Back";
            size = 19;
            break;
        case 6:
            currentMG = "Biceps";
            size = 15;
            break;
        case 7:
            currentMG = "Abs";
            size = 15;
            break;
        case 8:
            currentMG = "Bodyweight";
            size = 7;
            break;
    }
}

function new_workout(array) {
    // reset completed list to avoid infinite loop
    if (completedWorkoutsDict[currentMG].length == size) {
        completedWorkoutsDict[currentMG] = [];
    }

    do {
        selector = Math.ceil(Math.random()*size);
    } while (completedWorkoutsDict[currentMG].includes(selector));
    completedWorkoutsDict[currentMG].push(selector);

    index = String(selector);

    currentWorkout.name.textContent = array[index];
    currentMuscleGroup.textContent = currentMG;

    let setsIndex = Math.floor(Math.random()*4);
    let repsIndex = Math.floor(Math.random()*6);

    // Go floor because choosing from array (start index = 0)

    currentWorkout.sets.textContent = setsArr[setsIndex];
    currentWorkout.reps.textContent = repsArr[repsIndex];

    currentName = array[index];
    currentSets = setsArr[setsIndex];
    currentReps = repsArr[repsIndex];

}

function done() {
    numCompleted++;

    const listLeft = document.createElement('div');
    listLeft.textContent = numCompleted + '. ' + currentName;
    completedWorkoutsList.appendChild(listLeft);

    const listRight = document.createElement('div');
    listRight.textContent = `${currentSets} x ${currentReps} reps`;
    listRight.classList.add('list-right');
    completedWorkoutsList.appendChild(listRight);
    // Make pop up to enter weight used
    get_new();
}

function reload_page() {
    sideBar.classList.toggle('open');
    newTitle = workoutSelection.charAt(0).toUpperCase() + workoutSelection.slice(1);
    document.title = newTitle;
    pageTitleElement.textContent = newTitle;

}


fullBodyButton.addEventListener('click', (e) => {
    workoutSelection = 'full-body';
    reload_page();
});
pushButton.addEventListener('click', (e) => {
    workoutSelection = 'push';
    reload_page();
});

pullButton.addEventListener('click', (e) => {
    workoutSelection = 'pull';
    reload_page();
});

legsButton.addEventListener('click', (e) => {
    workoutSelection = 'legs';
    reload_page();
});

absButton.addEventListener('click', (e) => {
    workoutSelection = 'abs';
    reload_page();
});

bodyweightButton.addEventListener('click', (e) => {
    workoutSelection = 'bodyweight';
    reload_page();
});