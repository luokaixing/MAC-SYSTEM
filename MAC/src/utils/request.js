import axios from "axios";
import { MessageBox, Message, Notification } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import settings from "../settings";

// create an axios instance
const service = axios.create({
  baseURL: settings.baseUrl, // url = base url + request url
  // baseURL: "http://47.105.94.195/tp5/public/index.php/", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 * 2 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["token"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log("error"); // for debug
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response;

    // if the custom code is not 20000, it is judged as an error.
    // if (!res.succ) {

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (
      res.data.state === "401" ||
      res.code === 4401 ||
      res.code === 4433 ||
      res.code === 50008 ||
      res.code === 50012 ||
      res.code === 50014
    ) {
      // to re-login
      store.dispatch("user/resetToken").then(() => {
        location.reload();

        // Notification({
        //   title: "登录已过期",
        //   message: "登录已过期，请重新登录！",
        //   type: "warning"
        // });
        return false;
      });
    }

    if (res.data.state === "error") {
      Notification({
        title: "Error",
        message: res.data.msg || "Error",
        type: "error"
      });
    }
    // return false;
    // } else {
    return res;
    // }
  },
  error => {
    console.log(error);

    Notification({
      title: "Error",
      message: error.message || "Error",
      type: "error"
    });
    return false;
  }
);

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//    */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data;

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || "Error",
//         type: "error",
//         duration: 5 * 1000
//       });

//       console.log(res);

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (
//         res.state === "401" ||
//         res.code === 50008 ||
//         res.code === 50012 ||
//         res.code === 50014
//       ) {
//         // to re-login
//         // MessageBox.confirm(
//         //   "You have been logged out, you can cancel to stay on this page, or log in again",
//         //   "Confirm logout",
//         //   {
//         //     confirmButtonText: "Re-Login",
//         //     cancelButtonText: "Cancel",
//         //     type: "warning"
//         //   }
//         // ).then(() => {
//         store.dispatch("user/resetToken").then(() => {
//           location.reload();
//         });
//         // });
//       }
//       return Promise.reject(new Error(res.message || "Error"));
//     } else {
//       return res;
//     }
//   },
//   error => {
//     console.log("err" + error); // for debug
//     Message({
//       message: error.message,
//       type: "error",
//       duration: 5 * 1000
//     });
//     return Promise.reject(error);
//   }
// );

const request = {
  post: function(option) {
    store.dispatch("app/trigglerLoading", true);

    return new Promise(async (resolve, reject) => {
      let res = await service({
        method: option.method || "post",
        data: option.data || {},
        url: option.url
      });
      store.dispatch("app/trigglerLoading", false);
      if (res.data.state !== "error") {
        resolve(res);
      } else {
        resolve(false);
      }
    });
  },
  get: function(option) {
    return new Promise(async (resolve, reject) => {
      let res = await service({
        method: option.method || "get",
        url: option.url,
        data: option.data || {},
        params: option.params || {}
      });

      resolve(res);
    });
  }
};

export default request;
