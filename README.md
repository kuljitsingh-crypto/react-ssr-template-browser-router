# React SSR Template 
This project is built after ejecting the default  react app (generated using Create-React-App) and modifying the necessary part to create ssr functionality. Loadable components package is utilized to efficiently split and manage components, especially those designated for server-side rendering. 

In this template, I leverage React-Router's new CreateBrowserRouter to establish routes, providing the flexibility to tap into new data APIs if required.

## Folder Structure 
├── babel.config.js
├── config
│   ├── env.js
│   ├── getHttpsConfig.js
│   ├── jest
│   │   ├── babelTransform.js
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── modules.js
│   ├── nodeBackendConfig.js
│   ├── paths.js
│   ├── webpack
│   │   └── persistentCache
│   │       └── createEnvironmentHash.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── package.json
├── public
│   ├── 500.html
│   ├── index.html
│   ├── robots.txt
│   └── static
│       ├── icons
│       │   ├── browserconfig.xml
│       │   ├── favicon.ico
│       │   ├── logo150.png
│       │   ├── logo16.png
│       │   ├── logo180.png
│       │   ├── logo192.png
│       │   ├── logo32.png
│       │   └── logo512.png
│       ├── images
│       │   ├── facebook.png
│       │   └── twitter.png
│       ├── manifest.json
│       └── svg
│           └── icon.svg
├── README.md
├── scripts
│   ├── build-server.js
│   ├── build.js
│   ├── start.js
│   └── test.js
├── server
│   ├── csp-util
│   │   └── csp.js
│   ├── index.js
│   └── util
│       ├── helperFunctions.js
│       └── ssrUtills.js
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   ├── facebook.png
│   │   └── twitter.png
│   ├── components
│   │   ├── BrandIcon
│   │   │   └── BrandIcon.tsx
│   │   ├── Divider
│   │   │   └── Divider.tsx
│   │   ├── ErrorText
│   │   │   └── ErrorText.tsx
│   │   ├── FormattedMessage
│   │   │   └── FormattedMsg.tsx
│   │   ├── helperComponents
│   │   │   ├── AuthenticatedPage.tsx
│   │   │   ├── customConnect.tsx
│   │   │   ├── ReactHelmet.tsx
│   │   │   ├── windowDimension.tsx
│   │   │   └── withRouter.tsx
│   │   ├── IconSpinner
│   │   │   ├── IconSpinner.module.css
│   │   │   └── IconSpinner.tsx
│   │   ├── index.ts
│   │   ├── LeftChild
│   │   │   ├── LeftChild.module.css
│   │   │   └── LeftChild.tsx
│   │   ├── Menu
│   │   │   ├── index.tsx
│   │   │   ├── Menu.module.css
│   │   │   ├── Menu.tsx
│   │   │   ├── MenuContent.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   └── MenuLabel.tsx
│   │   ├── NamedLink
│   │   │   ├── NamedLink.module.css
│   │   │   └── NamedLink.tsx
│   │   ├── NamedRedirect
│   │   │   ├── NamedRedirect.module.css
│   │   │   └── NamedRedirect.tsx
│   │   ├── Page
│   │   │   ├── Page.tsx
│   │   │   └── pageHooks.ts
│   │   ├── RIghtChild
│   │   │   ├── RightChild.module.css
│   │   │   └── RightChild.tsx
│   │   ├── Sidebar
│   │   │   └── Sidebar.tsx
│   │   ├── Topbar
│   │   │   ├── ProfileMenu.tsx
│   │   │   ├── ThemeMenu.tsx
│   │   │   ├── Topbar.module.css
│   │   │   └── Topbar.tsx
│   │   ├── UI
│   │   │   ├── Button
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.tsx
│   │   │   └── FieldTextInput
│   │   │       ├── FieldTextInput.module.css
│   │   │       └── FieldTextInput.tsx
│   │   └── UserAvatar
│   │       ├── index.module.css
│   │       └── UserAvatar.tsx
│   ├── context
│   │   ├── index.ts
│   │   └── useConfigurationContext.ts
│   ├── custom-config.ts
│   ├── Form
│   │   ├── ForgotPasswordForm
│   │   │   ├── ForgotPasswordForm.module.css
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── index.ts
│   │   ├── LoginForm
│   │   │   ├── LoginForm.module.css
│   │   │   └── LoginForm.tsx
│   │   └── SignupForm
│   │       ├── SignupForm.module.css
│   │       └── SignupForm.tsx
│   ├── globalReducers
│   │   ├── auth.slice.ts
│   │   ├── index.ts
│   │   ├── ui.slice.ts
│   │   └── user.slice.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useCustomRouter.ts
│   │   ├── useFetchStatusHandler.ts
│   │   ├── useNamedRedirect.ts
│   │   ├── useReduxHooks.ts
│   │   └── useUnauthenticatedRedirect.tsx
│   ├── index.css
│   ├── index.js
│   ├── pages
│   │   ├── About
│   │   │   └── About.tsx
│   │   ├── ForgotPassword
│   │   │   ├── ForgotPassword.module.css
│   │   │   └── ForgotPassword.tsx
│   │   ├── Homepage
│   │   │   ├── Homepage.tsx
│   │   │   └── homePageSlice.ts
│   │   ├── LoginPage
│   │   │   ├── LoginPage.module.css
│   │   │   └── LoginPage.tsx
│   │   ├── NotFoundPage
│   │   │   ├── NotFoundPage.module.css
│   │   │   └── NotFoundPage.tsx
│   │   ├── pageDataLoadingAPI.ts
│   │   ├── pageGlobalType.ts
│   │   ├── pageReducers.ts
│   │   ├── ProductPage
│   │   │   ├── ProductPage.module.css
│   │   │   ├── ProductPage.tsx
│   │   │   └── ProductPageSlice.ts
│   │   ├── ProductsPage
│   │   │   ├── ProductsPage.module.css
│   │   │   ├── ProductsPage.tsx
│   │   │   └── ProductsPageSlice.ts
│   │   └── SignupPage
│   │       ├── SignupPage.module.css
│   │       └── SignupPage.tsx
│   ├── react-app-env.d.ts
│   ├── reducers.ts
│   ├── routeNames.ts
│   ├── store.ts
│   ├── storeHelperFunction.ts
│   ├── translations
│   │   ├── countryCodes.js
│   │   ├── de.json
│   │   ├── en.json
│   │   ├── es.json
│   │   └── fr.json
│   └── util
│       ├── api.ts
│       ├── APITypes.ts
│       ├── browserHelperFunction.ts
│       ├── functionHelper.ts
│       ├── localeHelper.ts
│       ├── objectHelper.ts
│       ├── polyfills.js
│       ├── routes.js
│       ├── routesHelperFunction.ts
│       └── themeHelper.ts
├── tsconfig.json
└── yarn.lock


## Enviroment Value
Enviroment value used in,

+ REACT_APP_API_SERVER_PORT=3500
+ REACT_APP_CANONICAL_ROOT_URL=http://localhost:3000
+ REACT_APP_CSP=report

This is the basic .env file value to run this project.

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

