(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const ASSET_VERSION = '20261031';
  const screenshotUrl = (name) => `assets/app-${name}.jpg?v=${ASSET_VERSION}`;
  let locale = 'en';

  function initImageResilience() {
    const placeholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f5f0e8"/><path d="M360 190h80v420h-80z" fill="#cc785c" opacity=".18"/><text x="400" y="430" text-anchor="middle" fill="#6c6a64" font-family="system-ui,sans-serif" font-size="34">Then &amp; Now</text></svg>'
    )}`;
    document.querySelectorAll('img').forEach((img) => {
      const handleError = () => {
        if (img.dataset.fallback) return;
        if (!img.dataset.retried) {
          img.dataset.retried = 'true';
          const url = new URL(img.getAttribute('src'), window.location.href);
          url.searchParams.set('retry', Date.now().toString());
          img.src = url.href;
          return;
        }
        img.dataset.fallback = 'true';
        img.src = placeholder;
      };
      img.addEventListener('error', handleError);
      if (img.complete && img.naturalWidth === 0) handleError();
    });
  }

  const zh = {
    'a11y.skip': '跳到主要内容',
    'a11y.compare': '前后照片对比，使用左右方向键调整',
    'nav.demo': '演示',
    'nav.features': '功能',
    'nav.privacy': '隐私',
    'nav.faq': '常见问题',
    'nav.cta': '获取 App',
    'hero.eyebrow': '静静记录，清晰看见',
    'hero.title1': '每一次变化，',
    'hero.title2': '都清晰可见。',
    'hero.lede': '对比前后照片，在原机位重拍，再把变化导成视频。简单好用，也从设计上保护隐私。',
    'hero.primary': '试试前后对比',
    'hero.secondary': '了解产品功能',
    'hero.fact1': '核心功能免费',
    'hero.fact2': '无需账号',
    'hero.note': '从前 / 现在',
    'hero.demo': '演示素材',
    'compare.before': '从前',
    'compare.after': '现在',
    'compare.hint': '拖动分割线，看见变化',
    'scenes.fitness': '健身记录',
    'scenes.skin': '护肤打卡',
    'scenes.home': '装修进度',
    'scenes.growth': '成长变化',
    'scenes.anything': '记录一切变化',
    'demo.chapter': '招牌交互',
    'demo.title': '轻轻一动，换个视角。',
    'demo.lede': '并排、滑动或叠加，用你顺手的方式比较两个时刻。画面怎么对齐，始终由你决定。',
    'demo.side': '并排',
    'demo.wipe': '滑动',
    'demo.overlay': '叠加',
    'demo.opacity': '现在照片透明度',
    'demo.noteTitle': '需要时自动，想调时手动。',
    'demo.note': '只有主动点击才会自动对齐，已经手动调整的位置不会被覆盖。',
    'product.chapter': '真实产品',
    'product.title': '不做繁复，只把细节做好。',
    'product.lede': '从拍摄、对比到分享，只保留真正需要的工具，不把照片变成云端服务。',
    'shots.slider': '滑动，看见变化',
    'shots.overlay': '叠加，对准细节',
    'shots.gallery': '收好每段旅程',
    'shots.timelapse': '把变化导成视频',
    'shots.sliderDesc': '顺滑的分割线，让细微变化也清晰可见。展示的是真实 App 界面，而非概念模型。',
    'shots.overlayDesc': '两张照片叠在一起，拖动透明度，看清每一处不同。',
    'shots.galleryDesc': '每组对比都有自己的位置，打开就能接着看、接着调。',
    'shots.timelapseDesc': '自定义标签、时长和帧率，把一段变化导出为最高 1080p 的视频。',
    'shots.sliderAlt': 'Then & Now 滑动对比真实界面',
    'shots.overlayAlt': 'Then & Now 叠加对比真实界面',
    'shots.galleryAlt': 'Then & Now 对比画廊真实界面',
    'shots.timelapseAlt': 'Then & Now 视频导出真实界面',
    'product.caption': '真实 App 界面 · iPhone',
    'features.chapter': '覆盖完整记录过程',
    'features.title': '从下一张照片，到最后一次分享。',
    'features.lede': '没有社交信息流，也不强制注册账号，只保留让对比真正好用的工具。',
    'features.ghostTitle': '在同一个位置，再拍一次。',
    'features.ghostDesc': '取景框里叠着半透明的原图，帮你以同样的站位和角度拍下「现在」。',
    'features.ghostTag': '幽灵相机',
    'features.alignTitle': '把每个时刻对齐。',
    'features.alignDesc': '主体与水平线都在本机识别，只有你需要时才自动对齐。',
    'features.stitchTitle': '拼出更长的故事。',
    'features.stitchDesc': '把 2–8 张照片拼成一张横向或纵向长图。',
    'features.pngTitle': '导出干净的方形图片。',
    'features.pngDesc': '1:1 PNG 可保存或分享，没有水印，始终免费。',
    'features.videoTitle': '让变化，动起来。',
    'features.videoDesc': '最高 1080p，支持自定义标签和时长。免费版每月导出 3 次并带品牌水印；Pro 一次性买断，无限导出、去品牌水印，并可上传自己的 Logo。',
    'features.videoTag': '无需订阅',
    'privacy.chapter': '从架构开始保护隐私',
    'privacy.title': '你的回忆，不⁠是我们的生意。',
    'privacy.lede': '照片与视频都在 iPhone 上处理，你的照片不会离开设备。',
    'privacy.rule1': '无需账号',
    'privacy.rule1Desc': '不注册，不收集邮箱，也不设置密码。',
    'privacy.rule2': '不做跟踪',
    'privacy.rule2Desc': '无广告、无分析 SDK、无第三方追踪。',
    'privacy.rule3': '没有照片云',
    'privacy.rule3Desc': '没有开发者服务器保存你的照片。',
    'privacy.footnote': 'Apple StoreKit 仅用于获取 Pro 商品信息和购买权益。支付由 Apple 处理，我们不会接触你的支付信息。',
    'faq.chapter': '在开始之前',
    'faq.title': '几个诚实的回答。',
    'faq.q1': '哪些功能免费？',
    'faq.a1': '核心对比功能与 PNG 导出免费，无广告、无订阅。视频每月可免费导出 3 次，并带 Then & Now 品牌水印。',
    'faq.q2': 'Pro 解锁什么？',
    'faq.a2': 'Pro 一次性买断，提供无限次视频导出、移除品牌水印，并支持上传自定义 Logo。App 内提供「恢复购买」。',
    'faq.q3': '照片保存在哪里？',
    'faq.a3': '保存在 iPhone 上 App 的本地容器中，没有开发者提供的照片云备份。删除 App 会移除它的本地数据。',
    'faq.q4': '支持哪些设备？',
    'faq.a4': 'Then & Now 需要 iOS 17 或更高版本，1.0 版本专为 iPhone 设计。',
    'faq.q5': '会有 Android 版吗？',
    'faq.a5': '暂时没有。现在先把 iPhone 版做完整、做好，Android 会在上线后再评估。',
    'download.chapter': '即将上线',
    'download.title': '留住从前，看见现在。',
    'download.lede': 'Then & Now 正在准备登陆 App Store。核心功能免费，无账号、无广告、无跟踪。',
    'download.badge': '即将登陆 App Store',
    'footer.privacy': '隐私政策',
    'footer.support': '联系支持',
    'footer.note': '为值得对比的时刻而生。',
    'compare.value': '已显示 {value}% 的从前照片',
    'meta.title': 'Then & Now — 每一次变化，都清晰可见。',
    'meta.description': '对比前后照片，在原机位重拍，再把变化导成视频。简单好用，本机处理，为 iPhone 而生。'
  };

  const en = {
    'compare.value': '{value}% of the before photo visible',
    'shots.overlayDesc': 'Layer two photos and adjust their opacity to see every detail.',
    'shots.galleryDesc': 'Every comparison has a home. Return to a moment, adjust the framing, or share it again.',
    'shots.timelapseDesc': 'Customize labels, duration, and frame rate, then export the journey in up to 1080p.',
    'shots.overlayAlt': 'Then & Now overlay comparison screen',
    'shots.galleryAlt': 'Then & Now comparison gallery screen',
    'shots.timelapseAlt': 'Then & Now video export screen',
    'meta.title': document.title,
    'meta.description': document.querySelector('meta[name="description"]').content
  };
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    en[el.dataset.i18n] = el.textContent;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    en[el.dataset.i18nAriaLabel] = el.getAttribute('aria-label');
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    en[el.dataset.i18nAlt] = el.getAttribute('alt');
  });

  const messages = { en, 'zh-Hans': zh };
  const validLocale = (value) => value === 'zh-Hans' || value === 'en' ? value : null;
  const storedLocale = validLocale(window.__initialLocale) ||
    (navigator.language.toLowerCase().startsWith('zh') ? 'zh-Hans' : 'en');

  function applyLocale(nextLocale, persist = false) {
    locale = validLocale(nextLocale) || 'en';
    const dictionary = messages[locale];
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = dictionary[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const value = dictionary[el.dataset.i18nAriaLabel];
      if (value !== undefined) el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const value = dictionary[el.dataset.i18nAlt];
      if (value !== undefined) el.setAttribute('alt', value);
    });
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.locale === locale));
    });
    document.title = dictionary['meta.title'];
    document.querySelector('meta[name="description"]').content = dictionary['meta.description'];
    document.querySelector('meta[property="og:title"]').content = dictionary['meta.title'];
    document.querySelector('meta[property="og:description"]').content = dictionary['meta.description'];
    updateComparisonLabels();
    if (persist) {
      try { localStorage.setItem('thenandnow.locale', locale); } catch (_) {}
      const url = new URL(window.location.href);
      url.searchParams.set('lang', locale);
      history.replaceState(null, '', url);
    }
  }

  document.querySelectorAll('[data-locale]').forEach((button) => {
    button.addEventListener('click', () => applyLocale(button.dataset.locale, true));
  });

  const comparisons = [...document.querySelectorAll('[data-comparison]')];

  function updateComparisonLabels() {
    comparisons.forEach((comparison) => {
      const position = Math.round(parseFloat(comparison.style.getPropertyValue('--position')) || 50);
      comparison.setAttribute('aria-valuenow', String(position));
      const template = messages[locale]['compare.value'];
      comparison.setAttribute('aria-valuetext', template.replace('{value}', position));
    });
  }

  function setPosition(comparison, value) {
    const position = Math.max(0, Math.min(100, value));
    comparison.style.setProperty('--position', `${position}%`);
    comparison.setAttribute('aria-valuenow', String(Math.round(position)));
    const template = messages[locale]['compare.value'];
    comparison.setAttribute('aria-valuetext', template.replace('{value}', Math.round(position)));
  }

  comparisons.forEach((comparison) => {
    let activePointer = null;

    function updateFromPointer(event) {
      const rect = comparison.getBoundingClientRect();
      setPosition(comparison, ((event.clientX - rect.left) / rect.width) * 100);
    }

    comparison.addEventListener('pointerdown', (event) => {
      if (comparison.dataset.mode !== 'wipe' || activePointer !== null || event.button !== 0) return;
      activePointer = event.pointerId;
      comparison.setPointerCapture(activePointer);
      updateFromPointer(event);
      event.preventDefault();
    });
    comparison.addEventListener('pointermove', (event) => {
      if (event.pointerId !== activePointer) return;
      updateFromPointer(event);
    });
    const finishDrag = (event) => {
      if (event.pointerId !== activePointer) return;
      if (comparison.hasPointerCapture(activePointer)) comparison.releasePointerCapture(activePointer);
      activePointer = null;
    };
    comparison.addEventListener('pointerup', finishDrag);
    comparison.addEventListener('pointercancel', finishDrag);
    comparison.addEventListener('lostpointercapture', () => { activePointer = null; });
    comparison.addEventListener('keydown', (event) => {
      if (comparison.dataset.mode !== 'wipe') return;
      const current = parseFloat(comparison.style.getPropertyValue('--position')) || 50;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setPosition(comparison, current + (event.key === 'ArrowLeft' ? -3 : 3));
        event.preventDefault();
      } else if (event.key === 'Home' || event.key === 'End') {
        setPosition(comparison, event.key === 'Home' ? 0 : 100);
        event.preventDefault();
      }
    });
  });

  const demo = document.querySelector('.comparison--demo');
  const modeTabs = [...document.querySelectorAll('.mode-tabs [data-mode]')];
  const overlayControl = document.querySelector('.overlay-control');
  const overlayRange = document.getElementById('overlayRange');
  const overlayValue = document.getElementById('overlayValue');
  const comparisonPanel = document.getElementById('comparisonPanel');

  function setDemoMode(mode) {
    if (!demo) return;
    demo.dataset.mode = mode;
    modeTabs.forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected) comparisonPanel.setAttribute('aria-labelledby', button.id);
    });
    overlayControl.hidden = mode !== 'overlay';
    const interactive = mode === 'wipe';
    demo.tabIndex = interactive ? 0 : -1;
    demo.setAttribute('role', interactive ? 'slider' : 'img');
    if (!reduceMotion) {
      demo.animate(
        [{ opacity: 0.72, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 200, easing: easeOut }
      );
    }
  }

  modeTabs.forEach((button, index) => {
    button.addEventListener('click', () => setDemoMode(button.dataset.mode));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = modeTabs[(index + direction + modeTabs.length) % modeTabs.length];
      next.focus();
      setDemoMode(next.dataset.mode);
      event.preventDefault();
    });
  });

  overlayRange?.addEventListener('input', () => {
    demo.style.setProperty('--overlay-opacity', String(Number(overlayRange.value) / 100));
    overlayValue.value = `${overlayRange.value}%`;
  });

  const shots = {
    slider: { description: 'shots.sliderDesc', alt: 'shots.sliderAlt' },
    overlay: { description: 'shots.overlayDesc', alt: 'shots.overlayAlt' },
    gallery: { description: 'shots.galleryDesc', alt: 'shots.galleryAlt' },
    timelapse: { description: 'shots.timelapseDesc', alt: 'shots.timelapseAlt' }
  };
  const productShot = document.getElementById('productShot');
  const shotDescription = document.getElementById('shotDescription');
  const shotTabs = [...document.querySelectorAll('.shot-tabs [data-shot]')];
  const productPanel = document.getElementById('productPanel');
  let currentShot = 'slider';

  function setShot(name) {
    if (!shots[name]) return;
    currentShot = name;
    shotTabs.forEach((button) => {
      const selected = button.dataset.shot === name;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected) productPanel.setAttribute('aria-labelledby', button.id);
    });
    productShot.getAnimations().forEach((animation) => animation.cancel());
    delete productShot.dataset.retried;
    delete productShot.dataset.fallback;
    productShot.src = screenshotUrl(name);
    productShot.dataset.i18nAlt = shots[name].alt;
    productShot.alt = messages[locale][shots[name].alt];
    shotDescription.dataset.i18n = shots[name].description;
    shotDescription.textContent = messages[locale][shots[name].description];
    if (!reduceMotion) {
      productShot.animate(
        [{ opacity: 0.35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 220, easing: easeOut }
      );
    }
  }

  shotTabs.forEach((button, index) => {
    button.tabIndex = button.dataset.shot === currentShot ? 0 : -1;
    button.addEventListener('click', () => setShot(button.dataset.shot));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      const next = shotTabs[(index + direction + shotTabs.length) % shotTabs.length];
      next.focus();
      setShot(next.dataset.shot);
      event.preventDefault();
    });
  });

  function initReveals() {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    if (reduceMotion || !('IntersectionObserver' in window) || new URLSearchParams(location.search).get('reveal') === 'all') {
      elements.forEach((el) => el.classList.add('is-in'));
      return;
    }
    document.documentElement.classList.add('is-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el) => observer.observe(el));
  }

  initImageResilience();
  applyLocale(storedLocale);
  setDemoMode('wipe');
  initReveals();
})();
