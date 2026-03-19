

const sideBarButton = document.getElementById('side-bar-button');
const sideBar = document.getElementById('side-bar');
const pageLink = document.getElementById('page-link');
sideBarButton.addEventListener('click', () => {
    sideBar.classList.toggle('open');
});

const currentWorkout = {
    name: document.getElementById('name')
}

// Testing purposes
const loadJsonButton = document.getElementById('loadjson');
loadJsonButton.addEventListener('click', load_full_body);

async function load_full_body() {
    const fullBodyURL = "C:/Users/nsayl/Desktop/websites/nas5606psu/pages/workouts/full-body.json";
    const request = new Request(fullBodyURL);
    const response = await fetch(request);
    const fullBody = await response.json();
    currentWorkout.name.textContent = fullBody.one.textContent;
}

