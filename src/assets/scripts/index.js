import barba from '@barba/core';
import slideUp from './transitions/slideUp'
import once from './transitions/once'
import svg from './transitions/svg'
import fade from './transitions/fade'
import entrance from './transitions/entrance'

// import anime from 'animejs/lib/anime.es.js';
import dissolve from './transitions/dissolve';
// const { barba, barbaRouter: router } = window

console.info('🚀App:init')

const duration = 1200 //1200

barba.hooks.before(() => {
  barba.wrapper.classList.add('is-animating');
})
barba.hooks.after(() => {
  barba.wrapper.classList.remove('is-animating');
})
// barba.use(router, {
//   routes: [
//     { name: 'home', path: '(/|/index.html)' },
//   ],
// })

barba.init({
  debug: true,
  transitions: [
    {
      sync: true,
      to: { namespace: 'home'},
      leave: ({ current }) => fade(current.container, duration * 0.5, 1, 0),
      enter: ({ next }) => fade(next.container, duration * 0.5, 0, 1),
      once: ({ next }) => dissolve(next.container),
    },
    {
      sync: true,
      to: { namespace: 'about'},
      leave: ({ current }) => fade(current.container, duration, 1, 0),
      enter: ({ next }) => entrance(next.container),
    },
  ],
})

/*
barba.init({
  debug: true,
  transitions: [
    {
      sync: true,
      from: { route: 'home'},
      leave: ({ current }) => Promise.all([
        slideUp(current.container, duration, 0, -100),
        svg(current.container, duration),
      ]),
      beforeEnter({ next }) {
        next.container.style.zIndex = -1
      }
    },
    {
      sync: true,
      to: { route: 'home'},
      leave: ({ current }) => slideUp(current.container, duration * 0.5, 0, 100),
      enter: ({ next }) => slideUp(next.container, duration * 0.5, -100, 0),
    },
    {
      to: { namespace: 'home'},
      once: ({ next }) => once(next.container),
    }
  ],
})
// */