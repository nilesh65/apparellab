//import DesignPage from "@/pages/design";
import DesignPage from "@/pages/design";
import HomePage from "@/pages/home";
import ListingsPage from "@/pages/listings";
import SinglelistingPage from "@/pages/listings/single-listing";
import ThankYouPage from "@/pages/listings/thank-you";
import OrdersPage from "@/pages/orders";


export const AUTH_ROUTES = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
};

export const PROTECTED_ROUTES = {
  HOME: '/',
  DESIGN: '/design/:product_id',
  LISTINGS: '/listings',
  ORDERS: '/orders',
};

export const publicRoutesPaths = [
  {
    path: '/listing/:slug',
    element: SinglelistingPage,
  },
  {
    path: '/thank-you',
    element: ThankYouPage,
  }
]

export const protectedRoutesPaths = [
  {
    path: PROTECTED_ROUTES.HOME,
    element: HomePage,
  },
  {
    path: PROTECTED_ROUTES.DESIGN,
    element: DesignPage,
  },
  {
    path: PROTECTED_ROUTES.LISTINGS,
    element: ListingsPage,
  },
  {
    path: PROTECTED_ROUTES.ORDERS,
    element: OrdersPage,
  },
];
