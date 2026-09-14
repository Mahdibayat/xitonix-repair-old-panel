const Actions = {
  OPEN_MENU: "OPEN_MENU",
  SET_ROUTE: "SET_ROUTE",
  UPDATE_USER: "UPDATE_USER",
};

const Constants = {
  baseUrl: "https://admin.xitonix.com/",
  // baseUrl: "http://127.0.0.1:8000/",
  ////local
  dateFormat: "YYYY-MM-DD",
  datetimeFormat: "YYYY-MM-DD HH:mm",
  defaultLat: 36.323054,
  defaultLng: 59.554985,
  defaultZoom: 16,
  expireToken: 7,
  imagePathBrand: "https://admin.xitonix.com/images/brand/",
  imagePathCategory: "https://admin.xitonix.com/uploads/",
  imagePathProduct: "https://admin.xitonix.com/uploads/",
  imagePathSocialNetwork: "https://admin.xitonix.com/uploads/",



  ////////////local
  // imagePathBrand: "http://127.0.0.1:9000/images/brand/",
  // imagePathCategory: "http://127.0.0.1:9000/uploads/",
  // imagePathProduct: "http://127.0.0.1:9000/uploads/",

  imagePathSetting: "https://admin.xitonix.com/images/setting/",
  imagePathSlider: "https://admin.xitonix.com/",
  jDateFormat: "jYYYY-jMM-jDD",
  jDateTimeFormat: "jYYYY-jMM-jDD HH:mm",
  pageSize: 25,
  mapZoom: 15,
  maxImageSize: 5242880,
  maxAge: 20,
  minAge: 0,
  siteUrl: "https://admin.xitonix.com/",
};

const Patterns = {
  username: /^[A-Za-z0-9]([A-Za-z0-9_]{1,48})[A-Za-z0-9_]$/,
  urlname: /^[A-Za-z]([A-Za-z0-9-]{1,48})[A-Za-z0-9-]$/,
  mobile: /^(09)[0-9]{9}$/,
  email: /^\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  name: /^[A-Za-z\u0600-\u06FF\u200c][A-Za-z\u0600-\u06FF\u200c ]{1,48}[A-Za-z\u0600-\u06FF\u200c]$/,
  rolename:
    /^[A-Za-z0-9\u0600-\u06FF\u200c][0-9A-Za-z\u0600-\u06FF\u200c ]{1,48}[A-Za-z0-9\u0600-\u06FF\u200c]$/,
  latlong: /^[0-9]{2,3}(\.)[0-9]{6}$/,
  tag: /^[a-zA-Z0-9_\u0600-\u06FF\u200c]{2,20}$/,
};

const Permissions = {
  dashboard_view: "dashboard_view",
  user_list: "user_list",
  user_store: "user_store",
  user_option: "user_option",
  voip_list: "voip_list",
  cart_list: "cart_list",
  cart_view: "cart_view",
  cart_option: "cart_option",
  special_list: "special_list",
  special_store: "special_store",
  special_option: "special_option",
  category_list: "category_list",
  category_store: "category_store",
  category_option: "category_option",
  product_list: "product_list",
  product_option: "product_option",
  postman_list: "postman_list",
  message_store: "message_store",
  message_list: "message_list",
  message_receipt: "message_receipt",
  setting_list: "setting_list",
  remittance_list:"remittance_list"
};

const Status = {};

const Types = {};

export { Actions, Constants, Patterns, Permissions, Status, Types };
