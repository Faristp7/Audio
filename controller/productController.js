import userHelper from "../databaseHelper/userHelper.js";

export async function addToCart(req, res) {
  try {
    const user = await userHelper.findUser(req.session.user)
    res.render("user/cartPage");
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