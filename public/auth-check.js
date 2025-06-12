

(function () {
  const token = localStorage.getItem('token');
  const path = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).toLowerCase();

  const openPages = ['sign in.html', 'index.html', 'Home.html'];
  const protectedPages = ['post-property.html','my-properties-list.html','view-properties.html','searched-properties.html'];

  
  if (!token && protectedPages.includes(path)) {
    alert("Please sign in to access this page.");
    window.location.href = 'sign in.html';
    return;
  }

  // Signed in & trying to access Sign In / Register / Landing page → redirect to a dashboard page
  if (token && openPages.includes(path)) {
    window.location.href = 'Home.html';
  }
})();

