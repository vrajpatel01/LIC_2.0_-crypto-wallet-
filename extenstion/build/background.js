chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // try {
    //     if (request.action === "connectWallet") {
    //         // Trigger wallet UI and let user connect
    //         const accounts = await getAccountsFromWallet(); // Fetch real accounts
    //         console.log("accounts", accounts)
    //         sendResponse({ success: true, accounts });
    //     }

    //     if (request.action === "getAccounts") {
    //         const accounts = await getAccountsFromWallet();
    //         sendResponse({ accounts });
    //     }

    //     if (request.action === "getBalances") {
    //         const balances = {};
    //         for (const account of request.accounts) {
    //             balances[account] = await getBalanceFromBlockchain(account);
    //         }
    //         sendResponse({ balances });
    //     }

    // } catch (error) {
    //     console.error("Error:", error);
    //     sendResponse({ error: error.message });
    // }

    console.log("📩 Background received:", message);

    if (message.method === "eth_chainId") {
        sendResponse("0x1"); // Ethereum Mainnet
    } else if (message.method === "eth_requestAccounts") {
        sendResponse(["0x1234567890abcdef"]); // Mock wallet address
    } else {
        sendResponse({ error: "Unknown request" });
    }
    return true; // Keep the message channel open for async responses
});

// Function to get accounts from the wallet extension

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("📩 Background received request:", request);

//     if (request.method === "eth_accounts") {
//       sendResponse({ result: ["0x123456789abcdef"] }); // Mock account response
//     } else if (request.method === "connectWallet") {
//       sendResponse({ result: { connected: true } });
//     } else {
//       sendResponse({ error: "Unknown method" });
//     }

//     return true; // Keeps the message channel open for async responses
//   });

async function getAccountsFromWallet() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["accounts"], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.accounts || []);
            }
        });
    });
}

// Function to get real-time balance from the blockchain
async function getBalanceFromBlockchain(address) {
    try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/571dab8d30c44d8b8ca7b6324db370ff");
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance) + " ETH";
    } catch (error) {
        console.error("Error fetching balance:", error);
        return "Error";
    }
}
