import axios from "axios";
import { Cookies } from "react-cookie";
import { message } from "antd";
import { Constants } from "./settings";

const _cookies = new Cookies();

axios.defaults.headers.common["fcmToken"] = localStorage["fcmToken"]
  ? localStorage["fcmToken"]
  : "";
axios.defaults.baseURL = Constants.baseUrl;
axios.defaults.headers.common["Authorization"] = `Bearer ${
  _cookies.get("AccessToken") || ""
}`;

const handleError = (error = {}) => {
  console.log(error.errors)
  switch (error.message) {
    case "Unauthenticated.":
      _cookies.remove("AccessToken", {
        path: "/",
        expires: new Date(1900, 1, 1),
        domain: window.location.hostname,
      });
      window.location = "/account/login";
      break;
    default:
      if (Array.isArray(error.errors))
        error.errors.forEach((text) => message.error(text));
      else if (error.message) message.error(error.message);
      break;
  }
};

const upload = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, { headers: { "content-type": "multipart/form-data" } })
      .then((response) => {
        if (response && response.data) {
          if (response.data.status === 1) {
            resolve(response.data);
          } else {
            handleError(response.data);
            reject(response.data);
          }
        }
      })
      .catch((error) => {
        handleError(error && error.response && error.response.data);
        reject(error && error.response && error.response.data);
      });
  });
};

const get = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((error) => {
        handleError(error && error.response && error.response.data);
        reject(error && error.response && error.response.data);
      });
  });
};

const post = (url, params = {}, skip) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((response) => {
        // if (response && response.data) {
        if (response && response.data) {
          if (skip || response.data.status === 1 || response.data.status == "success" || response.status == "success") {
            resolve(response.data);
          } else {
            handleError(response.data);
            reject(response.data);
          }
        }
      })
      .catch((error) => {
        handleError(error && error.response && error.response.data);
        reject(error && error.response && error.response.data);
      });
  });
};

const put = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then((response) => {
        if (response && response.data) {
          if (response.data.status === 1 || response.data.status == "success") {
            resolve(response.data);
          } else {
            handleError(response.data);
            reject(response.data);
          }
        }
      })
      .catch((error) => {
        handleError(error && error.response && error.response.data);
        reject(error && error.response && error.response.data);
      });
  });
};

const del = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, params)
      .then((response) => {
        if (response && response.data) {
          if (response.data.status === 1 || response.data.status == "success" || response.data.status == true) {
            resolve(response.data);
          } else {
            handleError(response.data);
            reject(response.data);
          }
        }
      })
      .catch((error) => {
        handleError(error && error.response && error.response.data);
        reject(error && error.response && error.response.data);
      });
  });
};

export default {

  expertDevice: {
    check: (params = {}, id) => {
      return post(`api/consultant/device/check`, params);
    },

    getDeviceInfo: (params = {}, id) => {
      return post(`api/consultant/device/expert/info`, params);
    },

    delete: (id) => {
      return del(`package/panel/delete/${id}`);
    },
    list: (params = {}) => {
      let src = `package/panel/list?q=${params.q || ""}`;

      if (params.page) src = `${src}&page=${params.page}`;
      if (params.type) src = `${src}&type=${params.type}`;

      return get(src);
    },
    update: (params, id) => {
      return post(`package/panel/update/${id}`, params);
    },
  },
  user: {

    me: () => {
      return get("api/repair/user/info");
    },

    login: (params = {}) => {
      return post("api/repair/auth/login", params, true);
    },
    logout: (params = {}) => {
      return get("api/repair/user/logout");
    },
  },

  representative: {

    list: ( params={}) => {
      return post(`api/repair/representative/list`, params, true);
    },
    show: (id= {}) => {
      return get(`api/repair/representative/show/${id}`);
    },

  },

  device: {
    list: ( params={}) => {
      return post(`api/repair/device/list`, params, true);
    },
    show: (imei) => {
      return get(`api/repair/device/show/${imei}`);
    },
  },

  product: {
    list: ( params={}) => {
      return post(`api/repair/product/list`, params, true);
    },
    show: (id) => {
      return get(`api/repair/product/show/${id}`);
    },
  },
  reception: {
    store: ( id, params={}) => {
      return post(`api/repair/reception/store`, params, true);
    },
    update: ( id, params={}) => {
      return post(`api/repair/reception/update/${id}`, params, true);
    },
    list: ( params={}) => {
      return post(`api/repair/reception/list`, params, true);
    },
    show: (id) => {
      return get(`api/repair/reception/show/${id}`);
    },
    delete: (id) => {
      return del(`api/repair/reception/delete/${id}`);
    },
    statusUpdate: ( id, params={}) => {
      return post(`api/repair/reception/status-update/${id}`, params, true);
    },

    setSendType: ( id, params={}) => {
      return post(`api/repair/reception/set-send-type/${id}`, params, true);
    },
  },

  device_part: {
    store: ( id, params={}) => {
      return post(`api/repair/device_part/store`, params, true);
    },
    update: ( id, params={}) => {
      return post(`api/repair/device_part/update/${id}`, params, true);
    },
    list: ( params={}) => {
      return post(`api/repair/device_part/list`, params, true);
    },
   
    delete: (id) => {
      return del(`api/repair/device_part/delete/${id}`);
    },
    show: (id) => {
      return get(`api/repair/device_part/show/${id}`);
    },

    search: ( params={}) => {
      return post(`api/repair/device_part/search`, params, true);
    },
  },

  diagnosis: {
 
    update: ( id, params={}) => {
      return post(`api/repair/diagnosis/update/${id}`, params, true);
    },
  },

  city: {
 
    list: ( id, params={}) => {
      return get(`api/repair/city/list`, true);
    },
  },

  customer: {
    store: ( id, params={}) => {
      return post(`api/repair/customer/store`, params, true);
    },
    update: ( id, params={}) => {
      return post(`api/repair/customer/update/${id}`, params, true);
    },
    list: ( params={}) => {
      return post(`api/repair/customer/list`, params, true);
    },
   
    delete: (id) => {
      return del(`api/repair/customer/delete/${id}`);
    },
   
  },

  
  kit_items: {
    store: ( id, params={}) => {
      return post(`api/repair/kit_items/store`, params, true);
    },
    update: ( id, params={}) => {
      return post(`api/repair/kit_items/update/${id}`, params, true);
    },
    list: ( params={}) => {
      return post(`api/repair/kit_items/list`, params, true);
    },
   
    delete: (id) => {
      return del(`api/repair/kit_items/delete/${id}`);
    },
    show: (id) => {
      return get(`api/repair/kit_items/show/${id}`);
    },

    search: ( params={}) => {
      return post(`api/repair/kit_items/search`, params, true);
    },
  },

  slider: {
    add: (params = {}) => {
      return post(`api/repair/slider/store`, params);
    },
    delete: (id) => {
      return del(`api/repair/slider/delete/${id}`);
    },
    list: (params = {}) => {
      let src = `api/repair/slider/list?q=${params.q || ""}`;

      if (params.page) src = `${src}&page=${params.page}`;

      return get(src);
    },
  
  },
};
