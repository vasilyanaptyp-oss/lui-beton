(function () {
  'use strict';
  var EMAIL = 'probuv@gmail.com';
  var root = document.documentElement;
  var lang = 'lv';

  var TXT = {
    lv: {
      title: 'SIA Lui Beton · Māju būvniecība un tehnikas noma Augšdaugavā',
      desc: 'SIA Lui Beton, Demene, Augšdaugavas novads: privātmāju būvniecība atslēgas galā, angāri, pamatu veidņu un fasādes sastatņu noma, traktora-ekskavatora Terex TLB990 noma.',
      subject: 'Pieprasījums no mājaslapas',
      subjectSvc: 'Pieprasījums: ',
      eService: 'Izvēlieties pakalpojumu.',
      ePlace: 'Norādiet objektu vai vietu.',
      ePhone: 'Norādiet tālruņa numuru.',
      ePhoneBad: 'Pārbaudiet tālruņa numuru.',
      eSum: 'Lūdzu, aizpildiet atzīmētos laukus.',
      lService: 'Pakalpojums', lPlace: 'Objekts / vieta', lDates: 'Datumi nomai', lPhone: 'Tālrunis', lMsg: 'Ziņa',
      hello: 'Labdien!'
    },
    ru: {
      title: 'SIA Lui Beton · Строительство домов и аренда техники в Аугшдаугавском крае',
      desc: 'SIA Lui Beton, Демене, Аугшдаугавский край: частные дома под ключ, ангары, аренда опалубки для фундаментов, фасадных лесов и трактора-экскаватора Terex TLB990.',
      subject: 'Запрос с сайта',
      subjectSvc: 'Запрос: ',
      eService: 'Выберите услугу.',
      ePlace: 'Укажите объект или место.',
      ePhone: 'Укажите номер телефона.',
      ePhoneBad: 'Проверьте номер телефона.',
      eSum: 'Пожалуйста, заполните отмеченные поля.',
      lService: 'Услуга', lPlace: 'Объект / место', lDates: 'Даты аренды', lPhone: 'Телефон', lMsg: 'Сообщение',
      hello: 'Здравствуйте!'
    }
  };

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function store(k, v) { try { if (v === undefined) { return window.localStorage.getItem(k); } window.localStorage.setItem(k, v); } catch (e) {} return null; }

  function setLang(l, persist) {
    if (l !== 'lv' && l !== 'ru') { l = 'lv'; }
    lang = l;
    root.setAttribute('lang', l);
    root.setAttribute('data-lang', l);
    document.title = TXT[l].title;
    var md = $('meta[name="description"]');
    if (md) { md.setAttribute('content', TXT[l].desc); }
    $$('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === l ? 'true' : 'false');
    });
    $$('option[data-lv]').forEach(function (o) { o.textContent = o.getAttribute('data-' + l); });
    $$('[data-ph-lv]').forEach(function (el) { el.setAttribute('placeholder', el.getAttribute('data-ph-' + l)); });
    $$('img[data-alt-lv]').forEach(function (el) { el.setAttribute('alt', el.getAttribute('data-alt-' + l)); });
    $$('[data-mailto]').forEach(function (a) {
      a.setAttribute('href', 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(TXT[l].subject));
    });
    clearErrors();
    if (persist) {
      try {
        var u = new URL(window.location.href);
        if (l === 'ru') { u.searchParams.set('lang', 'ru'); } else { u.searchParams.delete('lang'); }
        window.history.replaceState(null, '', u.pathname + u.search + u.hash);
      } catch (e) {}
    }
  }

  $$('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), true); });
  });

  // mobile menu
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });

  // buttons that preselect a service in the form
  var form = $('#form');
  var sel = $('#f-service'), place = $('#f-place'), dates = $('#f-dates'), phone = $('#f-phone'), msg = $('#f-msg');
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { sel.value = a.getAttribute('data-service'); clearErrors(); });
  });

  var errs = { service: $('#e-service'), place: $('#e-place'), phone: $('#e-phone'), sum: $('#e-sum') };

  function showErr(key, input, text) {
    errs[key].textContent = text; errs[key].hidden = false;
    if (input) { input.setAttribute('aria-invalid', 'true'); }
  }
  function clearErrors() {
    Object.keys(errs).forEach(function (k) { if (errs[k]) { errs[k].hidden = true; errs[k].textContent = ''; } });
    [sel, place, phone].forEach(function (i) { if (i) { i.removeAttribute('aria-invalid'); } });
  }

  function validate() {
    clearErrors();
    var T = TXT[lang], bad = [];
    if (!sel.value) { showErr('service', sel, T.eService); bad.push(sel); }
    if (!place.value.trim()) { showErr('place', place, T.ePlace); bad.push(place); }
    var digits = phone.value.replace(/\D/g, '');
    if (!phone.value.trim()) { showErr('phone', phone, T.ePhone); bad.push(phone); }
    else if (digits.length < 7 || digits.length > 15 || /[^\d\s+()\-.\/]/.test(phone.value)) { showErr('phone', phone, T.ePhoneBad); bad.push(phone); }
    if (bad.length) { showErr('sum', null, T.eSum); bad[0].focus(); return false; }
    return true;
  }

  function buildMailto() {
    var T = TXT[lang];
    var svcOpt = sel.options[sel.selectedIndex];
    var svcName = svcOpt ? svcOpt.textContent : '';
    var lines = [T.hello, '',
      T.lService + ': ' + svcName,
      T.lPlace + ': ' + place.value.trim()];
    if (dates.value.trim()) { lines.push(T.lDates + ': ' + dates.value.trim()); }
    lines.push(T.lPhone + ': ' + phone.value.trim());
    if (msg.value.trim()) { lines.push('', T.lMsg + ':', msg.value.trim()); }
    var body = lines.join('\r\n');
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subjectSvc + svcName) + '&body=' + encodeURIComponent(body);
  }

  [sel, place, phone].forEach(function (i) {
    i.addEventListener('input', function () { i.removeAttribute('aria-invalid'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) { return; }
    window.location.href = buildMailto();
  });

  // initial language: ?lang=ru wins, otherwise Latvian
  var q = '';
  try { q = new URLSearchParams(window.location.search).get('lang') || ''; } catch (e) {}
  setLang(q.toLowerCase() === 'ru' ? 'ru' : 'lv', false);

  // test hook: build the link without opening it
  window.LuiBeton = { buildMailto: buildMailto, validate: validate, getLang: function () { return lang; } };
})();
