const API_URL = '';
const token = localStorage.getItem('token');


const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-item").forEach(n =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );
}

// --- Property Form Preview ---
const propertyForm = document.querySelector("#propertyForm");
const fileUploadBtn = document.querySelector("#fileUploadBtn");
const uploadedImage = document.querySelector("#uploadedImage");
const postBtn = document.querySelector("#postBtn");

if (propertyForm && fileUploadBtn && uploadedImage && postBtn) {
  const readFileAsync = files => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.addEventListener("load", () => {
      const Image = document.createElement("img");
      Image.src = fileReader.result;
      Image.alt = "property";
      Image.setAttribute("class", "ab-img");
      uploadedImage.appendChild(Image);
    });
  };

  fileUploadBtn.addEventListener("change", () => {
    if (uploadedImage.firstChild) {
      uploadedImage.removeChild(uploadedImage.firstChild);
    }
    readFileAsync(fileUploadBtn.files);
  });

  postBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("mypropertyadverts.html");
  });
}

// --- View Buttons ---
const viewBtns = document.querySelectorAll(".viewBtn");
viewBtns.forEach((viewBtn) => {
  viewBtn.addEventListener("click", () => {
    window.location.replace("Specific property 1.html");
  });
});

// --- Update Property Button ---
const updateForm = document.querySelector("#updateForm");
const updateBtn = document.querySelector("#updateBtn");

if (updateBtn && updateForm) {
  updateBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("Specific property 1.html");
    updateForm.classList.add("sp-hide");
  });
}

// --- Modal Delete Buttons ---
const modal = document.getElementById("myModal");
const deletePropertyBtn = document.getElementById("deleteProperty");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

if (deletePropertyBtn && modal) {
  deletePropertyBtn.onclick = function () {
    modal.style.display = "block";
  };
}

if (yesBtn) {
  yesBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("My property list.html");
  });
}

if (noBtn) {
  noBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("Specific property 1.html");
  });
}

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// --- Signup Logic ---

document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Signup successful!');
      window.location.href = 'Sign In.html'; // redirect
    } else {
      alert('Signup failed: ' + data.message);
    }
  } catch (err) {
    console.error('Signup failed:', err);
    alert('Signup failed: Something went wrong');
  }
});



// --- Signin Function ---
async function signin(event) {
  event.preventDefault();
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  try {
    const res = await fetch(`/api/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Signin failed:', error);
  }
}

// --- Fetch Properties ---
async function fetchProperties() {
  try {
    const res = await fetch(`/api/properties/all`);
    const data = await res.json();
    displayProperties(data);
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
}

// --- Post Property ---
const postPropertyForm = document.getElementById('propertyForm');
if (postPropertyForm) {
  postPropertyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('image_url', document.getElementById('image').files[0]);

    try {
      const res = await fetch(`/api/properties/post`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      alert(data.message);
      fetchUserProperties();
    } catch (error) {
      console.error('Error posting property:', error);
    }
  });
}

// --- Display Properties ---
function displayProperties(properties) {
  const container = document.getElementById('properties');
  if (!container) return;

  container.innerHTML = '';
  properties.forEach(prop => {
    container.innerHTML += `
      <div class="property">
        <h3>${prop.title}</h3>
        <p>${prop.description}</p>
        <p>Price: $${prop.price}</p>
        <p>Location: ${prop.location}</p>
        <p>Status: ${prop.status}</p>
        <img src="${prop.image_url}" width="200">
        <button onclick="getProperty(${prop.id})">View Details</button>
      </div>
    `;
  });
}

// --- Update Property ---
async function updateProperty(id) {
  const newPrice = prompt('Enter new price:');
  if (!newPrice) return;

  try {
    const res = await fetch(`/api/properties/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ price: newPrice }),
    });

    const data = await res.json();
    alert(data.message);
    fetchUserProperties();
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

// --- Delete Property ---
async function deleteProperty(id) {
  if (!confirm('Are you sure?')) return;

  try {
    const res = await fetch(`/api/properties/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await res.json();
    alert(data.message);
    fetchUserProperties();
  } catch (error) {
    console.error('Error deleting property:', error);
  }
}

// --- Get One Property ---
async function getProperty(id) {
  try {
    const res = await fetch(`/api/properties/${id}`);
    const data = await res.json();
    alert(`Property: ${data.title}\nDescription: ${data.description}`);
  } catch (error) {
    console.error('Error fetching property:', error);
  }
}

// --- Get Property by Type ---
async function getPropertyByType(type) {
  try {
    const res = await fetch(`/api/properties/type/${type}`);
    const data = await res.json();
    alert(`Property: ${data.title}\nType: ${data.type}`);
  } catch (error) {
    console.error('Error fetching property by type:', error);
  }
}

// --- Mark as Sold ---
async function markAsSold(id) {
  try {
    const res = await fetch(`/api/properties/sold/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await res.json();
    alert(data.message);
    fetchUserProperties();
  } catch (error) {
    console.error('Error marking property as sold:', error);
  }
}
