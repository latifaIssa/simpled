function downloadVideo() {
    console.log("download this video");
    var dl = document.getElementById("videoDownloadDropdown");

    if (dl.className.indexOf("show") > -1) {
        dl.className = dl.className.replace("shown", "");

    } else {
        dl.className += "shown";
    }

    // var ext_id = document.getElementById("vdyt").getAttribute("data-ext");
    // console.log(ext_id);

    // var data = { "type": "download clicked" };
    // window.postMessage(data, "*");
}

function downloadURI(event){
    event.preventDefault();
    event.stopPropogation();

    var url = event.currentTarget.getAttribute("href");
    var name = document.getElementByTagName("title").innerText;
    var datatype = event.currentTarget.getAttribute("data-type");
    var data = {url:url, name: name, sender:"YTDL", type: datatype};

    window.postMessage(data, "*");

    var dl = document.getElementById("videoDownloadDropdown");

    if (dl.className.indexOf("show") > -1) {
        dl.className = dl.className.replace("shown", "");

    } else {
        dl.className += "shown";
    }

    return false;

}

// windows.onload = function() {
// var videoUrls = window.ytplayer.config.args.url_encoded_fmt_stream_map.split(",").map(function(item) {
//     return item.split("&").reduce(function(pre, cur) {
//         cur = cur.split('=');
//         return Object.assign(pre, {
//             [cur[0]]: decodeURIComponent(cur[1])
//         });
//     }, {});
// });
// console.log('Our extension has loaded', videoUrls);
// }




// style-scope ytd-menu-renderer
// dropdown-trigger style-scope ytd-menu-renderer"




var videoUrls = {};
(async() => {
    const html = await fetch(window.location.href).then((resp) => resp.text()).then((text) => text);
    const startStr = 'ytplayer.config = {';
    const start = html.indexOf(startStr) + startStr.length - 1;
    const end = html.indexOf('};', start) + 1;
    const playerObj = JSON.parse(html.slice(start, end));

    playerObj.args.player_response = JSON.parse(playerObj.args.player_response);

    videoUrls = playerObj.args.player_response.streamingData.adaptiveFormats.reduce((acc, item) => {
        if (!acc[item.quality]) {
            acc[item.quality] = {};
        }

        const mimeType = item.mimeType.split(';')[0];

        acc[item.quality][mimeType] = item;

        return acc;
    }, {});

    console.log('Our extension has loaded', videoUrls);
})();


var container = document.getElementById("top-level-buttons");
var btn = document.createElement("ytd-toggle-button-renderer");
btn.className = "style-scope ytd-button-renderer style-default size-default";
btn.setAttribute('role', 'button');
btn.id = "videoDownloadDropdown";
btn.innerText = "Download";

var dropdown = document.createElement("div");
dropdown.id = "videoDownloadDropdown";
container.appendChild(dropdown);

var dropList = document.createElement("ul");
dropdown.appendChild(dropList);



// let parent = document.createElement("div");
// parent.append(btn);

container.appendChild(btn);

// btn.addEventListener("click", downloadVideo);
for (i in videoUrls) {
    var item = document.createElement("a");
    var ext = videoUrls[i]["type"].split('/')[1].split(";")[0];
    
    item.innerText = videoUrls[i]["quality"] + "(" + ext + ")";

    item.setAttribute("href", videoUrls[i]["url"]);
    item.setAttribute("target", "_blank");
    item.setAttribute("data_type", videoUrls[i]["type"]);
    item.setAttribute("click", downloadURI);

    dropList.appendChild(item);
}

btn.addEventListener("click", downloadVideo);