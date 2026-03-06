function internalError(errorMessage) {
    const prefixedMessage = `[p5.strands internal error]: ${errorMessage}`; 
    throw new Error(prefixedMessage);
}

function userError(errorType, errorMessage) {
    const prefixedMessage = `[p5.strands ${errorType}]: ${errorMessage}`;
    throw new Error(prefixedMessage);
}

export { internalError, userError };
