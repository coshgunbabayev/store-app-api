const generateVerificationCode = (len) => {
    return String(Math.floor(Math.random() * Math.pow(10, len)));
};

export {
    generateVerificationCode
};