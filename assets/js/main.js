/* TURN SOUND — 全站互動：行動選單、回到頂端
   取代 bootstrap.bundle / navbar-dropdown / smooth-scroll / theme script */
(() => {
  "use strict";

  /* 行動版選單 */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.dataset.open = String(open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    /* 點選單項目後收合 */
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    /* Esc 收合，並把焦點還給按鈕 */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    /* 放大到桌機寬度時清掉行動版展開狀態 */
    matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* 聯絡表單 —— 原本的 action="dev@18light.cc" 不是有效端點，送出不會送達。
     改為組出 mailto 連結，交給訪客的郵件軟體寄出。
     若日後接上 Formspree/Google Form 等服務，把 form 的 action/method 換掉並移除這段即可。 */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = `網站來信：${d.get("name") || ""}`;
      const body = [
        `姓名：${d.get("name") || ""}`,
        `電話：${d.get("phone") || ""}`,
        `Email：${d.get("email") || ""}`,
        "",
        d.get("message") || "",
      ].join("\n");
      location.href =
        `mailto:turnsoundstudio@gmail.com?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    });
  }

  /* 作品案例：標籤篩選 */
  const filters = document.querySelector(".filters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      filters.querySelectorAll("button").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );

      const want = btn.dataset.tag;
      document.querySelectorAll(".works__item").forEach((item) => {
        const tags = item.dataset.tag.split(",").map((t) => t.trim());
        item.hidden = want !== "all" && !tags.includes(want);
      });
    });
  }

  /* 作品案例：燈箱 */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const body = lightbox.querySelector(".lightbox__body");

    const close = () => {
      body.replaceChildren();          /* 清空以停止 YouTube 播放 */
      lightbox.close();
    };

    document.querySelectorAll(".works__item").forEach((item) => {
      item.addEventListener("click", () => {
        const { type, src } = item.dataset;
        const el = document.createElement(type === "video" ? "iframe" : "img");
        el.src = type === "video" ? src + "?autoplay=1&rel=0" : src;
        if (type === "video") {
          el.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
          el.allowFullscreen = true;
          el.title = "作品影片";
        } else {
          el.alt = "作品圖片";
        }
        body.replaceChildren(el);
        lightbox.showModal();
      });
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", close);
    /* 點背景關閉：只在點到 dialog 本身（而非內容）時 */
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    /* Esc 走原生 cancel，仍要清空 iframe */
    lightbox.addEventListener("close", () => body.replaceChildren());
  }

  /* 回到頂端 */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const sync = () => {
      toTop.dataset.show = String(window.scrollY > 400);
    };
    addEventListener("scroll", sync, { passive: true });
    sync();
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
