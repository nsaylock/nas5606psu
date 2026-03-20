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

// Side Bar
const sideBarButton = document.getElementById('side-bar-button');
const sideBar = document.getElementById('side-bar');
const pageLink = document.getElementById('page-link');
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


// -------------------- FUNCTIONS

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

// begin workout button ??
//async function load_full_body() {
//    const fullBodyURL = 'data/workouts.json';
//    const request = new Request(fullBodyURL);
//    const response = await fetch(request);
//    const workoutsJSON = await response.json();

//    return workoutsJSON;
    

    //const repsArr = workoutsJSON.reps;
    //const workoutDict = workoutsJSON.workouts; //Keys from the JSON file

//}

function get_new() {
    if (first == true) {
        button.begin.classList.toggle('hidden');
        first = false;
    }
    // for full body
    select_muscle_group(); // Gets key and size
    new_workout(workoutsDict[currentMG]);
}

function select_muscle_group() {
    let i = Math.ceil(Math.random()*8);
    switch (i) {
        case 1:
            currentMG = "Legs";
            size = 18;
            break;
        case 2:
            currentMG = "Chest";
            size = 24;
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


function done() {
    numCompleted++;
    completedWorkoutsDict[currentMG].push(index);
    const newDiv = document.createElement('div');
    let previousWorkout = `${currentName} ------ ${currentSets} x ${currentReps} reps`;
    
    newDiv.textContent = numCompleted + '. ' + previousWorkout;
    completedWorkoutsList.appendChild(newDiv);
    // Make pop up to enter weight used
    get_new();
}

function add_to_completed_list() {
    

}

function new_workout(array) {
    // alert('update name called');
    let randNum = Math.ceil(Math.random()*size);
    index = String(randNum);

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