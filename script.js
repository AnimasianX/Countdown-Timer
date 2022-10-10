const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button')
const timeEl = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info')
const completeBtn = document.getElementById('complete-button');

//globals
let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input minimum with todays date
const today = new Date();

dateEl.setAttribute('min', today.toISOString().split('T')[0]);
dateEl.setAttribute('value', today.toISOString().split('T')[0]);

//populate countdown and ui(later)
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        //hide input container
        inputContainer.hidden = true;

        //if countdown ended, then show completed
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            //populating countdown variables
            countdownElTitle.textContent = `${countdownTitle}`;
            timeEl[0].textContent = `${days}`;
            timeEl[1].textContent = `${hours}`;
            timeEl[2].textContent = `${minutes}`;
            timeEl[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Take values from form
function updateCountdown(event) {
    event.preventDefault();
    countdownTitle = event.srcElement[0].value;
    countdownDate = event.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    //chek for valid date
    if (countdownDate === '') {
        alert('Please select a date for the countdown.')
    } else {
        // get number version of current date
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}


//reset countdown
function resetCountdown() {
    //hide countdown , show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    //stop countdown 
    clearInterval(countdownActive);
    //reset value for countdown title
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');//localstorage cache
}

//checks cache to see if countdown exists
function restorePreviousCountdown() {
    //get countdown from localstorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}
//event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);

//on load
restorePreviousCountdown();