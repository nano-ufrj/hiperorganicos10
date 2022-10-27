
const makeNavLinksSmooth = ( ) => {
  const navLinks = document.querySelectorAll( '.nav-link' );

  for ( let n in navLinks ) {
    if ( navLinks.hasOwnProperty( n ) ) {
      navLinks[ n ].addEventListener( 'click', e => {
        e.preventDefault( );
        document.querySelector( navLinks[ n ].hash )
          .scrollIntoView( {
            behavior: "smooth"
          } );
      } );
    }
  }
}

const spyScrolling = ( ) => {
  const pages = document.querySelectorAll( '.page' );

  window.onscroll = ( ) => {
    for (i = 0; i < pages.length; ++i) {
      var rect = pages[i].getBoundingClientRect();
      if(rect.left <= window.innerWidth/2 && rect.right >= window.innerWidth/2){
        document.querySelector( '.active' ).classList.remove( 'active' );
        const id = pages[i].id;
        document.querySelector( `a[href*=${ id }]` ).parentNode.classList.add( 'active' );
        console.log(id)
        return;
      }
    }
  } 
}
window.onload = function() {
  makeNavLinksSmooth( );
  spyScrolling( );
};