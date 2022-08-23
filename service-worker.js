// @ts-check
/// <reference path="./node_modules/@types/chrome/index.d.ts" />

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {
          message: 'TabUpdated'
        });
      }
    })
  });