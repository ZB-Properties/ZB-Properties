

(function () {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be signed in to view this page.");
    window.location.href = "Sign In.html";
  }
})();


