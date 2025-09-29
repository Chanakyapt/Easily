// function to change the app theme
function changeTheme() {
  const rootElement = document.querySelector(`:root`);
  const rootElementStyles = getComputedStyle(rootElement);
  const themeTogller = document.querySelector(`#themeToggleInput`);
  if (themeTogller.checked) {
    setCookie("appTheme", "dark", 1);
    rootElement.style.setProperty(
      "--application-background",
      rootElementStyles.getPropertyValue("--bs-dark")
    );
    rootElement.style.setProperty(
      "--application-component-background",
      rootElementStyles.getPropertyValue("--bs-gray-800")
    );
    rootElement.style.setProperty(
      "--application-componenet-text",
      rootElementStyles.getPropertyValue("--bs-gray-100")
    );
  } else {
    setCookie("appTheme", "light", 1);
    rootElement.style.setProperty(
      "--application-background",
      rootElementStyles.getPropertyValue("--bs-light")
    );
    rootElement.style.setProperty(
      "--application-component-background",
      rootElementStyles.getPropertyValue("--bs-primary-bg-subtle")
    );
    rootElement.style.setProperty(
      "--application-componenet-text",
      rootElementStyles.getPropertyValue("--bs-light-text-emphasis")
    );
  }
}

// function to set the appTheme cookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// function to remove skill from the available skills in job listing
function removeSkill(skill) {
  document.querySelector(`#${skill}`).remove();
}

// function to add skill skill in job listing
function addSkill() {
  const skillName = document.querySelector(`#addSkillInput`);
  if (skillName.value.trim().length > 0) {
    const SkillDisplay = document.querySelector(`#skillsRequiredDisplay`);

    const skillContainer = document.createElement("div");
    skillContainer.id = `Skill-${SkillDisplay.children.length + 1}`;
    skillContainer.className =
      "p-1 me-1 mb-1 rounded | jobSkill applicationBackground applicationTextColor applicationBorder";
    skillContainer.textContent = skillName.value;

    const deleteSkillBtn = document.createElement("span");
    deleteSkillBtn.setAttribute(
      "onclick",
      `removeSkill('Skill-${SkillDisplay.children.length + 1}')`
    );
    deleteSkillBtn.setAttribute("style", `cursor:pointer;`);

    const deleteImage = document.createElement("i");
    deleteImage.className = "ms-1 | fa-solid fa-circle-xmark";

    deleteSkillBtn.appendChild(deleteImage);
    skillContainer.appendChild(deleteSkillBtn);
    SkillDisplay.appendChild(skillContainer);

    skillName.value = "";
  }
}

// function to validate and submit create job form
function submitCreateJobForm() {
  const jobForm = document.querySelector("#jobForm");

  const companyName = document.querySelector("#companyName");
  const jobCategory = document.querySelector("#jobCategory");
  const jobDesignation = document.querySelector("#jobDesignation");
  const jobLocation = document.querySelector("#jobLocation");
  const Salary = document.querySelector("#Salary");
  const applyBy = document.querySelector("#applyBy");
  const numberOfOpenings = document.querySelector("#numberOfOpenings");

  const skillsRequired = jobForm.querySelector("#skillsRequiredDisplay");
  const skillsInput = jobForm.querySelector("#addSkillInput");
  const skillsInputView = jobForm.querySelector("#skillsRequiredInput");

  if (jobForm && skillsRequired && skillsInput) {
    if (companyName.value.trim().length === 0) {
      window.alert("Company name is mandetory.");
      companyName.focus();
      return;
    } else if (jobDesignation.value.trim().length === 0) {
      window.alert("Job designation is mandetory.");
      jobDesignation.focus();
      return;
    } else if (jobCategory.value.trim().length === 0) {
      window.alert("Job category is mandetory.");
      jobCategory.focus();
      return;
    } else if (skillsRequired.children.length === 0) {
      window.alert("At lest 1 skill is mandetory.");
      skillsInput.focus();
      return;
    } else if (jobLocation.value.trim().length === 0) {
      window.alert("Job location is mandetory.");
      jobLocation.focus();
      return;
    } else if (Number(Salary.value.trim()) === 0) {
      window.alert("Salary is mandetory.");
      Salary.focus();
      return;
    } else if (applyBy.value.trim().length === 0) {
      window.alert("Application end date is mandetory.");
      applyBy.focus();
      return;
    } else if (Number(numberOfOpenings.value.trim()) === 0) {
      window.alert("Number of job openings is mandetory.");
      numberOfOpenings.focus();
      return;
    }

    let skillInput = "";
    const skillCollection = skillsRequired.children;
    for (let indx = 0; indx < skillCollection.length; indx++) {
      if (skillCollection[indx].textContent.trim().includes("~")) {
        window.alert(
          "Can not pass skill name with '~'. Please Remove the Skill and update the same with correct name."
        );
        skillCollection[indx].classList.remove("applicationBackground");
        skillCollection[indx].classList.remove("applicationTextColor");
        skillCollection[indx].classList.remove("applicationBorder");
        skillCollection[indx].classList.add("bg-danger");
        return;
      }
      skillInput += skillCollection[indx].textContent.trim() + "~";
    }

    skillsInputView.value = skillInput;
    jobForm.submit();
  }
}

// function to validate and submit update job form
async function submitUpdateJobForm() {
  const jobForm = document.querySelector("#jobForm");

  const companyName = document.querySelector("#companyName");
  const jobCategory = document.querySelector("#jobCategory");
  const jobDesignation = document.querySelector("#jobDesignation");
  const jobLocation = document.querySelector("#jobLocation");
  const Salary = document.querySelector("#Salary");
  const applyBy = document.querySelector("#applyBy");
  const numberOfOpenings = document.querySelector("#numberOfOpenings");

  const skillsRequired = jobForm.querySelector("#skillsRequiredDisplay");
  const skillsInput = jobForm.querySelector("#addSkillInput");
  const skillsInputView = jobForm.querySelector("#skillsRequiredInput");

  if (jobForm && skillsRequired && skillsInput) {
    if (companyName.value.trim().length === 0) {
      window.alert("Company name is mandetory.");
      companyName.focus();
      return;
    } else if (jobDesignation.value.trim().length === 0) {
      window.alert("Job designation is mandetory.");
      jobDesignation.focus();
      return;
    } else if (jobCategory.value.trim().length === 0) {
      window.alert("Job category is mandetory.");
      jobCategory.focus();
      return;
    } else if (skillsRequired.children.length === 0) {
      window.alert("At lest 1 skill is mandetory.");
      skillsInput.focus();
      return;
    } else if (jobLocation.value.trim().length === 0) {
      window.alert("Job location is mandetory.");
      jobLocation.focus();
      return;
    } else if (Number(Salary.value.trim()) === 0) {
      window.alert("Salary is mandetory.");
      Salary.focus();
      return;
    } else if (applyBy.value.trim().length === 0) {
      window.alert("Application end date is mandetory.");
      applyBy.focus();
      return;
    } else if (Number(numberOfOpenings.value.trim()) === 0) {
      window.alert("Number of job openings is mandetory.");
      numberOfOpenings.focus();
      return;
    }

    let skillInput = "";
    const skillCollection = skillsRequired.children;
    for (let indx = 0; indx < skillCollection.length; indx++) {
      if (skillCollection[indx].textContent.trim().includes("~")) {
        window.alert(
          "Can not pass skill name with '~'. Please Remove the Skill and update the same with correct name."
        );
        skillCollection[indx].classList.remove("applicationBackground");
        skillCollection[indx].classList.remove("applicationTextColor");
        skillCollection[indx].classList.remove("applicationBorder");
        skillCollection[indx].classList.add("bg-danger");
        return;
      }
      skillInput += skillCollection[indx].textContent.trim() + "~";
    }

    skillsInputView.value = skillInput;

    if (
      window.confirm(
        `Are you sure that yo want to update the job listed against company ${companyName.value}`
      )
    ) {
      try {
        const formBody = {
          companyName: companyName.value,
          jobCategory: jobCategory.value,
          jobDesignation: jobDesignation.value,
          skillsRequiredInput: skillInput,
          jobLocation: jobLocation.value,
          Salary: Salary.value,
          applyBy: applyBy.value,
          numberOfOpenings: numberOfOpenings.value,
        };

        const response = await fetch(jobForm.getAttribute("action"), {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formBody),
        }).then((res) => {
          if (res.status === 201) {
            const jobID = jobForm.getAttribute("action").split("/")[2];
            window.location.href = `/jobs/${jobID}`;
          } else if (res.status === 501) {
            window.alert("Request Failed. Please Try Again.");
          } else if (res.status === 401) {
            const query = encodeURIComponent("You are not authorized.");
            window.location.href = `/jobs/?errorMsg=${query}`;
          } else {
            window.alert("Someting went wrong. Please Try again later.");
            window.location.href = `/`;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}

// function to validate and submit delete job form
async function deleteJob() {
  const jobDeleteForm = document.querySelector("#jobDeleteForm");
  const companyName = document.querySelector("#companyName");

  if (jobDeleteForm) {
    if (
      window.confirm(
        `Are you sure that yo want to delete the job listed against company ${companyName.value}`
      )
    ) {
      try {
        const response = await fetch(jobDeleteForm.getAttribute("action"), {
          method: "DELETE",
        }).then((res) => {
          if (res.status === 204) {
            window.alert(
              `Job listing for company ${companyName.value} deleted successfully.`
            );
            window.location.href = `/jobs`;
          } else if (res.status === 501) {
            window.alert(
              `Failed to delete job listing for company ${companyName.value}. Try again later.`
            );
          } else if (res.status === 401) {
            const query = encodeURIComponent("You are not authorized.");
            window.location.href = `/jobs/?errorMsg=${query}`;
          } else {
            window.alert("Someting went wrong. Please Try again later.");
            window.location.href = `/`;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}

// function to display application form
function displayApplicationForm() {
  const applyJobform = document.querySelector("#applyJobform");

  applyJobform.style.setProperty("display", "flex");
}

// function to search the jobs by company name in view jobs page.
function searchJobByName() {
  const searchJobByNameInput = document.querySelector("#searchJobByNameInput").value.trim();

  const jobElements = document.querySelector(".jobList").children;

  if (searchJobByNameInput.length === 0) {
    for (let job of jobElements) {
      job.style.display = "flex";
    }
  } else {
    for (let job of jobElements) {
      if (job.querySelector(".jobCompanyDisplay").textContent.trim().includes(searchJobByNameInput)) {
        job.style.display = "flex";
      } else {
        job.style.display = "none";
      }
    }
  }


}
