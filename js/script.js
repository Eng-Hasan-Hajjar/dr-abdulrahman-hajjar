/* =========================================================
   د. عبد الرحمن حجار — جراحة بولية
   ملف السكربت الرئيسي (مشترك بين كل صفحات الموقع)
   ========================================================= */
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page fade-in */
  document.addEventListener('DOMContentLoaded', function(){
    requestAnimationFrame(function(){ document.body.classList.add('is-loaded'); });
  });

  /* loader (present only on index.html) */
  var loader = document.getElementById('loader');
  if(loader){
    var hideLoader = function(){ loader.classList.add('is-hidden'); };
    if(reduceMotion){ hideLoader(); }
    else {
      window.addEventListener('load', function(){ setTimeout(hideLoader, 900); });
      setTimeout(hideLoader, 2200);
    }
  }

  /* nav toggle (mobile) */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.setAttribute('data-open','false');
        toggle.setAttribute('aria-expanded','false');
      });
    });
  }

  /* reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15});
    revealEls.forEach(function(el){io.observe(el);});
  } else {
    revealEls.forEach(function(el){el.classList.add('is-visible');});
  }

  /* medallion draw-in (hero + page banners) */
  if(!reduceMotion){
    document.querySelectorAll('.medallion .draw-path').forEach(function(el){
      try{
        var len = el.getTotalLength();
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
        el.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.65,0,0.35,1)';
        requestAnimationFrame(function(){
          setTimeout(function(){ el.style.strokeDashoffset = '0'; }, 150);
        });
      }catch(e){}
    });
  }

  /* hero parallax + spotlight (index.html only) */
  var hero = document.querySelector('.hero');
  var medallionWrap = document.getElementById('medallionWrap');
  var spotlight = document.getElementById('heroSpotlight');
  if(hero && !reduceMotion){
    hero.addEventListener('mousemove', function(e){
      var rect = hero.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      if(medallionWrap){
        var dx = (px - 0.5) * -18;
        var dy = (py - 0.5) * -14;
        medallionWrap.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      }
      if(spotlight){
        spotlight.style.setProperty('--mx',(px*100)+'%');
        spotlight.style.setProperty('--my',(py*100)+'%');
      }
    });
  }

  /* animated counter */
  var counters = document.querySelectorAll('[data-count-to]');
  var animateCounter = function(el){
    var target = parseInt(el.getAttribute('data-count-to'),10);
    if(reduceMotion){ el.textContent = String(target).padStart(2,'0'); return; }
    var current = 0;
    var step = function(){
      current++;
      el.textContent = String(current).padStart(2,'0');
      if(current < target){ setTimeout(function(){ requestAnimationFrame(step); }, 220); }
    };
    step();
  };
  if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateCounter(entry.target); cio.unobserve(entry.target); }
      });
    },{threshold:0.5});
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* timeline line grow */
  var timelineEl = document.getElementById('timelineEl');
  if(timelineEl && 'IntersectionObserver' in window){
    var tio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ timelineEl.classList.add('in-view'); tio.unobserve(timelineEl); }
      });
    },{threshold:0.2});
    tio.observe(timelineEl);
  } else if(timelineEl){ timelineEl.classList.add('in-view'); }

  /* tilt effect on cards */
  if(!reduceMotion){
    document.querySelectorAll('.tilt').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateX(' + (py*-6) + 'deg) rotateY(' + (px*6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq__q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq__item');
      var isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* brand/logo icon fallback (until images/logo.svg is added) */
  document.querySelectorAll('.brand-icon img').forEach(function(img){
    img.addEventListener('error', function(){
      var wrap = img.closest('.brand-icon');
      if(wrap){ wrap.classList.add('icon-missing'); }
    }, {once:true});
  });

  /* work-card image fallback (missing images -> graceful placeholder) */
  document.querySelectorAll('.work-card__media img').forEach(function(img){
    img.addEventListener('error', function(){
      var media = img.closest('.work-card__media');
      if(media){ media.classList.add('img-missing'); }
      img.remove();
    }, {once:true});
  });

  /* back to top + header scroll background */
  var header = document.querySelector('.site-header');
  var toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function(){
    if(header){
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    if(toTop){
      if(window.scrollY > 600){ toTop.classList.add('is-visible'); }
      else { toTop.classList.remove('is-visible'); }
    }
  });
  if(toTop){
    toTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  }

  /* theme toggle (dark / light) */
  var themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      if(next === 'light'){ document.documentElement.setAttribute('data-theme','light'); }
      else { document.documentElement.removeAttribute('data-theme'); }
      try{ localStorage.setItem('site-theme', next); }catch(e){}
      themeToggle.setAttribute('aria-pressed', String(next === 'light'));
    });
  }

  /* contact form -> WhatsApp deep link */
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (document.getElementById('cfName') || {}).value || '';
      var phone = (document.getElementById('cfPhone') || {}).value || '';
      var message = (document.getElementById('cfMessage') || {}).value || '';
      var lines = [
        'مرحبًا، أرغب بالتواصل بخصوص استشارة:',
        'الاسم: ' + (name || '—'),
        phone ? ('رقم للتواصل: ' + phone) : null,
        'الرسالة: ' + (message || '—')
      ].filter(Boolean);
      var text = encodeURIComponent(lines.join('\n'));
      window.open('https://wa.me/963959145239?text=' + text, '_blank', 'noopener');
    });
  }
})();
