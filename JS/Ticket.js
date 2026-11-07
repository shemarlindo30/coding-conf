   // Coding Conf - fills in the ticket on ticket.html

function loadAttendee()
{
  const saved = localStorage.getItem("attendee");   // null if nothing was saved

  if (saved === null)
  {
    return null;
  }

  try
  {
    const attendee = JSON.parse(saved);

    // every detail the ticket needs must be there
    if (!attendee.fullName || !attendee.email || !attendee.github || !attendee.avatar || !attendee.ticketNumber)
    {
      return null;
    }
    return attendee;
  }
  catch (err)
  {
    return null;   // the saved text was not valid JSON
  }
}

/* ---------- 2. FILL IN THE PAGE ---------- */

/**
 * Puts the attendee's details into the confirmation message and the ticket.
 * @param {object} attendee - fullName, email, github, avatar and ticketNumber
 */
function showTicket(attendee)
{
  // "@anabrown" becomes "anabrown" for the profile link
  const githubHandle = attendee.github.slice(1);

  // confirmation message: "Congrats, [Name]! Your ticket is ready."
  document.getElementById("congratsName").textContent = attendee.fullName;
  document.getElementById("congratsEmail").textContent = attendee.email;

  // the ticket
  document.getElementById("ticketName").textContent = attendee.fullName;

  const avatar = document.getElementById("ticketAvatar");
  avatar.src = attendee.avatar;
  avatar.alt = "Photo of " + attendee.fullName;

  const githubLink = document.getElementById("ticketGithub");
  githubLink.textContent = attendee.github;
  githubLink.href = "https://github.com/" + githubHandle;

  document.getElementById("ticketNumber").textContent = attendee.ticketNumber;

  // the browser tab shows whose ticket it is
  document.title = attendee.fullName + "'s Ticket | Coding Conf 2026";
}


/* ---------- 3. RUN WHEN THE PAGE LOADS ---------- */
const attendee = loadAttendee();

if (attendee === null)
{
  // replace() means the Back button won't return to this empty page
  window.location.replace("index.html");
}
else
{
  showTicket(attendee);
}