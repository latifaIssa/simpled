s = document.createElement("script");

s.src = chrome.extention.getURL("src/youtubedl.js");

// s.setAttribute("data-ext", chrome.runtime.id);

(document.head || document.createElement).appendChild(s);

window.addEventListener("message", function(e) {
    console.log(e.data.type);
})