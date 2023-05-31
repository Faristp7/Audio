import userModel from "../models/userModel.js";
 export default {
  getUsers: async () => {
    return await userModel.find();
  },
  doUserBlock: async (id) => {
    return await userModel.updateOne({_id : id}, {status : "Blocked"})
  },
  doUserUnBlock: async (id) => {
    return await userModel.updateOne({_id : id}, {status : "Verified"})
  }
};
