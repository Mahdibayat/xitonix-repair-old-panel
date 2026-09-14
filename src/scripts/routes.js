import React from "react";
import {
  AppstoreOutlined,
  DollarOutlined,
  LaptopOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
    FieldTimeOutlined,
    FileOutlined
} from "@ant-design/icons";

import { Permissions } from "../scripts/settings";

// account
import AccountLayout from "../layouts/Account";
import LoginPage from "../pages/Login";

// app
import BasicLayout from "../layouts/Basic";

import DashboardPage from "../pages/Dashboard";


import CheckDevice from "../pages/CheckDevice";





// errors
import NotFoundPage from "../pages/NotFound";
import UnAuthorizedPage from "../pages/UnAuthorized";
import ReceptionManagement from "../pages/ReceptionManagement";
import Resources from "./resources";
import DiagnosisRepairManagement from "../pages/DiagnosisRepairManagement";
import DevicePartManagement from "../pages/DevicePartManagement";
import CheckoutPageManagement from "../pages/CheckoutPageManagement";
import WaitConfirmManagement from "../pages/WaitConfirmManagement";
import ConfirmManagement from "../pages/ConfirmManagement";
import SendManagement from "../pages/SendManagement";
import CustomerManagement from "../pages/CustomerManagement";
import KitItemManagement from "../pages/KitItemManagement";
import SliderManagement from "../pages/SliderManagement";

export default [
  // errors
  {
    path: "/403",
    name: "unauthorized",
    component: UnAuthorizedPage,
  },
  {
    path: "/404",
    name: "notfound",
    component: NotFoundPage,
  },
  // account
  {
    path: "/account",
    name: "account",
    component: AccountLayout,
    routes: [
      {
        path: "/account",
        redirect: "/account/login",
      },
      {
        path: "/account/logout",
        redirect: "/account/login",
      },
      {
        path: "/account/login",
        name: "login",
        title: Resources.login,
        component: LoginPage,
      },
    ],
  },
  // app
  {
    path: "/",
    name: "app",
    component: BasicLayout,
    routes: [
      {
        name: "dashboardRedirect",
        path: "/",
        redirect: "/dashboard",
        hidden: true,
      },
      {
        name: "dashboard",
        icon: <LaptopOutlined />,
        path: "/dashboard",
        title: Resources.dashboard,
        component: DashboardPage,
      },
      // {
      //   name: "checkDevice",
      //   icon: <UserOutlined />,
      //   path: "/checkDevice",
      //   title: Resources.checkDevice,
      //   component: CheckDevice,
      // },
      {
        name: "reception",
        icon: <LaptopOutlined />,
        path: "/reception",
        title: Resources.reception,
        component: ReceptionManagement,
        hidden: true,
      },
      {
        name: "repair_diagnostic",
        icon: <LaptopOutlined />,
        path: "/repair_diagnostic",
        // title: Resources.reception,
        component: DiagnosisRepairManagement,
        hidden: true,
      },
      {
        name: "checkou_page",
        icon: <LaptopOutlined />,
        path: "/checkout_page",
        // title: Resources.checkou_page,
        component: CheckoutPageManagement,
        hidden: true,
      },
      {
        name: "wait_confirm",
        icon: <LaptopOutlined />,
        path: "/wait_confirm",
        // title: Resources.checkou_page,
        component: WaitConfirmManagement,
        hidden: true,
      },
      {
        name: "be_confirm",
        icon: <LaptopOutlined />,
        path: "/be_confirm",
        // title: Resources.checkou_page,
        component: ConfirmManagement,
        hidden: true,
      },
      {
        name: "be_send",
        icon: <LaptopOutlined />,
        path: "/be_send",
        // title: Resources.checkou_page,
        component: SendManagement,
        hidden: true,
      },
      {
        name: "parts",
        icon: <LaptopOutlined />,
        path: "/parts",
        title: Resources.parts,
        component: DevicePartManagement,
      },
      {
        name: "customers",
        icon: <LaptopOutlined />,
        path: "/customers",
        title: Resources.customers,
        component: CustomerManagement,
      },
      {
        name: "kit_items",
        icon: <LaptopOutlined />,
        path: "/kit_items",
        title: Resources.kit_items,
        component: KitItemManagement,
      },
      {
        name: "slider",
        icon: <FileOutlined />,
        path: "/slider",
        title: Resources.slider,
        component: SliderManagement,
      },
    ],
  },
];
