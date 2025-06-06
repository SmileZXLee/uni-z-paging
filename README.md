# z-paging

<p align="center">
    <img alt="logo" src="https://z-paging.zxlee.cn/img/title-logo.png" height="100" style="margin-bottom: 50px;">
</p>

[![release](https://img.shields.io/github/v/release/SmileZXLee/uni-z-paging?style=flat)](https://github.com/SmileZXLee/uni-z-paging/releases)
[![download](https://img.shields.io/npm/dt/z-paging?style=flat)](https://www.npmjs.com/package/z-paging)
[![license](https://img.shields.io/github/license/SmileZXLee/uni-z-paging?style=flat)](https://en.wikipedia.org/wiki/MIT_License)

## 文档地址：[https://z-paging.zxlee.cn](https://z-paging.zxlee.cn) 

## 在DCloud插件市场中访问：[https://ext.dcloud.net.cn/plugin?name=z-paging](https://ext.dcloud.net.cn/plugin?name=z-paging)

### 更新组件前，请注意[版本差异](https://z-paging.zxlee.cn/start/upgrade-guide.html)

### 仓库目录说明

```
.
├── demo
│   │
│   ├── z-paging-demo 采用【选项式api】写法，支持vue2和vue3，此文件夹可直接拖到HBuilderX中运行
│   │
│   └── z-paging-vue3-demo 采用【组合式api】写法，仅支持vue3，此文件夹可直接拖到HBuilderX中运行
│ 
├── z-paging 【z-paging】源码，可直接拷贝到【uni_modules】文件夹下或复制子组件到【compoments】目录下亦可。
│
├── .gitattributes
│
├── .gitignore
│
├── LICENSE
│
└── README.md
```

### 功能&特点

* 【配置简单】仅需两步（绑定网络请求方法、绑定分页结果数组）轻松完成完整下拉刷新，上拉加载更多功能。
* 【低耦合，低侵入】分页自动管理。在page中无需处理任何分页相关逻辑，无需在data中定义任何分页相关变量，全由z-paging内部处理。
* 【超灵活，支持各种类型自定义】支持自定义下拉刷新，自定义上拉加载更多等各种自定义效果；支持使用内置自动分页，同时也支持通过监听下拉刷新和滚动到底部事件自行处理；支持使用自带全屏布局规范，同时也支持将z-paging自由放在任意容器中。
* 【功能丰富】支持国际化，支持自定义且自动管理空数据图，支持主题模式切换，支持本地分页，支持聊天分页模式，支持展示最后更新时间，支持吸顶效果，支持内部scroll-view滚动与页面滚动，支持一键滚动到顶部等诸多功能。
* 【全平台兼容】支持vue&nvue，vue2&vue3，js&ts，支持h5、app、鸿蒙Next及各家小程序。
* 【高性能】在app-vue、h5、微信小程序、QQ小程序上使用wxs+renderjs从视图层实现下拉刷新；支持虚拟列表，轻松渲染百万级列表数据！

### 反馈qq群
* 官方1群`已满`：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)

* 官方2群`已满`：[371624008](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=avPmibADf2TNi4LxkIwjCE5vbfXpa-r1&authKey=dQ%2FVDAR87ONxI4b32Py%2BvmXbhnopjHN7%2FJPtdsqJdsCPFZB6zDQ17L06Uh0kITUZ&noverify=0&group_code=371624008)
* 官方3群：[343409055](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=sIaNqiCMIjxGQVksjytCw6R8DSiibHR7&authKey=pp995q8ZzFtl5F2xUwvvceP24QTcguWW%2FRVoDnMa8JZF4L2DmS%2B%2FV%2F5sYrcgPsmW&noverify=0&group_code=343409055)

### 使用案例
* [点击此处添加](https://github.com/SmileZXLee/uni-z-paging/issues/42)
* 使用过程中发现任何问题都可以提 [Issue](https://github.com/SmileZXLee/uni-z-paging/issues)，同时也欢迎 [PR](https://github.com/SmileZXLee/uni-z-paging/pulls)。

### 预览

|                    自定义下拉刷新效果演示                    |                   滑动切换选项卡+吸顶演示                    | 聊天记录模式演示                                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: | ------------------------------------------------------------ |
| ![](https://z-paging.zxlee.cn/public/img/z-paging-demo5.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo6.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo7.gif) |

|                 虚拟列表(流畅渲染1万+条)演示                 |                       下拉进入二楼演示                       | 在弹窗内使用演示                                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: | ------------------------------------------------------------ |
| ![](https://z-paging.zxlee.cn/public/img/z-paging-demo8.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo9.gif) | ![](https://z-paging.zxlee.cn/public/img/z-paging-demo10.gif) |

### 在线demo体验地址：

* [https://demo.z-paging.zxlee.cn](https://demo.z-paging.zxlee.cn)

| 扫码体验                                                     |
| ------------------------------------------------------------ |
| ![](https://z-paging.zxlee.cn/public/img/code.png) |

### 更新日志
* [点击查看更新日志](https://ext.dcloud.net.cn/plugin?id=3935&update_log)

### 贡献者们

感谢以下所有给 z-paging 贡献过代码的 [开发者](https://github.com/SmileZXLee/uni-z-paging/graphs/contributors)。

<a href="https://github.com/SmileZXLee/uni-z-paging/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SmileZXLee/uni-z-paging" />
</a>

### 感谢Star支持

[![Stargazers repo roster for @SmileZXLee/uni-z-paging](https://reporoster.com/stars/SmileZXLee/uni-z-paging)](https://github.com/SmileZXLee/uni-z-paging/stargazers)

