// @ts-check
/// <reference path="./node_modules/@types/chrome/index.d.ts" />

let count = 0;
chrome.webRequest.onCompleted.addListener(async (data) => {
    if (count === 0) {
        await fetch(data?.url).then(res => res.json()).then(res => {
            // console.log("res", res.events);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    // @ts-ignore
                    chrome.tabs.sendMessage(tabs[0]?.id, { type: 'subtitle_data', data: res.events }, (response) => {
                        console.log("response", response);
                    })
                }
            })
            count++;
        }).catch(err => {
            console.log(err);
        })
    }
}, {
    urls: ["https://www.youtube.com/api/timedtext?*"],
    types: ["xmlhttprequest"],

});
