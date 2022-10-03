export default class Slider {
  constructor({
    page = null,
    btns = null,
    next = null,
    prev = null,
    activeClass = "",
    animate,
    autoplay,
  } = {}) {
    this.page = document.querySelector(page);
    try {
      this.slides = this.page.children;
    } catch (error) {}
    this.btns = document.querySelectorAll(btns);
    this.prev = document.querySelector(prev);
    this.next = document.querySelector(next);
    this.activeClass = activeClass;
    this.animate = animate;
    this.autoplay = autoplay;
    this.slideIndex = 1;
  }
}
