//TODO: show home page
exports.home = (req, res, next) => {
    res.render("index-2");
};

//TODO: change password, Account Management
exports.Change_Password_Management = (req, res) => {
    res.render("change-password");
};

//TODO: login
exports.Login = (res, req) => {
    res.render("login");
};

//TODO: Reset Password
exports.Reset_Password = (res, req) => {
    res.render("reset-password");
};

//TODO: Sign Up
exports.Sign_Up = (res, req) => {
    res.render("signup");
};