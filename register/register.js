// BUILD REGISTER PAGE

buildRegisterForm = () => {
  const element = `
        <form id="sign-up">
            <div class="form-group">
                <label for="username">USERNAME</label>
                <input type="text" class="form-control" id="username" placeholder="Enter Username" required>
              </div>
            <div class="form-group">
                <label for="password">PASSWORD</label>
                <input type="password" class="form-control" id="password" placeholder="Enter Password" pattern=".{8,}" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">CONFIRM PASSWORD</label>
                <input type="password" class="form-control" id="confirm-password" placeholder="Confirm Password" pattern=".{8,}" required>
            </div>
            </div>
            <button id="signup-submit" type="submit" class="btn btn-primary">Submit</button>
        </form>
        <p>Continue as a <a href="/posts">guest</a></p>
        
        `;
  $("#sign-up-div").append(element);
};
// BUILD SITE HEADER

isLoggedIn = () => {
  if (localStorage.getItem("token")) {
    localStorage.setItem("loggedIn", true);
  }
  if (!localStorage.getItem("token")) {
    window.location.href = `${window.location.origin}/users/register.html`;
    localStorage.setItem("loggedIn", false);
  }
};

const getUserToken = async (userName, userPass) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username: userName,
          password: userPass,
        },
      }),
    });
    const data = await response.json();
    const userToken = data.data.token;
    localStorage.setItem("token", userToken);
  } catch (err) {
    alert(
      "This username already exists! Please login or choose a different username."
    );
    throw err;
  }
};

// RENDER PAGE

(() => {
  buildRegisterForm();
})();

$("#sign-up").on("submit", async function (event) {
  event.preventDefault();
  try {
    const username = $("#username").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirm-password").val();
    if (password === confirmPassword) {
      const response = await getUserToken(username, password);
      $("#sign-up-div").slideUp();
      isLoggedIn();
      window.location.href = "/index.html";
      return response;
    } else {
      alert("Your passwords are not the same. Try again!");
    }
  } catch (err) {
    throw err;
  }
});

$("#login-btn").click(() => {
  window.location.href = "/login";
});

$("#signup-btn").remove();

renderPostButton();
