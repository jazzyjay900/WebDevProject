class Movie {
    constructor(name, image, price) {
      this.name = name;
      this.image = image;
      this.price = price;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    displayUserCart();
  });
  
  // Global variables
  let selectedSeats = [];
  
  // Function to display the user cart
  function displayUserCart() {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const cartKey = `cart_${currentUserEmail}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    const mainDiv = document.querySelector(".main");
  
    mainDiv.innerHTML = ""; // Clear previous content
  
    if (cartItems.length > 0) {
      cartItems.forEach((item, index) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("moviecard");
  
        movieCard.innerHTML = `
          <img src="${item.movie.image}" class="thumbnail" alt="${item.movie.name}">
          <h4>${item.movie.name}</h4>
          <div class="movieinfo">
            <h4>Price: $${item.movie.price.toFixed(2)}</h4>
            <h4>Seats: ${item.seats?.join(", ") || "None selected"}</h4>
            <h4>Tickets: ${item.tickets || 1}</h4>
            <button class="action-btn" id="increase-${index}">+</button>
            <button class="action-btn" id="decrease-${index}">-</button>
            <button class="action-btn" id="selectSeats-${index}">Select Seats</button>
            <button class="action-btn" id="generateInvoice-${index}">Generate Invoice</button>
            <button class="remove-btn" id="remove-${index}">Remove</button>
            <div id="seatSelectionDiv-${index}" class="seat-selection hidden"></div>
          </div>
        `;
  
        mainDiv.appendChild(movieCard);
  
        // Add event listeners
        document.getElementById(`increase-${index}`).addEventListener("click", () => updateSeats(index, 1));
        document.getElementById(`decrease-${index}`).addEventListener("click", () => updateSeats(index, -1));
        document.getElementById(`selectSeats-${index}`).addEventListener("click", () => createSeatSelection(item.movie.name, index));
        document.getElementById(`generateInvoice-${index}`).addEventListener("click", () => generateInvoice(item));
        document.getElementById(`remove-${index}`).addEventListener("click", () => removeFromCart(index));
      });
  
      // Add clear cart button
      const clearButton = document.createElement("button");
      clearButton.textContent = "Clear Cart";
      clearButton.id = "clearCartButton";
      clearButton.classList.add("action-btn");
      clearButton.addEventListener("click", clearCart);
      mainDiv.appendChild(clearButton);
    } else {
      mainDiv.innerHTML = `<h4 style="text-align: center">Your cart is empty.</h4>`;
    }
  
    updateCartTotal();
  }
  
  // Function to update the number of tickets
  function updateSeats(index, change) {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const cartKey = `cart_${currentUserEmail}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    if (cart[index]) {
      cart[index].tickets = (cart[index].tickets || 1) + change;
  
      if (cart[index].tickets < 1) {
        cart[index].tickets = 1; // Prevent tickets from going below 1
        alert("You must have at least one ticket.");
      }
  
      localStorage.setItem(cartKey, JSON.stringify(cart));
      displayUserCart();
    } else {
      console.error(`Cart item at index ${index} does not exist.`);
    }
  }
  
  // Function to create seat selection UI
  function createSeatSelection(movieTitle, index) {
    const seatSelectionDiv = document.getElementById(`seatSelectionDiv-${index}`);
    seatSelectionDiv.innerHTML = "";
    selectedSeats = [];
  
    const titleElement = document.createElement("h4");
    titleElement.innerText = `Select Seats for ${movieTitle}`;
    seatSelectionDiv.appendChild(titleElement);
  
    const seatContainer = document.createElement("div");
    seatContainer.style.display = "flex";
    seatContainer.style.flexWrap = "wrap";
    seatContainer.style.maxWidth = "350px";
    seatContainer.style.gap = "10px";
    seatContainer.style.justifyContent = "center";
    seatContainer.style.margin = "10px auto";
  
    const ticketCount = JSON.parse(localStorage.getItem(`cart_${localStorage.getItem("currentUserEmail")}`))[index].tickets;
  
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 7; j++) {
        const seat = document.createElement("div");
        seat.className = "seat available";
        seat.innerText = `${String.fromCharCode(65 + i)}${j}`;
        seat.onclick = function () {
          toggleSeatSelection(seat, ticketCount);
        };
        seatContainer.appendChild(seat);
      }
    }
  
    seatSelectionDiv.appendChild(seatContainer);
    seatSelectionDiv.classList.remove("hidden");
  
    const confirmSeatsButton = document.createElement("button");
    confirmSeatsButton.innerText = "Confirm Seats";
    confirmSeatsButton.classList.add("action-btn");
    confirmSeatsButton.onclick = function () {
      const currentUserEmail = localStorage.getItem("currentUserEmail");
      const cartKey = `cart_${currentUserEmail}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
      cart[index].seats = selectedSeats;
      localStorage.setItem(cartKey, JSON.stringify(cart));
  
      seatSelectionDiv.classList.add("hidden");
      displayUserCart();
    };
    seatSelectionDiv.appendChild(confirmSeatsButton);
  }
  
  // Toggle seat selection
  function toggleSeatSelection(seat, ticketCount) {
    if (selectedSeats.length < ticketCount || seat.classList.contains("selected")) {
      seat.classList.toggle("selected");
      const seatLabel = seat.innerText;
  
      if (selectedSeats.includes(seatLabel)) {
        selectedSeats = selectedSeats.filter((s) => s !== seatLabel);
      } else {
        selectedSeats.push(seatLabel);
      }
    } else {
      alert("You can only select " + ticketCount + " seats.");
    }
  }
  
  // Generate invoice
  function generateInvoice(item) {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const invoiceContent = `
      Movie Purchase Invoice
      Customer: ${currentUserEmail}
      Movie: ${item.movie.name}
      Price: $${item.movie.price.toFixed(2)}
      Selected Seats: ${item.seats?.join(", ") || "None"}
      Total: $${item.movie.price.toFixed(2)}
      Date: ${new Date().toLocaleDateString()}
    `;
  
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.movie.name}_invoice.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Remove item from cart
  function removeFromCart(index) {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const cartKey = `cart_${currentUserEmail}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    cart.splice(index, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    displayUserCart();
  }
  
  // Clear the cart
  function clearCart() {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const cartKey = `cart_${currentUserEmail}`;
    localStorage.setItem(cartKey, JSON.stringify([]));
    displayUserCart();
  }
  
  // Update the cart total
  function updateCartTotal() {
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const cartKey = `cart_${currentUserEmail}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const total = cart.reduce((sum, item) => sum + item.movie.price, 0);
  
    let totalDiv = document.getElementById("cartTotal");
    if (!totalDiv) {
      totalDiv = document.createElement("div");
      totalDiv.id = "cartTotal";
      document.querySelector(".main").appendChild(totalDiv);
    }
  
    totalDiv.innerHTML = `
      <h4>Total: $${total.toFixed(2)}</h4>
    `;
  }
  