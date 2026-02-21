const infoImg = document.querySelector("#info-img");
const infoToggle = document.querySelector("#info-toggle");
const operatorNameSpans = document.querySelectorAll(".operator-name");
const operatorNameBtn = document.querySelector("#change-operator-name");
infoImg.addEventListener("click", (e) => {
    if (infoToggle.classList.contains("hidden")) {
        infoToggle.classList.remove("hidden");
    } else {
        infoToggle.classList.add("hidden");
    }
})
operatorNameBtn.addEventListener("click", (e) => {
    let newName = "";
    while (newName == "" ) {
        newName = prompt("Please enter your name (this can be changed at any time)", "");
    }
    setCookie("operator-name", newName, 365);
    populateFromCookies();
})

const clearDataBtn = document.querySelector("#clear-data-btn");
clearDataBtn.addEventListener("click", (e) => {
    deleteAllCookies();
    window.location.href = "/";
});
const logAllBtn = document.querySelector("#log-all-btn");
logAllBtn.addEventListener("click", (e) => {
    console.log(document.cookie);
    cookieStore.getAll().then(cookies => {
        cookies.forEach(cookie => {
            console.log(cookie);
        })
    })
});

let mainMusic;
let soundEffects = [];

const factoryDoor = document.querySelector("#factory-door");
const factoryDoorBtn = document.querySelector("#factory-door-btn");
factoryDoorBtn.addEventListener("click", (e) => {
    factoryDoor.animate([
        { top: "0" },
        { top: "calc(-100vh)" },
        { top: "calc(-100vh)" }
    ], {
        duration: 2500,
        iterations: 1
    });

    mainMusic = new Audio("./audio/housekeepingCaustic.mp3");
    mainMusic.loop = true;
    mainMusic.play();

    populateFromCookies();
    setTimeout(() => factoryDoor.classList.add("hidden"), 2000);
})

const crocBalanceSpans = document.querySelectorAll(".current-croc-balance");
const totalCrocsSpans = document.querySelectorAll(".total-croc-count")
let crocBalance = getCookie("croc-balance") != false ? getCookie("croc-balance") : 0;
let totalCrocs = getCookie("total-crocs") != false ? getCookie("total-crocs") : 0;
let comboMult = 1;
let clickHistory = [new Date()];
function makeCroc() {
    clickHistory.push(new Date());
    if (clickHistory.length > 10) {
        clickHistory.shift();
    }
    crocBalance += 1 * comboMult;
    totalCrocs += 1 * comboMult;
    crocBalanceSpans.forEach(span => span.textContent = crocBalance);
    totalCrocsSpans.forEach(span => span.textContent = totalCrocs);
    //playSound("./audio/explosion.mp3");
}

const comboBar = document.querySelector("#combo-bar");
const currentComboSpan = document.querySelector("#current-combo");
currentComboSpan.textContent = comboMult;
const greg = document.querySelector("#greg");
const mrSeal = document.querySelector("#mr-seal");
function updateCombo() {
    const maintainCombo = new Date().getTime() - clickHistory[clickHistory.length-1].getTime() < 400 ? true : false;
    if (comboBar.classList.contains("full")) {
        if (!maintainCombo) {
            const maintainFull = new Date().getTime() - clickHistory[clickHistory.length-1].getTime() < 3000 ? true : false;
            if (maintainFull) {
                return;
            }
        } else {
            return;
        }
    }
    if (maintainCombo) {
        if (comboBar.classList.contains("full")) {
            console.log("already full!");
        } else if (comboBar.getAttribute("style") == "background-position: 2%" || Number(comboBar.getAttribute("style").split(": ")[1].slice(0, -1)) <= 0) {
            comboBar.classList.add("full");
            greg.classList.add("rainbow-animation0");
            mrSeal.classList.add("rainbow-animation1");
            comboBar.removeAttribute("style");
            updateComboVar(2);
        } else if (comboBar.getAttribute("style") == "background-position: 100%") {
            comboBar.setAttribute("style", "background-position: 98%");
            greg.setAttribute("src", "./gifs/greg.gif");
            mrSeal.setAttribute("src", "./gifs/mrSeal.gif");
            crocImgDiv.classList.add("clickIP");
        } else {
            let currentBackPos = Number(comboBar.getAttribute("style").split(": ")[1].slice(0, -1));
            comboBar.setAttribute("style", `background-position: ${currentBackPos - 2}%`);
            crocImgDiv.classList.add("clickIP");
        }
    } else {
        if (comboBar.classList.contains("full")) {
            comboBar.classList.remove("full");
            greg.classList.remove("rainbow-animation0");
            mrSeal.classList.remove("rainbow-animation1");
            comboBar.setAttribute("style", "background-position: 2%");
            updateComboVar(0.5);
        } else if (comboBar.getAttribute("style") == "background-position: 100%") {
            greg.setAttribute("src", "./gifs/gregFREEZE.gif");
            mrSeal.setAttribute("src", "./gifs/mrSealFREEZE.gif");
        } else {
            let currentBackPos = Number(comboBar.getAttribute("style").split(": ")[1].slice(0, -1));
            comboBar.setAttribute("style", `background-position: ${currentBackPos + 2}%`);
            crocImgDiv.classList.remove("clickIP");
        }
    }
}
setInterval(updateCombo, 100);

function updateComboVar(factor) {
    comboMult *= factor;
    currentComboSpan.textContent = comboMult;
}

// currently limits number of total active sound effects to 10
function playSound(filepath) {
    if (soundEffects.length > 9 && !soundEffects[0].paused) {
        return;
    }
    let soundEffect = new Audio(filepath);
    soundEffect.play();
    soundEffects.push(soundEffect);
    if (soundEffects.length > 9 && soundEffects[0].paused) {
        soundEffects.shift();
    }
}

const crocImgArray = [
    "./images/backDirectR.png",
    "./images/bottomDirectR.png",
    "./images/outsideDirectR.png"
]
const crocImgDiv = document.querySelector("#croc-img-div");
const crocImg = document.querySelector("#croc-img-div img");
crocImgDiv.addEventListener("click", (e) => {
    let currentSrc = crocImg.getAttribute("src");
    let newSrc = currentSrc;
    while (newSrc == currentSrc) {
        newSrc = crocImgArray[Math.floor(Math.random()*3)];
    }
    crocImg.setAttribute("src", newSrc);
    makeCroc();
})

function populateFromCookies() {
    if (!getCookie("operator-name")) {
        let newName = "";
        while (newName == "" ) {
            newName = prompt("Please enter your name (this can be changed at any time)", "");
        }
        setCookie("operator-name", newName, 365);
    }
    operatorNameSpans.forEach(span => { span.textContent = getCookie("operator-name") });
    crocBalanceSpans.forEach(span => span.textContent = crocBalance);
    totalCrocsSpans.forEach(span => span.textContent = totalCrocs);
}
populateFromCookies();

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

function deleteCookie(cname) {
    console.log("Deleted cookie: " + cname);
    cookieStore.delete(cname);
}

function deleteAllCookies() {
    cookieStore.getAll().then(cookies => {
        cookies.forEach(cookie => {
            deleteCookie(cookie.name);
        })
    })
}
//deleteAllCookies();