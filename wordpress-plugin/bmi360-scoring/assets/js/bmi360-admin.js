/**
 * BMI 360™ — Admin JavaScript
 * Handles: copy shortcodes, connection test, dashboard AJAX
 * @package BMI360_Scoring
 */
(function($) {
  'use strict';

  /* ── Copy shortcodes ─────────────────────────────────────────────────── */
  $(document).on('click', '.bmi360-copy-btn', function() {
    var $btn  = $(this);
    var text  = $btn.data('copy');
    var original = $btn.text();

    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() {
        $btn.text('✓ Copié!');
        setTimeout(function() { $btn.text(original); }, 2000);
      }).catch(function() {
        fallbackCopy(text, $btn, original);
      });
    } else {
      fallbackCopy(text, $btn, original);
    }
  });

  function fallbackCopy(text, $btn, original) {
    var $tmp = $('<textarea>').val(text).css({ position: 'fixed', top: 0, left: 0, opacity: 0 });
    $('body').append($tmp);
    $tmp[0].select();
    try {
      document.execCommand('copy');
      $btn.text('✓ Copié!');
      setTimeout(function() { $btn.text(original); }, 2000);
    } catch(e) {}
    $tmp.remove();
  }

  /* ── Connection test ─────────────────────────────────────────────────── */
  $('#bmi360-test-connection').on('click', function() {
    var $btn    = $(this);
    var $result = $('#bmi360-connection-result');
    var appUrl  = $('input[name="bmi360_app_url"]').val() ||
                  (window.BMI360Admin && window.BMI360Admin.appUrl) || '';

    if (!appUrl) {
      showResult($result, 'error', 'Veuillez renseigner l\'URL de l\'application d\'abord.');
      return;
    }

    $btn.prop('disabled', true).text('Test en cours…');
    $result.hide();

    $.ajax({
      url:  window.BMI360Admin && window.BMI360Admin.ajaxUrl,
      type: 'POST',
      data: {
        action:   'bmi360_test_connection',
        nonce:    window.BMI360Admin && window.BMI360Admin.nonce,
        app_url:  appUrl
      },
      success: function(response) {
        if (response.success) {
          showResult($result, 'success', response.data.message || 'Connexion réussie !');
        } else {
          showResult($result, 'error', (response.data && response.data.message) || 'Erreur de connexion.');
        }
      },
      error: function() {
        showResult($result, 'error', 'Erreur réseau — vérifiez l\'URL.');
      },
      complete: function() {
        $btn.prop('disabled', false).text('Tester la connexion');
      }
    });
  });

  function showResult($el, type, message) {
    $el
      .removeClass('notice-success notice-error')
      .addClass(type === 'success' ? 'notice-success' : 'notice-error')
      .html('<p>' + escapeHtml(message) + '</p>')
      .show();
  }

  /* ── Dashboard stats refresh ─────────────────────────────────────────── */
  function refreshStats() {
    if (!window.BMI360Admin) return;
    $.ajax({
      url:  window.BMI360Admin.ajaxUrl,
      type: 'POST',
      data: {
        action: 'bmi360_get_stats',
        nonce:  window.BMI360Admin.nonce
      },
      success: function(response) {
        if (!response.success || !response.data) return;
        var stats = response.data;
        if (stats.leads      !== undefined) $('.bmi360-kpi-leads').text(stats.leads);
        if (stats.tools_used !== undefined) $('.bmi360-kpi-tools').text(stats.tools_used);
        if (stats.events     !== undefined) $('.bmi360-kpi-events').text(stats.events);
        if (stats.avg_score  !== undefined) $('.bmi360-kpi-score').text(stats.avg_score);
      }
    });
  }

  // Refresh stats on dashboard page load
  if ($('.bmi360-admin-kpis').length) {
    refreshStats();
  }

  /* ── Color picker preview ────────────────────────────────────────────── */
  $('input[name="bmi360_primary_color"]').on('input', function() {
    var color = $(this).val();
    $('.bmi360-kpi-value, .bmi360-qs-num, .bmi360-admin-logo').css('background', color);
    $('.bmi360-kpi-value').css({ background: 'transparent', color: color });
    $('.bmi360-badge').css('background', color);
  });

  /* ── Confirm dangerous actions ───────────────────────────────────────── */
  $('[name="bmi360_clear_leads"]').on('click', function(e) {
    if (!confirm('Supprimer tous les leads ? Cette action est irréversible.')) {
      e.preventDefault();
    }
  });

  /* ── Helper ──────────────────────────────────────────────────────────── */
  function escapeHtml(str) {
    return $('<div>').text(str).html();
  }

})(jQuery);
