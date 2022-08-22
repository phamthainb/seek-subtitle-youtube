
// {
//     "tStartMs": 16588,
//     "dDurationMs": 1675,
//     "segs": [
//         {
//             "utf8": "they assume two things."
//         }
//     ]
// }

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  
const makeList = (data) => {
    var video = document.getElementsByTagName('video')[0]
    
    const divWrap = document.createElement('div');
    const ul = document.createElement('ul')

    data.forEach(el => {
        const { segs, tStartMs, dDurationMs } = el
        const li = document.createElement('li')
        li.append(`${millisToMinutesAndSeconds(tStartMs)}: ${segs[0]?.utf8}`);

        li.addEventListener('click', function (ev) {
            console.log("next to: ", tStartMs);
            video.currentTime = tStartMs/1000;
        });


        li.style.cursor = "pointer"; 
        li.style.paddingBottom = "6px"

        ul.append(li);
    });
    divWrap.appendChild(ul);

    divWrap.style.zIndex = 999;
    divWrap.style.position = "fixed";
    divWrap.style.background = "white";
    divWrap.style.top = "80px";
    divWrap.style.right = "0";
    divWrap.style.width = "550px";
    divWrap.style.fontSize = "14px";
    divWrap.style.padding = "12px 24px";
    divWrap.style.maxHeight = "300px";
    divWrap.style.overflow = "auto";
    divWrap.style.border = "1px solid";

    document.body.append(divWrap);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("sender", sender);
    if (message.type === 'subtitle_data') {
        const { data: subtitle_data } = message;
        console.log("subtitle_data", subtitle_data);
        if (subtitle_data.length > 0) {
            makeList(subtitle_data)
        }
    }
});