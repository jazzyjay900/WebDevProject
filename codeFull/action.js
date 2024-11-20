class Movie {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
  }
}

class Package {
  constructor(movie) {
    this.movie = movie; // Movie object
    this.tickets = 1; // Default to 1 ticket
    this.seats = []; // Array to hold seat numbers
  }

  setTickets(num) {
    this.tickets = num;
  }

  setSeats(seats) {
    this.seats = seats;
  }
}


const main = document.getElementById("section");

var action_movies = [
  {
    movie_name: "Spider-man across the spider-verse",
    movie_image: "/Assets/spider-man-across-the-spider-verse-poster.jpg",
    ticket_price: 1500,
  },
  {
    movie_name: "Spiderman into the spider-verse",
    movie_image: "/Assets/Spiderman into.jpg",
    ticket_price: 1500,
  },
  {},
  {},
  {
    movie_name: "Venom last dance",
    movie_image: "/Assets/Venom last dance.jpg",
    ticket_price: 1500,
  },
  {},
  {},
  {
    movie_name: "Bad boys 4",
    movie_image: "/Assets/badboys.jpg",
    ticket_price: 1500,
  },
  {
    movie_name: "Free Guy",
    movie_image: "/Assets/free.jpg",
    ticket_price: 1500,
  },
  {},
  {
    movie_name: "Jackpot",
    movie_image: "/Assets/jackpot.jpg",
    ticket_price: 1500,
  },
  {},
];
localStorage.setItem("action_movies", JSON.stringify(action_movies));

var detail = JSON.parse(localStorage.getItem('action_movies'));

detail.forEach((n, i) => {
  const div_movieCard = document.createElement("div");
  div_movieCard.setAttribute("class", "moviecard");
  const div_movieRow = document.createElement("div");
  div_movieRow.setAttribute("class", "movieRow");
  const div_movieCol = document.createElement("div");
  div_movieCol.setAttribute("class", "movieCol");
  const img = document.createElement("img");
  img.setAttribute("class", "thumbnail");
  const title = document.createElement("h4");
  title.setAttribute("id", "movietitle");
  const div_input = document.createElement("input");
  div_input.setAttribute("type", "number");
  div_input.setAttribute("placeholder", "TicketAMT");
  div_input.setAttribute("id", "movieticket");
  const div_button = document.createElement("button");

  div_button.innerHTML = "Add to Cart";
  title.innerHTML = n.movie_name;
  img.src = n.movie_image;
  div_movieCard.appendChild(img);
  div_movieCard.appendChild(title);
  div_movieCard.appendChild(div_input);
  div_movieCard.appendChild(div_button);
  div_movieCol.appendChild(div_movieCard);
  div_movieRow.appendChild(div_movieCol);
  main.appendChild(div_movieRow);
  if(n.movie_name==null){
    div_movieCard.style.display='none'; 
   }
  // div_button.addEventListener("click", () => addToCart);
  div_button.addEventListener('click', function cost(){
    let movie_title = n.movie_name;
    let ticketnum = div_input.value;
   var cost = ticketnum * n.ticket_price; 
   var tax = cost * 0.15;
   var totalCost = cost + tax;
   var order_detail = {movie_title: movie_title, movie_ticket_num: ticketnum,tax_amt: tax,sub_total: cost ,movie_cost: totalCost};
   storeMovie(i,order_detail);
 });
});


function storeMovie(indnum,order){
  var a=indnum;
  var invoice = order;
    if(localStorage.getItem('movieOrder')==null){
      localStorage.setItem('movieOrder','[]');
    }
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    if (!currentUserEmail) {
      alert("Please log in to add items to your cart.");
      return;
    }else{
      var movieInvoice = JSON.parse(localStorage.getItem('movieOrder'));
      movieInvoice[a]=invoice;
    
      localStorage.setItem('movieOrder',JSON.stringify(movieInvoice));
      console.log(movieInvoice);
      //console.log(a);
    }
 
}

function addToCart(name, movie_detail) {
  const movie = new Movie(
    name,
    movie_detail.movie_image,
    movie_detail.ticket_price
  );

  let packageElem = new Package(movie);
  console.log(packageElem.movie);
  const currentUserEmail = localStorage.getItem("currentUserEmail");
  if (!currentUserEmail) {
    alert("Please log in to add items to your cart.");
    return;
  }

  // Retrieve the current cart or initialize an empty array
  const cartKey = `cart_${currentUserEmail}`; // Unique key for the user's cart
  const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Add the new movie to the cart

  if(currentCart.filter(movie => movie.movie.name === name).length > 0){
    alert("Movie already in cart");
    return;
  }
  
  currentCart.push(packageElem);

  // Save the updated cart back to local storage
  localStorage.setItem(cartKey, JSON.stringify(currentCart));
}
