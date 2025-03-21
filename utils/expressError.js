class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message); // Pass the message to the parent class
        this.statusCode = statusCode || 500; // Default to 500 if no status code is provided
    }
}

module.exports = ExpressError;
