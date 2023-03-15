async function getApi() {
  const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
  const res = await data.json();

  localStorage.setItem("products", JSON.stringify(res));

  return res;
}

function deleteProduct(st, idProduct) {
  const res = confirm("Seguro que quieres eliminar esto?");
  if (!res) return;
  delete st.cart[idProduct];
}

function productFind(st, idProduct) {
  return st.products.find(function (product) {
    return product.id === idProduct;
  });
}

function addProduct(st, productFound, idProduct) {
  if (productFound.quantity === st.cart[productFound.id].amount)
    return alert("Producto agotado");

  st.cart[idProduct].amount++;
}

function printProducts(st) {
  const productsHTML = document.querySelector(".products");

  let html = "";

  st.products.forEach(({ id, image, name, price, quantity }) => {
    html += `
        <div class="product">
          <div class="product_img">
            <img src="${image}" alt="" />
          </div>
          <div class="product_body">
          <p><b>$${price}.00</b><i class="bx bx-plus" id= ${id}></i> <span>Stock: ${quantity}</span></p><h3>${name}</h3>
            
          </div>
        </div>
    `;
  });

  productsHTML.innerHTML = html;
}

function printInCart(st) {
  const cartProductsHTML = document.querySelector(".cart_products");

  let html = "";

  for (const key in st.cart) {
    const { image, name, quantity, price, id, amount } = st.cart[key];

    html += `
        <div class="itemProduct">
            <div class="itemProduct_img">
              <img src="${image}" alt="" />
            </div>
            <div class="itemProduct_body">
              <h3>${name} </h3> 
              <p><span>stock: ${quantity}</span><h4>|$${price}.00</h4></p>

              <div class="itemProduct_op">
                    <i class='bx bx-minus' id= "${id}"></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus' id= "${id}"></i>
                    <i class='bx bx-trash-alt' id= "${id}" ></i>
              </div>
            </div>
        </div>
      `;
  }

  cartProductsHTML.innerHTML = html;
}

function showCart() {
  const iconCartHTML = document.querySelector(".bx-shopping-bag");
  const cartHTML = document.querySelector(".cart");

  iconCartHTML.addEventListener("click", function () {
    cartHTML.classList.toggle("cart_show");
  });
}

function addCartFromProducts(st) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const productId = Number(e.target.id);

      const productFound = productFind(st, productId);

      if (st.cart[productFound.id]) {
        addProduct(st, productFound, productId);
      } else {
        const newProduct = structuredClone(productFound);
        newProduct.amount = 1;
        st.cart[productFound.id] = newProduct;
      }

      localStorage.setItem("cart", JSON.stringify(st.cart));
      printInCart(st);
    }
  });
}

function handelCart(st) {
  const cartProducts = document.querySelector(".cart_products");

  cartProducts.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-minus")) {
      const idProduct = Number(e.target.id);
      if (st.cart[idProduct].amount === 1) {
        deleteProduct(st, idProduct);
      } else {
        st.cart[idProduct].amount--;
      }
    }

    if (e.target.classList.contains("bx-plus")) {
      const idProduct = Number(e.target.id);
      const productFound = productFind(st, idProduct);
      addProduct(st, productFound, idProduct);
    }

    if (e.target.classList.contains("bx-trash-alt")) {
      const idProduct = Number(e.target.id);
      deleteProduct(st, idProduct);
    }

    localStorage.setItem("cart", JSON.stringify(st));
    printInCart(st);
  });
}

function printTotal(st) {
  const infoTotal = document.querySelector("info_total");
  const infoAmount = document.querySelector("info_amount");

  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in st.cart) {
    const { amount, price } = st.cart[product];
    totalProducts += price * amount;
    amountProducts += amount;
  }

  infoTotal.textContent = totalProducts + " units";
  infoAmount.textContent = "$" + amountProducts + ".00";
}

async function main() {
  const st = {
    products: JSON.parse(localStorage.getItem("products")) || (await getApi()),

    cart: JSON.parse(localStorage.getItem("cart")) || {},
  };

  printProducts(st);
  showCart();
  addCartFromProducts(st);
  printInCart(st);
  handelCart(st);
  printTotal(st);
}

main();

// const iconMenu = document.querySelector(".bxs-dashboard");
// const menu = document.querySelector(".menu");

// iconMenu.addEventListener("click", function () {
//   menu.classList.toggle("menu_show");
// });
