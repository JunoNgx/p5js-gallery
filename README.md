# P5js Creative Coding Gallery

A collection of creative coding works made with [p5js](https://p5js.org/).

## Creative codings?

From [Wikipedia](https://en.wikipedia.org/wiki/Creative_coding):

> Creative coding is a type of computer programming in which the goal is to create something expressive instead of something functional.

In other words, this is a strictly recreational project I pursue entirely for personal enjoyment and expression. Most of the work here are created with [p5js](https://p5js.org/), a Javascript library tailored for this purpose. The remaining few (which are all indicated) uses [vanilla canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Deployment

This project is deployed via GitHub Page at https://junongx.github.io/p5js-gallery/, which also contains an index of my works.
## Structure

This project is setup with [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) and [p5-types](https://github.com/p5-types/p5.ts) for type checking and `light-server` for local deployment.

The works included in this project are stored in the folder `docs` to facilitate the use of GitHub Page. Each project is separated in a sub-folder, though they share the use of the library files in `/docs`.

## How to run

1. Clone the repository
2. Change directory to the repository `cd p5js-gallery`
3. Setup `npm install`
4. Run the `light-server` with the script `npm run watch_js` or `npm run watch_html`
5. Open `http://localhost:4000/` with a web browser