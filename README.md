# WebVisu
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Introduction

This is a single page application (SPA) for displaying the web visualisation pages build with the **CoDeSys 2.3** or **WAGO-I/O-PRO CAA** IDE without using Java. With this solution it's possible to display the existing visualisations on mobile devices or modern browsers that doesn't support Java applets anymore.

> :point_right: : Every release has been tested with bigger CoDeSys projects but the components are currently not automatically tested. Create an issue or send me a mail to \_tristan.nentwig+webvisu@gmail.com* if you encounter a problem.

## How to use

Just copy the webvisu.html and webvisu.js from the release tab to the folder which contents are deployed by the webserver. **The webvisu folder path depend on which WAGO PLC is used**. The FTP transfer could be made with FileZilla for example.

For displaying on client use a modern browser like Chrome, Firefox or Edge that supports ES6 constructs.

#### For the non Linux PLCs (like 750-88x, 750-89x series):

Transfer them to the _/PLC_ folder. The visualisation is available afterwards on  
_http://\<ip-address-of-your-plc>/PLC/webvisu.html_

#### For the Linux PLCs (like IPC or PFC200):

Transfer it to _/home/codesys_. The visualisation is available afterwards on  
_http://\<ip-address-of-your-plc>:8080/webvisu.html_ (IPC)
_http://\<ip-address-of-your-plc>/webvisu/webvisu.html_ (PFC200)

## How it works

This SPA is based on the [React](https://github.com/facebook/react) and [MobX](https://github.com/mobxjs/mobx) framework. CoDeSys creates a XML description file for every user generated visualisation. Every file descripes the look and behavior of the objects shown in the specific visualisation. Besides that the file contains the used variables (e.g. "_.xToggleColor_") and their addresses on the web interface.  
The SPA parse the current visualisation XML file and insert a React component dynamically to the React-Dom as absolut positioned element. The variables depending on the element will be included to a singleton object named "ComSocket". This object saves the variables in a observable map and queries the value of the variables cyclic. If an observable value changes all dependend elements rerender. The observable map is part of the MobX framework.

## Demo (1.0.9)

<p align="center"> 
<img src="./img/demo.gif">
</p>

## Currently supported features

The WebVisu-SPA is still in progress but already contains numerous functionalities and elements.

| Element/ Function    |     Integrated     |
| -------------------- | :----------------: |
| Change userlevel     | :heavy_check_mark: |
| Rectangle            | :heavy_check_mark: |
| Roundrect            | :heavy_check_mark: |
| Ellipse              | :heavy_check_mark: |
| Polygon              | :heavy_check_mark: |
| Bezier               | :heavy_check_mark: |
| Polyline             | :heavy_check_mark: |
| Sector               | :heavy_check_mark: |
| Bitmap<sup>1</sup>   | :heavy_check_mark: |
| Subvisualisation     | :heavy_check_mark: |
| Button               | :heavy_check_mark: |
| WMF-File             | :heavy_check_mark: |
| Table                |      :wrench:      |
| Alarm table          | :heavy_minus_sign: |
| Slider<sup>2</sup>   | :heavy_check_mark: |
| Button               | :heavy_check_mark: |
| Gauge                | :heavy_check_mark: |
| Bar display          | :heavy_check_mark: |
| Histogram            | :heavy_minus_sign: |
| CurrentVisu-Variable | :heavy_check_mark: |
| Language switching   | :heavy_minus_sign: |
| ActiveX-Element      |    :collision:     |

## Meaning of the marks

:heavy_check_mark: : Fully implemented  
:heavy_minus_sign: : Currently not supported  
:wrench: : Currently in progress  
:collision: : Is no longer supported in modern browsers

## Comments

<sup>1</sup> : The "Background transparent" functionality (select a specific color to become transparent) doesn't work.
<sup>2</sup> : Works fine with Firefox. Sliderchange has to be throttled on Chrome in the future.

## Dependencies

## - Dependencies

|        Package      |         Main        |         Dev         |         npm         |
| ------------------- | ------------------- | ------------------- | ------------------- |
| ![package](https://img.shields.io/badge/-%40material--ui%2Fcore-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/@material-ui/core?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/@material-ui/core/Dev?label=) | ![npm](https://img.shields.io/npm/v/@material-ui/core?label=) |
| ![package](https://img.shields.io/badge/-idb--keyval-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/idb-keyval?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/idb-keyval/Dev?label=) | ![npm](https://img.shields.io/npm/v/idb-keyval?label=) |
| ![package](https://img.shields.io/badge/-jszip-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/jszip?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/jszip/Dev?label=) | ![npm](https://img.shields.io/npm/v/jszip?label=) |
| ![package](https://img.shields.io/badge/-mobx-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx/Dev?label=) | ![npm](https://img.shields.io/npm/v/mobx?label=) |
| ![package](https://img.shields.io/badge/-mobx--react-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx-react?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx-react/Dev?label=) | ![npm](https://img.shields.io/npm/v/mobx-react?label=) |
| ![package](https://img.shields.io/badge/-mobx--react--lite-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx-react-lite?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/mobx-react-lite/Dev?label=) | ![npm](https://img.shields.io/npm/v/mobx-react-lite?label=) |
| ![package](https://img.shields.io/badge/-react-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react/Dev?label=) | ![npm](https://img.shields.io/npm/v/react?label=) |
| ![package](https://img.shields.io/badge/-react--dom-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-dom?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-dom/Dev?label=) | ![npm](https://img.shields.io/npm/v/react-dom?label=) |
| ![package](https://img.shields.io/badge/-react--error--boundary-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-error-boundary?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-error-boundary/Dev?label=) | ![npm](https://img.shields.io/npm/v/react-error-boundary?label=) |
| ![package](https://img.shields.io/badge/-react--hooks-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-hooks?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-hooks/Dev?label=) | ![npm](https://img.shields.io/npm/v/react-hooks?label=) |
| ![package](https://img.shields.io/badge/-react--uid-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-uid?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/react-uid/Dev?label=) | ![npm](https://img.shields.io/npm/v/react-uid?label=) |
| ![package](https://img.shields.io/badge/-reactjs--popup-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/reactjs-popup?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/reactjs-popup/Dev?label=) | ![npm](https://img.shields.io/npm/v/reactjs-popup?label=) |
| ![package](https://img.shields.io/badge/-sprintf--js-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/sprintf-js?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/sprintf-js/Dev?label=) | ![npm](https://img.shields.io/npm/v/sprintf-js?label=) |

## - devDependencies

|        Package      |         Main        |         Dev         |         npm         |
| ------------------- | ------------------- | ------------------- | ------------------- |
| ![package](https://img.shields.io/badge/-%40types%2Freact-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/react?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/react/Dev?label=) | ![npm](https://img.shields.io/npm/v/@types/react?label=) |
| ![package](https://img.shields.io/badge/-%40types%2Freact--dom-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/react-dom?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/react-dom/Dev?label=) | ![npm](https://img.shields.io/npm/v/@types/react-dom?label=) |
| ![package](https://img.shields.io/badge/-%40types%2Fsprintf--js-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/sprintf-js?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@types/sprintf-js/Dev?label=) | ![npm](https://img.shields.io/npm/v/@types/sprintf-js?label=) |
| ![package](https://img.shields.io/badge/-%40typescript--eslint%2Feslint--plugin-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@typescript-eslint/eslint-plugin?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@typescript-eslint/eslint-plugin/Dev?label=) | ![npm](https://img.shields.io/npm/v/@typescript-eslint/eslint-plugin?label=) |
| ![package](https://img.shields.io/badge/-%40typescript--eslint%2Fparser-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@typescript-eslint/parser?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/@typescript-eslint/parser/Dev?label=) | ![npm](https://img.shields.io/npm/v/@typescript-eslint/parser?label=) |
| ![package](https://img.shields.io/badge/-css--loader-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/css-loader?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/css-loader/Dev?label=) | ![npm](https://img.shields.io/npm/v/css-loader?label=) |
| ![package](https://img.shields.io/badge/-eslint-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint/Dev?label=) | ![npm](https://img.shields.io/npm/v/eslint?label=) |
| ![package](https://img.shields.io/badge/-eslint--config--prettier-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-config-prettier?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-config-prettier/Dev?label=) | ![npm](https://img.shields.io/npm/v/eslint-config-prettier?label=) |
| ![package](https://img.shields.io/badge/-eslint--loader-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-loader?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-loader/Dev?label=) | ![npm](https://img.shields.io/npm/v/eslint-loader?label=) |
| ![package](https://img.shields.io/badge/-eslint--plugin--prettier-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-plugin-prettier?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-plugin-prettier/Dev?label=) | ![npm](https://img.shields.io/npm/v/eslint-plugin-prettier?label=) |
| ![package](https://img.shields.io/badge/-eslint--plugin--react--hooks-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-plugin-react-hooks?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/eslint-plugin-react-hooks/Dev?label=) | ![npm](https://img.shields.io/npm/v/eslint-plugin-react-hooks?label=) |
| ![package](https://img.shields.io/badge/-html--webpack--plugin-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/html-webpack-plugin?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/html-webpack-plugin/Dev?label=) | ![npm](https://img.shields.io/npm/v/html-webpack-plugin?label=) |
| ![package](https://img.shields.io/badge/-prettier-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/prettier?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/prettier/Dev?label=) | ![npm](https://img.shields.io/npm/v/prettier?label=) |
| ![package](https://img.shields.io/badge/-source--map--loader-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/source-map-loader?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/source-map-loader/Dev?label=) | ![npm](https://img.shields.io/npm/v/source-map-loader?label=) |
| ![package](https://img.shields.io/badge/-style--loader-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/style-loader?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/style-loader/Dev?label=) | ![npm](https://img.shields.io/npm/v/style-loader?label=) |
| ![package](https://img.shields.io/badge/-ts--loader-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/ts-loader?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/ts-loader/Dev?label=) | ![npm](https://img.shields.io/npm/v/ts-loader?label=) |
| ![package](https://img.shields.io/badge/-typescript-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/typescript?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/typescript/Dev?label=) | ![npm](https://img.shields.io/npm/v/typescript?label=) |
| ![package](https://img.shields.io/badge/-webpack-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/webpack?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/webpack/Dev?label=) | ![npm](https://img.shields.io/npm/v/webpack?label=) |
| ![package](https://img.shields.io/badge/-webpack--cli-gray) | ![main](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/webpack-cli?label=) | ![dev](https://img.shields.io/github/package-json/dependency-version/Ekristoffe/WebVisu/dev/webpack-cli/Dev?label=) | ![npm](https://img.shields.io/npm/v/webpack-cli?label=) |
