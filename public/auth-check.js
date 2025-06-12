

(function () {
  const token = localStorage.getItem('token');
  const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).toLowerCase();

  const openPages = ['sign in.html', 'index.html', 'Home.html'];
  const protectedPages = ['Post-Property.html','My properties list.html','view properties.html','Searched properties.html'];

  
  if (!token && protectedPages.includes(path)) {
    alert("Please sign in to access this page.");
    window.location.href = 'Sign In.html';
    return;
  }

  // Signed in & trying to access Sign In / Register / Landing page → redirect to a dashboard page
  if (token && openPages.includes(path)) {
    window.location.href = 'Home.html';
  }
})();

