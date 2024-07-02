const isValidPassword = (password) => {
    const hasNumber = /\d/;
    const hasLowerCase = /[a-z]/;
    const hasUpperCase = /[A-Z]/;
    const noSpaces = /^\S*$/;

    return hasNumber.test(password) && hasLowerCase.test(password) && hasUpperCase.test(password) && noSpaces.test(password);
};

export {
    isValidPassword
};