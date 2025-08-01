document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
      duration: 1000,
      delay: 0,
      once: true,
      offset: 100,
      easing: 'ease-in-out'
    });

    document.querySelectorAll('[data-aos]').forEach((el) => {
      el.removeAttribute('data-aos-delay');
    });
  });


  
  const roles = [
    "Full Stack Developer ",
    "MERN Stack Engineer ",
    "Creator of JourniStay "
  ];

  let i = 0;
  let j = 0;
  let current = '';
  let isDeleting = false;
  const roleSpan = document.getElementById("role");

  function type() {
    const role = roles[i];

    if (!isDeleting && j <= role.length) {
      current = role.substring(0, j++);
    } else if (isDeleting && j >= 0) {
      current = role.substring(0, j--);
    }

    roleSpan.innerHTML = `<span style="color:#58a6ff;">${current}</span>`;

    if (!isDeleting && j === role.length) {
      isDeleting = true;
      setTimeout(type, 1000);
    } else if (isDeleting && j === 0) {
      isDeleting = false;
      i = (i + 1) % roles.length;
      setTimeout(type, 300);
    } else {
      setTimeout(type, isDeleting ? 40 : 90);
    }
  }

  type();