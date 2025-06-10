# React SSR Template 
This project is built after ejecting the default  react app (generated using Create-React-App) and modifying the necessary part to create ssr functionality. Loadable components package is utilized to efficiently split and manage components, especially those designated for server-side rendering. 

In this template, I leverage React-Router's new CreateBrowserRouter to establish routes, providing the flexibility to tap into new data APIs if required.

## Folder Structure 
<details> <summary><code>Project Structure</code></summary>
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
│       │   ├── logo16.png
│       │   ├── logo32.png
│       │   ├── logo150.png
│       │   ├── logo180.png
│       │   ├── logo192.png
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
│   │   └── ... (trimmed for brevity)
│   ├── context
│   ├── Form
│   ├── globalReducers
│   ├── hooks
│   ├── pages
│   ├── translations
│   └── util
├── tsconfig.json
└── yarn.lock
</details>

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

