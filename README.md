# React SSR Template 
This project is built after ejecting the default  react app (generated using Create-React-App) and modifying the necessary part to create ssr functionality. Loadable components package is utilized to efficiently split and manage components, especially those designated for server-side rendering. 

In this template, I leverage React-Router's new CreateBrowserRouter to establish routes, providing the flexibility to tap into new data APIs if required.

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

