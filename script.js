/* azghr — A Learner's Log : page-turn engine */
(function () {
  "use strict";

  var book = document.getElementById("book");
  var leaves = Array.prototype.slice.call(book.querySelectorAll(".leaf"));
  var total = leaves.length;
  var current = 0;                    // leaves flipped so far
  var isMobile = window.matchMedia("(max-width: 720px)");

  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var indicator = document.getElementById("pageIndicator");

  var PAGE_LABELS = [
    "cover", "preface", "contents",
    "i · open source", "ii · public repos", "ii · public repos",
    "iii · experience", "iv · private projects", "iv · private projects",
    "appendix", "correspondence", "study record", "finis", "back cover"
  ];

  function setZ() {
    leaves.forEach(function (leaf, i) {
      // unflipped leaves stack high, flipped ones settle underneath in order
      leaf.style.zIndex = i < current ? i + 1 : total * 2 - i;
    });
  }

  function bookPosition() {
    book.classList.toggle("is-closed-start", current === 0);
    book.classList.toggle("is-closed-end", current === total);
  }

  function render() {
    leaves.forEach(function (leaf, i) {
      leaf.classList.toggle("flipped", i < current);
      leaf.classList.toggle("visible", i === current - 1 || i === current);
    });
    setZ();
    bookPosition();

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total;

    // one clean label per spread: the right-hand page (left-hand on mobile)
    var page = isMobile.matches
      ? Math.min(current * 2, total * 2 - 1)
      : Math.min(current * 2 + 1, total * 2 - 1);
    indicator.textContent = PAGE_LABELS[page];
  }

  function next() { if (current < total) { current++; render(); } }
  function prev() { if (current > 0) { current--; render(); } }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
    if (e.key === "Home") { e.preventDefault(); current = 0; render(); }
    if (e.key === "End") { e.preventDefault(); current = total; render(); }
  });

  // corner hotspots show the cursor affordance; clicks are handled by the book click handler
  var zones = document.createElement("div");
  zones.innerHTML =
    '<div class="flip-zone left" title="Turn back"></div>' +
    '<div class="flip-zone right" title="Turn the page"></div>';
  book.appendChild(zones);

  // TOC jumps: each entry carries its target page in data-page
  // leaves flipped = floor(page / 2)
  document.querySelectorAll(".toc li[data-page]").forEach(function (li) {
    li.setAttribute("role", "link");
    li.setAttribute("tabindex", "0");
    function jump() {
      current = Math.min(Math.floor(parseInt(li.dataset.page, 10) / 2), total);
      render();
    }
    li.addEventListener("click", jump);
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
    });
  });

  // swipe (touch)
  var startX = null;
  book.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  book.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (dx < -40) next();
    else if (dx > 40) prev();
    startX = null;
  }, { passive: true });

  // mouse drag + mouse wheel
  var dragging = false, dragStartX = 0, dragMoved = false;

  book.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch") return; // touch handled above
    dragging = true;
    dragMoved = false;
    dragStartX = e.clientX;
  });

  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    if (Math.abs(e.clientX - dragStartX) > 8) dragMoved = true;
  });

  window.addEventListener("pointerup", function (e) {
    if (!dragging) return;
    dragging = false;
    if (!dragMoved) return; // treat as a click, let links/zones work
    var dx = e.clientX - dragStartX;
    if (dx < -40) next();
    else if (dx > 40) prev();
  });

  book.addEventListener("click", function (e) {
    // avoid flipping when the click was on a link or the TOC
    if (e.target.closest("a") || e.target.closest(".toc") || e.target.closest(".nav-btn")) return;
    if (dragMoved) return;
    // click on the left half flips back, right half flips forward
    var rect = book.getBoundingClientRect();
    if (e.clientX - rect.left > rect.width / 2) next();
    else prev();
  });

  var wheelCooldown = 0;
  window.addEventListener("wheel", function (e) {
    var now = Date.now();
    if (now - wheelCooldown < 900 || Math.abs(e.deltaY) < 25) return;
    wheelCooldown = now;
    if (e.deltaY > 0) next();
    else prev();
  }, { passive: true });

  render();
})();
