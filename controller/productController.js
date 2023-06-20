import userHelper from "../databaseHelper/userHelper.js";
import instance from "../helper/razorpay.js";

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

async function findProductFromMongodb(req) {
  try {
    const user = await userHelper.findUser(req.session.user);
    const productId = user[0]?.cart.map((item) => item.productId);
    const quantity = user[0]?.cart.map((item) => item.quantity);
    const product = await userHelper.findProductById(productId);
    return product;
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
    const user = await userHelper.findUser(req.session.user);
    const productId = user[0]?.cart.map((item) => item.productId);
    const quantity = Object.values(user[0]?.cart);
    const product = await userHelper.findProductById(productId);
    const { address, paymentType } = req.body;

    if (paymentType == "Online") {
      const amount = totalVal * 100;
      const Option = {
        amount,
        currency: "INR",
      };
      instance.orders.create(Option, (err, orders) => {
        if (err) {
          console.log(err);
        } else {
          saveOrderDatabase(req, res);
          res.send(orders);
        }
      });
    } else if (paymentType == "COD") {
      const status = saveOrderDatabase(req, res);
      status ? res.send(true) : res.send(false);
    }

    async function saveOrderDatabase(req, res) {
      const status = await userHelper.checkoutSave(
        address,
        paymentType,
        req.session.user,
        totalVal,
        quantity
      );

      const cartStatus = status
        ? await userHelper.destroyCart(req.session.user)
        : undefined;
      const completeStatus = cartStatus
        ? await userHelper.quantityMinus(quantity)
        : undefined;
      return completeStatus;
      // completeStatus ? res.send(true) : res.send(false);`
    }
  } catch (error) {
    console.log(error);
  }
}
