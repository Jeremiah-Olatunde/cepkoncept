# COMPONENTS

The Cepkoncept webpage is broken up into sections. Each section has a corresponding folder in the components directory refered to as ***section name*** component.

Each component folder contains an index.html, index.ts and index.scss file: 

- The index.html file of the component must be included in the global index.html file in the [./src]() directory using [posthtml modules](https://github.com/posthtml/posthtml-modules) syntax.

- The index.ts and index.scss files are imported into the global index.ts and scss files in the [./src]() directory and bundled into one JS and CSS file by [parcel](https://parceljs.org/)

- As a convention each index.scss file must only style elements in it's corresponding components index.html file. SCSS nesting and class names should be used to accomplish this.

- The components folder may also contain a scripts and styles directory to store functionality only used by the component

- *TODO: Consideration of composable components*

*./index.html*
```html
<nav class="navbar">
  <a>home</a>
  <a>about</a>
  <a>contact</a>
</nav>
```


*./index.scss*
```scss
.navbar {
  width: 100%;
  background: lightsteelblue;
  a {
    color: white;
  }
}
```

*./index.ts*
```typescript
const html = document.querySelector(".navbar").innerHTML;
console.log(html);
export {}
```