async function sendForm(event) {
  const formData = new FormData(this);
  const jsonData = {};

  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }

  event.preventDefault();
  const response = await fetch(this.action, {
    method: this.method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jsonData)
  });

  if (response.status >= 400) {
    const errorJson = await response.json();

    let error = this.querySelector("p.error");
    if (error == null) {
      error = document.createElement("p");
      error.className = "error";
      this.querySelector("[type=submit]").insertAdjacentElement("afterend", error);
    }
    error.innerText = errorJson.error;
  }

  const redirectUrl = response.headers.get("Location");
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}


document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", sendForm);
});