import userModel from "../models/usersModel.js";

export default class UserManager {
  getUsers = (params) => {
    return userModel.find(params).lean();
  };
  getUserBy = (params) => {
    return userModel.findOne(params).lean();
  };
  createUser = (user) => {
    return userModel.create(user);
  };
  updateUser = (id, user) => {
    return userModel.updateOne({ _id: id }, { $set: user });
  };
  deleteUser = (id) => {
    return userModel.deleteOne({ _id: id });
  };
}




// import { createHash, validatePassword } from "../../../utils.js";
// import userModel from "../models/usersModel.js";


// class UserManager {
//     constructor() {}
//     async getUserById(id) {
//         const searchedUser = await userModel.find({ _id: id });
//         if ((await searchedUser) != undefined) {
//             return await searchedUser;
//         } else {

//             return false;
//         }

//     }
//     async getUser(params) {
//         let { limit, page, query, sort } = params;
//         limit = limit ? limit : 10;
//         page = page ? page : 1;
//         let key = query ? query.split(":")[0] : "";
//         let value = query ? query.split(":")[1].replace(/(")/gm, "") : "";
//         let equery = [key, value];
//         let artquery = Object.fromEntries([equery]);
//         query = query ? artquery : {};
//         sort = sort ? (sort == "asc" ? 1 : -1) : 0;
//         let prodList = [];
//         let filter = {};

//         if (sort == 0) {
//             filter = { limit: limit, page: page };
//         } else {
//             filter = { limit: limit, page: page, sort: { price: sort } };
//         }

//         try {
//             prodList = await userModel.paginate(query, filter);
//             let status = prodList ? "success" : "error";
//             let hasPrevPage = prodList.hasPrevPage;
//             let hasNextPage = prodList.hasNextPage;
//             let prevPage = prodList.prevPage;
//             let nextPage = prodList.nextPage;
//             let prevLink =
//                 hasPrevPage != false
//                     ? "http://localhost:8080/users/?limit=" + limit + "&page=" + prevPage
//                     : null;
//             let nextLink =
//                 hasNextPage != false
//                     ? "http://localhost:8080/users/?limit=" + limit + "&page=" + nextPage
//                     : null;

//             prodList = {
//                 status: status,
//                 payLoad: prodList.docs,
//                 totalPages: prodList.totalPages,
//                 prevPage: prevPage,
//                 nextPage: nextPage,
//                 page: prodList.page,
//                 hasPrevPage: hasPrevPage,
//                 hasNextPage: hasNextPage,
//                 prevLink: prevLink,
//                 nextLink: nextLink,
//             };
//         } catch (error) {
//             return error;
//         }
//         return prodList;
//     }
//     async newUser(firstName, lastName, email, password, Admin) {

//         let newUser = {
//             firstName: firstName, last_name: lastName, email: email, password: createHash(password), Admin: Admin,
//         };

//         let values = [newUser.firstName, newUser.last_name, newUser.email, newUser.password, newUser.Admin,];
//         let emptyValue = values.includes("");
//         let undefValue = values.includes(undefined);


//         const userList = async () => {
//             let userTaxa = [];
//             try {
//                 userTaxa = await userModel.find().lean();
//             } catch (error) {
//                 return error;
//             }
//             return userTaxa;
//         };

//         let emails = userList().then((e) =>
//             e.map((Y) => Y.email)
//         );
//         let same = emails.then((e) =>
//             e.includes(newUser.email)
//         );
//         if (emptyValue || undefValue) { return "valuempty"; } else if (await same) { return "sameEmail"; } else {
//             await userModel.create(newUser); return true;
//         }
//     }
//     async login(user, password) {
//         const userL = (await userModel.findOne({ email: user }).lean()) || null;

//         if ((await userL) == null) {
//             return "invalidCredentials";
//         }

//         if (!validatePassword(userL, password)) {
//             return "invalidCredentials";
//         }

//         return userL;

//     }
//     async restore(user, password) {
//         const restoredUser =
//             (await userModel.findOne({ email: user }).lean()) || null;

//         if ((await restoredUser) == null) {
//             return "notRestored";
//         }
//         const newPass = createHash(password);

//         restoredUser.password = newPass;

//         await userModel.updateOne({ email: user }, restoredUser);

//         return restoredUser;

//     }

// };
// export default UserManager;


