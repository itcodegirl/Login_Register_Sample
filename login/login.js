const logIn = () => {
  localStorage.setItem("loggedIn", true);
  window.location.href = "/posts";
};

// BUILD AND RENDER LOGIN FORM
buildLoginForm = () => {
  const element = `
            <form id="log-in">
                <div class="form-group">
                    <label for="username">USERNAME</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter Username" required>
                  </div>
                <div class="form-group">
                    <label for="password">PASSWORD</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter Password" pattern=".{8,}" required>
                </div>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="storeInfo">
                    <label class="form-check-label" for="storeInfo">Remember Me</label>
                </div>
                <button id="login-submit" type="submit" class="btn btn-primary">Submit</button>
            </form> `;
  $("#app").append(element);
};

buildLoginForm();

const fetchLogin = async () => {
  const username = $("#username").val();
  const password = $("#password").val();
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: username,
          password: password,
        },
      }),
    });
    const data = await response.json();
    localStorage.setItem("token", data.data.token);
    return data;
  } catch (err) {
    throw err;
  }
};

$("#log-in").on("submit", async (element) => {
  element.preventDefault();
  await fetchLogin();
  logIn();
});
