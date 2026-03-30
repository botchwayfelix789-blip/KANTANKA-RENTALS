/* KANTANKA RENTALS — Main Script*/

var vehicles = {
  "kantanka-onantefo":     { name: "Kantanka Onantefo",       price: 220, img: "images/ONATEFO.jpeg" },
  "kantanka-k71":          { name: "Kantanka K71",            price: 150, img: "images/K71.jpeg" },
  "kantanka-amoanimaa":    { name: "Kantanka Amoanimaa",      price: 95,  img: "images/AMOANIMAA.jpeg" },
  "kantanka-omama":        { name: "Kantanka Omama",          price: 280, img: "images/OMAMA.jpeg" },
  "kantanka-mensah-ev":    { name: "Kantanka Mensah EV",      price: 200, img: "images/MENSAH.jpeg" },
  "kantanka-omama-pickup": { name: "Kantanka Omama Pickup",   price: 250, img: "images/OMAMA PICKUP.jpeg" },
  "toyota-corolla":        { name: "Toyota Corolla",          price: 130, img: "images/CORROLA.jpg" },
  "toyota-rav4":           { name: "Toyota RAV4",             price: 180, img: "images/RAV4.jpeg" },
  "mercedes-c-class":      { name: "Mercedes-Benz C-Class",   price: 350, img: "images/BENZ.jpg" },
  "bmw-3-series":          { name: "BMW 3 Series",            price: 320, img: "images/BMW.jpg" },
  "honda-cr-v":            { name: "Honda CR-V",              price: 170, img: "images/CRV.jpeg" },
  "hyundai-tucson":        { name: "Hyundai Tucson",          price: 160, img: "images/HYUNDAI.jpg" }
};


document.addEventListener("DOMContentLoaded", function () {

  //1. HAMBURGER MENU
  var hamburger = document.querySelector(".hamburger");
  var navLinks  = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
    });
    var links = navLinks.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("active");
      });
    }
  }


  //2. BOOKING PAGE
  var vehicleSelect = document.getElementById("vehicle");
  var summaryImg    = document.getElementById("summary-img");
  var summaryCar    = document.getElementById("summary-car");
  var summaryRate   = document.getElementById("summary-rate");
  var summaryPeriod = document.getElementById("summary-period");
  var summaryTotal  = document.getElementById("summary-total");
  var pickupInput   = document.getElementById("pickup");
  var returnInput   = document.getElementById("return");
  var bookingBtn    = document.getElementById("booking-btn");

  if (vehicleSelect && summaryCar) {
    // Read car from URL
    var urlParams = new URLSearchParams(window.location.search);
    var carParam  = urlParams.get("car");
    if (carParam && vehicles[carParam]) {
      vehicleSelect.value = carParam;
      updateSummary(carParam);
    }

    vehicleSelect.addEventListener("change", function () { updateSummary(this.value); });
    if (pickupInput) pickupInput.addEventListener("change", calculateTotal);
    if (returnInput) returnInput.addEventListener("change", calculateTotal);

    // Submit booking
    if (bookingBtn) {
      bookingBtn.addEventListener("click", function () {
        var fullname = document.getElementById("fullname").value.trim();
        var email    = document.getElementById("email").value.trim();
        var phone    = document.getElementById("phone").value.trim();
        var car      = vehicleSelect.value;
        var pickup   = pickupInput ? pickupInput.value : "";
        var ret      = returnInput ? returnInput.value : "";

        // Basic validation
        if (!fullname || !email || !phone || !car || !pickup || !ret) {
          alert("Please fill in all fields before confirming your booking.");
          return;
        }

        var carData = vehicles[car];
        var d1 = new Date(pickup);
        var d2 = new Date(ret);
        var days = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
          alert("Return date must be after the pickup date.");
          return;
        }

        // Save to localStorage
        var bookings = JSON.parse(localStorage.getItem("kantanka_bookings") || "[]");
        bookings.push({
          name: fullname,
          email: email,
          phone: phone,
          car: carData ? carData.name : car,
          pickup: pickup,
          returnDate: ret,
          days: days,
          total: "GH\u20B5 " + (days * carData.price),
          date: new Date().toLocaleString()
        });
        localStorage.setItem("kantanka_bookings", JSON.stringify(bookings));

        // Show success modal
        showModal("booking-modal");
      });
    }
  }

  function updateSummary(key) {
    var car = vehicles[key];
    if (!car) return;
    var placeholder = document.getElementById("img-placeholder");
    if (summaryImg) {
      summaryImg.src = car.img;
      summaryImg.alt = car.name;
      summaryImg.style.display = "block";
      summaryImg.onerror = function () {
        this.style.display = "none";
        if (placeholder) placeholder.style.display = "flex";
      };
      summaryImg.onload = function () {
        this.style.display = "block";
        if (placeholder) placeholder.style.display = "none";
      };
      if (placeholder) placeholder.style.display = "none";
    }
    if (summaryCar) summaryCar.textContent = car.name;
    if (summaryRate) summaryRate.textContent = "GH\u20B5 " + car.price;
    calculateTotal();
  }

  function calculateTotal() {
    var selectedKey = vehicleSelect.value;
    var car = vehicles[selectedKey];
    if (!car) return;
    var pickup = pickupInput ? pickupInput.value : "";
    var ret    = returnInput ? returnInput.value : "";
    if (pickup && ret) {
      var diff = Math.ceil((new Date(ret) - new Date(pickup)) / (1000 * 60 * 60 * 24));
      if (diff > 0) {
        if (summaryPeriod) summaryPeriod.textContent = diff + " day" + (diff > 1 ? "s" : "");
        if (summaryTotal) summaryTotal.textContent = "GH\u20B5 " + (diff * car.price);
        return;
      }
    }
    if (summaryPeriod) summaryPeriod.textContent = "\u2014 days";
    if (summaryTotal) summaryTotal.textContent = "GH\u20B5 \u2014";
  }


  //3. CONTACT PAGE
  var contactBtn = document.getElementById("contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", function () {
      var name    = document.getElementById("c-name").value.trim();
      var email   = document.getElementById("c-email").value.trim();
      var subject = document.getElementById("c-subject").value.trim();
      var message = document.getElementById("c-message").value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields before sending your message.");
        return;
      }

      // Save to localStorage
      var messages = JSON.parse(localStorage.getItem("kantanka_messages") || "[]");
      messages.push({
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("kantanka_messages", JSON.stringify(messages));

      // Show success modal
      showModal("contact-modal");
    });
  }


  //4. ADMIN DASHBOARD
  var bookingsTable  = document.getElementById("bookings-table-body");
  var messagesTable  = document.getElementById("messages-table-body");
  var clearBookings  = document.getElementById("clear-bookings");
  var clearMessages  = document.getElementById("clear-messages");

  if (bookingsTable) {
    var bookings = JSON.parse(localStorage.getItem("kantanka_bookings") || "[]");
    if (bookings.length === 0) {
      bookingsTable.innerHTML = '<tr><td colspan="8" class="empty-state">No bookings yet.</td></tr>';
    } else {
      var html = "";
      for (var b = bookings.length - 1; b >= 0; b--) {
        var bk = bookings[b];
        html += "<tr><td>" + bk.date + "</td><td>" + bk.name + "</td><td>" + bk.email + "</td><td>" + bk.phone + "</td><td>" + bk.car + "</td><td>" + bk.pickup + " to " + bk.returnDate + "</td><td>" + bk.days + "</td><td>" + bk.total + "</td></tr>";
      }
      bookingsTable.innerHTML = html;
    }
  }

  if (messagesTable) {
    var messages = JSON.parse(localStorage.getItem("kantanka_messages") || "[]");
    if (messages.length === 0) {
      messagesTable.innerHTML = '<tr><td colspan="5" class="empty-state">No messages yet.</td></tr>';
    } else {
      var html2 = "";
      for (var m = messages.length - 1; m >= 0; m--) {
        var msg = messages[m];
        html2 += "<tr><td>" + msg.date + "</td><td>" + msg.name + "</td><td>" + msg.email + "</td><td>" + msg.subject + "</td><td>" + msg.message + "</td></tr>";
      }
      messagesTable.innerHTML = html2;
    }
  }

  if (clearBookings) {
    clearBookings.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all bookings?")) {
        localStorage.removeItem("kantanka_bookings");
        location.reload();
      }
    });
  }
  if (clearMessages) {
    clearMessages.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all messages?")) {
        localStorage.removeItem("kantanka_messages");
        location.reload();
      }
    });
  }


  //MODAL HELPER
  window.showModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.add("show");
  };
  window.closeModal = function (id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove("show");
  };

  // Close modal on overlay click
  var overlays = document.querySelectorAll(".modal-overlay");
  for (var o = 0; o < overlays.length; o++) {
    overlays[o].addEventListener("click", function (e) {
      if (e.target === this) this.classList.remove("show");
    });
  }

});
