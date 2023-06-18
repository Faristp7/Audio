import userHelper from "../databaseHelper/userHelper.js";

var totalVal = 0;
var productCount = 0;
export async function addToCart(req, res) {
  try {
    const user = await userHelper.findUser(req.session.user);
    const productId = user[0]?.cart.map((item) => item.productId);
    const quantity = user[0]?.cart.map((item) => item.quantity);
    const product = await userHelper.findProductById(productId);
    const productPrice = product.map((product) => product.productPrice);

    const count = product.length;
    const total = product.reduce(
      (sum, { productPrice }, index) => sum + productPrice * quantity[index],
      0
    );
    totalVal = total;
    productCount = count;
    res.render("user/cartPage", { product, count, total, quantity });
  } catch (error) {
    console.log(error);
  }
}

export async function addToCartPost(req, res) {
  try {
    const status = await userHelper.addToCart(req.body, req.session.user);
    status ? res.send("Added to Cart") : res.send("failed");
  } catch (error) {
    console.log(error);
  }
}

export async function removeProduct(req, res) {
  try {
    const status = await userHelper.removeProduct(req.session.user, req.body);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function checkout(req, res) {
  try {
    const [{ address }] = await userHelper.findAddress(req.session.user);
    res.render("user/checkout", { address, totalVal, productCount });
  } catch (error) {
    console.log(error);
  }
}

export async function quantityController(req, res) {
  try {
    const status = await userHelper.quantityController(
      req.session.user,
      req.body
    );
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function checkoutPost(req, res) {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
}
