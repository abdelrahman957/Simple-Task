//--------------------- nav settings -----------------//
let nav = document.querySelector('#site_nav'),
    menuBtn = document.querySelector('.menu_btn'),
    mobileList = document.querySelector('.mobile_list');

let scrolling = 0;
window.onscroll = function name() {
    if (window.pageYOffset > scrolling) {
        nav.classList.add("hide");
    } else {
        nav.classList.remove("hide");
    }
    scrolling = window.scrollY;
};

menuBtn.addEventListener('click', () => {
    mobileList.classList.toggle('slide_list');
})

//--------------------- movies section -----------------//

let moviesShow = document.querySelector('.movies_show'),
    allMovies = [],
    prevPage = document.querySelector('.prev_page'),
    currentPage = document.querySelector('.current_page'),
    nxtPage = document.querySelector('.nxt_page'),
    index = 1;

function getMovies() {
    const requestData = new XMLHttpRequest();
    requestData.open('GET', `https://api.themoviedb.org/3/movie/popular?api_key=b42c7ffd8fb3615ec3680fd9efbf6683&language=en-US&page=${index}`);
    requestData.send();

    requestData.addEventListener('readystatechange', () => {
        if (requestData.readyState == 4 && requestData.status == 200) {
            allMovies = JSON.parse(requestData.response).results;
            displayData();
        }
    })

};

function displayData() {
    let showData = '';
    for (let i = 0; i < allMovies.length; i++) {
        showData += `
        <div class="movie">
            <div style="overflow:hidden">
                <img src="https://image.tmdb.org/t/p/w500/${allMovies[i].poster_path}" class="img-fluid" />
            </div>
            <div class="movie_dts">
                <p>${allMovies[i].title}</p>
                <div class="date_rate">
                    <span>${getMovieDate(allMovies[i].release_date)}</span>
                    <span>${(allMovies[i].vote_average).toString().replace('.', '')}%</span>
                </div>
            </div>
        </div>`
    }
    moviesShow.innerHTML = showData;
}

nxtPage.addEventListener('click', () => {
    if (index < 99) {
        index++;
        currentPage.innerHTML = index;
        getMovies();
    }
})

prevPage.addEventListener('click', () => {
    if (index > 1) {
        index--;
        currentPage.innerHTML = index;
        getMovies();
    }
})

function getMovieDate(movieDate) {
    const date = new Date(movieDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`;
}

getMovies();

//--------------------- contact section -----------------//

let inputs = Array.from(document.querySelectorAll('.form-control input, textarea')),
    dangerAlerts = Array.from(document.querySelectorAll('.form-control .danger_alert')),
    successAlerts = Array.from(document.querySelectorAll('.form-control .success_alert')),
    length = document.querySelector('.length'),
    submitBtn = document.querySelector('.submit_btn'),
    sentMessage = document.querySelector('.sent_message'),
    ///////////////////name          -       email    -           phone           -       message
    validators = [/^[a-zA-Z ]{4,20}$/, /\S+@\S+\.\S+$/, /^(002)?01[0125][0-9]{8}$/, /^[A-Za-z0-9]{20,500}$/]

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', validationTextInputs);
    inputs[i].addEventListener('keyup', validationTextInputs);
}
function validationTextInputs() {
    for (let i = 0; i < inputs.length; i++) {
        if (i == inputs.length - 1 && inputs[inputs.length - 1].value.length > 0) {
            getLength();
        } else {
            length.style.display = 'none';
        }
        if (inputs.indexOf(this) == i) {
            if (validators[i].test(inputs[i].value)) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
                dangerAlerts[i].style.display = 'none';
                successAlerts[i].style.display = 'block';
            }
            else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                dangerAlerts[i].style.display = 'block';
                successAlerts[i].style.display = 'none';
            }
        }
    }
    checkByBtn();
}

function getLength() {
    const text = inputs[inputs.length - 1].value.length;
    length.innerHTML = `<i class="far fa-keyboard" style="margin-right:5px"></i><span>Letters: ${text} </span>`;
    length.style.display = 'block';
}

function checkByBtn() {
    for (let i = 0; i < inputs.length; i++) {
        if (validators[i].test(inputs[i].value)) {
            submitBtn.removeAttribute('disabled');
            submitBtn.style.cursor = 'pointer';
        }
        else {
            submitBtn.setAttribute('disabled', true);
            submitBtn.style.cursor = 'not-allowed';
            break;
        }
    }
}

submitBtn.addEventListener('click', () => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
        inputs[i].classList.remove('is-valid');
        successAlerts[i].style.display = 'none';
    }
    sentMessage.style.display = 'block';
    checkByBtn();
    length.style.display = 'none';
})