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
const reloadPageBtn = document.querySelector("#reload-page-btn");
reloadPageBtn.addEventListener("click", (e) => {
    window.location.reload();
})

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

    if (getCookie("total-crocs") == "0") {
        setTimeout(() => startEvent("tutorial0"), 1200);
    }
    mainMusic = new Audio("./audio/housekeepingCaustic.mp3");
    mainMusic.loop = true;
    mainMusic.play();

    populateFromCookies();
    setTimeout(() => factoryDoor.classList.add("hidden"), 2000);
})

const crocBalanceSpans = document.querySelectorAll(".current-croc-balance");
const totalCrocsSpans = document.querySelectorAll(".total-croc-count");
const currentOutputSpans = document.querySelectorAll(".current-croc-output");
let crocBalance = getCookie("croc-balance") != false ? getCookie("croc-balance") : 0;
let totalCrocs = getCookie("total-crocs") != false ? getCookie("total-crocs") : 0;
let currentOutput = 0;
let comboMult = 1;
let clickHistory = [new Date()];
function makeCroc(number = 1, source = "click", e) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    if (source == "click") {
        clickHistory.push(new Date());
        if (clickHistory.length > 10) {
            clickHistory.shift();
        }
        particle.style.left = `${e.clientX - 30 + window.scrollX}px`;
        particle.style.top = `${e.clientY - 50 + window.scrollY}px`;
    } else {
        particle.style.left = `${e.getBoundingClientRect().left + window.scrollX + Math.floor(e.getBoundingClientRect().width * 0.5) - 10}px`;
        particle.style.top = `${e.getBoundingClientRect().top + window.scrollY + Math.floor(e.getBoundingClientRect().height * 0.5)}px`;
    }
    particle.textContent = "+" + (1 * comboMult * number);
    particleDiv.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
    
    crocBalance = Number(crocBalance) + (1 * comboMult * number);
    totalCrocs = Number(totalCrocs) + (1 * comboMult * number);
    crocBalanceSpans.forEach(span => span.textContent = crocBalance);
    totalCrocsSpans.forEach(span => span.textContent = totalCrocs);
    currentOutputSpans.forEach(span => span.textContent = currentOutput);
    if (totalCrocs == 10) startEvent("mrSealIntro0");
    if (totalCrocs == 100 || totalCrocs == 101) {
        totalCrocs = 101;
        startEvent("firstPurchase0");
    }
    updateShopBtns();
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
            playSound("./audio/marioKartLap.mp3");
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
greg.addEventListener

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
const particleDiv = document.querySelector("#particle-div");
crocImgDiv.addEventListener("click", (e) => {
    let currentSrc = crocImg.getAttribute("src");
    let newSrc = currentSrc;
    while (newSrc == currentSrc) {
        newSrc = crocImgArray[Math.floor(Math.random()*3)];
    }
    crocImg.setAttribute("src", newSrc);
    makeCroc(1, "click", e);
})

let eventArrays = {
    "endEvent": [ true ],
    "fallbackEvent": ["ERROR", "no event found", "", "./images/figmentFullBody.png", "exit", "endEvent0", false, false, false, false],
    "tutorial0": ["Tutorial", "Hi! My name's Figment.", "Welcome to my croc factory!", "./images/figmentFullBody.png", "--->", "tutorial1", false, false, false, false],
    "tutorial1": ["Tutorial", "I need your help, and I hear you're one of the best croc factory operators around.", "We need to manufacture as many crocs as possible, otherwise...", "./images/figmentFullBody.png", "--->", "tutorial2", false, false, false, false],
    "tutorial2": ["👎︎☜︎✌︎❄︎☟︎ ✌︎🕈︎✌︎✋︎❄︎💧︎", "... i will be banished to the abyss of forgotten theme park mascots, never to take corporeal form ever again.", "", "./images/figmentCursed.png", "--->", "tutorial3", false, false, false, false],
    "tutorial3": ["Tutorial", "Anyways, let's get started!", "Just click on the croc to operate the factory.", "./images/figmentFullBody.png", "OKAY!", "endEvent0", false, false, false, false],
    "mrSealIntro0": ["", "Hi there! I'm Mr. Seal.", "", "./gifs/mrSealFREEZE.gif", "--->", "mrSealIntro1", false, false, false, false],
    "mrSealIntro1": ["", "This is my husband, Greg.", "", "./gifs/gregFREEZE.gif", "--->", "mrSealIntro2", false, false, false, false],
    "mrSealIntro2": ["", "I'm here to tell you about the COMBO BAR.", "If you're clicking fast enough, you'll start filling up the combo bar in the top right.", "./gifs/mrSealFREEZE.gif", "--->", "mrSealIntro3", false, false, false, false],
    "mrSealIntro3": ["", "If you keep clicking fast enough for enough time, Greg and I will start dancing!", "Eventually, we'll also be able to use the power of the COMBO BAR to augment your factory's output. Try it out!", "./gifs/mrSeal.gif", "OKAY!", "endEvent0", false, false, false, false],
    "firstPurchase0": ["", "It looks like you have enough crocs to pay someone to help you!", "It's important that we manufacture crocs for the general public, but we can also melt them down and use the resulting goop as payment for our employees.", "./images/figmentFullBody.png", "--->", "firstPurchase1", false, false, false, false],
    "firstPurchase1": ["", "Your employees' output will also be affected by me and Greg's COMBO BAR.", "Hire a skeleton and try it out!", "./gifs/mrSeal.gif", "OKAY!", "endEvent0", false, false, false, false],
};
const eventModal = document.querySelector("#event-modal");
const eventTitle = document.querySelector("#event-modal h2");
const eventPara1 = document.querySelector("#event-modal p:nth-child(2)");
const eventPara2 = document.querySelector("#event-modal p:nth-child(3)");
const eventImg = document.querySelector("#event-modal img");
const eventBtn1 = document.querySelector("#event-modal button:nth-child(2)");
const eventBtn2 = document.querySelector("#event-modal button:nth-child(3)");
const eventBtn3 = document.querySelector("#event-modal button:nth-child(4)");
function startEvent(eventName) {
    if (eventName.includes("endEvent")) {
        eventModal.close();
        eventArrays["endEvent"][Number(eventName.slice(8))];
        return;
    }
    const eventArray = eventArrays[eventName];
    eventTitle.textContent = eventArray[0];
    eventPara1.textContent = eventArray[1];
    eventPara2.textContent = eventArray[2];
    eventImg.setAttribute("src", eventArray[3]);
    eventBtn1.textContent = eventArray[4];
    eventBtn1.addEventListener("click", (e) => startEvent(eventArray[5]));
    if (eventArray[6] != false) {
        eventBtn2.hidden = false;
        eventBtn2.textContent = eventArray[6];
        eventBtn2.addEventListener("click", (e) => startEvent(eventArray[7]));
    } else eventBtn2.hidden = true;
    if (eventArray[8] != false) {
        eventBtn3.hidden = false;
        eventBtn3.textContent = eventArray[8];
        eventBtn3.addEventListener("click", (e) => startEvent(eventArray[9]));
    } else eventBtn3.hidden = true;
    eventModal.showModal();
}

let shopItems = [
    { name: "skeleton", src: "./gifs/dance-skeleton.gif", price: 100, stats: 5 },
    { name: "nubby", src: "./gifs/nubby.gif", price: 1000, stats: 10 },
    { name: "rubber-chicken", src: "./gifs/rubberChicken.gif", price: 5000, stats: 20 },
    { name: "unicycle-frog", src: "./gifs/unicycleFrog.gif", price: 10000, stats: 50 },
    { name: "turtle", src: "./gifs/turtle.gif", price: 15000, stats: 75 },
    { name: "mutant-nubby", src: "./gifs/mutantNubby.gif", price: 25000, stats: 100 },
    { name: "punch", src: "./gifs/punch.gif", price: 50000, stats: 250 },
    { name: "pingu", src: "./gifs/pingu.gif", price: 100000, stats: 500 },
    { name: "ego-death", src: "./gifs/pedro-pascal.gif", price: Math.pow(10, 100), stats: 69 }
];

const shopDiv = document.querySelector("#shop-div");
shopItems.forEach((obj) => {
    const itemInfo = document.createElement("div");
    itemInfo.classList.add("purchase-info");
    const itemImg = document.createElement("img");
    itemImg.setAttribute("src", obj.src);
    itemInfo.appendChild(itemImg);
    const itemDesc = document.createElement("p");
    itemDesc.textContent = obj.name;
    itemInfo.appendChild(itemDesc);
    const itemStats = document.createElement("p");
    itemStats.textContent = obj.stats + " crocs/sec";
    itemInfo.appendChild(itemStats);
    shopDiv.appendChild(itemInfo);
    const buyBtn = document.createElement("div");
    buyBtn.classList.add("purchase-btn");
    buyBtn.setAttribute("id", obj.name + "-buy-btn");
    const itemPrice = document.createElement("p");
    itemPrice.textContent = obj.price + " crocs";
    buyBtn.appendChild(itemPrice);
    buyBtn.addEventListener("click", (e) => {
        purchaseItem(obj);
    })
    shopDiv.appendChild(buyBtn);
})

const activeEntitiesDiv = document.querySelector("#active-entities-div");
function purchaseItem(obj) {
    if (obj.price > crocBalance) {
        console.log("cannot afford " + obj.name);
    } else {
        crocBalance -= obj.price;
        populateFromCookies();
        makeEntityDiv(obj);
        updateEmployedEntities();
        updateCookies();
    }
}

function updateShopBtns() {
    shopItems.forEach((obj) => {
        const relevantBtn = document.querySelector(`#${obj.name}-buy-btn`);
        if (obj.price > crocBalance) {
            relevantBtn.classList.add("too-expensive");
        } else {
            relevantBtn.classList.remove("too-expensive");
        }
    })
}
updateShopBtns();

function makeEntityDiv(obj) {
    const entityDiv = document.createElement("div");
    const entityImg = document.createElement("img");
    entityImg.setAttribute("src", obj.src);
    entityDiv.appendChild(entityImg);
    const entityTypeDiv = document.querySelector(`#${obj.name}s`);
    entityTypeDiv.appendChild(entityDiv);
}

const entityTypeDivs = document.querySelectorAll("#active-entities-div > div");
function workersTick() {
    entityTypeDivs.forEach((type) => {
        const shopObj = shopItems.find(obj => obj.name == String(type.getAttribute("id")).slice(0, -1));
        const childDivs = type.childNodes;
        childDivs.forEach((child) => {
            makeCroc(shopObj.stats, "entity", child);   
        })
    })
}
setInterval(workersTick, 1000);

function updateEmployedEntities() {
    entityTypeDivs.forEach((type) => {
        setCookie(`${type.id}-employed`, type.childNodes.length, 365);
    })
}

function loadSavedEntities() {
    entityTypeDivs.forEach((type) => {
        for (let i = 0; i < Number(getCookie(`${type.id}-employed`)); i++) {
            makeEntityDiv(shopItems.find(item => item.name == type.id.slice(0, -1)));
        }
    })
}
loadSavedEntities();

let currentOutputBenchmark = totalCrocs;
function currentOutputTick() {
    currentOutput = totalCrocs - currentOutputBenchmark;
    currentOutputBenchmark = totalCrocs;
    currentOutputSpans.forEach(span => span.textContent = currentOutput);
}
setInterval(currentOutputTick, 1000);

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
    currentOutputSpans.forEach(span => span.textContent = currentOutput);
}
populateFromCookies();

function updateCookies() {
    setCookie("croc-balance", crocBalance, 365);
    setCookie("total-crocs", totalCrocs, 365);
}
setInterval(updateCookies, 10000);

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

function createComboParticles() {
    const particle = document.createElement("div");
    particle.classList.add("combo-particle");
    particle.style.left = `${1040 - window.scrollX}px`;
    particle.style.top = `${50 - window.scrollY}px`;
    particle.textContent = "COMBOOOOOO";
    particleDiv.appendChild(particle);
    particle.animate([
        { transform: "translate(0)", opacity: "1" },
        { transform: `translate(${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 100) + 50}px, ${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 100) + 50}px)`, opacity: "0" }
    ], {
        duration: 500,
        iterations: 1
    });
    setTimeout(() => particle.remove(), 500);
}
setInterval(createComboParticles, 100);

