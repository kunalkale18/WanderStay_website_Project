class ExpressError extends Error {
    constructor(status, message) {
        super(message); // Also pass the message to super (better error output)
        this.statusCode = status;
    }
}

module.exports = ExpressError;
