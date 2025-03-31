// Inject our wallet into the window object
window.customWallet = {
    // Connect to the wallet
    connect: async () => {
        try {
            // Send message to extension to get wallet data
            const response = await chrome.runtime.sendMessage({ type: 'CONNECT_WALLET' });
            return response;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Event listeners
    listeners: {},

    // Add event listener
    on: function(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },

    // Remove all listeners
    removeAllListeners: function() {
        this.listeners = {};
    },

    // Emit event
    emit: function(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ACCOUNT_CHANGED') {
        window.customWallet.emit('accountsChanged', message.address);
    } else if (message.type === 'CHAIN_CHANGED') {
        window.customWallet.emit('chainChanged', message.chain);
    }
}); 