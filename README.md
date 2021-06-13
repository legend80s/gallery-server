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
  <a href="https://www.npmjs.com/package/git-commit-msg-linter">
    <img src="https://badgen.net/badge/git-commit-msg-linter/3.2.5/green" alt="commit msg linted by git-commit-msg-linter" />
  </a>
</p>

<img alt="demo-page-fullscreen" src="https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/demo-page-fullscreen.png" width="100%" />

<p align="center">
  <img alt="gallery-mobile" src="https://raw.githubusercontent.com/legend80s/gallery-server/master/assets/gallery-mobile.jpg" width="40%" />
</p>

#### **<p align="center" style="color: #cb3837;">Beautiful Local Image Viewer</p>**

> Beautiful and powerful yet simple local image viewer on your PC or mobile.

[中文版文档](https://juejin.cn/post/6973163233008058405/)

## Install

No installment required!

## Use

1. Serve the local photos.

```sh
npx gallery-server --folder /path/to/photos

# for more usage
npx gallery-server -h
```

2. Open <http://localhost:xxxx/> in your favorite browser or share with your friends <http://a.b.c.d:xxxx/?token=${token}>.

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

   - A: You see this message because you are not the gallery owner. Ask the owner for the token and append it to the resource URL.

2. Photos in node_modules will be ignored for performance.

## Develop

1. start api server

```sh
npm run dev:server -- --folder=/path/to/photos
```

2. start webpack devServer

```sh
npm run dev:client
```

Notice: Install all the dependencies into `./package.json`'s devDependencies not `./client/package.json`. The package.json in `client` exits only for `scripts`。

For example if you want change to another gallery (react-bnb-gallery):

```sh
# enter project root not ./client/
cd project_root

npm install --save-dev react-bnb-gallery

# start api server
npm run dev:server -- --folder=/path/to/photos

# start webpack devServer
npm run dev:client
```

## Publish

```sh
npm version patch / minor / major
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
- [ ] Electron App.

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
