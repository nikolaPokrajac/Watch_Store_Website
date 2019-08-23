function navSlide() {
  const mobileMenu = document.querySelector('.js--mobile-menu');
  const nav = document.querySelector('.js--nav');
  const navLinks = document.querySelectorAll('.js--nav-middle li');

  mobileMenu.addEventListener('click', () => {
    // toggle nav
    nav.classList.toggle('nav__active');

    // animate links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
          0.3}s`;
      }
    });

    // burger animation
    mobileMenu.classList.toggle('toggle');
  });
}
navSlide();