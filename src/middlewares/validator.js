// Modules
import { body, validationResult } from "express-validator";

// Models
import templateRenderData from "../models/templateRenderData.model.js";
import Job from "../models/job.model.js";

// To validate login form
export const loginValidator = async (req, res, next) => {
  //Step 1: Setup rules for validation
  const rules = [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Please enter a valid password."),
  ];

  //Step 2: Run the rules
  await Promise.all(rules.map((rule) => rule.run(req)));

  let validationErrors = validationResult(req);
  //Check if there was any validation error

  if (!validationErrors.isEmpty()) {
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Home");
    templateData.addProperty("authAction", "SignIn");
    templateData.addProperty("errorMsg", validationErrors.array());
    templateData.addProperty("page", "signUp");
    return res.render("signUp.ejs", templateData);
  } else {
    next();
  }
};

// To validate registration form
export const registerationValidator = async (req, res, next) => {
  //Step 1: Setup rules for validation
  const rules = [
    body("fullname")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Please enter a valid name."),
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Please enter a valid password."),
    body("confirmPassword")
      .custom(async (value) => {
        if (!(req.body.password === value)) {
          throw new Error("Passwords does not match");
        }
      })
      .withMessage(`Value for "password" and "confirm password" should match.`),
  ];

  //Step 2: Run the rules
  await Promise.all(rules.map((rule) => rule.run(req)));

  let validationErrors = validationResult(req);

  //Check if there was any validation error
  if (!validationErrors.isEmpty()) {
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Home");
    templateData.addProperty("authAction", "SignUp");
    templateData.addProperty("errorMsg", validationErrors.array());
    templateData.addProperty("page", "signUp");
    return res.render("signUp.ejs", templateData);
  } else {
    next();
  }
};

// To validate create/update job form
export const createOrUpdateJobValidation = async (req, res, next) => {
  if (req.session.userEmail) {
    //Step 1: Setup rules for validation
    const rules = [
      body("companyName")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Please enter a valid company name."),
      body("jobDesignation")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Please enter a valid job designation."),
      body("jobCategory")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Please enter a valid job category."),
      body("skillsRequiredInput")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Please enter at least 1 skill."),
      body("jobLocation")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Please enter a valid job location."),
      body("Salary")
        .custom(async (value) => {
          if (Number(value) === 0) {
            throw new Error("Invalid Salary");
          }
        })
        .withMessage("Please enter a valid salary."),
      body("applyBy")
        .custom(async (value) => {
          const applyByDateSplit = value.split("-");
          const applyByYear = Number(applyByDateSplit[0]);
          const applyByMonth = Number(applyByDateSplit[1]) - 1;
          const applyByDate = Number(applyByDateSplit[2]);

          try {
            const endDate = new Date(applyByYear, applyByMonth, applyByDate);
          } catch (err) {
            throw new Error("Invalid Application End Date");
          }
        })
        .withMessage("Please enter a valid application end date."),
      body("numberOfOpenings")
        .custom(async (value) => {
          if (Number(value) === 0) {
            throw new Error("Invalid Number Of Job Openings");
          }
        })
        .withMessage("Please enter a valid number of job openings."),
    ];

    //Step 2: Run the rules
    await Promise.all(rules.map((rule) => rule.run(req)));

    let validationErrors = validationResult(req);
    //Check if there was any validation error

    if (!validationErrors.isEmpty()) {
      if (req.session.userEmail) {
        console.log(req.body);
        const templateData = new templateRenderData();
        templateData.addProperty("titleDesc", "Create Job");
        templateData.addProperty("page", "Create");
        templateData.addProperty("userData", "Recruiter");
        templateData.addProperty("createdBy", req.session.userEmail);

        const createdJob = req.body;
        if (createdJob.skillsRequiredInput) {
          createdJob.skillsRequired = createdJob.skillsRequiredInput
            .split("~")
            .reduce((acc, job) => {
              if (job) {
                acc.push(job);
              }
              return acc;
            }, []);
        } else createdJob.skillsRequired = [];

        console.log(createdJob);

        templateData.addProperty("jobDetails", createdJob);
        templateData.addProperty("errorMsg", validationErrors.array());

        return res.render("jobCreateView.ejs", templateData);
      } else {
        const query = encodeURIComponent("Please Login to continue.");
        return res.redirect(`/jobs/?errorMsg=${query}`);
      }
    } else {
      next();
    }
  } else {
    const query = encodeURIComponent("You are not authorized.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
};

// To validate job application form
export const applyJobValidator = async (req, res, next) => {
  //Step 1: Setup rules for validation
  const rules = [
    body("fullname")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Please enter a valid first name."),
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("contact")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Please enter a valid last name.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must contain 10 digits."),
  ];

  //Step 2: Run the rules
  await Promise.all(rules.map((rule) => rule.run(req)));

  let validationErrors = validationResult(req);

  //Check if there was any validation error
  if (!validationErrors.isEmpty()) {
    return res.redirect(`/jobs/${req.params.jobId}/?errorMsg=${validationErrors.array()[0].msg}`);
  } else {
    next();
  }
};
