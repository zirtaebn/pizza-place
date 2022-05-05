const doc = (element) => document.querySelector(element);
const doc_all = (element) => document.querySelectorAll(element);
let pizzaQt = 1;
let key = null;
let sizeSelected = null;
let qtSelected = null;
let pizzaSelected = null;
let pizzaPriceSelected = null;
let pizzas = [];
let pizza = {};
let subTotal = null;
let total = null;
let items = null;
let pizzaIndex = 0;
let keyCart = null;




pizzaJson.map((item, index) => {

    // clones the structure from HTML
    let pizzaItem = doc('.models .pizza-item').cloneNode(true);

    // fills the structure with information
    pizzaItem.setAttribute('data-index', index)
    pizzaItem.querySelector('.pizza-item-img img').src = item.img;
    pizzaItem.querySelector('.pizza-item-price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item-name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-desc').innerHTML = item.description;

    //modal
    pizzaItem.querySelector('.pizza-item-link').addEventListener('click',(element) => {

        // mobile only
        doc('body').classList.add('overflow-mobile');

        // sets the default quantity 
        pizzaQt = 1;


        let index = element.target.closest('.pizza-item').getAttribute('data-index');
        key = index;

        // fills the modal with information
        doc('.pizza-img img').src = pizzaJson[index].img;
        doc('.pizza-info h1').innerHTML = pizzaJson[index].name;
        doc('.pizza-desc').innerHTML = pizzaJson[index].description;
        doc_all('.pizza-size').forEach((size, sizeIndex) => {

            // clears the size option and sets the default option  
            size.classList.remove('selected');
            if(sizeIndex == 2){

                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[index].sizes[sizeIndex];
        })
        doc('.pizza-price').innerHTML = `R$ ${pizzaJson[index].price.toFixed(2)}`;
        doc('.pizza-qt').innerHTML = pizzaQt;
        

        // opens the modal
        doc('.pizza-window-area').style.opacity = '0';
        doc('.pizza-window-area').style.display = 'flex';
        setTimeout(() => {

            doc('.pizza-window-area').style.opacity = '1';
        }, 100)
    })


    // appends the clone to the body
    doc('.pizza-area').append(pizzaItem);
})

// it can both close or show the cart when header cart its clicked 
doc('.header-cart').addEventListener('click', handleClickCart);
function handleClickCart(){

    if(doc('.cart-area').classList.contains('hide')){

        openCart();

        // mobile only
        doc('body').classList.add('overflow-mobile');
    }else{

        closeCart();
    }
}


// closes the modal window
doc_all('.close-window, .close-window-mobile').forEach((element) => {element.addEventListener('click', closeWindow)});
function closeWindow(){

    // mobile only
    doc('body').classList.remove('overflow-mobile');

    doc('.pizza-window-area').style.opacity = '0';
    setTimeout(() => {
        doc('.pizza-window-area').style.display = 'none';
    }, 400)

}

// picks the size option
doc_all('.pizza-size').forEach((size) => {

    size.addEventListener('click', () => {

        doc('.pizza-size.selected').classList.remove('selected');
        size.classList.add('selected');   
    })
})


// controls the quantity of the pizzas they want
doc('.pizza-qt-minus').addEventListener('click', () => {

    
    if(pizzaQt > 1){

        pizzaQt--;
        doc('.pizza-qt').innerHTML = pizzaQt;
    }
})
doc('.pizza-qt-plus').addEventListener('click', () => {

    pizzaQt++;
    doc('.pizza-qt').innerHTML = pizzaQt;
})


// adds items to the cart and shows it 
doc('.add-cart').addEventListener('click', () => {

    if(doc('.pizza-size.selected').getAttribute('data-size') == 0){

        sizeSelected = 'PEQUENA';
    }else if(doc('.pizza-size.selected').getAttribute('data-size') == 1){

        sizeSelected = 'MÉDIA';
    }else{

        sizeSelected = 'GRANDE';
    }
    
    pizza = {

        
        qt: pizzaQt,
        name: pizzaJson[key].name,
        price: pizzaJson[key].price,
        size:sizeSelected,
        calculateTotal: function(){

            return this.qt * this.price
        }

    }
    
    pizzas.push(pizza);

    closeWindow();
    openCart();
    fillCart();
})


// fills the cart with information
function fillCart(){

    // sets off the default display for empty cart
    doc('.empty-cart').classList.add('displaynone');
    doc_all('.cart-area1, .cart-area2').forEach((element) => {element.classList.remove('displaynone')});
    
    
    let pizzaCart = doc('.models .order').cloneNode(true);
    pizzaCart.querySelector('.qt').innerHTML = `${pizza.qt}x`;
    pizzaCart.querySelector('.name').innerHTML = pizza.name;
    pizzaCart.querySelector('.size').innerHTML =  pizza.size;
    pizzaCart.querySelector('.pizza-qt-cart').innerHTML = pizza.qt;
    pizzaCart.querySelector('.price').innerHTML = `R$ ${(pizza.calculateTotal()).toFixed(2)}`;
    doc('.orders').append(pizzaCart);


    for (p in pizzas){

        pizzaCart.setAttribute('data-cart', p);
    }

    pizzaCart.querySelector('.pizza-qt-plus-cart').addEventListener('click', (element) => {

        
        let indexCart = element.target.closest('.order').getAttribute('data-cart');
        pizzas[indexCart].qt += 1;
        pizzaCart.querySelector('.pizza-qt-cart').innerHTML = pizzas[indexCart].qt;
        pizzaCart.querySelector('.qt').innerHTML = `${pizzas[indexCart].qt}x`;
        pizzaCart.querySelector('.price').innerHTML = `R$ ${(pizzas[indexCart].calculateTotal()).toFixed(2)}`;

        updateCart();


    })

    pizzaCart.querySelector('.pizza-qt-minus-cart').addEventListener('click', (element) => {

        let indexCart = element.target.closest('.order').getAttribute('data-cart');

        if(pizzas[indexCart].qt > 1){

            
            console.log(indexCart);

            console.log('cliquei');

            pizzas[indexCart].qt -= 1
            pizzaCart.querySelector('.pizza-qt-cart').innerHTML = pizzas[indexCart].qt;
            pizzaCart.querySelector('.qt').innerHTML = `${pizzas[indexCart].qt}x`;
            pizzaCart.querySelector('.price').innerHTML = `R$ ${(pizzas[indexCart].calculateTotal()).toFixed(2)}`;

            updateCart();


        }else{

           pizzaCart.style.display = 'none';
           pizzas.splice(indexCart,1)
           updateCart();        
        }


    })

    // the function responsible to update the cart information
    updateCart();


}




function updateCart(){

    subTotal = 0;
    items = 0;

    for(p in pizzas){

        subTotal += pizzas[p].calculateTotal();
        items += pizzas[p].qt;
    }

    doc('.subtotal').innerHTML = `R$ ${subTotal.toFixed(2)}`;
    
    if(subTotal >= 50){

        doc('.delivery').classList.add('free');
        doc('.delivery').innerHTML = 'Grátis';

        total = (subTotal).toFixed(2);
        doc('.total').innerHTML = `R$ ${total}`;


    }else if(pizzas.length == 0){

        total = 0;
        doc('.empty-cart').classList.remove('displaynone');
        doc_all('.cart-area1, .cart-area2').forEach((element) => {element.classList.add('displaynone')});
    }else{

        total = (subTotal + 7.5).toFixed(2)
        doc('.total').innerHTML = `R$ ${total}`;
        doc('.delivery').classList.remove('free');
        doc('.delivery').innerHTML = '+ R$ 7.50';


    }

    doc('.header-cart-cost').innerHTML = `R$ ${parseFloat(total).toFixed(2)}`;

    if(items == 1){
        doc('.header-cart-items').innerHTML = `${items} item`;

    }else{

        doc('.header-cart-items').innerHTML = `${items} itens`;
    }        

}


// closes the cart 
doc('.close-cart').addEventListener('click', closeCart);
function closeCart(){

    doc('.cart-area').classList.remove('show');
    doc('.cart-area').classList.add('hide');

    // mobile only
    doc('body').classList.remove('overflow-mobile');
}

// closes the cart
function openCart(){

    doc('.cart-area').classList.remove('hide');
    doc('.cart-area').classList.add('show');
}













