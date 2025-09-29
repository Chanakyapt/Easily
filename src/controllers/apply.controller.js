// Modules
import { Router } from "express";
import multer from "multer";
import path from "path";

// Models
import Applicant from "../models/applicant.model.js";
import { validateJob, addApplicantInJob } from "../controllers/jobs.controller.js";
import { applyJobValidator } from "../middlewares/validator.js";

const applyRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("src", "static", "applicantData"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// To handle Job Applications.
applyRouter.post(
  "/:jobId",
  upload.single("resume"),
  applyJobValidator,
  validateJob,
  createApplicant,
  addApplicantInJob,
  (req, res) => {
    const query = encodeURIComponent("Application sent to recruiter.");
    return res.redirect(`/jobs/?successMsg=${query}`);
  }
);

function createApplicant(req, res, next) {
  const { fullname, email, contact } = req.body;
  const resumePath = "/applicantData/" + req.file.filename;

  const newApplicant = Applicant.addApplicant(
    fullname,
    email,
    contact,
    resumePath,
    req.file.originalname
  );

  if (newApplicant) {
    req.body.newApplicant = newApplicant;
    next();
  } else {
    const query = encodeURIComponent("Server Error. Please Try Again.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
}

export default applyRouter;
