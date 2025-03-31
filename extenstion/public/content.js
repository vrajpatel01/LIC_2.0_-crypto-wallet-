// content.js

// Create a script element that will load our inject.js file
// const script = document.createElement('script');
// const url = chrome.runtime.getURL('inject.js');
// script.setAttribute('src', url);
// script.setAttribute('type', 'text/javascript');

(function injectScript() {
    console.log("🚀 Injecting myCustomWallet script...");

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    script.onload = function () {
        console.log("✅ myCustomWallet script injected successfully!");
        this.remove(); // Remove script after execution
    };

    (document.head || document.documentElement).appendChild(script);
})();

// Add the script to the document
// (document.head || document.documentElement).appendChild(script);

// Remove the script after it loads (optional cleanup)
// script.onload = function () {
//     this.remove();
// };

// console.log("🔄 Content script loaded...");

window.addEventListener("message", async (event) => {
    // if (event.source !== window || event.data.type !== "MY_WALLET_REQUEST") return;
    // if (event.source !== window || !event.data.type || event.data.type !== "MY_WALLET_REQUEST") return;
    if (event.source !== window || event.data.type !== "MY_WALLET_REQUEST") return;

    // chrome.runtime.sendMessage({ method: event.data.method, params: event.data.params }, (response) => {
    //     window.postMessage({ type: "MY_WALLET_RESPONSE", messageId: event.data.messageId, result: response }, "*");
    // });
    // try {
    //     chrome.runtime.sendMessage({ method: event.data.method, params: event.data.params }, (response) => {
    //         if (chrome.runtime.lastError) {
    //             console.error("❌ Error in content script:", chrome.runtime.lastError.message);
    //             window.postMessage({ type: "MY_WALLET_RESPONSE", messageId: event.data.messageId, error: chrome.runtime.lastError.message }, "*");
    //         } else {
    //             console.log("✅ Response received in content.js:", response);
    //             window.postMessage({ type: "MY_WALLET_RESPONSE", messageId: event.data.messageId, result: response }, "*");
    //         }
    //     });
    // } catch (error) {
    //     console.error("❌ Exception in content script:", error);
    // }

    try {
        chrome.runtime.sendMessage(
            { method: event.data.method, params: event.data.params },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("❌ Content.js Error:", chrome.runtime.lastError.message);
                    window.postMessage(
                        { type: "MY_WALLET_RESPONSE", messageId: event.data.messageId, error: chrome.runtime.lastError.message },
                        "*"
                    );
                } else {
                    console.log("✅ Content script received response:", response);
                    window.postMessage(
                        { type: "MY_WALLET_RESPONSE", messageId: event.data.messageId, result: response },
                        "*"
                    );
                }
            }
        );
    } catch (error) {
        console.error("❌ Content.js Exception:", error);
    }

    // chrome.runtime.sendMessage(
    //     { method: event.data.method, params: event.data.params },
    //     (response) => {
    //         if (chrome.runtime.lastError) {
    //             console.error("❌ Error in content script:", chrome.runtime.lastError);
    //         }

    //         window.postMessage(
    //             {
    //                 type: "MY_WALLET_RESPONSE",
    //                 method: event.data.method,
    //                 result: response?.result || null,
    //                 error: chrome.runtime.lastError || response?.error || null
    //             },
    //             "*"
    //         );
    //     }
    // );
});


// Listen for account changes (example trigger)
setInterval(() => {
    if (window.customWallet && window.customWallet.emit) {
        // Simulate account changes every 30 seconds (for testing)
        window.customWallet.emit('accountsChanged', '0x' + Math.random().toString(16).slice(2, 42));
    }
}, 30000);