   // Coding Conf - form validation for login.html
function showError(errorId, message)
{
  document.getElementById(errorId).textContent = message;
}

/**
 * Checks the full name.
 * @param {string} fullName - the name with spaces trimmed from both ends
 * @returns {string} an error message, or "" if the name is fine
 */
function checkFullName(fullName)
{
  if (fullName === "")
  {
    return "Please enter your full name.";
  }
  return "";
}

/**
 * Checks the email against the email pattern (user@domain.com).
 * @param {string} email - the email with spaces trimmed from both ends
 * @returns {string} an error message, or "" if the email is fine
 */
function checkEmail(email)
{
  if (email === "")
  {
    return "Please enter your email address.";
  }
  if (!EMAIL_PATTERN.test(email))
  {
    return "Please enter a valid email address, like name@example.com.";
  }
  return "";
}

/**
 * Checks the GitHub username starts with @ and has no spaces or symbols.
 * @param {string} github - the username with spaces trimmed from both ends
 * @returns {string} an error message, or "" if the username is fine
 */
function checkGithub(github)
{
  if (github === "")
  {
    return "Please enter your GitHub username.";
  }
  if (github.charAt(0) !== "@")
  {
    return "Your GitHub username must start with @, like @yourusername.";
  }
  if (!GITHUB_PATTERN.test(github))
  {
    return "Use only letters, numbers or hyphens after the @.";
  }
  return "";
}

/**
 * Checks a photo was chosen, is a JPG or PNG, and is under 500KB.
 * @param {File} file - the chosen file, or undefined if none was chosen
 * @returns {string} an error message, or "" if the photo is fine
 */
function checkAvatar(file)
{
  if (file === undefined)
  {
    return "Please upload a photo.";
  }
  if (file.type !== "image/jpeg" && file.type !== "image/png")
  {
    return "File must be a JPG or PNG image.";
  }
  if (file.size > MAX_AVATAR_SIZE)
  {
    return "File too large. Please upload a photo under 500KB.";
  }
  return "";
}

/**
 * Makes a random 5-digit ticket number, for example "#01609".
 * @returns {string} the ticket number
 */
function makeTicketNumber()
{
  const serial = Math.floor(Math.random() * 100000);   // 0 to 99999
  return "#" + ("00000" + serial).slice(-5);            // pad with zeros to 5 digits
}

/**
 * Reads the photo as text, saves all the details in localStorage,
 * then opens the ticket page.
 * @param {File} file - the checked photo
 * @param {object} attendee - name, email, github and ticket number
 */
function saveAndContinue(file, attendee)
{
  const reader = new FileReader();

  // runs once the photo has been read; saving and moving page must happen in here
  reader.onload = function ()
  {
    attendee.avatar = reader.result;

    try
    {
      localStorage.setItem("attendee", JSON.stringify(attendee));
    }
    catch (err)
    {
      showError("avatarError", "Your photo could not be saved. Please try a smaller image.");
      return;
    }

    window.location.href = "ticket.html";
  };

  reader.readAsDataURL(file);
}


/* ---------- 4. CHECK THE FORM WHEN IT IS SUBMITTED ---------- */
form.addEventListener("submit", function (event)
{
  event.preventDefault();   // stop the browser's normal submit; this script moves to the next page

  // read the values (trim removes spaces at the start and end)
  const file = avatarInput.files[0];
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const github = githubInput.value.trim();

  // check every field and show its message (an empty message clears an old error)
  const avatarMessage = checkAvatar(file);
  const nameMessage = checkFullName(fullName);
  const emailMessage = checkEmail(email);
  const githubMessage = checkGithub(github);

  showError("avatarError", avatarMessage);
  showError("fullNameError", nameMessage);
  showError("emailError", emailMessage);
  showError("githubError", githubMessage);

  // move the cursor to the first field with a problem
  if (avatarMessage !== "")
  {
    avatarInput.focus();
  }
  else if (nameMessage !== "")
  {
    fullNameInput.focus();
  }
  else if (emailMessage !== "")
  {
    emailInput.focus();
  }
  else if (githubMessage !== "")
  {
    githubInput.focus();
  }
  else
  {
    // everything is valid: save and go to the ticket
    const attendee = {
      fullName: fullName,
      email: email,
      github: github,
      ticketNumber: makeTicketNumber()
    };
    saveAndContinue(file, attendee);
  }
});


/* ---------- 5. EXTRA HELP WHILE THE USER IS TYPING ---------- */

/**
 * Clears a field's error as soon as the user starts fixing it.
 * @param {HTMLElement} input - the text input to watch
 * @param {string} errorId - id of that input's error line
 */
function clearErrorWhileTyping(input, errorId)
{
  input.addEventListener("input", function ()
  {
    showError(errorId, "");
  });
}

clearErrorWhileTyping(fullNameInput, "fullNameError");
clearErrorWhileTyping(emailInput, "emailError");
clearErrorWhileTyping(githubInput, "githubError");

// check the photo as soon as it is chosen, and show a preview in the upload box
avatarInput.addEventListener("change", function ()
{
  const file = avatarInput.files[0];
  const avatarMessage = checkAvatar(file);
  showError("avatarError", avatarMessage);

  if (avatarMessage === "")
  {
    const reader = new FileReader();
    reader.onload = function ()
    {
      uploadIcon.src = reader.result;
      uploadIcon.alt = "Preview of your photo";
      uploadText.textContent = file.name + " (click to change)";
    };
    reader.readAsDataURL(file);
  }
});