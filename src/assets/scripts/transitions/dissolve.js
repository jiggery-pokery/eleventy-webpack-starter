import anime from 'animejs/lib/anime.es.js';

export default (el) => {
  const targets = el.querySelectorAll('.box');
  console.log(targets);
  const duration = 550;
  const anim = anime({
    autoplay: false,
    targets,
    translateY: {
      value: [100, 0],
      duration,
    },
    opacity: {
      value: [0, 1],
      duration: duration * 0.75,
    },
    easing: 'easeOutQuart',
    delay: anime.stagger(100),
  });
  
  setTimeout(anim.play, 750);

  return anim.finished;
}