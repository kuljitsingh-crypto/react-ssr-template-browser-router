// Add routes the you want to in your website keep the name of routes same as Component file name in Pages
// For example if your component file name in pages as like pages/ResourcePage/ResourcePage
// then route name has to be ResourcePage in route details

export const routeDetails = [
  { path: "/", name: "Homepage", isAuth: true },
  { path: "/products", name: "ProductsPage", isAuth: true },
  { path: "/products/:id", name: "ProductPage", isAuth: true },
  { path: "/login", name: "LoginPage" },
  { path: "/signup", name: "SignupPage" },
  { path: "*", name: "NotFoundPage", notFound: true },
] as const;

type RouteNames = (typeof routeDetails)[number]["name"];

export const routesName = routeDetails.reduce((acc, value) => {
  acc[value.name] = value.name;
  return acc;
}, {} as Record<RouteNames, RouteNames>);

type routesKey = keyof typeof routesName;
export type RoutesNameType = (typeof routesName)[routesKey];
