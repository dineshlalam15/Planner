function isEmpty(input){
    return input === ""
}

function validateUsername(username) {
    const lengthValid = username.length >= 1 && username.length <= 30;
    const formatValid = /^[a-zA-Z0-9._]+$/.test(username);
    return lengthValid && formatValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
}

export {isEmpty, validateUsername, validateEmail, validatePassword}