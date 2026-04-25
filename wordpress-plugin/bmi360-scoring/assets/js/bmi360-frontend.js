/**
 * BMI 360™ — Frontend JavaScript
 * Handles: popup open/close, inline toggle, iframe lazy-load, postMessage resize + leads
 * @package BMI360_Scoring
 */
(function() {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ── Popup / Modal ───────────────────────────────────────────────────── */
  function openModal(modal) {
    var iframe = modal.querySelector('.bmi360-modal-iframe');
    if (iframe && iframe.dataset.src && !iframe.src) {
      iframe.src = iframe.dataset.src;
    }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function initPopups() {
    $$('.bmi360-popup-btn').forEach(function(btn) {
      var targetId = btn.dataset.modal;
      if (!targetId) return;
      var modal = document.getElementById(targetId);
      if (!modal) return;

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(modal);
      });
    });

    $$('.bmi360-modal').forEach(function(modal) {
      // Close button
      var closeBtn = modal.querySelector('.bmi360-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() { closeModal(modal); });
      }

      // Overlay click
      var overlay = modal.querySelector('.bmi360-modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', function() { closeModal(modal); });
      }
    });

    // ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        $$('.bmi360-modal.is-open').forEach(function(modal) { closeModal(modal); });
      }
    });
  }

  /* ── Inline ──────────────────────────────────────────────────────────── */
  function initInline() {
    $$('.bmi360-inline-btn').forEach(function(btn) {
      var wrap = btn.closest('.bmi360-tool-wrap');
      if (!wrap) return;
      var content = wrap.querySelector('.bmi360-inline-content');
      if (!content) return;

      btn.addEventListener('click', function() {
        var isVisible = content.style.display !== 'none' && content.style.display !== '';
        if (isVisible) {
          content.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          // Lazy-load iframe inside content
          var iframe = content.querySelector('.bmi360-iframe[data-src]');
          if (iframe && !iframe.src) {
            iframe.src = iframe.dataset.src;
          }
          content.style.display = 'block';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── postMessage handler ─────────────────────────────────────────────── */
  function handleMessage(e) {
    if (!e.data || typeof e.data !== 'object') return;

    var appUrl = (window.BMI360Config && window.BMI360Config.appUrl) || '';
    if (appUrl) {
      try {
        var allowed = new URL(appUrl).origin;
        if (e.origin !== allowed && e.origin !== window.location.origin) return;
      } catch(err) {}
    }

    var type = e.data.type;

    /* ── Resize ── */
    if (type === 'bmi360:resize') {
      var height = e.data.height;
      if (!height) return;
      $$('.bmi360-iframe').forEach(function(iframe) {
        try {
          if (iframe.contentWindow === e.source) {
            iframe.style.height = height + 'px';
          }
        } catch(err) {}
      });
      // Also resize modal iframes
      $$('.bmi360-modal-iframe').forEach(function(iframe) {
        try {
          if (iframe.contentWindow === e.source) {
            iframe.style.height = Math.min(height, window.innerHeight * 0.85) + 'px';
          }
        } catch(err) {}
      });
    }

    /* ── Lead capture ── */
    if (type === 'bmi360:lead') {
      var lead = e.data.lead || {};
      lead.page_url = window.location.href;
      captureLead(lead);
    }

    /* ── Score event ── */
    if (type === 'bmi360:score_event') {
      var payload = e.data.payload || {};
      payload.page_url = window.location.href;
      trackScoreEvent(payload);
    }

    /* ── Close popup from inside iframe ── */
    if (type === 'bmi360:close') {
      $$('.bmi360-modal.is-open').forEach(function(modal) { closeModal(modal); });
    }
  }

  /* ── Lead capture via REST API ───────────────────────────────────────── */
  function captureLead(lead) {
    if (!window.BMI360Config) return;
    var endpoint = window.BMI360Config.restUrl + 'bmi360/v1/lead';
    var nonce    = window.BMI360Config.nonce;

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify(lead)
    }).catch(function() {});
  }

  /* ── Score event tracking ────────────────────────────────────────────── */
  function trackScoreEvent(payload) {
    if (!window.BMI360Config) return;
    var endpoint = window.BMI360Config.restUrl + 'bmi360/v1/score-event';
    var nonce    = window.BMI360Config.nonce;

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify(payload)
    }).catch(function() {});
  }

  /* ── Iframe auto-resize observer ─────────────────────────────────────── */
  function initIframeResizeObserver() {
    // Set initial min-height on all iframes that haven't loaded yet
    $$('.bmi360-iframe').forEach(function(iframe) {
      if (!iframe.style.height) {
        iframe.style.height = (iframe.dataset.minHeight || '600') + 'px';
      }
    });
  }

  /* ── Hub card CTAs ───────────────────────────────────────────────────── */
  function initHubCards() {
    $$('.bmi360-hub-card[data-mode="popup"]').forEach(function(card) {
      var btn = card.querySelector('.bmi360-hub-card-btn');
      if (!btn) return;
      var href = btn.getAttribute('href');
      if (!href || href === '#') return;

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openQuickModal(href, btn.textContent.trim());
      });
    });
  }

  /* ── Quick popup for hub cards ───────────────────────────────────────── */
  function openQuickModal(src, title) {
    var existing = document.getElementById('bmi360-quick-modal');
    if (existing) document.body.removeChild(existing);

    var modal = document.createElement('div');
    modal.id = 'bmi360-quick-modal';
    modal.className = 'bmi360-modal is-open';
    modal.innerHTML = [
      '<div class="bmi360-modal-overlay"></div>',
      '<div class="bmi360-modal-inner">',
      '  <button class="bmi360-modal-close" aria-label="Fermer">×</button>',
      '  <iframe class="bmi360-modal-iframe" src="' + escapeAttr(src) + '" height="700" title="' + escapeAttr(title) + '"></iframe>',
      '</div>'
    ].join('');

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.bmi360-modal-overlay').addEventListener('click', function() {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
    modal.querySelector('.bmi360-modal-close').addEventListener('click', function() {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    });
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */
  function init() {
    initPopups();
    initInline();
    initIframeResizeObserver();
    initHubCards();
    window.addEventListener('message', handleMessage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
