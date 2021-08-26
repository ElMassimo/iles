"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var NProgress = require("nprogress");
var vue = require("vue");
var serverRenderer = require("@vue/server-renderer");
var vueRouter = require("vue-router");
var head = require("@vueuse/head");
var core = require("@vueuse/core");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NProgress__default = /* @__PURE__ */ _interopDefaultLegacy(NProgress);
const install = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(() => {
      NProgress__default["default"].start();
    });
    router.afterEach(() => {
      NProgress__default["default"].done();
    });
  }
};
var __glob_7_0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  install
});
var windi = `/* windicss layer base */
*, ::before, ::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}
* {
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(59, 130, 246, 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
}
:root {
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
}
:-moz-focusring {
  outline: 1px dotted ButtonText;
}
:-moz-ui-invalid {
  box-shadow: none;
}
::moz-focus-inner {
  border-style: none;
  padding: 0;
}
::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
  height: auto;
}
::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
[type='search'] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
abbr[title] {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
a {
  color: inherit;
  text-decoration: inherit;
}
audio, svg {
  display: block;
  vertical-align: middle;
}
body {
  margin: 0;
  font-family: inherit;
  line-height: inherit;
}
button {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  background-color: transparent;
  background-image: none;
  padding: 0;
  line-height: inherit;
  color: inherit;
}
button, [type='button'], [type='reset'], [type='submit'] {
  -webkit-appearance: button;
}
button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
button, [role="button"] {
  cursor: pointer;
}
html {
  -webkit-text-size-adjust: 100%;
  font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  line-height: 1.5;
}
h1, h3, h2 {
  font-size: inherit;
  font-weight: inherit;
}
p, h1, h3, h2 {
  margin: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
/* windicss layer components */
.prose {
  color: var(--fg);
  max-width: 65ch;
  font-size: 1.125rem;
  line-height: 1.75;
}
.prose [class~="lead"] {
  color: #4b5563;
  font-size: 1.25em;
  line-height: 1.6;
  margin-top: 1.2em;
  margin-bottom: 1.2em;
}
.prose a {
  color: var(--color-primary);
  text-decoration: underline;
  font-weight: 500;
}
.prose strong {
  color: var(--fg-deep);
  font-weight: 600;
}
.prose ol[type="A"] {
  --list-counter-style: upper-alpha;
}
.prose ol[type="a"] {
  --list-counter-style: lower-alpha;
}
.prose ol[type="A s"] {
  --list-counter-style: upper-alpha;
}
.prose ol[type="a s"] {
  --list-counter-style: lower-alpha;
}
.prose ol[type="I"] {
  --list-counter-style: upper-roman;
}
.prose ol[type="i"] {
  --list-counter-style: lower-roman;
}
.prose ol[type="I s"] {
  --list-counter-style: upper-roman;
}
.prose ol[type="i s"] {
  --list-counter-style: lower-roman;
}
.prose ol[type="1"] {
  --list-counter-style: decimal;
}
.prose ol > li {
  position: relative;
  padding-left: 1.75em;
}
.prose ol > li::before {
  content: counter(list-item, var(--list-counter-style, decimal)) ".";
  position: absolute;
  font-weight: 400;
  color: #6b7280;
  left: 0;
}
.prose ul > li {
  position: relative;
  padding-left: 1.75em;
}
.prose ul > li::before {
  content: "";
  position: absolute;
  background-color: #d1d5db;
  border-radius: 50%;
  width: 0.375em;
  height: 0.375em;
  top: calc(0.875em - 0.1875em);
  left: 0.25em;
}
.prose hr {
  border-color: #e5e7eb;
  margin-top: 3em;
  margin-bottom: 3em;
}
.prose blockquote {
  font-weight: 500;
  font-style: italic;
  color: var(--fg-deep);
  border-left-width: 0.25rem;
  border-color: #e5e7eb;
  quotes: "\\201C""\\201D""\\2018""\\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}
.prose blockquote p:first-of-type::before {
  content: open-quote;
}
.prose blockquote p:last-of-type::after {
  content: close-quote;
}
.prose h1 {
  color: var(--fg-deeper);
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
}
.prose h2 {
  color: var(--fg-deep);
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}
.prose h3 {
  color: inherit;
  font-weight: 600;
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}
.prose h4 {
  color: inherit;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}
.prose figure figcaption {
  color: #6b7280;
  font-size: 0.875em;
  line-height: 1.4285714;
  margin-top: 0.8571429em;
}
.prose code {
  color: #111827;
  font-weight: 600;
  font-size: 0.875em;
}
.prose code::before {
  content: "\`";
}
.prose code::after {
  content: "\`";
}
.prose a code {
  color: #111827;
}
.prose pre {
  color: #e5e7eb;
  background-color: #1f2937;
  overflow-x: auto;
  font-size: 0.875em;
  line-height: 1.7142857;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  border-radius: 0.375rem;
  padding-top: 0.8571429em;
  padding-right: 1.1428571em;
  padding-bottom: 0.8571429em;
  padding-left: 1.1428571em;
}
.prose pre code {
  background-color: transparent;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-weight: 400;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
}
.prose pre code::before {
  content: none;
}
.prose pre code::after {
  content: none;
}
.prose table {
  width: 100%;
  table-layout: auto;
  text-align: left;
  margin-top: 2em;
  margin-bottom: 2em;
  font-size: 0.875em;
  line-height: 1.7142857;
}
.prose thead {
  color: #111827;
  font-weight: 600;
  border-bottom-width: 1px;
  border-bottom-color: #d1d5db;
}
.prose thead th {
  vertical-align: bottom;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}
.prose tbody tr {
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
}
.prose tbody tr:last-child {
  border-bottom-width: 0;
}
.prose tbody td {
  vertical-align: top;
  padding-top: 0.5714286em;
  padding-right: 0.5714286em;
  padding-bottom: 0.5714286em;
  padding-left: 0.5714286em;
}
.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
.prose img {
  margin-top: 2em;
  margin-bottom: 2em;
}
.prose video {
  margin-top: 2em;
  margin-bottom: 2em;
}
.prose figure {
  margin-top: 2em;
  margin-bottom: 2em;
}
.prose figure > * {
  margin-top: 0;
  margin-bottom: 0;
}
.prose h2 code {
  font-size: 0.875em;
}
.prose h3 code {
  font-size: 0.9em;
}
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  list-style-type: none;
}
.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  list-style-type: none;
}
.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose > ul > li p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}
.prose > ul > li > *:first-child {
  margin-top: 1.25em;
}
.prose > ul > li > *:last-child {
  margin-bottom: 1.25em;
}
.prose > ol > li > *:first-child {
  margin-top: 1.25em;
}
.prose > ol > li > *:last-child {
  margin-bottom: 1.25em;
}
.prose ul ul, .prose ul ol, .prose ol ul, .prose ol ol {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}
.prose hr + * {
  margin-top: 0;
}
.prose h2 + * {
  margin-top: 0;
}
.prose h3 + * {
  margin-top: 0;
}
.prose h4 + * {
  margin-top: 0;
}
.prose thead th:first-child {
  padding-left: 0;
}
.prose thead th:last-child {
  padding-right: 0;
}
.prose tbody td:first-child {
  padding-left: 0;
}
.prose tbody td:last-child {
  padding-right: 0;
}
.prose > :first-child {
  margin-top: 0;
}
.prose > :last-child {
  margin-bottom: 0;
}
.prose b {
  color: var(--fg-deep);
}
.prose em {
  color: inherit;
}
/* windicss layer utilities */
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.bg-warm-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgba(245, 245, 244, var(--tw-bg-opacity));
}
.hover\\:bg-warm-gray-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(231, 229, 228, var(--tw-bg-opacity));
}
.dark .dark\\:bg-dark-400 {
  --tw-bg-opacity: 1;
  background-color: rgba(34, 34, 34, var(--tw-bg-opacity));
}
.dark .dark\\:hover\\:bg-dark-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(45, 45, 45, var(--tw-bg-opacity));
}
.bg-primary {
  background-color: var(--color-primary);
}
.bg-subtle {
  background-color: var(--color-subtle);
}
.dark .dark\\:bg-shallow {
  background-color: var(--fg-shallow);
}
.dark .dark\\:bg-primary-deep {
  background-color: var(--color-primary-deep);
}
.dark .dark\\:bg-deeper {
  background-color: var(--fg-deeper);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-full {
  border-radius: 9999px;
}
.cursor-pointer {
  cursor: pointer;
}
.group:hover .group-hover\\:block {
  display: block;
}
.\\!block {
  display: block !important;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.inline-flex {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
}
.grid {
  display: -ms-grid;
  display: grid;
}
.hidden {
  display: none;
}
.flex-col {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.place-items-center {
  place-items: center;
}
.items-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.flex-auto {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
}
.font-mono {
  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}
.font-extrabold {
  font-weight: 800;
}
.font-bold {
  font-weight: 700;
}
.h-12 {
  height: 3rem;
}
.h-2\\/3 {
  height: 66.666667%;
}
.h-full {
  height: 100%;
}
.h-3 {
  height: 0.75rem;
}
.h-6px {
  height: 6px;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-5xl {
  font-size: 3rem;
  line-height: 1;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-1\\.05rem {
  font-size: 1.05rem;
  line-height: 1;
}
.m-3 {
  margin: 0.75rem;
}
.m-auto {
  margin: auto;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.ml-4 {
  margin-left: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-4 {
  margin-right: 1rem;
}
.-ml-1\\.5 {
  margin-left: -0.375rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.-mb-6 {
  margin-bottom: -1.5rem;
}
.mb-16 {
  margin-bottom: 4rem;
}
.opacity-75 {
  opacity: 0.75;
}
.hover\\:opacity-100:hover {
  opacity: 1;
}
.opacity-85 {
  opacity: 0.85;
}
.opacity-100 {
  opacity: 1;
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.p-2 {
  padding: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}
.pl-2px {
  padding-left: 2px;
}
.static {
  position: static;
}
.absolute {
  position: absolute;
}
.right-8 {
  right: 2rem;
}
.top-8 {
  top: 2rem;
}
.fill-current {
  fill: currentColor;
}
.text-center {
  text-align: center;
}
.text-pink-500 {
  --tw-text-opacity: 1;
  color: rgba(236, 72, 153, var(--tw-text-opacity));
}
.text-\\$c-text {
  color: var(--c-text);
}
.text-white {
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}
.text-deep {
  color: var(--fg-deep);
}
.text-teal-700 {
  --tw-text-opacity: 1;
  color: rgba(15, 118, 110, var(--tw-text-opacity));
}
.dark .dark\\:text-gray-200 {
  --tw-text-opacity: 1;
  color: rgba(229, 231, 235, var(--tw-text-opacity));
}
.\\!no-underline {
  text-decoration: none !important;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.w-12 {
  width: 3rem;
}
.w-full {
  width: 100%;
}
.w-3 {
  width: 0.75rem;
}
.w-max-65ch {
  width: 65ch;
}
.z-1 {
  z-index: 1;
}
.transform {
  --tw-rotate: 0;
  --tw-rotate-x: 0;
  --tw-rotate-y: 0;
  --tw-rotate-z: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-scale-z: 1;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-translate-z: 0;
  -webkit-transform: rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));
  -ms-transform: rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));
  transform: rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));
}
.\\<transition {
  -webkit-transition-property: background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;
  -o-transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;
  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -o-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition-duration: 150ms;
  -o-transition-duration: 150ms;
  transition-duration: 150ms;
}
.transition-transform {
  -webkit-transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform, -webkit-transform;
  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -o-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition-duration: 150ms;
  -o-transition-duration: 150ms;
  transition-duration: 150ms;
}
.transition-all {
  -webkit-transition-property: all;
  -o-transition-property: all;
  transition-property: all;
  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -o-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-transition-duration: 150ms;
  -o-transition-duration: 150ms;
  transition-duration: 150ms;
}
@media (min-width: 768px) {
  .md\\:items-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
}`;
var main$1 = ":root {\n  --color-bg: #fff;\n  --color-primary: #7c3aed;\n  --color-primary-deep: #6d28d9;\n  --color-subtle: #e5e7eb;\n  --fg-shallow: #9ca3af;\n  --fg: #374151;\n  --fg-deep: #1f2937;\n  --fg-deeper: #111827;\n}\nhtml {\n  background-color: var(--color-bg);\n  color: var(--fg);\n}\nhtml.dark {\n  --color-bg: #000;\n  --color-primary: #8b5cf6;\n  --color-primary-deep: #a78bfa;\n  --color-subtle: #1f2937;\n  --fg-shallow: #6b7280;\n  --fg: #d1d5db;\n  --fg-deep: #e5e7eb;\n  --fg-deeper: #f3f4f6;\n}\nhtml.dark .prose p, html.dark .prose a {\n  --color-primary: #f3f4f6;\n}\n.icon-next {\n  margin-left: 0.25rem;\n}\n.icon-prev {\n  margin-right: 0.25rem;\n}\n.icon {\n  display: block;\n  fill: var(--fg);\n  flex-shrink: 0;\n  height: 16px;\n  transform: translateY(1px);\n  width: 16px;\n}\n.audio-player {\n  min-height: 87px;\n}";
const S = "/";
function withPrefix(string, prefix) {
  return string.startsWith(prefix) ? string : prefix + string;
}
function withoutPrefix(string, prefix) {
  return string.startsWith(prefix) ? string.slice(prefix.length) : string;
}
function withoutSuffix(string, suffix) {
  return string.endsWith(suffix) ? string.slice(0, -1 * suffix.length) : string + suffix;
}
function createUrl(urlLike) {
  if (urlLike instanceof URL) {
    return urlLike;
  }
  if (!(urlLike || "").includes("://")) {
    urlLike = "http://e.g" + withPrefix(urlLike, S);
  }
  return new URL(urlLike);
}
function getFullPath(url, routeBase) {
  url = typeof url === "string" ? createUrl(url) : url;
  let fullPath = withoutPrefix(url.href, url.origin);
  if (routeBase) {
    const parts = fullPath.split(S);
    if (parts[1] === routeBase.replace(/\//g, "")) {
      parts.splice(1, 1);
    }
    fullPath = parts.join(S);
  }
  return fullPath;
}
function findDependencies(modules, manifest) {
  const files = new Set();
  for (const id of modules || []) {
    for (const file of manifest[id] || []) {
      files.add(file);
    }
  }
  return [...files];
}
function renderPreloadLinks(files) {
  let link = "";
  for (const file of files || []) {
    if (file.endsWith(".js")) {
      link += `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith(".css")) {
      link += `<link rel="stylesheet" href="${file}">`;
    }
  }
  return link;
}
function defer() {
  const deferred = { status: "pending" };
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = (value) => {
      deferred.status = "resolved";
      return resolve(value);
    };
    deferred.reject = (error) => {
      deferred.status = "rejected";
      return reject(error);
    };
  });
  return deferred;
}
const isRedirect = ({ status = 0 }) => status >= 300 && status < 400;
function useSsrResponse() {
  const deferred = defer();
  let response = {};
  const writeResponse = (params) => {
    Object.assign(response, params);
    if (isRedirect(params)) {
      deferred.resolve("");
    }
  };
  return {
    deferred,
    response,
    writeResponse,
    isRedirect: () => isRedirect(response),
    redirect: (location, status = 302) => writeResponse({ headers: { location }, status })
  };
}
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}
function serializeState(state) {
  try {
    return JSON.stringify(JSON.stringify(state || {})).replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
  } catch (error) {
    console.error("[SSR] On state serialization -", error, state);
    return "{}";
  }
}
function addPagePropsGetterToRoutes(routes2) {
  routes2.forEach((staticRoute) => {
    const originalProps = staticRoute.props;
    staticRoute.props = (route) => {
      const resolvedProps = originalProps === true ? route.params : typeof originalProps === "function" ? originalProps(route) : originalProps;
      return __spreadValues(__spreadValues(__spreadValues({}, (route.meta.hmr || {}).value), route.meta.state || {}), resolvedProps || {});
    };
  });
}
const ClientOnly = vue.defineComponent({
  name: "ClientOnly",
  setup(_, { slots }) {
    const show = vue.ref(false);
    vue.onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
const CONTEXT_SYMBOL = Symbol();
function provideContext(app, context) {
  app.provide(CONTEXT_SYMBOL, context);
}
const viteSSR = function viteSSR2(App, { routes: routes2, base, routerOptions = {}, pageProps = { passToPage: true }, transformState = serializeState }, hook) {
  if (pageProps && pageProps.passToPage) {
    addPagePropsGetterToRoutes(routes2);
  }
  return async function(url, _a = {}) {
    var _b = _a, { manifest, preload = false } = _b, extra = __objRest(_b, ["manifest", "preload"]);
    const app = vue.createSSRApp(App);
    url = createUrl(url);
    const routeBase = base && withoutSuffix(base({ url }), "/");
    const router = vueRouter.createRouter(__spreadProps(__spreadValues({}, routerOptions), {
      history: vueRouter.createMemoryHistory(routeBase),
      routes: routes2
    }));
    const { deferred, response, writeResponse, redirect, isRedirect: isRedirect2 } = useSsrResponse();
    const context = __spreadValues({
      url,
      isClient: false,
      initialState: {},
      redirect,
      writeResponse
    }, extra);
    provideContext(app, context);
    const fullPath = getFullPath(url, routeBase);
    const { head: head$1 } = hook && await hook(__spreadValues({
      app,
      router,
      initialRoute: router.resolve(fullPath)
    }, context)) || {};
    app.use(router);
    router.push(fullPath);
    await router.isReady();
    if (isRedirect2())
      return response;
    Object.assign(context.initialState || {}, (router.currentRoute.value.meta || {}).state || {});
    serverRenderer.renderToString(app, context).then(deferred.resolve).catch(deferred.reject);
    const body = await deferred.promise;
    if (isRedirect2())
      return response;
    let { headTags = "", htmlAttrs = "", bodyAttrs = "" } = head$1 ? head.renderHeadToString(head$1) : {};
    const dependencies = manifest ? findDependencies(context.modules, manifest) : [];
    if (preload && dependencies.length > 0) {
      headTags += renderPreloadLinks(dependencies);
    }
    const initialState = await transformState(context.initialState || {}, serializeState);
    return __spreadValues({
      html: `<!DOCTYPE html>
<html ${htmlAttrs}  lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/pwa-192x192.png">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00aba9">
  <meta name="msapplication-TileColor" content="#00aba9">
  <meta name="theme-color" content="#ffffff">
  <script type="module" crossorigin src="/assets/index.567bddf4.js"><\/script>
    <link rel="modulepreload" href="/assets/vendor.ca5446d8.js">
    <link rel="stylesheet" href="/assets/index.ccd4b6e2.css">
  ${headTags}
</head>
<body ${bodyAttrs} >
  <div id="app" data-server-rendered="true">${body}</div>

  <script>window.__INITIAL_STATE__=${initialState}<\/script>
  <script>
    (function() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('color-schema') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  <\/script>
  
</body>
</html>
`,
      htmlAttrs,
      headTags,
      body,
      bodyAttrs,
      initialState,
      dependencies
    }, response);
  };
};
function ssrRegisterHelper(comp, filename) {
  const setup2 = comp.setup;
  comp.setup = (props, ctx) => {
    const ssrContext = vue.useSSRContext();
    (ssrContext.modules || (ssrContext.modules = new Set())).add(filename);
    if (setup2) {
      return setup2(props, ctx);
    }
  };
}
const title$3 = "Meditando en el campo", date$2 = "2021-07-13 15:00 -03:00", image$2 = "/images/meditando-en-el-campo.jpg";
function MDXContent$4(props) {
  const _components = Object.assign({
    p: "p",
    a: "a"
  }, props.components), {
    wrapper: MDXLayout
  } = _components;
  const _content = vue.createVNode(vue.Fragment, null, [vue.createVNode(_components.p, null, {
    default: () => ["Estoy viviendo en el campo desde hace m\xE1s de un a\xF1o, a poca distancia de la ciudad de ", vue.createVNode(_components.a, {
      "href": "https://www.google.com/maps/place/80000+San+Jos%C3%A9,+Departamento+de+San+Jos%C3%A9/@-34.3401525,-56.7491658,13z"
    }, {
      default: () => ["San Jos\xE9 de Mayo"]
    }), ", donde desarroll\xE9 mi trabajo como psic\xF3loga durante m\xE1s de tres d\xE9cadas."]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["En esta nueva etapa ya no hay agenda, ni encuadre, ni planificaci\xF3n de actividades para el a\xF1o."]
  }), "\n", "\n", vue.createVNode(_components.p, null, {
    default: () => ["Siento una enorme gratitud\u2014me siguen acompa\xF1ando los afectos, los aprendizajes de vida y las historias que todos los a\xF1os de trabajo me entregaron."]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["Hoy son otras mis prioridades. Vivir cerca de la naturaleza y aprender sus ritmos."]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["Estos nuevos aprendizajes y experiencias son lo que compartir\xE9 en este espacio."]
  })]);
  return MDXLayout ? vue.createVNode(MDXLayout, props, _isSlot$4(_content) ? _content : {
    default: () => [_content]
  }) : _content;
}
function _isSlot$4(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const __default__$4 = vue.defineComponent({
  props: {
    components: {
      type: Object,
      default: () => ({})
    }
  },
  render() {
    return MDXContent$4(__spreadValues(__spreadValues({}, this.$props), this.$attrs));
  }
});
const __moduleId$2 = "src/pages/posts/meditando-en-el-campo.mdx";
ssrRegisterHelper(__default__$4, __moduleId$2);
var __glob_4_2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  title: title$3,
  date: date$2,
  image: image$2,
  "default": __default__$4
});
var _sfc_main$c = vue.defineComponent({
  name: "IleComponent",
  inheritAttrs: false,
  props: {
    component: { required: true },
    "client:idle": { type: Boolean, default: false },
    "client:load": { type: Boolean, default: false },
    "client:visible": { type: Boolean, default: false },
    "client:media": { type: String, default: "" },
    "client:only": { type: Boolean, default: false }
  },
  setup({ component }) {
    head.useHead({
      script: [
        { type: "module", "client-keep": "", children: `console.log('Should hydrate ${component.name}.')` }
      ]
    });
  },
  render() {
    const prerendered = vue.h(this.component, this.$attrs, this.$slots);
    return vue.h("ile-root", null, prerendered);
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/IleComponent.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const title$2 = "Meditaci\xF3n de la tangerina", date$1 = "2021-08-15 11:05 -03:00", recorded$1 = new Date(162864e7), category$1 = "practicas", image$1 = "/images/meditacion-de-la-tangerina.jpg", audio$1 = "/audio/meditacion-de-la-tangerina.mp3";
function MDXContent$3(props) {
  const _components = Object.assign({
    p: "p"
  }, props.components), {
    wrapper: MDXLayout
  } = _components;
  const _content = vue.createVNode(vue.Fragment, null, [vue.createVNode(_components.p, null, {
    default: () => ["Esta meditaci\xF3n la comparto para que los ni\xF1os la puedan realizar en familia o con el docente en su grupo escolar. Promueve la alimentaci\xF3n consciente y la conexi\xF3n con la naturaleza."]
  }), "\n", vue.createVNode(_sfc_main$c, {
    "component": props.components.AudioPlayer,
    "client:idle": true,
    "title": title$2,
    "url": audio$1,
    "recorded": recorded$1
  }, null)]);
  return MDXLayout ? vue.createVNode(MDXLayout, props, _isSlot$3(_content) ? _content : {
    default: () => [_content]
  }) : _content;
}
function _isSlot$3(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const __default__$3 = vue.defineComponent({
  props: {
    components: {
      type: Object,
      default: () => ({})
    }
  },
  render() {
    return MDXContent$3(__spreadValues(__spreadValues({}, this.$props), this.$attrs));
  }
});
const __moduleId$1 = "src/pages/posts/meditacion-de-la-tangerina.mdx";
ssrRegisterHelper(__default__$3, __moduleId$1);
var __glob_4_1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  title: title$2,
  date: date$1,
  recorded: recorded$1,
  category: category$1,
  image: image$1,
  audio: audio$1,
  "default": __default__$3
});
const title$1 = "Conexi\xF3n con la madre tierra", date = "2021-07-18 17:41 -03:00", recorded = new Date(15869088e5), category = "practicas", image = "/images/conexion-con-la-madre-tierra.jpg", audio = "/audio/conexion-con-la-madre-tierra.mp3";
function MDXContent$2(props) {
  const _components = Object.assign({
    p: "p"
  }, props.components), {
    wrapper: MDXLayout
  } = _components;
  const _content = vue.createVNode(vue.Fragment, null, [vue.createVNode(_components.p, null, {
    default: () => ["Esta visualizaci\xF3n la compart\xED cuando iban pasando los d\xEDas de aislamiento\nsocial y se volv\xEDa m\xE1s dif\xEDcil mantener la quietud y la calma."]
  }), "\n", vue.createVNode(_sfc_main$c, {
    "component": props.components.AudioPlayer,
    "client:idle": true,
    "title": title$1,
    "url": audio,
    "recorded": recorded
  }, null)]);
  return MDXLayout ? vue.createVNode(MDXLayout, props, _isSlot$2(_content) ? _content : {
    default: () => [_content]
  }) : _content;
}
function _isSlot$2(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const __default__$2 = vue.defineComponent({
  props: {
    components: {
      type: Object,
      default: () => ({})
    }
  },
  render() {
    return MDXContent$2(__spreadValues(__spreadValues({}, this.$props), this.$attrs));
  }
});
const __moduleId = "src/pages/posts/conexion-con-la-madre-tierra.mdx";
ssrRegisterHelper(__default__$2, __moduleId);
var __glob_4_0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  title: title$1,
  date,
  recorded,
  category,
  image,
  audio,
  "default": __default__$2
});
const routes$1 = [{ "name": "posts", "path": "/posts", "component": () => Promise.resolve().then(function() {
  return index;
}), "props": true, "meta": { "layout": "home" } }, { "name": "posts-meditando-en-el-campo", "path": "/posts/meditando-en-el-campo", "component": __default__$4, "props": true }, { "name": "posts-meditacion-de-la-tangerina", "path": "/posts/meditacion-de-la-tangerina", "component": __default__$3, "props": true }, { "name": "posts-conexion-con-la-madre-tierra", "path": "/posts/conexion-con-la-madre-tierra", "component": __default__$2, "props": true }, { "name": "index", "path": "/", "component": () => Promise.resolve().then(function() {
  return index$1;
}), "props": true, "meta": { "layout": "home" } }, { "name": "about", "path": "/about", "component": () => Promise.resolve().then(function() {
  return about;
}), "props": true }, { "name": "README", "path": "/readme", "component": () => Promise.resolve().then(function() {
  return README;
}), "props": true }, { "name": "all", "path": "/:all(.*)*", "component": () => Promise.resolve().then(function() {
  return ____all_;
}), "props": true, "meta": { "layout": 404 } }];
const _hoisted_1$3 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24"
};
const _hoisted_2$3 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93a9.93 9.93 0 0 0 7.07-2.929a10.007 10.007 0 0 0 2.583-4.491a1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343a7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483a10.027 10.027 0 0 0 2.89 7.848a9.972 9.972 0 0 0 7.848 2.891a8.036 8.036 0 0 1-1.484 2.059z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3$3 = [
  _hoisted_2$3
];
function render$3(_ctx, _cache) {
  return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$3, _hoisted_3$3);
}
var __vite_components_0$1 = { name: "bx-bx-moon", render: render$3 };
const _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24"
};
const _hoisted_2$2 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993S6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007S8.993 13.658 8.993 12S10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122l1.415 1.414l-2.12 2.122zM16.24 6.344l2.122-2.122l1.414 1.414l-2.122 2.122zM6.342 7.759L4.22 5.637l1.415-1.414l2.12 2.122zm13.434 10.605l-1.414 1.414l-2.122-2.122l1.414-1.414z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3$2 = [
  _hoisted_2$2
];
function render$2(_ctx, _cache) {
  return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, _hoisted_3$2);
}
var __vite_components_1$1 = { name: "bx-bx-sun", render: render$2 };
const __default__$1 = { name: "DarkSwitch" };
function setup$1(__props) {
  const isDark = core.useDark();
  core.useToggle(isDark);
  return (_ctx, _push, _parent, _attrs) => {
    const _component_bx58bx_moon = __vite_components_0$1;
    const _component_bx58bx_sun = __vite_components_1$1;
    _push(`<nav${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "text-xl space-x-2 absolute right-8 top-8" }, _attrs))} data-v-51988034><button class="icon-btn" title="Toggle Dark" data-v-51988034>`);
    if (vue.unref(isDark)) {
      _push(serverRenderer.ssrRenderComponent(_component_bx58bx_moon, null, null, _parent));
    } else {
      _push(serverRenderer.ssrRenderComponent(_component_bx58bx_sun, null, null, _parent));
    }
    _push(`</button></nav>`);
  };
}
var _sfc_main$b = vue.defineComponent(__spreadProps(__spreadValues({}, __default__$1), {
  __ssrInlineRender: true,
  setup: setup$1
}));
;
var DarkSwitch_vue_vue_type_style_index_0_scoped_true_lang = ".icon-btn[data-v-51988034] {\n  --tw-bg-opacity: 1;\n  background-color: rgba(245, 245, 244, var(--tw-bg-opacity));\n  border-radius: 0.5rem;\n  cursor: pointer;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: -webkit-inline-flex;\n  display: inline-flex;\n  font-size: 1.05rem;\n  line-height: 1;\n  overflow: hidden;\n  padding: 0.5rem;\n  color: var(--c-text);\n}\n.icon-btn[data-v-51988034]:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgba(231, 229, 228, var(--tw-bg-opacity));\n}\n.dark .icon-btn[data-v-51988034] {\n  --tw-bg-opacity: 1;\n  background-color: rgba(34, 34, 34, var(--tw-bg-opacity));\n}\n.dark .icon-btn[data-v-51988034]:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgba(45, 45, 45, var(--tw-bg-opacity));\n}\n.icon-btn[data-v-51988034]:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.slide-enter-active[data-v-51988034], .slide-leave-active[data-v-51988034] {\n  transition: transform 0.15s ease;\n}\n.slide-enter-from[data-v-51988034] {\n  transform: translateY(-100%);\n}\n.slide-enter-to[data-v-51988034], .slide-leave-from[data-v-51988034] {\n  transform: translateY(0);\n}\n.slide-leave-to[data-v-51988034] {\n  transform: translateY(100%);\n}";
_sfc_main$b.__scopeId = "data-v-51988034";
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/DarkSwitch.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
var _sfc_main$a = vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    let title2 = vue.ref("");
    async function onRouteChange(route) {
      console.log({ route });
      const component = await route.component;
      console.log({ component });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IleComponent = _sfc_main$c;
      const _component_router_view = vue.resolveComponent("router-view");
      _push(`<main${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "px-4 py-10 w-max-65ch mx-auto" }, _attrs))}>`);
      _push(serverRenderer.ssrRenderComponent(_component_IleComponent, {
        component: _ctx.__vite_components_1,
        "client:idle": ""
      }, null, _parent));
      _push(serverRenderer.ssrRenderComponent(_component_router_view, null, {
        default: vue.withCtx(({ Component, route }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<article${serverRenderer.ssrRenderAttrs(_attrs)}${_scopeId}>${serverRenderer.ssrInterpolate(onRouteChange(route))} <h1 class="text-3xl font-extrabold mb-8"${_scopeId}>${serverRenderer.ssrInterpolate(title2.value)}</h1>`);
            serverRenderer.ssrRenderVNode(_push2, vue.createVNode(vue.resolveDynamicComponent(Component), {
              key: route.meta.usePathKey ? route.path : void 0
            }, null), _parent2, _scopeId);
            _push2(`</article>`);
          } else {
            return [
              vue.createVNode(vue.Transition, {
                name: route.meta.transition || "fade",
                mode: "out-in"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode("article", null, [
                    vue.createTextVNode(vue.toDisplayString(onRouteChange(route)) + " ", 1),
                    vue.createVNode("h1", { class: "text-3xl font-extrabold mb-8" }, vue.toDisplayString(title2.value), 1),
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
                      key: route.meta.usePathKey ? route.path : void 0
                    }))
                  ])
                ]),
                _: 2
              }, 1032, ["name"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/default.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const layouts = {
  "404": () => Promise.resolve().then(function() {
    return _404;
  }),
  "default": _sfc_main$a,
  "home": () => Promise.resolve().then(function() {
    return home;
  })
};
function setupLayouts(routes2) {
  return routes2.map((route) => {
    var _a;
    return {
      path: route.path,
      component: layouts[((_a = route.meta) == null ? void 0 : _a.layout) || "default"],
      children: [route]
    };
  });
}
var _sfc_main$9 = vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    const title2 = "\xEEles";
    const description = "Static Site Generator with Islands Architecture";
    head.useHead({
      title: title2,
      meta: [
        { name: "description", content: description },
        { name: "description", content: description },
        { property: "og:title", content: title2 },
        {
          property: "og:image",
          content: "https://repository-images.githubusercontent.com/341177866/d42c1300-7633-11eb-84fd-ec68894d4fc9"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = vue.resolveComponent("router-view");
      _push(serverRenderer.ssrRenderComponent(_component_router_view, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/App.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const routes = setupLayouts(routes$1);
var main = viteSSR(_sfc_main$9, {
  routes
}, async (ctx) => {
  Object.values({ "./modules/nprogress.ts": __glob_7_0 }).map((i) => {
    var _a;
    return (_a = i.install) == null ? void 0 : _a.call(i, ctx);
  });
  const { app } = ctx;
  const router = ctx.router;
  const head$1 = head.createHead();
  app.use(head$1);
  app.component(ClientOnly.name, ClientOnly);
  router.beforeEach(async (to, from, next) => {
    if (!!to.meta.state && true) {
      return next();
    }
    next();
  });
  return { head: head$1 };
});
function formatSecondsAsMinutes(secondsDuration) {
  if (!isFinite(secondsDuration))
    return "     ";
  secondsDuration = Math.round(secondsDuration);
  const minutes = Math.floor(secondsDuration / 60);
  const seconds = secondsDuration % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
function formatDate(date2) {
  return new Intl.DateTimeFormat("es-UY", {
    year: "numeric",
    month: "long"
  }).format(date2);
}
var _sfc_main$8 = vue.defineComponent({
  __ssrInlineRender: true,
  props: {
    duration: { type: Number, required: true },
    currentTime: { type: Number, required: true }
  },
  emits: ["seekBar:timeChanged"],
  setup(__props, { emit }) {
    const props = __props;
    vue.useCssVars((_ctx) => ({
      "4ebcdfa1": fractionElapsed.value,
      "399cd6e4": seekBarWidth.value
    }));
    let totalDuration = vue.computed(() => formatSecondsAsMinutes(props.duration));
    let draggingTime = vue.ref();
    let isDragging = vue.computed(() => draggingTime.value !== void 0);
    let seekingTime = vue.computed(() => isDragging.value ? draggingTime.value : props.currentTime);
    let fractionElapsed = vue.computed(() => props.duration === 0 || !isFinite(props.duration) ? 0 : seekingTime.value / props.duration);
    let initialMouseX = vue.ref(void 0);
    let initialFraction = vue.ref(0);
    let seekBarWidth = vue.ref(NaN);
    let seekBar = vue.ref(void 0);
    vue.ref(void 0);
    core.useResizeObserver(seekBar, (entries) => {
      seekBarWidth.value = entries[0].contentRect.width;
    });
    vue.onBeforeUnmount(onTouchEnd);
    function onScroll() {
      draggingTime.value = void 0;
      onTouchEnd();
    }
    function onMouseMove({ screenX }) {
      if (!isDragging.value || initialMouseX.value === void 0)
        return;
      const diffX = screenX - initialMouseX.value;
      setCurrentFraction(diffX / seekBarWidth.value + initialFraction.value);
    }
    function onTouchEnd() {
      if (isFinite(draggingTime.value))
        emit("seekBar:timeChanged", draggingTime.value);
      draggingTime.value = void 0;
      document.removeEventListener("mouseup", onTouchEnd);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    }
    function clamp(num, max) {
      return Math.min(Math.max(0, num), max);
    }
    function setCurrentFraction(fraction) {
      const time = clamp(fraction * props.duration, props.duration);
      if (isFinite(time))
        draggingTime.value = time;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "4ebcdfa1": fractionElapsed.value,
        "399cd6e4": seekBarWidth.value
      } };
      _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "flex flex-auto items-center select-none" }, _attrs, _cssVars))} data-v-07506942><span class="duration mr-4" data-v-07506942>${serverRenderer.ssrInterpolate(vue.unref(formatSecondsAsMinutes)(seekingTime.value))}</span><div class="seek-bar-wrapper w-full group cursor-pointer" data-v-07506942><div class="seek-bar-line bg-subtle dark:bg-shallow w-full rounded-lg" data-v-07506942><div class="seek-bar-progress bg-primary dark:bg-primary-deep w-full h-full transform rounded-lg" data-v-07506942></div></div><div class="${serverRenderer.ssrRenderClass([{ "!block": isDragging.value }, "seek-bar-indicator bg-primary rounded-full h-3 w-3 -ml-1.5 dark:bg-deeper transform hidden group-hover:block"])}" data-v-07506942></div><div class="seek-bar-touch w-full h-full z-1" data-v-07506942></div></div><span class="duration ml-4" data-v-07506942>${serverRenderer.ssrInterpolate(totalDuration.value)}</span></div>`);
    };
  }
});
;
var SeekBar_vue_vue_type_style_index_0_scoped_true_lang = '.seek-bar-wrapper[data-v-07506942] {\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  z-index: 1;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: 1fr;\n  height: 40px;\n}\n.seek-bar-line[data-v-07506942] {\n  height: 6px;\n  overflow: hidden;\n  grid-area: 1/1;\n}\n.seek-bar-touch[data-v-07506942]:active {\n  cursor: grabbing;\n}\n.seek-bar-touch[data-v-07506942] {\n  grid-area: 1/1;\n}\n.seek-bar-progress[data-v-07506942] {\n  --tw-translate-x: calc(var(--4ebcdfa1) * 100% - 100%);\n}\n.seek-bar-indicator[data-v-07506942] {\n  --tw-translate-x: calc(var(--4ebcdfa1) * var(--399cd6e4) * 1px);\n  grid-area: 1/1;\n}\n.duration[data-v-07506942] {\n  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: var(--fg-deep);\n  white-space: pre;\n}';
_sfc_main$8.__scopeId = "data-v-07506942";
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/SeekBar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var _sfc_main$7 = vue.defineComponent({
  __ssrInlineRender: true,
  props: {
    isPlaying: { type: Boolean, required: true }
  },
  setup(__props) {
    const props = __props;
    const label = vue.computed(() => props.isPlaying ? "Pausar" : "Reproducir");
    const animateRef = vue.ref(null);
    const begin = vue.ref("indefinite");
    const play = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
    const pause = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
    vue.watch(() => props.isPlaying, (isPlaying) => {
      var _a;
      begin.value = "0s";
      (_a = animateRef.value) == null ? void 0 : _a.beginElement();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${serverRenderer.ssrRenderAttrs(vue.mergeProps({
        class: "play-button bg-primary text-white rounded-full grid place-items-center transform transition-transform transition-bg",
        "aria-live": "assertive",
        "aria-label": vue.unref(label)
      }, _attrs))} data-v-57460bb0><svg class="${serverRenderer.ssrRenderClass([{ "pl-2px": !__props.isPlaying }, "fill-current h-2/3 transition-all"])}" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-v-57460bb0><path${serverRenderer.ssrRenderAttr("d", play)} data-v-57460bb0><animate${serverRenderer.ssrRenderAttr("begin", begin.value)} attributeType="XML" attributeName="d" fill="freeze"${serverRenderer.ssrRenderAttr("from", __props.isPlaying ? play : pause)}${serverRenderer.ssrRenderAttr("to", __props.isPlaying ? pause : play)} dur="0.2s" keySplines=".4 0 1 1" repeatCount="1" data-v-57460bb0></animate></path></svg></button>`);
    };
  }
});
;
var PlayButton_vue_vue_type_style_index_0_scoped_true_lang = ".play-button[data-v-57460bb0] {\n  opacity: 0.85;\n  -webkit-transition-duration: 400ms;\n  -o-transition-duration: 400ms;\n  transition-duration: 400ms;\n  outline: none !important;\n}\n.play-button[data-v-57460bb0]:hover, .play-button[data-v-57460bb0]:focus {\n  opacity: 1;\n  --tw-scale-x: 1.1;\n  --tw-scale-y: 1.1;\n  --tw-scale-z: 1.1;\n}";
_sfc_main$7.__scopeId = "data-v-57460bb0";
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/PlayButton.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
let currentPlayer;
function pauseWhenOtherPlays(player) {
  vue.watch(player.isPlaying, (playing) => {
    if (playing && currentPlayer !== player) {
      currentPlayer == null ? void 0 : currentPlayer.pauseAudio();
      currentPlayer = player;
    }
  });
  vue.onUnmounted(() => {
    if (currentPlayer === player)
      currentPlayer = void 0;
  });
}
var _sfc_main$6 = vue.defineComponent({
  __ssrInlineRender: true,
  props: {
    src: { type: String, required: true }
  },
  emits: ["audio:error"],
  setup(__props, { emit }) {
    let currentTime = vue.ref(0);
    let duration = vue.ref(NaN);
    let status = vue.ref("stopped");
    let isPlaying = vue.computed(() => status.value === "playing");
    let audioRef = vue.ref(void 0);
    function pauseAudio() {
      var _a;
      (_a = audioRef.value) == null ? void 0 : _a.pause();
    }
    pauseWhenOtherPlays({ isPlaying, pauseAudio });
    let el = vue.ref();
    let isVisible = vue.ref(false);
    const observer = core.useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (!isIntersecting)
        return;
      isVisible.value = isIntersecting;
      observer.stop();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SeekBar = _sfc_main$8;
      const _component_PlayButton = _sfc_main$7;
      _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({
        ref: el,
        class: "flex items-center whitespace-nowrap"
      }, _attrs))}>`);
      _push(serverRenderer.ssrRenderComponent(_component_SeekBar, {
        duration: duration.value,
        currentTime: currentTime.value
      }, null, _parent));
      _push(`<span class="ml-4">`);
      _push(serverRenderer.ssrRenderComponent(_component_PlayButton, {
        class: "w-12 h-12",
        isPlaying: isPlaying.value
      }, null, _parent));
      _push(`</span>`);
      if (isVisible.value) {
        _push(`<audio class="hidden"${serverRenderer.ssrRenderAttr("src", __props.src)} preload="metadata"></audio>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Audio.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 24 24"
};
const _hoisted_2$1 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M12 16l4-5h-3V4h-2v7H8z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3$1 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z",
  fill: "currentColor"
}, null, -1);
const _hoisted_4$1 = [
  _hoisted_2$1,
  _hoisted_3$1
];
function render$1(_ctx, _cache) {
  return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$1, _hoisted_4$1);
}
var __vite_components_1 = { name: "bx-bx-download", render: render$1 };
const __default__ = { name: "AudioPlayer" };
function setup(__props) {
  let errorMessage = vue.ref("");
  return (_ctx, _push, _parent, _attrs) => {
    const _component_Audio = _sfc_main$6;
    const _component_bx58bx_download = __vite_components_1;
    _push(`<div${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "audio-player" }, _attrs))}>`);
    if (!errorMessage.value) {
      _push(serverRenderer.ssrRenderComponent(_component_Audio, { src: __props.url }, null, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="flex flex-col md:items-center mt-2">`);
    if (errorMessage.value) {
      _push(`<div class="text-pink-500 mt-2 mb-4">${serverRenderer.ssrInterpolate(errorMessage.value)}</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<a class="flex items-center opacity-75 hover:opacity-100 select-none !no-underline"${serverRenderer.ssrRenderAttr("href", __props.url)}${serverRenderer.ssrRenderAttr("download", `${__props.title}.mp3`)}>`);
    _push(serverRenderer.ssrRenderComponent(_component_bx58bx_download, { class: "inline mr-2" }, null, _parent));
    _push(` Descarga esta pr\xE1ctica </a><p class="opacity-75 text-sm"> Grabada en ${serverRenderer.ssrInterpolate(vue.unref(formatDate)(__props.recorded))}. </p></div></div>`);
  };
}
var _sfc_main$5 = vue.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  __ssrInlineRender: true,
  props: {
    url: { type: String, required: true },
    title: { type: String, required: true },
    recorded: { type: null, required: true }
  },
  setup
}));
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/AudioPlayer.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var _sfc_main$4 = vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    const posts = { "./posts/conexion-con-la-madre-tierra.mdx": __glob_4_0, "./posts/meditacion-de-la-tangerina.mdx": __glob_4_1, "./posts/meditando-en-el-campo.mdx": __glob_4_2 };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><h1 class="font-extrabold text-5xl mb-16">Posts</h1><ul><!--[-->`);
      serverRenderer.ssrRenderList(vue.unref(posts), (post, file) => {
        _push(`<li class="mb-8"><h2 class="text-2xl font-bold tracking-tight mb-4"><a${serverRenderer.ssrRenderAttr("href", file.slice(1, file.length).replace(".mdx", ""))}>${serverRenderer.ssrInterpolate(post.title)}</a></h2><article class="prose">`);
        serverRenderer.ssrRenderVNode(_push, vue.createVNode(vue.resolveDynamicComponent(post.default), {
          components: { AudioPlayer: _sfc_main$5 }
        }, null), _parent);
        _push(`</article></li>`);
      });
      _push(`<!--]--></ul><!--]-->`);
    };
  }
});
var block0$2 = {};
if (typeof block0$2 === "function")
  block0$2(_sfc_main$4);
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$4
});
var block0$1 = {};
const _sfc_main$3 = _sfc_main$4;
if (typeof block0$1 === "function")
  block0$1(_sfc_main$3);
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/posts/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$3
});
function _isSlot$1(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const title = "About";
function MDXContent$1(props) {
  const _components = Object.assign({
    p: "p",
    a: "a",
    strong: "strong",
    pre: "pre",
    code: "code"
  }, props.components), {
    wrapper: MDXLayout
  } = _components;
  const _content = vue.createVNode(vue.Fragment, null, [vue.createVNode(_components.p, null, {
    default: () => [vue.createVNode(_components.a, {
      "href": "https://github.com/frandiox/vitesse-ssr-template"
    }, {
      default: () => ["Vitesse SSR"]
    }), " is an opinionated ", vue.createVNode(_components.a, {
      "href": "https://github.com/vitejs/vite"
    }, {
      default: () => ["Vite"]
    }), " starter template made by ", vue.createVNode(_components.a, {
      "href": "https://github.com/antfu"
    }, {
      default: () => ["@antfu"]
    }), " and ", vue.createVNode(_components.a, {
      "href": "https://github.com/frandiox"
    }, {
      default: () => ["@frandiox"]
    }), " for mocking apps swiftly. With ", vue.createVNode(_components.strong, null, {
      default: () => ["file-based routing"]
    }), ", ", vue.createVNode(_components.strong, null, {
      default: () => ["components auto importing"]
    }), ", ", vue.createVNode(_components.strong, null, {
      default: () => ["markdown support"]
    }), ", I18n, PWA and uses ", vue.createVNode(_components.strong, null, {
      default: () => ["Tailwind"]
    }), " v2 for UI. The SSR capability is added via ", vue.createVNode(_components.a, {
      "href": "https://github.com/frandiox/vite-ssr"
    }, {
      default: () => ["Vite SSR"]
    }), "."]
  }), "\n", vue.createVNode(_components.pre, null, {
    default: () => [vue.createVNode(_components.code, {
      "className": "language-js"
    }, {
      default: () => ["// syntax highlighting example\nfunction vitesse() {\n  const foo = 'bar'\n  console.log(foo)\n}\n"]
    })]
  })]);
  return MDXLayout ? vue.createVNode(MDXLayout, props, _isSlot$1(_content) ? _content : {
    default: () => [_content]
  }) : _content;
}
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  title,
  "default": MDXContent$1
});
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
function MDXContent(props) {
  const _components = Object.assign({
    h2: "h2",
    p: "p",
    a: "a",
    code: "code",
    h3: "h3",
    pre: "pre"
  }, props.components), {
    wrapper: MDXLayout
  } = _components;
  const _content = vue.createVNode(vue.Fragment, null, [vue.createVNode(_components.h2, null, {
    default: () => ["File-based Routing"]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["Routes will auto-generated for Vue files in this dir with the same file structure.\nCheck out ", vue.createVNode(_components.a, {
      "href": "https://github.com/hannoeru/vite-plugin-pages"
    }, {
      default: () => [vue.createVNode(_components.code, null, {
        default: () => ["vite-plugin-pages"]
      })]
    }), " for more details."]
  }), "\n", vue.createVNode(_components.h3, null, {
    default: () => ["Path Aliasing"]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => [vue.createVNode(_components.code, null, {
      default: () => ["~/"]
    }), " is aliased to ", vue.createVNode(_components.code, null, {
      default: () => ["./src/"]
    }), " folder."]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["For example, instead of having"]
  }), "\n", vue.createVNode(_components.pre, null, {
    default: () => [vue.createVNode(_components.code, {
      "className": "language-ts"
    }, {
      default: () => ["import utils from '../../../../utils'\n"]
    })]
  }), "\n", vue.createVNode(_components.p, null, {
    default: () => ["now you can use"]
  }), "\n", vue.createVNode(_components.pre, null, {
    default: () => [vue.createVNode(_components.code, {
      "className": "language-ts"
    }, {
      default: () => ["import utils from '~/utils'\n"]
    })]
  })]);
  return MDXLayout ? vue.createVNode(MDXLayout, props, _isSlot(_content) ? _content : {
    default: () => [_content]
  }) : _content;
}
var README = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": MDXContent
});
var block0 = {};
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${serverRenderer.ssrRenderAttrs(_attrs)}> Not Found </div>`);
}
if (typeof block0 === "function")
  block0(_sfc_main$2);
_sfc_main$2.ssrRender = _sfc_ssrRender$1;
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/[...all].vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ____all_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$2
});
const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 32 32"
};
const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M15 8h2v11h-2z",
  fill: "currentColor"
}, null, -1);
const _hoisted_4 = /* @__PURE__ */ vue.createElementVNode("path", {
  d: "M16 22a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22z",
  fill: "currentColor"
}, null, -1);
const _hoisted_5 = [
  _hoisted_2,
  _hoisted_3,
  _hoisted_4
];
function render(_ctx, _cache) {
  return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1, _hoisted_5);
}
var __vite_components_0 = { name: "carbon-warning", render };
var _sfc_main$1 = vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    vueRouter.useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_carbon_warning = __vite_components_0;
      const _component_router_view = vue.resolveComponent("router-view");
      _push(`<main${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "px-4 py-10 text-center text-teal-700 dark:text-gray-200" }, _attrs))}><div><p class="text-4xl">`);
      _push(serverRenderer.ssrRenderComponent(_component_carbon_warning, { class: "inline-block" }, null, _parent));
      _push(`</p></div>`);
      _push(serverRenderer.ssrRenderComponent(_component_router_view, _ctx.$attrs, null, _parent));
      _push(`<div><button class="btn m-3 text-sm mt-8"> Go Back </button></div></main>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/404.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var _404 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$1
});
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_IleComponent = _sfc_main$c;
  const _component_router_view = vue.resolveComponent("router-view");
  _push(`<main${serverRenderer.ssrRenderAttrs(vue.mergeProps({ class: "px-4 py-10 w-max-65ch mx-auto" }, _attrs))}>`);
  _push(serverRenderer.ssrRenderComponent(_component_IleComponent, {
    component: _sfc_main$b,
    "client:idle": ""
  }, null, _parent));
  _push(serverRenderer.ssrRenderComponent(_component_router_view, _ctx.$attrs, null, _parent));
  _push(`</main>`);
}
_sfc_main.ssrRender = _sfc_ssrRender;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var home = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main
});
exports["default"] = main;
