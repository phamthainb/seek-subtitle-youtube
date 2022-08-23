function injectScript(file_path, tag) {

  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement('script');
  script.id = 'injectScript';
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log(document.location.href);
    injectScript(chrome.runtime.getURL('content.js'), 'body');
  }
})

console.log("Seek subtitle");

