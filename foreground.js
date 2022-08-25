function injectScript(file_path, tag) {
  var s = document.getElementById("injectScript");
  if (s) {
    console.log("remove exist elemnt injectScript");
    s.remove();
  }
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.id = "injectScript";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

// on open video link
injectScript(chrome.runtime.getURL("content.js"), "body");

// on change video by click video - not reload page
var pageUrl = document.location.href;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "TabUpdated") {
    if (pageUrl !== document.location.href) {
      console.log("video change", document.location.href);
      pageUrl = document.location.href;
      injectScript(chrome.runtime.getURL("content.js"), "body");
    }
  }
});

console.log("Seek subtitle");
