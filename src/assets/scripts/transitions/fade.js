import anime from 'animejs/lib/anime.es.js';

export default (targets, durationx, from, to) => {
    // targets.style.transform = `opacity(${from}%)`;
    const duration = 1200 //1200
    // const opacity = `${to}%`;
    const anim = anime.timeline({
      easing: 'easeInOutSine',
      duration,
    });
    
    // anim.add({
    //   targets,
    //   opacity,
    // });

    anim.add({
        targets: targets,
        opacity:[from, to]
    });
  
    return anim.finished;
  }
  