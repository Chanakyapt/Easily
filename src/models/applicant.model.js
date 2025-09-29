export default class Applicant {
  constructor(name, email, contact, resumePath, resumeName) {
    this.applicantId = Applicant.applicantId++;
    this.name = name;
    this.email = email;
    this.contact = contact;
    this.resumePath = resumePath;
    this.resumeName = resumeName;
  }

  static applicantId = 1;

  // function to add the applicant
  static addApplicant(name, email, contact, resumePath, resumeName) {
    applicants.push(new Applicant(name, email, contact, resumePath, resumeName));
    return applicants[applicants.length-1];
  }
}
// Memory variable to store the details of applicants
let applicants = new Array();
