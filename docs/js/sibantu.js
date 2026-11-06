/* SIBANTU — render isi dari data/informasi.json + interaksi UI.
   Tanpa framework. HTML memuat nilai cadangan agar tetap terbaca bila fetch gagal. */
(function () {
  'use strict';

  var esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  function tanggal(iso) {
    if (!iso) return '-';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear();
  }
  function tanggalPendek(iso) {
    var d = new Date((iso || '') + 'T00:00:00');
    if (isNaN(d)) return '-';
    return d.getDate() + ' ' + BULAN[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear();
  }
  function angka(n) { return typeof n === 'number' ? n.toLocaleString('id-ID') : n; }
  function ambil(data, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : null; }, data);
  }
  function thumb(item) {
    if (item && item.video) return '<video src="' + esc(item.video) + '" controls preload="metadata" playsinline style="width:100%;height:100%;object-fit:cover"></video>';
    if (item && item.foto) return '<img src="' + esc(item.foto) + '" alt="" loading="lazy">';
    return '<span class="placeholder-art">Dokumentasi SIBANTU</span>';
  }

  /* ---------- UI dasar ---------- */
  function uiDasar() {
    var nav = document.querySelector('.nav');
    var top = document.querySelector('.back-top');
    function onScroll() {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
      if (top) top.classList.toggle('show', window.scrollY > 600);
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

    var toggle = document.querySelector('.nav-toggle');
    var panel = document.getElementById('menuMobile');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('show');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    document.querySelectorAll('.dd').forEach(function (dd) {
      document.addEventListener('click', function (e) {
        if (dd.open && !dd.contains(e.target)) dd.open = false;
      });
    });

    var els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && els.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -60px 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }

    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- pencarian ---------- */
  var indeks = [
    { t: 'Beranda', d: 'Informasi utama bantuan sosial tunai', u: 'index.html' },
    { t: 'Profil SIBANTU', d: 'Latar, peran, dan prinsip layanan', u: 'profil.html' },
    { t: 'Persyaratan & kriteria', d: 'Dokumen wajib dibawa dan kriteria penerima', u: 'persyaratan.html' },
    { t: 'Alur pengusulan', d: 'Delapan langkah dari desa sampai penetapan Gubernur', u: 'alur.html' },
    { t: 'Program bantuan sosial', d: 'Jenis layanan dan sasaran penerima', u: 'program.html' },
    { t: 'Sosialisasi & edukasi', d: 'Materi sosialisasi untuk desa dan warga', u: 'sosialisasi.html' },
    { t: 'Pengumuman resmi', d: 'Jadwal, ketentuan, dan peringatan', u: 'pengumuman.html' },
    { t: 'Berita', d: 'Kabar kegiatan penyaluran dan verifikasi', u: 'berita.html' },
    { t: 'Galeri dokumentasi', d: 'Dokumentasi kegiatan SIBANTU', u: 'galeri.html' },
    { t: 'Transparansi', d: 'Angka penyaluran dan dokumen penetapan', u: 'transparansi.html' },
    { t: 'Kontak & FAQ', d: 'Helpdesk provinsi, kabupaten, dan pertanyaan umum', u: 'kontak.html' }
  ];

  function pencarian() {
    var dlg = document.getElementById('pencarian');
    var input = document.getElementById('inputCari');
    var hasil = document.getElementById('hasilCari');
    if (!dlg || !input || !hasil) return;

    function buka() {
      dlg.classList.add('show');
      dlg.setAttribute('aria-hidden', 'false');
      setTimeout(function () { input.focus(); }, 30);
      render(input.value);
    }
    function tutup() {
      dlg.classList.remove('show');
      dlg.setAttribute('aria-hidden', 'true');
    }
    function render(q) {
      q = (q || '').toLowerCase().trim();
      var daftar = indeks.filter(function (i) {
        return !q || (i.t + ' ' + i.d).toLowerCase().indexOf(q) > -1;
      }).slice(0, 8);
      hasil.innerHTML = daftar.length
        ? daftar.map(function (i) {
            return '<a href="' + esc(i.u) + '"><strong>' + esc(i.t) + '</strong><span>' + esc(i.d) + '</span></a>';
          }).join('')
        : '<p class="search-empty">Tidak ada halaman yang cocok. Coba kata lain, misalnya "persyaratan" atau "jadwal".</p>';
    }

    document.querySelectorAll('[data-buka-cari]').forEach(function (b) { b.addEventListener('click', buka); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) tutup(); });
    document.querySelectorAll('[data-tutup-cari]').forEach(function (b) { b.addEventListener('click', tutup); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dlg.classList.contains('show')) tutup();
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); buka();
      }
    });
    input.addEventListener('input', function () { render(input.value); });
  }

  /* ---------- render ---------- */
  function bind(data) {
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = ambil(data, el.getAttribute('data-bind'));
      if (v === null) return;
      var f = el.getAttribute('data-format');
      el.textContent = f === 'tanggal' ? tanggal(v) : f === 'angka' ? angka(v) : v;
    });
  }

  function status(data) {
    var p = data.periode || {};
    var bar = document.querySelector('[data-progress]');
    if (bar && p.kuota) {
      var pct = Math.max(0, Math.min(100, Math.round((p.tersalurkan / p.kuota) * 100)));
      bar.style.width = pct + '%';
      var lbl = document.querySelector('[data-progress-label]');
      if (lbl) lbl.textContent = (p.tersalurkan && p.tersalurkan > 0) ? pct + '% tersalurkan' : 'Dalam proses di BPKAD';
    }
    document.querySelectorAll('[data-status-chip]').forEach(function (el) { el.textContent = p.status || 'Berlangsung'; });
    var draft = document.querySelector('[data-draft]');
    if (draft && data.meta && data.meta.draf) draft.hidden = false;
  }

  function ticker(data) {
    var el = document.querySelector('[data-ticker]');
    if (!el || !data.pengumuman) return;
    var isi = data.pengumuman.slice(0, 3).map(function (n) { return '<b>' + esc(n.judul) + '</b>'; }).join(' &nbsp;•&nbsp; ') + ' &nbsp;•&nbsp; ';
    el.innerHTML = isi + isi;
  }

  function nilai(data) {
    var host = document.querySelector('[data-nilai]');
    if (!host || !data.nilai) return;
    host.innerHTML = data.nilai.map(function (n, i) {
      return '<div class="value reveal">' +
        '<div class="d-flex justify-content-between align-items-start">' +
        '<span class="num">0' + (i + 1) + '</span><i class="bi bi-' + esc(n.ikon) + ' ic" aria-hidden="true"></i></div>' +
        '<h3>' + esc(n.judul) + '</h3><p><strong>' + esc(n.sub) + '</strong><br>' + esc(n.teks) + '</p></div>';
    }).join('');
  }

  function standar(data) {
    var host = document.querySelector('[data-standar]');
    if (!host || !data.standar) return;
    host.innerHTML = data.standar.prinsip.map(function (p) {
      return '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span><strong>' + esc(p.nama) + '.</strong> ' + esc(p.teks) + '</span></li>';
    }).join('');
    var intro = document.querySelector('[data-standar-intro]');
    if (intro) intro.textContent = data.standar.intro;
    var tutup = document.querySelector('[data-standar-penutup]');
    if (tutup) tutup.textContent = data.standar.penutup;
  }

  function pengumuman(data) {
    var host = document.querySelector('[data-pengumuman]');
    if (!host || !data.pengumuman) return;
    var limit = parseInt(host.getAttribute('data-limit'), 10) || data.pengumuman.length;
    var items = data.pengumuman.slice().sort(function (a, b) { return a.tanggal < b.tanggal ? 1 : -1; }).slice(0, limit);
    host.innerHTML = items.map(function (n) {
      return '<article class="notice' + (n.penting ? ' is-penting' : '') + '">' +
        '<div class="notice-date"><b>' + esc(tanggal(n.tanggal)) + '</b>' + (n.penting ? 'Penting' : '') + '</div>' +
        '<div><span class="chip">' + esc(n.kategori) + '</span>' +
        '<h3 class="mt-2">' + esc(n.judul) + '</h3><p>' + esc(n.isi) + '</p></div></article>';
    }).join('');
    var count = document.querySelector('[data-pengumuman-count]');
    if (count) count.textContent = data.pengumuman.length + ' pengumuman';
  }

  function berita(data) {
    var kartu = document.querySelector('[data-berita]');
    var daftar = document.querySelector('[data-berita-list]');
    if (!data.berita) return;
    var urut = data.berita.slice().sort(function (a, b) { return a.tanggal < b.tanggal ? 1 : -1; });

    if (kartu) {
      var n = parseInt(kartu.getAttribute('data-limit'), 10) || 3;
      kartu.innerHTML = urut.slice(0, n).map(function (b) {
        return '<div class="col-md-6 col-lg-4 reveal"><a class="news-card" href="berita-detail.html?id=' + encodeURIComponent(b.id) + '">' +
          '<div class="thumb">' + thumb(b) + '</div>' +
          '<div class="meta"><span class="chip">' + esc(b.kategori) + '</span><span>' + esc(tanggalPendek(b.tanggal)) + '</span></div>' +
          '<h3>' + esc(b.judul) + '</h3><p>' + esc(b.ringkas) + '</p>' +
          '<span class="more">Baca selengkapnya <i class="bi bi-arrow-right"></i></span></a></div>';
      }).join('');
    }

    if (daftar) {
      daftar.innerHTML = urut.map(function (b) {
        return '<a class="news-item" href="berita-detail.html?id=' + encodeURIComponent(b.id) + '">' +
          '<div class="thumb">' + thumb(b) + '</div>' +
          '<div><div class="d-flex gap-2 align-items-center mb-2"><span class="chip">' + esc(b.kategori) + '</span>' +
          '<span class="text-muted-2" style="font-size:.8rem;">' + esc(tanggal(b.tanggal)) + '</span></div>' +
          '<h3>' + esc(b.judul) + '</h3><p>' + esc(b.ringkas) + '</p>' +
          '<span class="link-arrow">Baca <i class="bi bi-arrow-right"></i></span></div></a>';
      }).join('');
    }
  }

  function beritaDetail(data) {
    var host = document.getElementById('isiBerita');
    if (!host || !data.berita) return;
    var id = new URLSearchParams(location.search).get('id');
    var b = data.berita.filter(function (x) { return x.id === id; })[0] || data.berita[0];
    document.title = b.judul + ' — SIBANTU';
    var h1 = document.getElementById('judulBerita');
    if (h1) h1.textContent = b.judul;
    var crumb = document.getElementById('crumbBerita');
    if (crumb) crumb.textContent = b.judul;
    var meta = document.getElementById('metaBerita');
    if (meta) meta.innerHTML = '<span class="chip">' + esc(b.kategori) + '</span><span>' + esc(tanggal(b.tanggal)) + '</span><span>Dinas Sosial Provinsi Sulawesi Barat</span>';
    host.innerHTML = '<p class="lead">' + esc(b.ringkas) + '</p>' +
      b.isi.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var hero = document.getElementById('heroBerita');
    if (hero) hero.innerHTML = thumb(b) + '<span class="caption">Dokumentasi kegiatan</span>';
    var lain = document.getElementById('beritaLain');
    if (lain) {
      lain.innerHTML = data.berita.filter(function (x) { return x.id !== b.id; }).slice(0, 3).map(function (x) {
        return '<a class="news-item" href="berita-detail.html?id=' + encodeURIComponent(x.id) + '">' +
          '<div class="thumb">' + thumb(x) + '</div><div><h3 style="font-size:1rem">' + esc(x.judul) + '</h3>' +
          '<span class="text-muted-2" style="font-size:.82rem">' + esc(tanggalPendek(x.tanggal)) + '</span></div></a>';
      }).join('');
    }
  }

  function program(data) {
    var host = document.querySelector('[data-program]');
    if (!host || !data.programBantuan) return;
    host.innerHTML = data.programBantuan.map(function (p) {
      return '<div class="card reveal"><div class="d-flex justify-content-between align-items-start mb-2">' +
        '<i class="bi bi-box-seam ic" aria-hidden="true"></i><span class="chip chip--green">' + esc(p.status) + '</span></div>' +
        '<h3>' + esc(p.nama) + '</h3><p>' + esc(p.ringkas) + '</p>' +
        '<hr class="hairline my-3"><p style="font-size:.88rem;margin:0"><strong>Sasaran.</strong> ' + esc(p.sasaran) + '</p>' +
        '<p style="font-size:.88rem;margin:.5rem 0 0"><strong>Manfaat.</strong> ' + esc(p.manfaat) + '</p></div>';
    }).join('');
  }

  function sosialisasi(data) {
    var host = document.querySelector('[data-sosialisasi]');
    if (!host || !data.sosialisasi) return;
    host.innerHTML = data.sosialisasi.map(function (s) {
      return '<div class="col-md-6 reveal"><a class="card card-link" href="' + esc(s.tautan) + '">' +
        '<span class="chip chip--gold">' + esc(s.jenis) + '</span>' +
        '<h3 class="mt-2">' + esc(s.judul) + '</h3><p>' + esc(s.ringkas) + '</p>' +
        '<span class="link-arrow mt-3">Buka <i class="bi bi-arrow-right"></i></span></a></div>';
    }).join('');
  }

  function galeri(data) {
    var host = document.querySelector('[data-galeri]');
    if (!host || !data.galeri) return;
    host.innerHTML = data.galeri.map(function (g) {
      return '<figure><div class="thumb">' + thumb(g) + '</div>' +
        '<figcaption><b>' + esc(g.judul) + '</b>' + esc(g.keterangan) + ' · ' + esc(tanggalPendek(g.tanggal)) + '</figcaption></figure>';
    }).join('');
  }

  function jadwal(data) {
    var body = document.querySelector('[data-jadwal]');
    if (!body || !data.jadwal) return;
    var label = { selesai: 'Selesai', berlangsung: 'Berlangsung', mendatang: 'Mendatang' };
    var kelas = { selesai: 'chip--green', berlangsung: 'chip', mendatang: 'chip--gold' };
    body.innerHTML = data.jadwal.map(function (j) {
      var k = j.status || 'mendatang';
      var penerima = (j.penerima !== undefined) ? '<td class="tnum">' + angka(j.penerima) + '</td>' : '<td>-</td>';
      return '<tr><td><strong>' + esc(j.tahap) + '</strong></td>' + penerima +
        '<td>' + esc(tanggal(j.mulai)) + '</td><td>' + esc(tanggal(j.selesai)) +
        '</td><td><span class="chip ' + (kelas[k] || 'chip') + '">' + esc(label[k] || k) + '</span></td></tr>';
    }).join('');
  }

  function kabupaten(data) {
    var body = document.querySelector('[data-kabupaten]');
    if (!body || !data.kabupaten) return;
    body.innerHTML = data.kabupaten.map(function (k) {
      return '<tr><td>' + esc(k.nama) + '</td><td class="tnum">' + esc(k.helpdesk) + '</td></tr>';
    }).join('');
  }

  function dokumen(data) {
    var body = document.querySelector('[data-dokumen]');
    if (!body || !data.transparansi) return;
    body.innerHTML = data.transparansi.dokumen.map(function (d) {
      return '<tr><td><strong>' + esc(d.nama) + '</strong></td><td>' + esc(d.tahap) + '</td><td>' + esc(d.keterangan) + '</td></tr>';
    }).join('');
    var cat = document.querySelector('[data-catatan-transparansi]');
    if (cat) cat.textContent = data.transparansi.catatan;
  }

  function kontak(data) {
    var k = data.kontak || {};
    document.querySelectorAll('[data-kontak]').forEach(function (el) {
      var key = el.getAttribute('data-kontak');
      if (k[key]) el.textContent = k[key];
    });
    // Placeholder bertanda X tidak boleh menjadi tautan hidup (mis. tel:0426).
    var digit = function (v) { return String(v || '').replace(/[^0-9]/g, ''); };
    var isiNomor = function (v) { return !/x/i.test(String(v || '')) && digit(v).length >= 8; };
    var tujuan = {
      telepon: isiNomor(k.telepon) ? 'tel:' + digit(k.telepon) : '',
      whatsapp: isiNomor(k.whatsapp) ? 'https://wa.me/' + digit(k.whatsapp).replace(/^0/, '62') : '',
      email: /@/.test(String(k.email || '')) ? 'mailto:' + k.email : ''
    };
    Object.keys(tujuan).forEach(function (jenis) {
      document.querySelectorAll('[data-kontak-link="' + jenis + '"]').forEach(function (a) {
        if (tujuan[jenis]) { a.href = tujuan[jenis]; a.removeAttribute('title'); }
        else { a.removeAttribute('href'); a.title = 'Nomor/alamat belum diisi'; }
      });
    });
    var peta = document.querySelector('[data-peta]');
    if (peta && k.peta) peta.src = k.peta;
  }

  function tambahIndeks(data) {
    (data.berita || []).forEach(function (b) {
      indeks.push({ t: b.judul, d: b.kategori, u: 'berita-detail.html?id=' + encodeURIComponent(b.id) });
    });
    (data.programBantuan || []).forEach(function (p) {
      indeks.push({ t: p.nama, d: 'Program bantuan sosial', u: 'program.html' });
    });
  }

  function init() {
    uiDasar();
    pencarian();
    fetch('data/informasi.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        bind(data);
        status(data);
        ticker(data);
        nilai(data);
        standar(data);
        pengumuman(data);
        berita(data);
        beritaDetail(data);
        program(data);
        sosialisasi(data);
        galeri(data);
        jadwal(data);
        kabupaten(data);
        dokumen(data);
        kontak(data);
        tambahIndeks(data);
        document.documentElement.dataset.dataReady = '1';
      })
      .catch(function (err) {
        console.warn('data/informasi.json gagal dimuat:', err.message);
        document.documentElement.dataset.dataReady = 'error';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
