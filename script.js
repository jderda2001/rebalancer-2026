document.addEventListener('DOMContentLoaded', () => {

  // === Scroll Reveal ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // === Radio Buttons ===
  document.querySelectorAll('.radio-row .radio-opt').forEach(label => {
    label.addEventListener('click', () => {
      label.closest('.radio-row').querySelectorAll('.radio-opt').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      label.querySelector('input').checked = true;
    });
  });

  // === Form Validation ===
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('successModal');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    const submitBtn = form.querySelector('.submit-btn');
    const fieldsToValidate = ['name', 'phone', 'email', 'nip', 'revenue'];

    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    fieldsToValidate.forEach(id => {
      const field = document.getElementById(id);
      if (!field || !field.value.trim()) {
        if (field) field.classList.add('error');
        valid = false;
      }
    });

    if (valid) {
      const formDataObj = new FormData(form);
      const data = {};
      formDataObj.forEach((value, key) => {
        data[key] = value;
      });

      // Ensure specific keys are present if needed
      if (!data.jdg) data.jdg = 'nie podano';

      try {
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';

        const response = await fetch('https://hook.eu2.make.com/o2ys4oyrd7ebk2152qx5ivkby06dbd8j', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          modal.classList.add('active');
          form.reset();
          document.querySelectorAll('.radio-opt').forEach(l => l.classList.remove('selected'));
        } else {
          alert('Wystąpił błąd podczas wysyłania formularza. Status: ' + response.status);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Wystąpił błąd połączenia. Spróbuj ponownie później.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Wyślij i poznaj oszczędności →';
      }
    }
  });

  // === Modal ===
  document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // === Donut Charts ===
  const animateDonut = (id, pct) => {
    const circle = document.getElementById(id);
    if (!circle) return;
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          circle.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
          circle.style.strokeDashoffset = c - (pct / 100) * c;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(circle.closest('svg'));
  };

  animateDonut('donut-jdg', 35);
  animateDonut('donut-spzoo', 9.08);

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
