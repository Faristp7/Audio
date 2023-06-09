import adminModel from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import helper from "../databaseHelper/adminHelper.js";
import { cloudinaryUploadImage } from "../helper/cloudinary.js";
import userHelper from "../databaseHelper/userHelper.js";
import Razorpay from "razorpay";
import ExeclJS from "exceljs";
import { Chart } from "chart.js";

let err;
export function adminLogin(req, res) {
  try {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/adminLogin", { err });
    }
    err = false;
  } catch (error) {
    console.log(error);
  }
}
export function pageNotFound(req, res) {
  try {
    res.render("include/404error");
  } catch (error) {
    console.log(error);
  }
}

export async function dashboard(req, res) {
  try {
    if (req.session.admin) {
      const overallData = await helper.overallData();

      const data = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };

      const monthlySales = await helper.monthlyRevenue();

      monthlySales.forEach((month) => {
        const monthIndex = month._id - 1;
        if (monthIndex >= 0 && monthIndex < data.values.length) {
          data.values[monthIndex] = month.totalSales;
        }
      });

      const categoriesSale = await helper.categoriesRevenue();
      const datas = {
        labels: categoriesSale.map((category) => category._id),
        values: categoriesSale.map((category) => category.totalRevenue),
      };

      res.render("admin/dashboard", {
        data: JSON.stringify(data),
        datas: JSON.stringify(datas),
        overallData,
      });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function user(req, res) {
  try {
    const users = await helper.getUsers();
    res.render("admin/user", { users });
  } catch (error) {
    console.log(error);
  }
}
export async function product(req, res) {
  try {
    const product = await helper.getProducts();
    res.render("admin/product", { product });
  } catch (error) {
    console.log(error);
  }
}
export function addProduct(req, res) {
  try {
    res.render("admin/addProduct");
  } catch (error) {
    console.log(error);
  }
}
export function logout(req, res) {
  try {
    req.session.admin = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
}

export async function doUserblock(req, res) {
  try {
    let status = await helper.doUserBlock(req.body.id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function doUserUnBlock(req, res) {
  try {
    let status = await helper.doUserUnBlock(req.body.id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

// verify the admin login

export async function postadminLogin(req, res) {
  let err;
  try {
    const admin = await adminModel.findOne({ email: req.body.email });
    if (admin) {
      if (admin.password == req.body.password) {
        req.session.admin = {
          email: req.body.email,
        };
        console.log(req.session.admin);
        res.redirect("/admin/dashboard");
      } else {
        err = true;
        res.render("admin/adminLogin", { err });
      }
    } else {
      res.redirect("/admin");
      err = true;
    }
  } catch (error) {
    console.log(error);
  }
}

//add product

export async function postAddProduct(req, res) {
  try {
    cloudinaryUploadImage(req.body.images)
      .then(async (urls) => {
        const status = await helper.addproduct(req.body, urls);
        if (status) res.send(true);
        else res.send(false);
        console.log("image url", urls);
      })
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    console.log(error);
  }
}

export function unListProduct(req, res) {
  const id = req.body;
  console.log(id);
  const productList = helper.doUnlist(id);
  productList ? res.send(true) : res.send(false);
}
export function listProduct(req, res) {
  const id = req.body;
  console.log(id);
  const productList = helper.doList(id);
  productList ? res.send(true) : res.send(false);
}

export async function editProduct(req, res) {
  try {
    const productInfo = await userHelper.getProduct(req.params.id);
    res.render("admin/editProduct", { productInfo });
  } catch (error) {
    console.log(error);
  }
}

export async function postEditProduct(req, res) {
  // cloudinaryUploadImage(req.body.images)
  // const status = await helper.addproduct(req.body,urls);
  //     if (status) res.send(true);
  //     else res.send(false);
  //     console.log(urls);
  const id = req.body.id;
  const updated = await helper.updateProduct(req.body, id);
  return updated ? res.send(true) : res.send(false);
}

export async function getOrders(req, res) {
  try {
    const orders = await helper.getOrdersAdmin();
    res.render("admin/orders", { orders });
  } catch (error) {
    console.log(error);
  }
}

export async function orderControl(req, res) {
  try {
    const { id, orderStatus } = req.body;
    console.log(orderStatus);
    const status = await helper.orderControl(id, orderStatus);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function couponController(req, res) {
  try {
    const coupons = await helper.getCoupon();
    res.render("admin/coupon", { coupons });
  } catch (error) {
    console.log(error);
  }
}

export async function addCoupon(req, res) {
  try {
    res.render("admin/addCoupon");
  } catch (error) {
    console.log(error);
  }
}

export async function addCouponPost(req, res) {
  try {
    const status = await helper.addCoupon(req.body);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function removeCoupon(req, res) {
  try {
    const status = await helper.removerCoupon(req.body);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function approveRequest(req, res) {
  try {
    let finalAmount;
    const status = await helper.approveRequest(req.body, req.session.user);
    const productPriceCalculate = await userHelper.findOrderId(req.body);
    if (status) {
      finalAmount =
        productPriceCalculate[0].total - productPriceCalculate[0].couponAmount;
    }
    if (productPriceCalculate[0].paymentType == "COD") {
      const success = await helper.updateWallet(finalAmount, req.session.user);
      success ? res.send("refundDone") : undefined;
    } else {
      const client = new Razorpay({
        key_id: process.env.razor_pay_key_id,
        key_secret: process.env.razor_pay_secrect_key,
      });

      const paymentId = productPriceCalculate[0].paymentId;
      const receiptNumber = Math.random().toString(36).substring(7);
      const amount = finalAmount * 100;
      const refund = await client.payments.refund(paymentId, {
        amount: amount,
        speed: "optimum",
        notes: {
          reason: "customer requested a refund",
        },
        receipt: receiptNumber,
      });

      refund ? res.send("refundDone") : undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function banner(req, res) {
  try {
    const banner = await helper.bannerDatas();
    res.render("admin/banner", { banner });
  } catch (error) {
    console.log(error);
  }
}

export async function addBanner(req, res) {
  try {
    res.render("admin/addBanner");
  } catch (error) {
    console.log(error);
  }
}

export async function postAddbanner(req, res) {
  try {
    const image = [req.body.Image];
    cloudinaryUploadImage(image)
      .then(async (urls) => {
        const status = await helper.addBanner(req.body, urls);
        if (status) res.send(true);
        else res.send(false);
        console.log("image url", urls);
      })
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBanner(req, res) {
  try {
    const { id } = req.body;
    const status = await helper.bannerDelete(id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

var pdfVal = 0;
var salesExecl;
export async function salesReport(req, res) {
  try {
    const { selectedValue } = req.body;
    const currentDate = new Date();
    let startDate, endDate;

    if (selectedValue === "week") {
      const currentDay = currentDate.getDay();
      startDate = new Date(
        currentDate.setDate(currentDate.getDate() - currentDay)
      );
      endDate = new Date(currentDate.setDate(currentDate.getDate() + 6));
    } else if (selectedValue === "month") {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (selectedValue === "year") {
      const year = currentDate.getFullYear();
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }

    const filtredOrder = await helper.filteredOrders(startDate, endDate);

    const salesReport = filtredOrder.map((order) => ({
      productName: order.product.productName,
      price: order.total,
    }));

    const totalSales = salesReport.reduce((sum, order) => sum + order.price, 0);
    if (salesReport.length !== 0) {
      res.send("gotit");
    }

    

    const { downloadFormat } = req.body;

    const workbook = new ExeclJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    const salesReports = filtredOrder.map((order) => ({
      productName: order.product.productName,
      price: order.total,
      qunatity: order.quantity,
      paymentType : order.paymentType,
      category : order.product.category,
      couponApplied : order.couponAmount
    }));
    const a = ["apple","ball"]
    sheet.addRows(a);
    await workbook.xlsx.writeFile("sales-report.xlsx");

    if (totalSales !== 0) {
      pdfVal = totalSales;
      salesExecl = salesReports
    }

    if (downloadFormat === "execl") {
      res.json({
        salesReports: salesExecl,
        downloadURL: `/api/sales-report/download?downloadFormat=${downloadFormat}`,
      });
    } else {
      console.log("nop");
    }
  } catch (error) {
    console.log(error);
  }
}
