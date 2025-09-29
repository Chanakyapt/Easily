// Modules
import { Router } from "express";

//Validators
import {
  loginValidator,
  registerationValidator,
} from "../middlewares/validator.js";

// Models
import User from "../models/user.model.js";
import templateRenderData from "../models/templateRenderData.model.js";

const authRouter = Router();

//Default Route
authRouter.get("/", (req, res) => {
  if (req.session.userEmail) {
    return res.redirect("/jobs");
  } else {
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Home");
    templateData.addProperty("authAction", "SignIn");
    templateData.addProperty("page", "signUp");
    return res.render("signUp.ejs", templateData);
  }
});

// To handle login requests
authRouter.post("/login", loginValidator, (req, res) => {
  const loggedUser = User.authenticateUser(req.body);

  if (loggedUser) {
    req.session.userEmail = loggedUser.email;
    return res.redirect("/jobs");
  } else {
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Home");
    templateData.addProperty("authAction", "SignIn");
    templateData.addProperty("errorMsg", [{ msg: "invalid Credentials" }]);
    templateData.addProperty("page", "signUp");
    return res.render("signUp.ejs", templateData);
  }
});

// To handle registration requests
authRouter.post("/register", registerationValidator, (req, res) => {
  const templateData = new templateRenderData();
  templateData.addProperty("titleDesc", "Home");
  templateData.addProperty("authAction", "SignIn");
  templateData.addProperty("page", "signUp");
  const { name, email, password } = req.body;
  const registeredUser = User.addUser(name, email, password);

  if (registeredUser.user) {
    templateData.addProperty("successMsg", [
      { msg: "Registration done. Please Login to continue." },
    ]);
    return res.render("signUp.ejs", templateData);
  } else {
    templateData.addProperty("successMsg", [{ msg: registeredUser.msg }]);
    return res.render("signUp.ejs", templateData);
  }
});

// To Log out the user
authRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    return res.redirect("/");
  });
});

export default authRouter;
