const ticket_price = 1500;

var all_movie_Info = [];

function cost(titlenanme,ticketamt,indnum){
  var title = document.getElementById(titlenanme).innerHTML
  var ticketnum = document.getElementById(ticketamt).value;
  var cost = ticketnum * ticket_price; 
  var tax = cost * 0.15;
  var totalCost = cost + tax;
  all_movie_Info[indnum] = {movie_title: title, movie_ticket_num: ticketnum, movie_cost: totalCost};
  storeMovie(indnum);
}

function storeMovie(indnum){
  var a=indnum;
  var invoice = all_movie_Info[a];
    if(localStorage.getItem('movieOrder')==null){
      localStorage.setItem('movieOrder','[]');
    }
  
  var movieInvoice = JSON.parse(localStorage.getItem('movieOrder'));
  movieInvoice.push(invoice);

  localStorage.setItem('movieOrder',JSON.stringify(movieInvoice));
  console.log(movieInvoice);
}