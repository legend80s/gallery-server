# Welcome to gallery-server 👋

<p>
  <a href="https://www.npmjs.com/package/gallery-server">
    <img src="https://img.shields.io/npm/v/gallery-server.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/gallery-server">
    <img src="https://img.shields.io/npm/dm/gallery-server.svg" alt="npm downloads" />
  </a>
  <a href="https://bundlephobia.com/result?p=gallery-server">
    <img src="https://flat.badgen.net/bundlephobia/minzip/gallery-server" alt="Minified + gzip package size for gallery-server in KB">
  </a>
</p>

<img alt="demo-page-fullscreen" src="https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/demo-page-fullscreen.png" width="100%" />

<p align="center">
  <img alt="gallery-mobile" src="https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/gallery-mobile.jpg" width="40%" />
</p>

#### **<p align="center" style="color: #cb3837;">Beautiful Local Image Viewer</p>**

> Beautiful and powerful yet simple local image viewer on your PC or mobile.

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

   # for more usage
   gallery-server -h
   ```

2. Enjoy：open <http://localhost:6834/?token=${token}> in your favorite browser.

### Enjoy on PC

![demo-page-album](https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/demo-page-album-2.png)

### Enjoy on Mobile

<p align="center">
  <img alt="album-mobile" src="https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/album-mobile.jpeg" width="40%" />
</p>

*Photos from pixabay API of Yosemite.*

## Features

1. Photos in your PC can be viewed in your mobile phone's browser!
2. Security on privacy to prevent eavesdropping. API or image resources without a specific token is forbidden, but you can still share with your friends by sending him the token.
3. Theme togglable between light and dark.
4. Videos also supported!
5. More than one galleries can be served at the same time.
6. A lot of gallery features. Check it at [react-images](https://jossmac.github.io/react-images/#/accessibility).

## FAQ

1. Q: Why `403 forbidden`？

   ```json
   {
     "code": 403,
     "message": "Forbidden. `token` required. Please redirect to https://github.com/legend80s/gallery-server#faq for more information."
   }
   ```

   - A: Add token to the resource url if you are the gallery owner otherwise ask the owner for the token.

2. Photos in node_modules will be ignored for the performance.

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
- [ ] Build with remote client to support a wide range of client gallery.
- [x] Use network IP. mimic create-react-app.
- [x] Show help Information on cli `-v` `-h`.
- [x] Viewable on mobile.
- [x] Adapt to mobile.
- [ ] Image lazy load.
- [x] Security on privacy. only url with token is shareable.
- [x] Port customizable.
- [x] Token customizable.
- [x] Serve multiple folders in one cmd.
- [x] Token can be optional when viewed on owner's brower.

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
