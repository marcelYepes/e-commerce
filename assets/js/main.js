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
          <h3>${name} | <span><b>Stock</b>: ${quantity}</span></h3>
          <h5>
          $${price}
          ${
            quantity
              ? `<i class="bx bx-plus" id= "${id}"></i>`
              : "<span class='soldout'>Sold out</span>"
          }
          </h5>
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
      printTotal(st);
      handlePrintAmountProducts(st);
    }
  });
}

function handleCart(st) {
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

    localStorage.setItem("cart", JSON.stringify(st.cart));
    printInCart(st);
    printTotal(st);
    handlePrintAmountProducts(st);
  });
}

function printTotal(st) {
  const infoTotal = document.querySelector(".info_total");
  const infoAmount = document.querySelector(".info_amount");

  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in st.cart) {
    const { amount, price } = st.cart[product];
    totalProducts += price * amount;
    amountProducts += amount;
  }
  infoAmount.textContent = amountProducts + " units";
  infoTotal.textContent = "$" + totalProducts + ".00";
}

function handleTotal(st) {
  const btnBuy = document.querySelector(".btn_buy");

  btnBuy.addEventListener("click", function () {
    if (!Object.values(st.cart).length)
      return alert("Debes agregar algún producto para comprar😁");

    const response = confirm("Estas seguro de seguir con tu compra?");
    if (!response) return;

    const currentProducts = [];

    for (const product of st.products) {
      const productCart = st.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }

    st.products = currentProducts;
    st.cart = {};

    localStorage.setItem("products", JSON.stringify(st.products));
    localStorage.setItem("cart", JSON.stringify(st.cart));

    printTotal(st);
    printInCart(st);
    printProducts(st);
    handlePrintAmountProducts(st);
  });
}

function handlePrintAmountProducts(st) {
  const amountProducts = document.querySelector(".amountProducts");

  let amount = 0;

  for (const product in st.cart) {
    amount += st.cart[product].amount;
  }

  amountProducts.textContent = amount;
}

function filterProducts(products) {
  let html = "";

  products.forEach((product) => {
    html += `
          <div class="product ${product.category}">
              <div class="product__img">
                  <img src="${product.image}" alt="">
              </div>

              <div class="product__body">
                  <h3>${product.name}</h3>
              </div>
          </div>
      `;
  });

  document.querySelector(".products").innerHTML = html;
}

function handleFilter() {
  const filterSHTML = document.querySelectorAll(".filters .btn__filter");

  filterSHTML.forEach((filter) => {
    filter.addEventListener("click", (e) => {
      filterSHTML.forEach((filter) =>
        filter.classList.remove("btn__filter--active")
      );

      e.target.classList.add("btn__filter--active");
    });
  });

  mixitup(".products", {
    selectors: {
      target: ".product",
    },
    animation: {
      duration: 300,
    },
  });
}

function printFilter(products) {
  let obj = {};

  for (const product of products) {
    obj[product.category] = obj[product.category] + 1 || 1;
  }

  let html =
    '<button class="btn__filter btn__filter--active" data-filter="all">All</button>';

  for (const key in obj) {
    html += `<button class="btn__filter" data-filter=".${key}">${key} <br> <small>${obj[key]} items</small></button>`;
  }

  document.querySelector(".filters").innerHTML = html;
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
  handleCart(st);
  printTotal(st);
  handleTotal(st);
  handlePrintAmountProducts(st);
  filterProducts(products);
  handleFilter();
  printFilter(products);
}

main();

// const iconMenu = document.querySelector(".bxs-dashboard");
// const menu = document.querySelector(".menu");

// iconMenu.addEventListener("click", function () {
//   menu.classList.toggle("menu_show");
// });
