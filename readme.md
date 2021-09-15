# js-gallery-slider

> 😎 JS gallery slider

## Live demo

- [Demo](https://alexanderguminskii.github.io/js-gallery-slider/)

## Install dependencies
```bash
npm install
```

## Run project
```bash
gulp
```

## Usage

```jsx
<div class="gallery">
  <div class="gallery-preview">
    <div class="gallery-preview__inner">
      <div class="gallery-preview__item">
        <img src="./img/1.jpg" alt="">
      </div>
    </div>
  </div>
  <div class="gallery-nav">
    <div id="arrow-left" class="gallery-nav__arrow">
      <svg><use href="#arrow"></use></svg>
    </div>
    <div class="gallery-nav__slider">
      <div class="gallery-nav__slider-inner">
        <!-- js will create elements here -->
      </div>
    </div>
    <div id="arrow-right" class="gallery-nav__arrow">
      <svg><use href="#arrow"></use></svg>
    </div>
  </div>
  </div>

  <div class="galleryModal">
    <!-- js will generate content here -->
  </div>
```