// src/utils/disableConsole.js

if (process.env.NODE_ENV === "production") {
    console.log = function () {};
    console.error = function () {};
    console.warn = function () {};
    console.info = function () {};
    console.debug = function () {};
  }
  