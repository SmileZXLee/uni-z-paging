# z-paging

<p align="center">
    <img alt="logo" src="https://z-paging.zxlee.cn/img/title-logo.png" height="100" style="margin-bottom: 50px;">
</p>

<p align="center">
  <b>Language：</b>
  <a href="./README.md">🇨🇳 中文</a> &nbsp;|&nbsp;
  <a href="./README_EN.md">🇬🇧 English</a>
</p>

[![release](https://img.shields.io/github/v/release/SmileZXLee/uni-z-paging?style=flat)](https://github.com/SmileZXLee/uni-z-paging/releases)
[![download](https://img.shields.io/npm/dt/z-paging?style=flat)](https://www.npmjs.com/package/z-paging)
[![license](https://img.shields.io/github/license/SmileZXLee/uni-z-paging?style=flat)](https://en.wikipedia.org/wiki/MIT_License)

## Documentation: [https://z-paging.zxlee.cn](https://z-paging.zxlee.cn)

## Visit on DCloud Plugin Market: [https://ext.dcloud.net.cn/plugin?name=z-paging](https://ext.dcloud.net.cn/plugin?name=z-paging)

### Before updating the component, please check the [Version Differences](https://z-paging.zxlee.cn/start/upgrade-guide.html)

### Repository Structure

```
.
├── demo
│   │
│   ├── z-paging-demo         Uses [Options API], supports both vue2 and vue3. This folder can be dragged directly into HBuilderX to run.
│   │
│   └── z-paging-vue3-demo    Uses [Composition API], supports vue3 only. This folder can be dragged directly into HBuilderX to run.
│
├── z-paging    [z-paging] source code. Copy it directly to the [uni_modules] folder, or copy the sub-components into the [components] directory.
│
├── .gitattributes
│
├── .gitignore
│
├── LICENSE
│
└── README.md
```

### Features & Highlights

* **[Easy Configuration]** Only two steps needed — bind the network request method and bind the paginated result array — to effortlessly implement complete pull-down refresh and pull-up load more.
* **[Low Coupling, Low Intrusion]** Automatic pagination management. No pagination logic is needed in the page, and no pagination-related variables need to be defined in `data` — everything is handled internally by z-paging.
* **[Highly Flexible & Customizable]** Supports custom pull-down refresh, custom pull-up load more, and various other custom effects. Supports both built-in automatic pagination and manual control via pull-down refresh and scroll-to-bottom event listeners. Supports the built-in full-screen layout specification as well as freely placing z-paging inside any container.
* **[Feature Rich]** Supports internationalization, custom and auto-managed empty-data views, theme mode switching, local pagination, chat pagination mode, last-update-time display, sticky header effects, inner scroll-view scrolling and page-level scrolling, one-tap scroll to top, and much more.
* **[Cross-Platform Compatible]** Supports vue & nvue, vue2 & vue3, JS & TS, h5, App, HarmonyOS Next, and all major mini-program platforms.
* **[High Performance]** Uses wxs + renderjs at the view layer for pull-down refresh on app-vue, h5, WeChat Mini Program, and QQ Mini Program. Supports virtual lists to effortlessly render millions of list items!

### Feedback QQ Group

* Official Group 1 `Full`: [790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)
* Official Group 2 `Full`: [371624008](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=avPmibADf2TNi4LxkIwjCE5vbfXpa-r1&authKey=dQ%2FVDAR87ONxI4b32Py%2BvmXbhnopjHN7%2FJPtdsqJdsCPFZB6zDQ17L06Uh0kITUZ&noverify=0&group_code=371624008)
* Official Group 3: [343409055](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=sIaNqiCMIjxGQVksjytCw6R8DSiibHR7&authKey=pp995q8ZzFtl5F2xUwvvceP24QTcguWW%2FRVoDnMa8JZF4L2DmS%2B%2FV%2F5sYrcgPsmW&noverify=0&group_code=343409055)

### Use Cases

* [Click here to add your use case](https://github.com/SmileZXLee/uni-z-paging/issues/42)
* If you encounter any issues, feel free to submit an [Issue](https://github.com/SmileZXLee/uni-z-paging/issues). [PRs](https://github.com/SmileZXLee/uni-z-paging/pulls) are also very welcome!

### Preview

|                    Custom Pull-Down Refresh Demo                    |                   Swipeable Tab + Sticky Header Demo                   | Chat History Mode Demo                                             |
| :-----------------------------------------------------------------: | :--------------------------------------------------------------------: | ------------------------------------------------------------------ |
| ![](https://z-paging.zxlee.cn/public/img/z-paging-demo5.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo6.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo7.gif) |

|                 Virtual List (Smooth Rendering of 10,000+ Items) Demo                 |                       Pull Down to Enter Second Floor Demo                        | Usage Inside a Popup Demo                                             |
| :------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: | --------------------------------------------------------------------- |
| ![](https://z-paging.zxlee.cn/public/img/z-paging-demo8.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo9.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo10.gif) |

### Online Demo

* [https://demo.z-paging.zxlee.cn](https://demo.z-paging.zxlee.cn)

| Scan to Experience                                                   |
| -------------------------------------------------------------------- |
| ![](https://z-paging.zxlee.cn/public/img/code.png) |

### Changelog

* [Click to view changelog](https://ext.dcloud.net.cn/plugin?id=3935&update_log)

### Contributors

Thanks to all the [developers](https://github.com/SmileZXLee/uni-z-paging/graphs/contributors) who have contributed code to z-paging.

<a href="https://github.com/SmileZXLee/uni-z-paging/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SmileZXLee/uni-z-paging" />
</a>

### Thanks for Your Star Support

[![Stargazers repo roster for @SmileZXLee/uni-z-paging](https://reporoster.com/stars/SmileZXLee/uni-z-paging)](https://github.com/SmileZXLee/uni-z-paging/stargazers)
