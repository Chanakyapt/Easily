// Modules
import { Router } from "express";

//Validators
import { createOrUpdateJobValidation } from "../middlewares/validator.js";

// Models
import Job from "../models/job.model.js";
import templateRenderData from "../models/templateRenderData.model.js";

const jobRouter = Router({ mergeParams: true });

// defaylt get jobs route.
jobRouter.get("/", (req, res) => {
  const templateData = new templateRenderData();
  templateData.addProperty("titleDesc", "Jobs");
  templateData.addProperty("page", "jobs");

  if (req.query.errorMsg) {
    templateData.addProperty("errorMsg", [{ msg: req.query.errorMsg }]);
  }

  if (req.query.successMsg) {
    templateData.addProperty("successMsg", [{ msg: req.query.successMsg }]);
  }

  if (req.session.userEmail) {
    // get jobs created by user.
    templateData.addProperty("userData", "Recruiter");
    templateData.addProperty("email", req.session.userEmail);
    templateData.addProperty(
      "jobDetails",
      Job.fetchAllJobs(req.session.userEmail)
    );
    return res.render("jobs.ejs", templateData);
  } else {
    // get all the job postings (for job seekers)
    templateData.addProperty("userData", "User");
    templateData.addProperty("email", null);
    templateData.addProperty("jobDetails", Job.fetchAllJobs());
    return res.render("jobs.ejs", templateData);
  }
});

// To serve job listing create view
jobRouter.get("/createJob", (req, res) => {
  if (req.session.userEmail) {
    // If user is logged in, then only system will allow to create the job.
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Create Job");
    templateData.addProperty("page", "Create");
    templateData.addProperty("userData", "Recruiter");
    templateData.addProperty("createdBy", req.session.userEmail);
    return res.render("jobCreateView.ejs", templateData);
  } else {
    const query = encodeURIComponent("Please Login to continue.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
});

// To view the applicants for the selected job
jobRouter.get("/viewApplicants/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);
  const selectedJob = Job.fetchJob(jobId);

  const templateData = new templateRenderData();
  templateData.addProperty("titleDesc", "View Applicants");
  templateData.addProperty("page", "View Applicants");

  if (req.query.errorMsg) {
    templateData.addProperty("errorMsg", [{ msg: req.query.errorMsg }]);
  }

  if (req.query.successMsg) {
    templateData.addProperty("successMsg", [{ msg: req.query.successMsg }]);
  }

  if (selectedJob && req.session.userEmail) {
    // If user is logged in, then only system will allow to view the job applicants.
    templateData.addProperty("jobDetails", selectedJob);
    templateData.addProperty("userData", "Recruiter");
    return res.render("jobApplicantsView.ejs", templateData);
  } else {
    const query = encodeURIComponent("Please Login to continue.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
});

// To get details of particular job listing
jobRouter.get("/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);
  const selectedJob = Job.fetchJob(jobId);

  const templateData = new templateRenderData();
  templateData.addProperty("titleDesc", "Apply");
  templateData.addProperty("page", "Apply");

  if (req.query.errorMsg) {
    templateData.addProperty("errorMsg", [{ msg: req.query.errorMsg }]);
  }

  if (req.query.successMsg) {
    templateData.addProperty("successMsg", [{ msg: req.query.successMsg }]);
  }

  if (selectedJob) {
    templateData.addProperty("jobDetails", selectedJob);
    if (req.session.userEmail) {
      // if user is logged in, passing user data which will grant permissions for creating/updating jobs
      if (req.session.userEmail === selectedJob.createdBy) {
        templateData.addProperty("userData", "Recruiter");
        return res.render("jobView.ejs", templateData);
      } else {
        const query = encodeURIComponent("You are not authorized.");
        return res.redirect(`/jobs/?errorMsg=${query}`);
      }
    } else {
      // if user is not logged in, rendring page to allow job applications
      templateData.addProperty("userData", "User");
      return res.render("jobView.ejs", templateData);
    }
  } else {
    const query = encodeURIComponent("Job Not Found.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
});

// To serve job listing update view for selected job
jobRouter.get("/update/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);
  const selectedJob = Job.fetchJob(jobId);

  if (selectedJob) {
    // Checks if the selected job is available
    const templateData = new templateRenderData();
    templateData.addProperty("titleDesc", "Apply");
    templateData.addProperty("page", "Apply");
    templateData.addProperty("jobDetails", selectedJob);

    if (req.session.userEmail === selectedJob.createdBy) {
      // if selected job is available and it is created by same user who is logged in then system will allow to update.
      templateData.addProperty("userData", "Recruiter");
      return res.render("jobUpdateView.ejs", templateData);
    } else {
      const query = encodeURIComponent("You are not authorized.");
      return res.redirect(`/jobs/?errorMsg=${query}`);
    }
  } else {
    const query = encodeURIComponent("Job Not Found.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
});

// To handle job listings creation requests
jobRouter.post("/", createOrUpdateJobValidation, (req, res) => {
  if (req.session.userEmail) {
    // System will only allow job creation is user is logged in.
    const {
      jobCategory,
      jobDesignation,
      jobLocation,
      companyName,
      Salary,
      applyBy,
      skillsRequiredInput,
      numberOfOpenings,
    } = req.body;

    const skillsRequired = skillsRequiredInput.split("~").reduce((acc, job) => {
      if (job) {
        acc.push(job);
      }
      return acc;
    }, []);

    Job.addJob(
      req.session.userEmail,
      jobCategory,
      jobDesignation,
      jobLocation,
      companyName,
      Salary,
      applyBy,
      skillsRequired,
      numberOfOpenings
    );

    return res.redirect("/");
  } else {
    const query = encodeURIComponent("You are not authorized.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
});

// To handle job listings updation requests
jobRouter.put("/:jobId", createOrUpdateJobValidation, (req, res) => {
  const jobId = Number(req.params.jobId);

  if (req.session.userEmail) {
    // System will only allow job updation is user is logged in.
    const {
      jobCategory,
      jobDesignation,
      jobLocation,
      companyName,
      Salary,
      applyBy,
      skillsRequiredInput,
      numberOfOpenings,
    } = req.body;

    const skillsRequired = skillsRequiredInput.split("~").reduce((acc, job) => {
      if (job) {
        acc.push(job);
      }
      return acc;
    }, []);

    const response = {
      jobUpdateStatus: Job.updateJob(
        jobId,
        req.session.userEmail,
        jobCategory,
        jobDesignation,
        jobLocation,
        companyName,
        Salary,
        applyBy,
        skillsRequired,
        numberOfOpenings
      ),
    };

    if (response.jobUpdateStatus) return res.status(201).json(response);
    else return res.status(501).json(response);
  } else {
    return res.status(401).send();
  }
});

// To handle the deletion request of selected job.
jobRouter.delete("/delete/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);

  if (req.session.userEmail) {
    // System will only allow job deletion is user is logged in.
    const response = {
      jobUpdateStatus: Job.deleteJob(jobId, req.session.userEmail),
    };

    if (response.jobUpdateStatus) return res.status(204).json(response);
    else return res.status(501).json(response);
  } else {
    return res.status(401).send();
  }
});

// To validate the job for incoming applications.
export function validateJob(req, res, next) {
  if (Job.fetchJob(Number(req.params.jobId))) {
    next();
  } else {
    const query = encodeURIComponent("Job does not exists.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
}

// To add the applicant in the job applicants array.
export function addApplicantInJob(req, res, next) {
  const updatedJob = Job.addApplicant(
    Number(req.params.jobId),
    req.body.newApplicant
  );
  if (updatedJob) next();
  else {
    const query = encodeURIComponent("Server Error. Please Try Again.");
    return res.redirect(`/jobs/?errorMsg=${query}`);
  }
}

export default jobRouter;
