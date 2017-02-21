$(document).ready(function() {
  // side nav functionality
  $(".button-collapse").sideNav();

  // declaring tbody, object of products (items), and setting subtotal = 0
  let tbody = $('#tbody');
  let prices = {
    toiletpaper: {
      name: "Toilet Paper",
      price: "$5.49",
      priceToAdd: 5.49,
      quantity: 0
    },
    mouthwash: {
      name: "Mouthwash",
      price: "$5.99",
      priceToAdd: 5.99,
      quantity: 0
    },
    toothbrush: {
      name: "Toothbrush",
      price: "$1.25",
      priceToAdd: 1.25,
      quantity: 0
    },
    toothpaste: {
      name: "Toothpaste",
      price: "$2.99",
      priceToAdd: 2.99,
      quantity: 0
    }
  };
  let subtotal = 0;

  // clear function to clear cart, set subtotal = 0, reset quantities in prices
  function clear() {
    // clearing quantities
    for (let item in prices) {
      prices[item].quantity = 0;
    }

    subtotal = 0;
    $('#subtotal').text('');
    $('#total').text('');
    $('#tax').text('');

    $('#name').val('');
    $('#phone').val('');
    $('#address').val('');

    $('tfoot').addClass('hide');
    $('.input-field input[type=tel]').removeClass('invalid valid');
    $('.input-field input[type=tel] + label').removeClass('active');

    $('.input-field input[type=text]').removeClass('valid');
    $('.input-field input[type=text] + label').removeClass('active');

    tbody.children().remove();
  }

  function calculateTotals(priceToAdd) {
    subtotal += priceToAdd;
    subtotal = Math.abs(subtotal);
    let tax = Math.abs(subtotal * 0.08845).toFixed(2);
    let total = Math.abs(parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

    $('#subtotal').text(`$ ${subtotal.toFixed(2)}`);
    $('#tax').text(`$ ${tax}`);
    $('#total').text(`$ ${total}`);
  }

  // event listener for adding items to cart
  $(this).on('click', '.items', function() {
    // display table footer - i.e., subtotal, tax, total
    $('tfoot').removeClass('hide');

    // create variables accessing elements in prices object
    let id = $(event.target).attr("id");
    let price = prices[$(event.target).attr("id")].price;
    let name = prices[$(event.target).attr("id")].name;
    let priceToAdd = prices[$(event.target).attr("id")].priceToAdd;

    // incrementing quantity by 1
    prices[$(event.target).attr("id")].quantity += 1;
    // displaying new total (priceTotal) for ALL quanities of an item
    let quantity = prices[$(event.target).attr("id")].quantity;
    let priceTotal = (parseFloat(quantity) * parseFloat(priceToAdd)).toFixed(2);

    // calculating subtotal, tax, total
    calculateTotals(priceToAdd);

    // creating table row & appending to body
    let tr = $('<tr>');

    tbody.append(tr);

    // to handle adding first of an item into receipt
    if (prices[$(event.target).attr("id")].quantity === 1) {
      tr.append(`<td class="left-align">${name}</td>`,
        `<td class="quantity center-align ${id}">${quantity}</td>`,
        `<td>
          <a class="btn-floating halfway-fab waves-effect waves-light blue lighten-2"><i class="material-icons cart_edit ${id}" id="additem">add_shopping_cart</i></a>
          <a class="btn-floating halfway-fab waves-effect waves-light blue lighten-2"><i class="material-icons cart_edit ${id}" id="removeitem">remove_shopping_cart</i></a>
        </td>`,
        `<td class="right-align priceTotal ${id}">${priceTotal}</td>`);
    }
    // adding all other 1+ quantities to receipt
    else {
      $(`.quantity.${id}`).text(quantity);
      $(`.priceTotal.${id}`).text(priceTotal);
    }
    event.preventDefault();
  });

  // event listener for editing the cart (add/remove_shopping_cart btns)
  $(this).on('click', '.cart_edit', function() {
    //if click add to shopping cart btn
    if ($(event.target).attr("id") === "additem") {
      // increment quantity & set new quantity display
      prices[event.target.classList[2]].quantity += 1;
      let quantity = prices[event.target.classList[2]].quantity;

      $(event.target).parent().parent().prev().text(quantity);

      // edit price total from changed quantity
      let priceToAdd = prices[event.target.classList[2]].priceToAdd;

      let priceTotal = (parseFloat(quantity) * parseFloat(priceToAdd)).toFixed(2);

      $(event.target).parent().parent().next().text(priceTotal);

      calculateTotals(priceToAdd);
    }
    // if click remove from shopping cart btn
    if ($(event.target).attr("id") === "removeitem") {
      // increment quantity
      prices[event.target.classList[2]].quantity -= 1;

      let quantity = prices[event.target.classList[2]].quantity;

      // remove tr if quantity === 0
      if (quantity === 0) {
        $(event.target).parent().parent().parent().remove();
      }
      else {
        // else edit quantity display
        $(event.target).parent().parent().prev().text(quantity);
      }

      let priceToAdd = prices[event.target.classList[2]].priceToAdd;

      calculateTotals(-parseFloat(priceToAdd));
      // calculate and display new total price of quantity of items
      let priceTotal = (parseFloat(quantity) * parseFloat(priceToAdd)).toFixed(2);

      $(event.target).parent().parent().next().text(priceTotal);
    }
  });

  // event listener for place order button
  $('#btn').click(function() {
    if ($('#total').text() === '' || $('#total').text() === '$ 0.00') {
      Materialize.toast('Please add an item to your order before pressing "Place Order"', 4000);
      event.preventDefault();
    }
    else if ($('#name').val() === '' || $('#phone').val() === '' || $('#address').val() === '') {
      Materialize.toast('Please fill out all of the fields. Your order has not been completed.', 4000);
      event.preventDefault();
    }
    else if ($('.input-field input[type=tel]').hasClass('valid')) {
      clear();
      Materialize.toast('Success. Your order has been completed. Your gToiletries will arrive shortly via gDrone.', 6000);
      event.preventDefault();
    }
  });

  // event listener for cancel button
  $('#cancel').click(function() {
    clear();
    Materialize.toast(`Sorry we couldn't meet your gToiletry needs. Please come again soon.`, 4000);
    event.preventDefault();
  });
});
