
const makeNavLinksSmooth = ( ) => {
  const navLinks = document.querySelectorAll( '.nav-link' );

  for ( let n in navLinks ) {
    if ( navLinks.hasOwnProperty( n ) ) {
      navLinks[ n ].addEventListener( 'click', e => {
        e.preventDefault( );
        document.querySelector( navLinks[ n ].hash )
          .scrollIntoView( {
            behavior: "smooth",
            inline: "start"
          } );
      } );
    }
  }
}

const spyScrolling = ( ) => {
  const pages = document.querySelectorAll( '.page' );

  const scrollEl = document.getElementsByClassName("horizontal-group")[0];
  scrollEl.addEventListener('scroll', (event) => {
    for (i = 0; i < pages.length; ++i) {
      var rect = pages[i].getBoundingClientRect();
      if(rect.left <= window.innerWidth/2 && rect.right >= window.innerWidth/2){
        const active = document.querySelector( '.active' );
        if(active)
          active.classList.remove( 'active' );
        const id = pages[i].id;
        document.querySelector( `a[href*=${ id }]` ).classList.add( 'active' );
        return;
      }
    }
  });
}

makeNavLinksSmooth( );
spyScrolling( );