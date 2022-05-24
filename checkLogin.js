const checkLoggedIn = async () => {
  if (localStorage.getItem("token")) {
    localStorage.setItem("loggedIn", true);
  }
  if (!localStorage.getItem("token")) {
    window.location.href = "/register";
    localStorage.setItem("loggedIn", false);
  }
};
