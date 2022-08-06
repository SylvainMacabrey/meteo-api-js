let button = document.getElementById('submit-btn');
let panels = document.getElementById('panels');
let template = document.getElementById('meteo-panel');

let listPanels = [];
let listDay = [];


const getMeteo = async (e) => {
    e.preventDefault();
    let city = document.forms["form-city"]["city"].value;
    listDay.splice(0, listDay.length);
    panels.innerHTML = "";
    try {
        const response = await fetch(`https://www.prevision-meteo.ch/services/json/${ city }`);
        let meteo = await response.json();
        listDay.push(meteo.fcst_day_0, meteo.fcst_day_1, meteo.fcst_day_2, meteo.fcst_day_3, meteo.fcst_day_4);
        if ("content" in document.createElement("template")) {
            listDay.forEach(day => {
                let clone = document.importNode(template.content, true);
                let h4 = clone.querySelector("h4");
                h4.innerHTML = meteo.city_info.name;
                let img = clone.querySelector("img");
                img.src = day.icon_big;
                let p = clone.querySelectorAll("p");
                p[0].innerHTML = `${ reformateDate(day.day_long) } ${ reformateDate(day.date) }`;
                p[1].innerHTML = day.condition;
                p[2].innerHTML = `Température minimum ${ day.tmin } °C`;
                p[3].innerHTML = `Température maximum ${ day.tmax } °C`;
                panels.appendChild(clone);
            });
        }
    } catch (err) {
        throw new Error(err);
    }
}

const reformateDate = (date) => {
    return date.split('.').join('/');
}

const setForward = (e) => {
    e.style.filter = "none";
    e.classList.add('primary-panel');
    let info = e.childNodes[3];
    info.classList.add('primary-info');
    listPanels.forEach(panel => behind(panel));
}

const behind = (e) => {
    if(!e.classList.contains('primary-panel')) {
        e.style.filter = "contrast(70%)";
    }
}

const setBackwards = (e) => {
    e.classList.remove('primary-panel');
    let info = e.childNodes[3];
    info.classList.remove('primary-info');
}

button.addEventListener('click', getMeteo);