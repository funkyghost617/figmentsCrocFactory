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
    populateFromCookies();
    setTimeout(() => factoryDoor.classList.add("hidden"), 2000);
})

const crocBalanceSpans = document.querySelectorAll(".current-croc-balance");
const totalCrocsSpans = document.querySelectorAll(".total-croc-count")
let crocBalance = getCookie("croc-balance") != false ? getCookie("croc-balance") : 0;
let totalCrocs = getCookie("total-crocs") != false ? getCookie("total-crocs") : 0;
function makeCroc() {
    crocBalance += 1;
    totalCrocs += 1;
    crocBalanceSpans.forEach(span => span.textContent = crocBalance);
    totalCrocsSpans.forEach(span => span.textContent = totalCrocs);
}

const crocImgArray = [
    "./images/backDirectR.png",
    "./images/bottomDirectR.png",
    "./images/outsideDirectR.png",
    "./images/topDirectR.png"
]
const crocImgDiv = document.querySelector("#croc-img-div");
const crocImg = document.querySelector("#croc-img-div img");
crocImgDiv.addEventListener("click", (e) => {
    let currentSrc = crocImg.getAttribute("src");
    let newSrc = currentSrc;
    while (newSrc == currentSrc) {
        newSrc = crocImgArray[Math.floor(Math.random()*4)];
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