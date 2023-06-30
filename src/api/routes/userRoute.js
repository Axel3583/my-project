module.exports = (app) => {
    const userController = require("../controllers/userController");

    app.post("/user/register", userController.userRegister);
    app.post("/user/login", userController.userLogin);
}
