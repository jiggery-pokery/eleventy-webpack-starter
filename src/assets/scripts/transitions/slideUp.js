import anime from 'animejs/lib/anime.es.js';

export default (targets, duration, from, to) => {
    targets.style.transform = `translateY(${from}%)`;
  
    const translateY = `${to}%`;
    const anim = anime.timeline({
      easing: 'easeInOutSine',
      duration,
    });
    
    anim.add({
      targets,
      translateY,
    });
  
    return anim.finished;
  }
  