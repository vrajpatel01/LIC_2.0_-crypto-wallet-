export default function Wrapper({ children }) {
  //   (function () {
  //     if (window.myCustomWallet) return; // Prevent duplicate injection
  //     console.log("🔄 Injecting myCustomWallet...");

  //     window.myCustomWallet = {
  //       isMyWallet: true,
  //       connect: async function () {
  //         return new Promise((resolve, reject) => {
  //           chrome.runtime.sendMessage(
  //             { action: "connectWallet" },
  //             (response) => {
  //               if (chrome.runtime.lastError) {
  //                 reject(chrome.runtime.lastError);
  //               } else {
  //                 resolve(response);
  //               }
  //             }
  //           );
  //         });
  //       },

  //       getAccounts: async function () {
  //         return new Promise((resolve, reject) => {
  //           chrome.runtime.sendMessage({ action: "getAccounts" }, (response) => {
  //             if (chrome.runtime.lastError) {
  //               reject(chrome.runtime.lastError);
  //             } else {
  //               resolve(response.accounts); // Return real accounts
  //             }
  //           });
  //         });
  //       },

  //       getBalances: async function (accounts) {
  //         return new Promise((resolve, reject) => {
  //           chrome.runtime.sendMessage(
  //             { action: "getBalances", accounts },
  //             (response) => {
  //               if (chrome.runtime.lastError) {
  //                 reject(chrome.runtime.lastError);
  //               } else {
  //                 resolve(response.balances); // Return real-time balances
  //               }
  //             }
  //           );
  //         });
  //       },
  //       request: async function ({ method, params }) {
  //         console.log(`📩 Received request: ${method}`, params);
  //         return new Promise((resolve, reject) => {
  //           chrome.runtime.sendMessage({ action: method, params }, (response) => {
  //             if (chrome.runtime.lastError) {
  //               console.error(
  //                 "❌ Chrome Extension Error:",
  //                 chrome.runtime.lastError
  //               );
  //               reject(chrome.runtime.lastError);
  //             } else {
  //               console.log("✅ Response from background:", response);
  //               resolve(response);
  //             }
  //           });
  //         });
  //       },
  //     };

  //     // Expose as `window.ethereum` for ethers.js compatibility
  //     window.ethereum = window.myCustomWallet;
  //     console.log("✅ myCustomWallet injected successfully!");
  //   })();
  return <div>{children}</div>;
}
