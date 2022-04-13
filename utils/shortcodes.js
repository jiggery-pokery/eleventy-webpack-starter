const fs = require('fs');
const path = require('path');
const { outdent } = require('outdent');
const Image = require('@11ty/eleventy-img');
const markdown = require('./markdown');

const iconDefaultSize = 24;
const defaultSizes = '90vw';
const defaultImagesSizes = [null]; // [1920, 1280, 640, 320];

const isFullUrl = (url) => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

const manifestPath = path.resolve(__dirname, '../_site/assets/manifest.json');

module.exports = {
  // Allow embedding markdown in `.njk` files
  // {% markdown %}
  // # Heading
  // {% endmarkdown %}
  markdown: (content) => markdown.render(outdent.string(content)),

  // Allow embedding webpack assets pulled out from `manifest.json`
  // {% webpack "main.css" %}
  webpack: async (name) =>
    new Promise((resolve) => {
      fs.readFile(manifestPath, { encoding: 'utf8' }, (err, data) =>
        resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
      );
    }),

  // Allow embedding svg icon
  // {% icon "github.svg", "my-class", [24, 24] %}
  icon: (name, className, size = iconDefaultSize) => {
    if (!Array.isArray(size)) size = [size];
    return outdent({ newline: '' })`
    <svg class="icon icon--${name} ${
      className || ''
    }" role="img" aria-hidden="true" width="${size[0]}" height="${
      size[1] || size[0]
    }">
      <use xlink:href="/assets/images/sprite.svg#${name}"></use>
    </svg>`;
  },

  // Only returns img tag
  // Allow embedding responsive images
  // {% img "image.jpeg", "Image alt", "Image title", "my-class" %}
  // {% img [100,100], "image.jpeg", "Image alt", "Image title", "my-class" %}
  img: async (...args) => {
    let explicitWidth, explicitHeight;

    if (Array.isArray(args[0])) {
      [explicitWidth, explicitHeight] = args.shift();
    }

    const src = args[0];
    const alt = args[1];
    const title = args[2];
    const className = args[3];
    const lazy = args[4] ?? false;
    const sizes = args[5] ?? defaultSizes;

    const extension = path.extname(src).slice(1).toLowerCase();
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

    let stats;
    try {
      stats = await Image(fullSrc, {
        widths: defaultImagesSizes,
        formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
        urlPath: '/assets/images/',
        outputDir: '_site/assets/images/',
        filenameFormat: function (id, src, width, format, options) {
          // id: hash of the original image
          // src: original image path
          // width: current width in px
          // format: current file format
          // options: set of options passed to the Image call
      
          const extension = path.extname(src);
          const name = path.basename(src, extension);

          //return `${name}-${width}w.${format}`;
          return `${name}.${format}`;
        },
        dryRun: false
      });
    } catch (e) {
      console.log('\n\x1b[31mERROR\x1b[0m creating image:');
      console.log(`> (${fullSrc})`);
      console.log(`  ${e}\n`);
      return '';
    }

    const fallback = stats[extension].reverse()[0];
    const picture = outdent({ newline: '' })`
      <img
       class="${className ? `img-${className}` : ''}"
       loading="${lazy ? 'lazy' : 'eager'}"
       src="${fallback.url}"
       ${explicitWidth ? `width="${explicitWidth}"` : ''}
       ${explicitHeight ? `height="${explicitHeight}"` : ''} alt="${alt}">`;
    
    return picture;
  },

  // Returns Picture tag
  // Allow embedding responsive images
  // {% img "image.jpeg", "Image alt", "Image title", "my-class" %}
  // {% img [100,100], "image.jpeg", "Image alt", "Image title", "my-class" %}
  imagep: async (...args) => {
    let explicitWidth, explicitHeight;

    if (Array.isArray(args[0])) {
      [explicitWidth, explicitHeight] = args.shift();
    }

    const src = args[0];
    const alt = args[1];
    const title = args[2];
    const className = args[3];
    const lazy = args[4] ?? false;
    const sizes = args[5] ?? defaultSizes;

    const extension = path.extname(src).slice(1).toLowerCase();
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

    let stats;
    try {
      stats = await Image(fullSrc, {
        widths: defaultImagesSizes,
        formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
        urlPath: '/assets/images/',
        outputDir: '_site/assets/images/',
        filenameFormat: function (id, src, width, format, options) {
          // id: hash of the original image
          // src: original image path
          // width: current width in px
          // format: current file format
          // options: set of options passed to the Image call
      
          const extension = path.extname(src);
          const name = path.basename(src, extension);

          //return `${name}-${width}w.${format}`;
          return `${name}.${format}`;
        },
        dryRun: false
      });
    } catch (e) {
      console.log('\n\x1b[31mERROR\x1b[0m creating image:');
      console.log(`> (${fullSrc})`);
      console.log(`  ${e}\n`);
      return '';
    }

    const fallback = stats[extension].reverse()[0];
    const picture = outdent({ newline: '' })`
    <picture>
      ${Object.values(stats)
        .map(
          (image) =>
            `<source type="image/${image[0].format}" srcset="${image
              .map((entry) => `${entry.url}`)
              .join(', ')}">`
        )
        .join('')}
      <img
        class="${className ? `img-${className}` : ''}"
        loading="${lazy ? 'lazy' : 'eager'}"
        src="${fallback.url}"
        ${explicitWidth ? `width="${explicitWidth}"` : ''}
        ${explicitHeight ? `height="${explicitHeight}"` : ''}
        alt="${alt}">
    </picture>`;
    
    return title
      ? outdent({ newline: '' })`
      <figure class="${className ? `fig-${className}` : ''}">
        ${picture}
        <figcaption>${markdown.renderInline(title)}</figcaption>
      </figure>`
      : picture;
  },

  // Full with various sizes defined in defaultImagesSizes
  // Allow embedding responsive images
  // {% img "image.jpeg", "Image alt", "Image title", "my-class" %}
  // {% img [100,100], "image.jpeg", "Image alt", "Image title", "my-class" %}
  imagef: async (...args) => {
    let fallbackWidth, fallbackHeight;

    if (Array.isArray(args[0])) {
      [fallbackWidth, fallbackHeight] = args.shift();
    }

    const src = args[0];
    const alt = args[1];
    const title = args[2];
    const className = args[3];
    const lazy = args[4] ?? true;
    const sizes = args[5] ?? defaultSizes;

    const extension = path.extname(src).slice(1).toLowerCase();
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

    let stats;
    try {
      stats = await Image(fullSrc, {
        widths: defaultImagesSizes,
        formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
        urlPath: '/assets/images/',
        outputDir: '_site/assets/images/',
        filenameFormat: function (id, src, width, format, options) {
          // id: hash of the original image
          // src: original image path
          // width: current width in px
          // format: current file format
          // options: set of options passed to the Image call
      
          const extension = path.extname(src);
          const name = path.basename(src, extension);

          //return `${name}-${width}w.${format}`;
          return `${name}.${format}`;
        },
        dryRun: false
      });
    } catch (e) {
      console.log('\n\x1b[31mERROR\x1b[0m creating image:');
      console.log(`> (${fullSrc})`);
      console.log(`  ${e}\n`);
      return '';
    }
    
    const fallback = stats[extension].reverse()[0];
    const picture = outdent({ newline: '' })`
    <picture>
      ${Object.values(stats)
        .map(
          (image) =>
            `<source type="image/${image[0].format}" srcset="${image
              .map((entry) => `${entry.url} ${entry.width}w`)
              .join(', ')}" sizes="${sizes}">`
        )
        .join('')}
      <img
        class="${className ? `img-${className}` : ''}"
        loading="${lazy ? 'lazy' : 'eager'}"
        src="${fallback.url}"
        width="${fallbackWidth ?? fallback.width}"
        height="${fallbackHeight ?? fallback.height}" alt="${alt}">
    </picture>`;
    return title
      ? outdent({ newline: '' })`
      <figure class="${className ? `fig-${className}` : ''}">
        ${picture}
        <figcaption>${markdown.renderInline(title)}</figcaption>
      </figure>`
      : picture;
  }
};
