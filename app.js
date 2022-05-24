isLoggedIn = () => {
  if (localStorage.getItem("token")) {
    console.log("is logged in in app.js");
    localStorage.setItem("loggedIn", true);
    window.location.href = "/posts";
  }
  console.log(window.location.origin);
  if (!localStorage.getItem("token")) {
    window.location.href = `/register`;
    localStorage.setItem("loggedIn", false);
  }
};

isLoggedIn();
