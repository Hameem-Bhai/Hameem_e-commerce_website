/**
 * ============================================================
 *  Hameem Bhai er Dokan — Blog Page JS
 *  Dynamic listing of articles and single article rendering
 * ============================================================
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('blog');
    HBD.components.renderFooter();

    renderBlog();

    // Listen for server data updates (async fetch) — re-render then reveal
    HBD.store.EventBus.on('data:changed', function () {
      renderBlog();
    });

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });

  function renderBlog() {
    var container = document.getElementById('blog-container');
    if (!container) return;

    var postId = HBD.utils.getQueryParam('id');
    var breadcrumbCurrent = document.getElementById('breadcrumb-blog-current');
    var breadcrumb = document.getElementById('blog-breadcrumb');

    if (postId) {
      // Find the specific post
      var post = null;
      var posts = HBD.data.blogPosts;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
          post = posts[i];
          break;
        }
      }

      if (post) {
        // Set page metadata
        document.title = post.title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', post.summary);

        var metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        if (post.keywords) {
          if (Array.isArray(post.keywords)) {
            metaKeywords.setAttribute('content', post.keywords.join(', '));
          } else {
            metaKeywords.setAttribute('content', post.keywords);
          }
        }

        // Update breadcrumbs
        if (breadcrumb && breadcrumbCurrent) {
          breadcrumb.innerHTML =
            '<a href="index.html" class="breadcrumb__link">Home</a>' +
            '<span class="breadcrumb__sep">›</span>' +
            '<a href="blog.html" class="breadcrumb__link">Blog</a>' +
            '<span class="breadcrumb__sep">›</span>' +
            '<span class="breadcrumb__current">' + HBD.utils.sanitize(post.category) + '</span>';
        }

        // Render Single Post Details
        container.innerHTML =
          '<article class="blog-post" data-animate="fade-up">' +
            '<header class="blog-post__header">' +
              '<div class="blog-post__meta">' +
                '<span class="blog-post__category">' + HBD.utils.sanitize(post.category) + '</span>' +
                '<span class="blog-post__sep">•</span>' +
                '<span class="blog-post__date">' + post.date + '</span>' +
                '<span class="blog-post__sep">•</span>' +
                '<span class="blog-post__read-time">' + post.readTime + '</span>' +
              '</div>' +
              '<h1 class="blog-post__title">' + HBD.utils.sanitize(post.title) + '</h1>' +
              '<div class="blog-post__author">' +
                '<img src="hameem_photo.png" alt="" class="blog-post__author-avatar" style="object-fit: cover;">' +
                '<div>' +
                  '<div class="blog-post__author-name">' + HBD.utils.sanitize(post.author) + '</div>' +
                  '<div class="blog-post__author-title">Founder & Creative Lead</div>' +
                '</div>' +
              '</div>' +
            '</header>' +
            '<div class="blog-post__content rich-text">' +
              post.content +
            '</div>' +
            '<footer class="blog-post__footer">' +
              '<a href="blog.html" class="hbd-btn hbd-btn--outline">← Back to Blog</a>' +
              '<div class="blog-post__share">' +
                '<span style="color:var(--clr-text-muted); font-size:var(--fs-sm); margin-right:8px;">Share:</span>' +
                '<button class="share-btn share-btn--wa" title="Share on WhatsApp" onclick="window.open(\'https://wa.me/?text=\' + encodeURIComponent(\'' + post.title.replace(/'/g, "\\'") + ' \' + window.location.href), \'_blank\')" aria-label="Share on WhatsApp">💬</button>' +
                '<button class="share-btn share-btn--tw" title="Share on X / Twitter" onclick="window.open(\'https://twitter.com/intent/tweet?text=\' + encodeURIComponent(\'' + post.title.replace(/'/g, "\\'") + '\') + \'&url=\' + encodeURIComponent(window.location.href), \'_blank\')" aria-label="Share on Twitter">𝕏</button>' +
                '<button class="share-btn share-btn--fb" title="Share on Facebook" onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=\' + encodeURIComponent(window.location.href), \'_blank\')" aria-label="Share on Facebook">f</button>' +
                '<button class="share-btn share-btn--li" title="Share on LinkedIn" onclick="window.open(\'https://www.linkedin.com/shareArticle?mini=true&url=\' + encodeURIComponent(window.location.href) + \'&title=\' + encodeURIComponent(\'' + post.title.replace(/'/g, "\\'") + '\'), \'_blank\')" aria-label="Share on LinkedIn">in</button>' +
                '<button class="share-btn share-btn--copy" id="share-copy-btn" title="Copy link" onclick="(function(btn){navigator.clipboard.writeText(window.location.href).then(function(){var orig=btn.innerHTML;btn.innerHTML=\'✓\';btn.style.color=\'#4ade80\';setTimeout(function(){btn.innerHTML=orig;btn.style.color=\'\';},2000);})})(this)" aria-label="Copy link">🔗</button>' +
              '</div>' +
            '</footer>' +
          '</article>';


        // Dynamically injected elements won't be caught by the already-running
        // IntersectionObserver — force-reveal them immediately
        revealAnimatedElements();
        return;
      }
    }

    // Default: Render List View
    document.title = 'Blog | Hameem Bhai er Dokan — Creative Studio Dhaka';
    if (breadcrumb) {
      breadcrumb.innerHTML =
        '<a href="index.html" class="breadcrumb__link">Home</a>' +
        '<span class="breadcrumb__sep">›</span>' +
        '<span class="breadcrumb__current">Blog</span>';
    }

    var postsHTML = HBD.data.blogPosts.map(function (post, index) {
      return (
        '<div class="blog-card" data-animate="fade-up" style="animation-delay: ' + (index * 0.1) + 's">' +
          '<div class="blog-card__body">' +
            '<div class="blog-card__meta">' +
              '<span class="blog-card__category">' + HBD.utils.sanitize(post.category) + '</span>' +
              '<span class="blog-card__sep">•</span>' +
              '<span class="blog-card__read-time">' + post.readTime + '</span>' +
            '</div>' +
            '<h3 class="blog-card__title">' +
              '<a href="blog.html?id=' + post.id + '">' + HBD.utils.sanitize(post.title) + '</a>' +
            '</h3>' +
            '<p class="blog-card__summary">' + HBD.utils.sanitize(post.summary) + '</p>' +
            '<div class="blog-card__footer">' +
              '<div class="blog-card__author">' +
                '<img src="hameem_photo.png" alt="" class="blog-card__author-avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 8px;">' +
                '<span class="blog-card__author-name">' + HBD.utils.sanitize(post.author) + '</span>' +
              '</div>' +
              '<a href="blog.html?id=' + post.id + '" class="blog-card__link">Read Article →</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    container.innerHTML =
      '<div class="blog-index">' +
        '<div class="blog-index__header" data-animate="fade-up">' +
          '<h1 class="blog-index__title">Hameem Bhai\'s Studio Journal</h1>' +
          '<p class="blog-index__subtitle">Design insights, web development tips, and behind-the-scenes portfolio updates from Hameem Bhai er Dokan.</p>' +
        '</div>' +
        '<div class="blog-index__grid">' +
          postsHTML +
        '</div>' +
      '</div>';

    // Force-reveal dynamically injected elements
    revealAnimatedElements();
  }

  /**
   * Immediately marks all [data-animate] elements as visible.
   * Needed because IntersectionObserver won't fire for elements
   * that are already in the viewport when they're added to the DOM.
   */
  function revealAnimatedElements() {
    var els = document.querySelectorAll('[data-animate]:not(.is-visible)');
    els.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

})();
