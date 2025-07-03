document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Toggle menu
  hamburger.addEventListener('click', function() {
    const isActive = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Animate hamburger lines
    const lines = hamburger.querySelectorAll('.hamburger-line');
    if (!isActive) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
      const lines = hamburger.querySelectorAll('.hamburger-line');
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    });
  });

  // Add hover effect to cards
  const cards = document.querySelectorAll('.app-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 5px 0 rgba(0, 0, 0, 0.2)';
      card.style.transition = 'all 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'none';
      card.style.boxShadow = '0 3px 0 rgba(0, 0, 0, 0.2)';
      card.style.transition = 'all 0.1s ease';
    });
  });

  // Add click animations to buttons
  const buttons = document.querySelectorAll('.cta-button, .cf-button');
  buttons.forEach(button => {
    const isBlue = button.classList.contains('cf-button');
    const defaultColor = isBlue ? '#1D5D73' : '#C04700';
    const hoverBg = isBlue ? '#3CBDEA' : '#ff8c2c';
    const normalBg = isBlue ? '#2FADD7' : '#FF7C14';

    const removeStates = () => {
      button.classList.remove('hover', 'active', 'up');
      button.style.background = normalBg;
    };

    button.addEventListener('mouseenter', () => {
      removeStates();
      button.classList.add('hover');
      button.style.background = hoverBg;
    });

    button.addEventListener('mouseleave', () => {
      removeStates();
    });

    button.addEventListener('mousedown', () => {
      removeStates();
      button.classList.add('active');
      button.style.background = hoverBg;
    });

    button.addEventListener('mouseup', () => {
      removeStates();
      button.classList.add('up');
      button.style.background = hoverBg;
    });
  });

  // Add scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.dataset.finalTransform || 'none';
      }
    });
  }, {
    threshold: 0.1
  });

  // Animate sections on scroll
  document.querySelectorAll('.section, .crowdfunding-banner').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });

});

// jQuery for smooth scroll
$(document).ready(function() {
  // Smooth scroll for navigation links
  $('a[href^="#"]').on('click', function(event) {
    event.preventDefault();
    const target = $(this.getAttribute('href'));
    if(target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 100
      }, 400);
    }
  });

  // Add fade-in animation to list items only on mobile
  if ($(window).width() <= 768) {
    $('.feature-list li').each(function(index) {
      $(this).css({
        'opacity': 0,
        'transform': 'translateX(-20px)'
      });
      
      $(this).waypoint(function() {
        $(this.element).animate({
          opacity: 1
        }, {
          duration: 400,
          step: function(now, fx) {
            const progress = fx.pos;
            $(this).css('transform', `translateX(${-20 + (progress * 20)}px)`);
          }
        });
      }, {
        offset: '90%'
      });
    });
  }
});
