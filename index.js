// Modules
import express from "express";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import session from "express-session";
import cookieParser from 'cookie-parser';

// Routers
import authRouter from "./src/controllers/auth.controller.js";
import jobRouter from "./src/controllers/jobs.controller.js";
import applyRouter from "./src/controllers/apply.controller.js";
import setCookies from "./src/middlewares/cookiePasser.js";

// Models
import templateRenderData from "./src/models/templateRenderData.model.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(cookieParser());
app.use(ejsLayouts);
app.use(express.static(path.join(path.resolve(), "src", "static")));
app.use(setCookies);

app.use((req, res, next) => {
  console.log(`Hit ${req.url}`);
  next();
});

app.use("/", authRouter);
app.use("/jobs", jobRouter);
app.use("/apply", applyRouter);
app.use((req, res) => {
  const templateData = new templateRenderData();
  templateData.addProperty("titleDesc", "404 Page Not Found");
  templateData.addProperty("authAction", "404 Page Not Found");
  res.render("pageNotFound.ejs", templateData);
});

export default app;
