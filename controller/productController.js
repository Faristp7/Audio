import userHelper from "../databaseHelper/userHelper.js";
import instance from "../helper/razorpay.js";
import Razorpay from "razorpay";

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
    res.render("user/cartPage", {
      product,
      count,
      total,
      quantity,
    });
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
    const check = await userHelper.checkAlreadyExist(
      req.body,
      req.session.user
    );
    if (check) {
      res.send("already");
    } else {
      const status = await userHelper.addToCart(req.body, req.session.user);
      status ? res.send("Added to Cart") : res.send("failed");
    }
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
    const [{ address, wallet }] = await userHelper.findAddress(
      req.session.user
    );
    res.render("user/checkout", { address, totalVal, productCount, wallet });
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

export async function applyCoupon(req, res) {
  try {
    const productPrice = req.body.productPrice;
    const currentDate = new Date();
    const status = await userHelper.CheckCoupon(req.body);
    if (status == "") {
      res.send("notExist");
    } else {
      if (status[0].minimumPurchase > productPrice) {
        res.send({
          message: "amountReached",
          minimumPurchase: status[0].minimumPurchase,
        });
      } else if (status[0].validity <= currentDate) {
        res.send("dateValidity");
      } else {
        totalVal -= status[0].amount;
        res.send({ amount: status[0].amount });
      }
    }
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
    const {
      address,
      paymentType,
      paymentId,
      applycouponCode,
      walletAmount,
      checkWalletUse,
    } = req.body;
    const orderAddress = await userHelper.getUserAddres(
      req.session.user,
      address
    );

    if (paymentId) {
      saveOrderDatabase(req, res);
    }

    if (paymentType == "Online") {
      if (walletAmount > 0) {
        totalVal -= walletAmount;
      }
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
      const productIds = quantity.map((item) => item.productId);
      const products = await userHelper.getProductArray(productIds);
      
      const verifyPrice = totalVal;
      if (totalVal !== verifyPrice) {
        console.log("something went Wrong");
      } else {
        var status = await userHelper.checkoutSave(
          orderAddress,
          paymentType ,
          req.session.user,
          totalVal,
          quantity,
          paymentId,
          applycouponCode
        );
      }
      let amount = totalVal * 100;
      try {
        if (paymentId) {
          const client = new Razorpay({
            key_id: process.env.razor_pay_key_id,
            key_secret: process.env.razor_pay_secrect_key,
          });
          await client.payments.capture(paymentId, amount);
        }
      } catch (error) {
        console.log(error);
      }
      if (paymentType == "COD") {
        manger();
      } else {
        if (paymentId) {
          manger();
        }
      }

      async function manger() {
        const cartStatus = status
          ? await userHelper.destroyCart(req.session.user)
          : undefined;
        const completeStatus = cartStatus
          ? await userHelper.quantityMinus(quantity)
          : undefined;

        if (checkWalletUse) {
          const completeStatus = await userHelper.walletMinus(
            req.session.user,
            walletAmount
          );
          return completeStatus;
        } else {
          return completeStatus;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function requestReturn(req, res) {
  try {
    const status = await userHelper.requestRefund(req.body.id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}
