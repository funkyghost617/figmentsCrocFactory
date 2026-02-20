const textInput = document.querySelector("#text");
const title = document.querySelector("h1");
populateFromCookies();

textInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        setCookie("title", textInput.value, 365);
        textInput.value = "";
        populateFromCookies();
    }
})

function populateFromCookies() {
    title.textContent = getCookie("title");
}

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
    return "ERROR: no cookie found named \"" + cname + "\"";
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