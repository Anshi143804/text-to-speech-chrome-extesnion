chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "readText",
        title: "Read Selected Text",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Read and Summarize Selected Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "readText" && info.selectionText) {
        chrome.tts.speak(info.selectionText, { rate: 1.0 }, () => {
            if (chrome.runtime.lastError) {
                console.error("TTS Error:", chrome.runtime.lastError);
            }
        });
    } 
    else if (info.menuItemId === "summarizeText" && info.selectionText) {
        // Get the selected summary length
        chrome.storage.local.get(['summaryLength'], (result) => {
            const summaryLength = result.summaryLength || 'short'; // Default to 'short' if not set

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0 || tabs[0].url.startsWith("chrome://") || tabs[0].url.startsWith("chrome-extension://")) {
                    console.error("Cannot run content scripts on this page.");
                    return;
                }

                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id },
                        files: ['contentScript.js']
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error executing content script:", chrome.runtime.lastError);
                            return;
                        }

                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "summarize",
                            text: info.selectionText,
                            word_count: summaryLength
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error sending message to content script:", chrome.runtime.lastError);
                            }
                        });
                    }
                );
            });
        });
    }
});
