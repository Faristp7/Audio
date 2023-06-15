import userHelper from "../databaseHelper/userHelper.js";

export async function addToCart(req, res) {
  try {
    const user = await userHelper.findUser(req.session.user);
    const productId = user[0]?.cart.map((item) => item.productId);
    const quantity = user[0]?.cart.map((item) => item.quantity);
    const product = await userHelper.findProductById(productId);
    
    const count = product.length;
    const total = product.reduce(
      (sum, product) => sum + product.productPrice,
      0
    );
    res.render("user/cartPage", { product, count, total ,quantity});
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
    res.render("user/checkout", { address });
  } catch (error) {
    console.log(error);
  }
}

export async function quantityController(req, res) {
  try {
    const status =  await userHelper.quantityController(req.session.user, req.body);
    status ? res.send(true) : res.send(false)
  } catch (error) {
    console.log(error);
  }
}
