# Welcome to gallery-server 👋

> Powerful yet simple Node.js local image viewer on your PC or mobile.

![gallery-server-demo](https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/demo-page.jpg)

#### **<p align="center">Beautiful Local Image Viewer</p>**

## Install

```sh
npm install gallery-server -g
```

## Use

1. Serve the images.

   ```sh
   gallery-server --folder /path/to/images

   # or
   npx gallery-server --folder /path/to/images

   # no footer
   npx gallery-server --folder /path/to/images --view-footer=false
   ```

   ![gallery-server-cli-demo](https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/cli-demo.jpg)

2. Enjoy：open <http://localhost:6834/> in your favorite browser.

## Features

1. Images in your PC can be viewed in your mobile phone's browser!
2. More than one gallery can be served at the same time.
3. A lot of gallery features. Check it at [react-images](https://jossmac.github.io/react-images/#/accessibility).

## Develop

Install all the dependencies into `./package.json`'s devDependencies not `./client/package.json`. The package.json in `client` exits only for `scripts`。

For example if you want change to another gallery:

```sh
# enter project root not ./client/
cd project_root

npm install --save-dev react-bnb-gallery

# start api server
npm run start:server

# start webpack devServer
npm run start:client

# finish coding, run this cmd to build
npm run start -- --folder /path/to/images
```

## Run tests

```sh
npm run test
```

## Author

👤 **legend80s**

* Github: [@legend80s](https://github.com/legend80s)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/legend80s/gallery-server/issues).

## Todo

- [x] Any port. use unoccupied port.
- [ ] Serve network images.
- [x] Use network IP. mimic create-react-app.
- [ ] Electron App
- [ ] Show help Information on cli `-v` `-h`.
- [x] Viewable on mobile.
- [ ] Adapt to mobile.

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
