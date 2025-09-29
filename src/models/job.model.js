export default class Job {
  constructor(
    jobId,
    createdBy,
    jobCategory,
    jobDesignation,
    jobLocation,
    companyName,
    Salary,
    applyBy,
    skillsRequired,
    numberOfOpenings,
    jobPosted,
    applicants
  ) {
    this.jobId = jobId;
    this.createdBy = createdBy;
    this.jobCategory = jobCategory;
    this.jobDesignation = jobDesignation;
    this.jobLocation = jobLocation;
    this.companyName = companyName;
    this.Salary = Salary;
    this.applyBy = applyBy;
    this.skillsRequired = skillsRequired;
    this.numberOfOpenings = numberOfOpenings;
    this.jobPosted = jobPosted;
    this.applicants = applicants;
  }

  static jobId = 0;

  // function to get unique job if for each listing
  static getJobId() {
    return ++Job.jobId;
  }

  // function to add new job listing in available jobs array
  static addJob(
    createdBy,
    jobCategory,
    jobDesignation,
    jobLocation,
    companyName,
    Salary,
    applyBy,
    skillsRequired,
    numberOfOpenings
  ) {
    const salaryToNumber = Number(Salary);

    const applyByDateSplit = applyBy.split("-");
    const applyByYear = Number(applyByDateSplit[0]);
    const applyByMonth = Number(applyByDateSplit[1]) - 1;
    const applyByDate = Number(applyByDateSplit[2]);

    const numberOfOpeningsToNumber = Number(numberOfOpenings);

    jobs.push(
      new Job(
        Job.getJobId(),
        createdBy,
        jobCategory,
        jobDesignation,
        jobLocation,
        companyName,
        salaryToNumber,
        new Date(applyByYear, applyByMonth, applyByDate).toLocaleDateString(),
        skillsRequired,
        numberOfOpeningsToNumber,
        new Date().toLocaleDateString(),
        new Array()
      )
    );
  }

  // function to update the job listing
  static updateJob(
    jobId,
    createdBy,
    jobCategory,
    jobDesignation,
    jobLocation,
    companyName,
    Salary,
    applyBy,
    skillsRequired,
    numberOfOpenings
  ) {
    const jobIdtoNumber = Number(jobId);
    const salaryToNumber = Number(Salary);

    const applyByDateSplit = applyBy.split("-");
    const applyByYear = Number(applyByDateSplit[0]);
    const applyByMonth = Number(applyByDateSplit[1]) - 1;
    const applyByDate = Number(applyByDateSplit[2]);

    const numberOfOpeningsToNumber = Number(numberOfOpenings);

    const selectedJobIndx = Job.fetchJobIndx(jobId);

    if (
      jobs[selectedJobIndx] &&
      jobs[selectedJobIndx].jobId === jobIdtoNumber &&
      jobs[selectedJobIndx].createdBy === createdBy
    ) {
      jobs[selectedJobIndx].jobCategory = jobCategory;
      jobs[selectedJobIndx].jobDesignation = jobDesignation;
      jobs[selectedJobIndx].jobLocation = jobLocation;
      jobs[selectedJobIndx].companyName = companyName;
      jobs[selectedJobIndx].Salary = salaryToNumber;
      jobs[selectedJobIndx].applyBy = new Date(
        applyByYear,
        applyByMonth,
        applyByDate
      ).toLocaleDateString();
      jobs[selectedJobIndx].skillsRequired = skillsRequired;
      jobs[selectedJobIndx].numberOfOpenings = numberOfOpeningsToNumber;

      return true;
    } else {
      return false;
    }
  }

  // function to delete job listing
  static deleteJob(jobId, createdBy) {
    const selectedJobIndx = Job.fetchJobIndx(jobId);

    if (
      jobs[selectedJobIndx] &&
      jobs[selectedJobIndx].jobId === jobId &&
      jobs[selectedJobIndx].createdBy === createdBy
    ) { 

      jobs.splice(selectedJobIndx,1);
      return true;
    } else {
      return false 
    }
  }

  // function to add applicant in job listing
  static addApplicant(jobId ,newApplicant) {
    const selectedJobIndx = Job.fetchJobIndx(jobId);
    jobs[selectedJobIndx].applicants.push(newApplicant);

    return jobs[selectedJobIndx];
  }

  // function to fetch particular job listing by id
  static fetchJob(jobId) {
    return jobs.find((j) => j.jobId === jobId);
  }

  // function to fetch particular job listing index in the available jobs array
  static fetchJobIndx(jobId) {
    return jobs.findIndex((j) => j.jobId === jobId);
  }

  // function to fetch all the available job listings
  static fetchAllJobs() {
    return jobs;
  }

  // function to fetch all the job listings created by particular user
  static fetchAllJobs(userEmail = null) {
    if (userEmail) {
      const createdBy = userEmail;
      const userJobs = jobs.reduce((acc, job) => {
        if (job.createdBy === createdBy) acc.push(job);
        return acc;
      }, []);
      return userJobs;
    } else {
      return jobs;
    }
  }
}

// Memory variable to store the job listings.
let jobs = new Array();

Job.addJob(
  "chanakyapt@gmail.com",
  "IT",
  "Software Developer",
  "Mumbai",
  "Chanakya Ltd.",
  "3",
  "2025-04-20",
  ["Java", "Python", "C", "C++", "C#", "JavaScript", "Node", "Express"],
  "10"
);
Job.addJob(
  "chanakyapt@gmai.com",
  "IT",
  "Software Developer",
  "Delhi",
  "Chanakya Ltd.",
  "2",
  "2025-03-30",
  ["Java", "Python", "C", "C++", "C#", "JavaScript", "Node", "Express"],
  "10"
);
Job.addJob(
  "chanakyapt@gmai.com",
  "IT",
  "Software Developer",
  "Chennai",
  "New Ltd.",
  "5",
  "2025-03-30",
  ["Java", "Python", "C", "C++", "C#", "JavaScript", "Node", "Express"],
  "10"
);
Job.addJob(
  "chanakyapt@gmail.com",
  "IT",
  "Software Developer",
  "Banglore",
  "Old Ltd.",
  "5",
  "2025-03-30",
  [
    "Java",
    "Python",
    "C",
    "C++",
    "C#",
    "JavaScript",
    "Node",
    "Express",
    "Python",
    "C",
    "C++",
    "C#",
    "Python",
    "C",
    "C++",
    "C#",
  ],
  "10"
);
