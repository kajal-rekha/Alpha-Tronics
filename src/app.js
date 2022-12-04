const productsWrapper = document.querySelector(".products-wrapper");
const addedProductsWrapper = document.querySelector(".added-products");
const cartModal = document.querySelector(".cart-modal");
const cartCloseBtn = document.querySelector(".cart-close");
const cartOpenBtn = document.querySelector(".cart-open-btn");
const itemCountHolder = document.querySelector(".item-count");

function getProducts() {
  fetch(`http://localhost:5000/products`)
    .then((res) => {
      if (!res.ok)
        throw new Error("Products not found,please try again later!");
      return res.json();
    })
    .then((data) => {
      renderProducts(data);
      loadingLocalData(data);
    })
    .catch((err) => renderError(err.message));
}

getProducts();

function currencyFormatter(price) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function renderProducts(products) {
  products.forEach((product) => {
    const html = `
    
    <div
            class="product overflow-hidden w-96 h-auto bg-white/75 backdrop-blur-lg rounded-xl shadow-lg shadow-gray-200"
          >
            <div
              class="product-img h-80 w-96 overflow-hidden flex justify-center items-center"
            >
              <img
                src= ${product.image}
                alt=${product.title}
                class="w-full block"
              />
            </div>
            <div class="product-text p-5 flex flex-col gap-1">
              <p
                class="text-sm uppercase font-bold tracking-widest text-sky-500"
              >
                ${product.category}
              </p>
              <h3 class="text-2xl font-semibold truncate">${product.title}</h3>
              <p class="text-2xl text-rose-500 font-semibold">
                ${currencyFormatter(product.price)}
                <span class="text-sm text-gray-600"> ${product.review}</span>
              </p>
              <button data-id = "${product.id}"
                class=" add-to-cart-btn bg-sky-500 self-start text-sky-50 p-2 px-5 rounded shadow-lg shadow-sky-200 font-semibold hover:bg-rose-500 hover:shadow-rose-200 duration-300 hover:rose-50"
              >
                Add to cart
              </button>
            </div>
          </div>
    
    `;
    productsWrapper.insertAdjacentHTML("beforeend", html);
  });

  // add to cart even
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  //console.log(addToCartBtns);
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const id = e.target.dataset.id;

      // checking
      const checkingLocalData = JSON.parse(localStorage.getItem(`item-${id}`));

      if (checkingLocalData) {
        return null;
      }

      if (!checkingLocalData) {
        //calling another fetch function
        getSingleProductData(id);
        showCountValue();
      }

      // cart open
      cartModal.classList.remove("hidden");
    });
  });
}

//show count value
let liveCount = 0;
const prevCount = +itemCountHolder.textContent;

function showCountValue() {
  liveCount += 1;
  const newCount = prevCount + liveCount;
  itemCountHolder.textContent = newCount;
}

function getSingleProductData(id) {
  fetch(`http://localhost:5000/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      renderSingleProduct(data);
      saveInLocalStorage(data);
    });
}

function saveInLocalStorage(product) {
  // localStorage.setItem("item", JSON.stringify(product));
  //get data from localstorage
  const gettingLocalData = JSON.parse(
    localStorage.getItem(`item-${product.id}`)
  );

  // if data exists , return null
  if (gettingLocalData) return null;

  // if not exixts , set
  if (!gettingLocalData) {
    localStorage.setItem(`item-${product.id}`, JSON.stringify(product));
  }
}

function loadingLocalData(products) {
  let localData = [];

  for (let i = 1; i <= products.length; i++) {
    const dataParsing = JSON.parse(localStorage.getItem(`item-${i}`));
    if (dataParsing) localData.push(dataParsing);
  }

  //render local data

  localData.forEach((product) => {
    renderSingleProduct(product);
  });

  //render item count
  const itemCount = localData.length;
  itemCountHolder.textContent = itemCount;
}

function renderSingleProduct(product) {
  const html = `
    <div
            class="added-product grid grid-cols-3 border-b pb-2 justify-center gap-2 overflow-hidden items-center"
          >
            <div
              class="img overflow-hidden w-20 rounded flex justify-center items-center"
            >
              <img
                src="${product.image}"
                alt="${product.title}"
                class="block w-full rounded"
              />
            </div>
            <div class="texts flex flex-col gap-2">
              <h4 class="font-sibold">${product.title}</h4>
              <div class="flex justify-between items-center gap-3">
                <p class="price font-bold text-rose-500">${currencyFormatter(
                  product.price
                )}</p>
                <p
                  class="font-semibold text-xl gap-3 overflow-hidden flex items-center bg-sky-100"
                >
                  <span
                    class="bg-sky-500 text-sky-50 px-2 cursor-pointer active:bg-gray-700"
                    >-</span
                  >
                  <span>1</span>
                  <span
                    class="bg-sky-500 text-sky-50 px-2 cursor-pointer active:bg-gray-700"
                    >+</span
                  >
                </p>
              </div>
            </div>

            <button class="remove-item hover:text-rose-500 justify-self-end">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
  
  `;

  addedProductsWrapper.insertAdjacentHTML("beforeend", html);
}
// error method
function renderError(errMsg) {
  productsWrapper.innerHTML = "";
  const html = `
  <p> ${errMsg}</p>
  `;
  productsWrapper.insertAdjacentHTML("afterbegin", html);
}

// cart close event
cartCloseBtn.addEventListener("click", function () {
  cartModal.classList.add("hidden");
});

// cart open from cart open btn
cartOpenBtn.addEventListener("click", function () {
  cartModal.classList.remove("hidden");
});
