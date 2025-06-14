# React SSR Template 
This project is built after ejecting the default  react app (generated using Create-React-App) and modifying the necessary part to create ssr functionality. Loadable components package is utilized to efficiently split and manage components, especially those designated for server-side rendering. 

In this template, I leverage React-Router's new CreateBrowserRouter to establish routes, providing the flexibility to tap into new data APIs if required.

## Folder Structure 
``` bash
├── public
│   ├── 500.html
│   ├── index.html
│   ├── robots.txt
│   └── static
│       ├── icons
│       │   ├── browserconfig.xml
│       │   ├── favicon.ico
│       │   ├── logo150.png
│       │   ├── logo16.png
│       │   ├── logo180.png
│       │   ├── logo192.png
│       │   ├── logo32.png
│       │   └── logo512.png
│       ├── images
│       │   ├── facebook.png
│       │   └── twitter.png
│       ├── manifest.json
│       └── svg
│           └── icon.svg
├── server
│   ├── csp-util
│   │   └── csp.js
│   ├── index.js
│   └── util
│       ├── helperFunctions.js
│       └── ssrUtills.js
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   ├── facebook.png
│   │   └── twitter.png
│   ├── components
│   │   ├── BrandIcon
│   │   │   └── BrandIcon.tsx
│   │   ├── Divider
│   │   │   └── Divider.tsx
│   │   ├── ErrorText
│   │   │   └── ErrorText.tsx
│   │   ├── FormattedMessage
│   │   │   └── FormattedMsg.tsx
│   │   ├── helperComponents
│   │   │   ├── AuthenticatedPage.tsx
│   │   │   ├── customConnect.tsx
│   │   │   ├── ReactHelmet.tsx
│   │   │   ├── windowDimension.tsx
│   │   │   └── withRouter.tsx
│   │   ├── IconSpinner
│   │   │   ├── IconSpinner.module.css
│   │   │   └── IconSpinner.tsx
│   │   ├── index.ts
│   │   ├── LeftChild
│   │   │   ├── LeftChild.module.css
│   │   │   └── LeftChild.tsx
│   │   ├── Menu
│   │   │   ├── index.tsx
│   │   │   ├── Menu.module.css
│   │   │   ├── Menu.tsx
│   │   │   ├── MenuContent.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   └── MenuLabel.tsx
│   │   ├── NamedLink
│   │   │   ├── NamedLink.module.css
│   │   │   └── NamedLink.tsx
│   │   ├── NamedRedirect
│   │   │   ├── NamedRedirect.module.css
│   │   │   └── NamedRedirect.tsx
│   │   ├── Page
│   │   │   ├── Page.tsx
│   │   │   └── pageHooks.ts
│   │   ├── RIghtChild
│   │   │   ├── RightChild.module.css
│   │   │   └── RightChild.tsx
│   │   ├── Sidebar
│   │   │   └── Sidebar.tsx
│   │   ├── Topbar
│   │   │   ├── ProfileMenu.tsx
│   │   │   ├── ThemeMenu.tsx
│   │   │   ├── Topbar.module.css
│   │   │   └── Topbar.tsx
│   │   ├── UI
│   │   │   ├── Button
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.tsx
│   │   │   └── FieldTextInput
│   │   │       ├── FieldTextInput.module.css
│   │   │       └── FieldTextInput.tsx
│   │   └── UserAvatar
│   │       ├── index.module.css
│   │       └── UserAvatar.tsx
│   ├── context
│   │   ├── index.ts
│   │   └── useConfigurationContext.ts
│   ├── custom-config.ts
│   ├── Form
│   │   ├── ForgotPasswordForm
│   │   │   ├── ForgotPasswordForm.module.css
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── index.ts
│   │   ├── LoginForm
│   │   │   ├── LoginForm.module.css
│   │   │   └── LoginForm.tsx
│   │   └── SignupForm
│   │       ├── SignupForm.module.css
│   │       └── SignupForm.tsx
│   ├── globalReducers
│   │   ├── auth.slice.ts
│   │   ├── index.ts
│   │   ├── ui.slice.ts
│   │   └── user.slice.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useCustomRouter.ts
│   │   ├── useFetchStatusHandler.ts
│   │   ├── useNamedRedirect.ts
│   │   ├── useReduxHooks.ts
│   │   └── useUnauthenticatedRedirect.tsx
│   ├── index.css
│   ├── index.js
│   ├── pages
│   │   ├── About
│   │   │   └── About.tsx
│   │   ├── ForgotPassword
│   │   │   ├── ForgotPassword.module.css
│   │   │   └── ForgotPassword.tsx
│   │   ├── Homepage
│   │   │   ├── Homepage.tsx
│   │   │   └── homePageSlice.ts
│   │   ├── LoginPage
│   │   │   ├── LoginPage.module.css
│   │   │   └── LoginPage.tsx
│   │   ├── NotFoundPage
│   │   │   ├── NotFoundPage.module.css
│   │   │   └── NotFoundPage.tsx
│   │   ├── pageDataLoadingAPI.ts
│   │   ├── pageGlobalType.ts
│   │   ├── pageReducers.ts
│   │   ├── ProductPage
│   │   │   ├── ProductPage.module.css
│   │   │   ├── ProductPage.tsx
│   │   │   └── ProductPageSlice.ts
│   │   ├── ProductsPage
│   │   │   ├── ProductsPage.module.css
│   │   │   ├── ProductsPage.tsx
│   │   │   └── ProductsPageSlice.ts
│   │   └── SignupPage
│   │       ├── SignupPage.module.css
│   │       └── SignupPage.tsx
│   ├── react-app-env.d.ts
│   ├── reducers.ts
│   ├── routeNames.ts
│   ├── store.ts
│   ├── storeHelperFunction.ts
│   ├── translations
│   │   ├── countryCodes.js
│   │   ├── de.json
│   │   ├── en.json
│   │   ├── es.json
│   │   └── fr.json
│   └── util
│       ├── api.ts
│       ├── APITypes.ts
│       ├── browserHelperFunction.ts
│       ├── functionHelper.ts
│       ├── localeHelper.ts
│       ├── objectHelper.ts
│       ├── polyfills.js
│       ├── routes.js
│       ├── routesHelperFunction.ts
│       └── themeHelper.ts
└── tsconfig.json
```

## Enviroment Value
Enviroment value used in,

+ REACT_APP_API_SERVER_PORT=3500
+ REACT_APP_CANONICAL_ROOT_URL=http://localhost:3000
+ REACT_APP_CSP=report

This is the basic .env file value to run this project.


## 🧭 Adding a New Route
To add a new route to the application, follow these steps:

1. ✅ Create the Component File
Create a folder and file inside the pages directory with the same name as the route.

    Example: To create a ContactPage: `pages/ContactPage/ContactPage.tsx`

2. 🛣️ Update routeDetails
Add the route entry in the routeDetails array (found in routeNames.ts or similar file):
        `{ path: "/contact", name: "ContactPage", isAuth: true }`
        
    Note: The name must exactly match the folder/file name you created in the pages directory.
3. 🔐 (Optional) Add Auth or Not Found Flags

    To require authentication, add isAuth: true

    To mark a route as the Not Found fallback, add notFound: true

    `{ path: "*", name: "NotFoundPage", notFound: true }`

4. 🔁 (Optional) Add Data Loader Logic

    If your page needs to load data on navigation:

    Add an entry to `getPageDataLoadingAPI()` in `pageDataLoadingAPI.ts`

    Follow examples like `ProductsPageSlice.ts` or `ProductPageSlice.ts`

    Make sure to check for SSR-loaded data to prevent double-fetching

## 🧪 Example
Suppose you’re adding a BlogPage:

1. Create the component:

    `pages/BlogPage/BlogPage.tsx`

2. Add the route:

    `{ path: "/blog", name: "BlogPage", isAuth: false }`

3. (Optional) Add loader logic in `pageDataLoadingAPI.ts`:

         BlogPage: (getState, dispatch, params, searchObject) => { 

            // your loader code here
        }


That’s it! The system will:

    Load the component dynamically

    Wrap it with authentication if needed

    Attach data loaders automatically


## 🔍 SEO Optimization with `<Page />` and `<ReactHelmet />`

### ✅ Why It Matters

The `<Page />` component, together with `<ReactHelmet />`, handles **automatic SEO metadata injection** to ensure:

- 📈 **Improved discoverability** on search engines like Google
- 🧩 **Rich previews** on social media platforms (Facebook, Twitter)
- 📷 **Correct image rendering** for link sharing (OG & Twitter Cards)
- 🏷️ **Structured data** (via JSON-LD) for better semantic understanding
- 🌐 **Canonical URLs** to avoid duplicate content issues
- 🧠 **Localized metadata** using `react-intl` for multi-language support

### ⚙️ How It Works

- Every page is wrapped inside the `Page` component.
- The `Page` component injects `<ReactHelmet />`, which builds metadata dynamically using:
  - Config from `config.seo`
  - Page-specific props: `metaTitle`, `description`, `published`, `updated`, etc.
- The resulting tags are added to the `<head>` via `react-helmet-async`.

### 🧠 Meta Tags Included

| Type            | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `<meta>`        | Description, Author, Keywords, Referrer                                     |
| `<meta property="og:*">` | Facebook Open Graph (title, image, type, url, etc.)                  |
| `<meta name="twitter:*">` | Twitter Card data (summary, image, creator, etc.)                   |
| `<link rel="canonical">` | Canonical URL for SEO                                              |
| `<script type="application/ld+json">` | JSON-LD Schema for WebPage, Organization, and Website |

### 📝 Example Schema Generated

```json
{
  "@context": "http://schema.org",
  "@type": "WebPage",
  "description": "Your page description",
  "name": "Your Meta Title",
  "image": ["https://yourdomain.com/static/facebook.png"]
}
```

## 🚨 Important
1. Always use <Page> as the root wrapper for route components to ensure SEO metadata is rendered.

2. Provide meaningful metaTitle and description props for each page.

3. Keep config.seo updated with site-wide defaults (author, images, social links, etc.).

## 🧠 SEO Considerations: SSR and Authentication

This project uses **Server-Side Rendering (SSR)** along with optional **authenticated user context**, which directly influences SEO and crawlability.

### ✅ Benefits of SSR for SEO

* **Pre-rendered HTML**: Pages are rendered on the server and sent to the client as full HTML. This ensures that **search engine bots** (Googlebot, Bingbot, etc.) can read and index content more easily compared to purely client-rendered pages.
* **Improved Time to First Byte (TTFB)**: SSR improves perceived performance by reducing the time to load the first meaningful content, which is a **positive signal for search rankings**.
* **Helmet Integration**: The use of `react-helmet` ensures that dynamic meta tags (`<title>`, `<meta name="description">`, OpenGraph tags, etc.) are included in the HTML response — making pages better optimized for SEO and social media previews.

---

### ⚠️ Authentication and Its SEO Impact

If pages require user authentication:

* 🔒 **Search Engine Bots Cannot Log In**
  Authenticated pages are typically **not indexed**, which is expected and secure behavior for user-specific content like dashboards, account settings, etc.

* ❌ **Do Not Put Public Content Behind Auth Walls**
  If you require users to log in before viewing SEO-critical content (like blogs, product pages, etc.), **search engines won’t be able to crawl or index those pages**.

#### 👌 Best Practices

* Keep SEO-critical pages **publicly accessible**.
* Use authenticated content only for **user-specific** or **sensitive** views.
* Provide a **read-only version** of any page you want indexed but currently restrict via authentication.

---

### 🔐 SSR + Authentication (Technical Implementation)

* Each incoming request is passed through `validateAndGetCurrentUserInfo(req)` on the server to check for authentication.
* If the user is authenticated, their data is injected into Redux using:

```js
store.dispatch(setCurrentUser(currentUser));
store.dispatch(setAuthenticationState(isAuthenticated));
```

* This user context is used server-side to personalize content **without exposing it to bots**.
* Pages that require login can trigger redirects directly from the server, preventing bots from accessing them:

```js
if (!currentUser && route.requiresAuth) {
  context.url = '/login'; // Trigger SSR-based redirect
}
```

---

### 🔍 Summary

| Feature                     | Impact on SEO                    |
| --------------------------- | -------------------------------- |
| SSR (Server-Side Rendering) | ✅ Boosts crawlability & indexing |
| Dynamic Meta with Helmet    | ✅ Enables rich snippets/previews |
| Authenticated-only Pages    | ❌ Not crawlable by bots          |
| Public + Auth Views         | ✅ Best for SEO & UX balance      |


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3500](http://localhost:3500) to view it in the browser.
It also render preloaded data, if available.


### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React and Node in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

