// (function() {
//   if (window.myCustomWallet) return; // Prevent duplicate injection
//   console.log("inject")
//   window.myCustomWallet = {
//     isMyWallet: true,

//     connect: async function() {
//       return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({ action: "connectWallet" }, (response) => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError);
//           } else {
//             resolve(response);
//           }
//         });
//       });
//     },

//     getAccounts: async function() {
//       return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({ action: "getAccounts" }, (response) => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError);
//           } else {
//             resolve(response.accounts); // Return real accounts
//           }
//         });
//       });
//     },

//     getBalances: async function(accounts) {
//       return new Promise((resolve, reject) => {
//         chrome.runtime.sendMessage({ action: "getBalances", accounts }, (response) => {
//           if (chrome.runtime.lastError) {
//             reject(chrome.runtime.lastError);
//           } else {
//             resolve(response.balances); // Return real-time balances
//           }
//         });
//       });
//     }
//   };
// })();


// (function () {
//     if (window.myCustomWallet) return; // Prevent duplicate injection
//     console.log("Injected myCustomWallet");

//     window.myCustomWallet = {
//       isMyWallet: true,

//       connect: async function () {
//         return new Promise((resolve, reject) => {
//           window.postMessage({ action: "connectWallet" }, "*");
//           window.addEventListener("message", function handler(event) {
//             if (event.data.action === "connectWallet") {
//               window.removeEventListener("message", handler);
//               event.data.response ? resolve(event.data.response) : reject("Connection failed");
//             }
//           });
//         });
//       },

//       getAccounts: async function () {
//         return new Promise((resolve, reject) => {
//           window.postMessage({ action: "getAccounts" }, "*");
//           window.addEventListener("message", function handler(event) {
//             if (event.data.action === "getAccounts") {
//               window.removeEventListener("message", handler);
//               event.data.response ? resolve(event.data.response.accounts) : reject("Error fetching accounts");
//             }
//           });
//         });
//       },

//       getBalances: async function (accounts) {
//         return new Promise((resolve, reject) => {
//           window.postMessage({ action: "getBalances", accounts }, "*");
//           window.addEventListener("message", function handler(event) {
//             if (event.data.action === "getBalances") {
//               window.removeEventListener("message", handler);
//               event.data.response ? resolve(event.data.response.balances) : reject("Error fetching balances");
//             }
//           });
//         });
//       }


//     };
//   })();

(function () {
    if (window.myCustomWallet) return; // Prevent duplicate injection
    console.log("🔄 Injecting myCustomWallet...");

    window.myCustomWallet = {
        isMyWallet: true,
        connect: async function () {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: "connectWallet" }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                });
            });
        },

        getAccounts: async function () {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: "getAccounts" }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response.accounts); // Return real accounts
                    }
                });
            });
        },

        getBalances: async function (accounts) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: "getBalances", accounts }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response.balances); // Return real-time balances
                    }
                });
            });
        },
        request: async function ({ method, params }) {
            // console.log(`📩 Received request: ${method}`, params);

            // return new Promise((resolve, reject) => {
            //     const messageId = Math.random().toString(36).substring(7);

            //     window.postMessage({ type: "MY_WALLET_REQUEST", method, params, messageId }, "*");

            //     window.addEventListener("message", function eventListener(event) {
            //         if (event.data.type === "MY_WALLET_RESPONSE" && event.data.messageId === messageId) {
            //             window.removeEventListener("message", eventListener);
            //             resolve(event.data.result);
            //         }
            //     });
            // });

            // console.log(`📩 Received request: ${method}`, params);
            // return new Promise((resolve, reject) => {
            //     const messageId = Math.random().toString(36).substring(7);

            //     // Send request to content script
            //     window.postMessage({ type: "MY_WALLET_REQUEST", method, params, messageId }, "*");

            //     // Wait for response
            //     const listener = (event) => {
            //         if (event.source !== window || event.data.type !== "MY_WALLET_RESPONSE") return;
            //         if (event.data.messageId === messageId) {
            //             window.removeEventListener("message", listener);
            //             if (event.data.error) {
            //                 reject(event.data.error);
            //             } else {
            //                 resolve(event.data.result);
            //             }
            //         }
            //     };

            //     window.addEventListener("message", listener);
            // });

            console.log(`📩 Received request: ${method}`, params);
            return new Promise((resolve, reject) => {
                const messageId = Math.random().toString(36).substring(7);

                // Send request to content script
                window.postMessage({ type: "MY_WALLET_REQUEST", method, params, messageId }, "*");

                // Wait for response
                const listener = (event) => {
                    if (event.source !== window || event.data.type !== "MY_WALLET_RESPONSE") return;
                    if (event.data.messageId === messageId) {
                        window.removeEventListener("message", listener);
                        if (event.data.error) {
                            console.error("❌ Error received in inject.js:", event.data.error);
                            reject(new Error(event.data.error));
                        } else {
                            console.log("✅ Response received in inject.js:", event.data.result);
                            resolve(event.data.result);
                        }
                    }
                };

                window.addEventListener("message", listener);

                setTimeout(() => {
                    window.removeEventListener("message", listener);
                    reject(new Error("Timeout: No response received from content.js"));
                }, 5000); // Timeout after 5 seconds
            });
        }
    };

    // Expose as `window.ethereum` for ethers.js compatibility
    window.ethereum = window.myCustomWallet;
    console.log("✅ myCustomWallet injected successfully!");
})();