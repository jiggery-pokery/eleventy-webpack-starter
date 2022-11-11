import anime from 'animejs/lib/anime.es.js';

export default (container, duration) => {
  const shape = container.querySelector('.shape');
  const path = shape.querySelector('path');  		
  const animShape = anime({
    targets: shape,
    scaleY: [
      {
        value: [1, 1.8],
        duration: duration * 0.5,
        easing: 'easeInQuad',
      },
      {
        value: 1,
        duration: duration * 0.5,
        easing: 'easeOutQuad',
      }
    ]
  });
  
  const animPath = anime({
    targets: path,
    duration,
    easing: 'easeOutQuad',
    d: path.getAttribute('pathdata:id')
  });
    
  return Promise.all([
    animShape.finished,
    animPath.finished,
  ]);
}