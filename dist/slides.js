(() => {
  "use strict";
  function initializeGallery(options = {}) {
    const gallery = options.root || document.querySelector("#slide-gallery");
    const showcase = options.showcase !== false;
    const namespace = "lm-slide-" + Math.random().toString(36).slice(2);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const titles = [
      ["번호로 넘기기", "번호를 누르면 해당 이미지로 이동해요."],
      ["이전·다음 넘기기", "화살표로 이미지를 한 장씩 넘겨 보세요."],
      ["겹쳐지는 페이드", "다음 이미지가 밝아지면서 앞 장면이 사라져요."],
      ["한 장씩 덮기", "새 이미지가 왼쪽에서 들어와 앞 장을 덮어요."],
      ["가로로 펼치기", "왼쪽 가장자리에서 이미지가 펼쳐져요."],
      ["오른쪽으로 밀기", "새 장면이 들어오며 앞 장면을 오른쪽으로 밀어요."],
      ["왼쪽 순환", "연결된 이미지가 왼쪽으로 한 칸씩 움직여요."],
      ["너비 나눠 갖기", "넓은 면이 이미지를 차례로 지나가요."],
      ["집중 아코디언", "장면에 마우스를 올리거나 선택해 넓혀 보세요."],
      ["이어지는 아코디언", "좁게 접힌 이미지가 이동하며 순서대로 열려요."]
    ];
    let dispose = () => {};

    function node(tag, cls, text) {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text) el.textContent = text;
      return el;
    }

    // Three images use the original tracks. Other counts keep the same entrances,
    // holds and exits, with a three-second slot for each image.
    function keyframesFor(count) {
      if (count < 2 || count === 3) return "";
      const step = 100 / count;
      const enter = step / 3;
      const frames = (name, stops) => "@keyframes " + name + " { " +
        stops.map(([time, style]) => time.toFixed(5) + "% { " + style + " }").join(" ") + " }";
      const rules = [frames("custom-slide-3", [
        [0, "opacity:0;z-index:4"], [enter, "opacity:1;z-index:4"],
        [step, "opacity:1;z-index:4"], [step + enter, "opacity:0;z-index:1"],
        [100, "opacity:0;z-index:1"]
      ])];
      for (const effect of [4, 5, 6]) {
        const hidden = effect === 5 ? "width:0" : "transform:translateX(-100%)";
        const shown = effect === 5 ? "width:100%" : "transform:translateX(0)";
        const exited = effect === 6 ? "transform:translateX(100%)" : shown;
        rules.push(frames("custom-slide-" + effect, [
          [0, hidden + ";z-index:4"], [enter, shown + ";z-index:4"],
          [step, shown + ";z-index:4"], [step + enter, exited + ";z-index:1"],
          [100, exited + ";z-index:1"]
        ]));
      }
      const row = [];
      for (let i = 0; i < count; i++) {
        row.push([i * step, "transform:translateX(" + (-100 * i) + "%)"]);
        row.push([(i + 2 / 3) * step, "transform:translateX(" + (-100 * i) + "%)"]);
      }
      row.push([100, "transform:translateX(" + (-100 * count) + "%)"]);
      rules.push(frames("custom-slide-7", row));
      const narrow = Math.min(5, 20 / (count - 1));
      for (const [effect, property, small, large] of [
        [8, "width", narrow + "%", (100 - narrow * (count - 1)) + "%"],
        [9, "flex", "1", "20"]
      ]) {
        rules.push(frames("custom-slide-" + effect, [
          [0, property + ":" + large], [step * 0.85, property + ":" + large],
          [step, property + ":" + small], [100 - step * 0.15, property + ":" + small],
          [100, property + ":" + large]
        ]));
      }
      for (let image = 0; image < 2 * count; image++) {
        const flexAt = position => image < position || image >= position + count ? 0 : image === position ? 18 : 1;
        const stops = [];
        for (let position = 0; position < count; position++) {
          stops.push([position * step, "flex:" + flexAt(position)]);
          stops.push([(position + 2 / 3) * step, "flex:" + flexAt(position)]);
        }
        stops.push([100, "flex:" + flexAt(count)]);
        rules.push(frames("custom-slide-10-" + image, stops));
      }
      return rules.join("\n");
    }

    return function renderSlideGallery(images, size = { mode: "custom", width: 640, height: 280 }) {
      if (!Array.isArray(images) || images.length < 1 || images.length > 10 ||
          images.some(image => !image || typeof image.url !== "string" || !image.url)) {
        throw new TypeError("이미지는 URL이 있는 1~10개 항목이어야 합니다.");
      }
      if (!size || !["custom", "viewport"].includes(size.mode) ||
          ![size.width, size.height].every(value => Number.isInteger(value) && value >= 80 && value <= 7680)) {
        throw new TypeError("슬라이드 크기는 80~7680px의 정수로 지정해 주세요.");
      }
      size = { ...size };
      const pictures = images.map((image, i) => ({
        url: image.url,
        name: typeof image.name === "string" && image.name ? image.name : "이미지 " + (i + 1),
        blob: image.blob
      }));
      dispose();
      const count = pictures.length;
      const aborter = new AbortController();
      const cleanups = [];
      let active = true;
      const dynamicStyle = node("style");
      dynamicStyle.textContent = keyframesFor(count).replaceAll("custom-slide-", namespace + "-");
      gallery.replaceChildren();
      gallery.append(dynamicStyle);
      if (!showcase) {
        gallery.style.width = size.mode === "viewport" ? "100%" : "min(100%, " + size.width + "px)";
        gallery.dataset.sizeMode = size.mode;
      }
      dispose = () => {
        active = false;
        aborter.abort();
        cleanups.forEach(cleanup => cleanup());
        dynamicStyle.remove();
      };

      function listen(element, type, action) {
        element.addEventListener(type, action, { signal: aborter.signal });
      }
      function control(label, action, accessibleLabel) {
        const button = node("button", "", label);
        button.type = "button";
        if (accessibleLabel) button.setAttribute("aria-label", accessibleLabel);
        listen(button, "click", action);
        return button;
      }

      titles.forEach(([name, note], ix) => {
        const n = ix + 1;
        if (options.effectNumbers && !options.effectNumbers.includes(n)) return;
        const article = node("div", (showcase ? "effect-card " : "") + "lm-slider slide-card slide-" + n);
        const head = node("div", "card-head");
        const stage = node("div", "slide-stage");
        const track = node("div", "slide-track");
        const foot = node("div", "slide-foot");
        const controls = node("div", "slide-controls");
        const actions = [];
        const base = pictures.map((_, i) => i);
        const logical = count === 1 ? base : n === 10 ? base.concat(base)
          : n === 7 ? base.concat(0) : n < 3 ? [count - 1].concat(base, 0) : base;
        let selected = 0;
        let paused = false;
        let visible = true;
        let timer = 0;
        let toggle;
        article.classList.toggle("is-single", count === 1);
        article.classList.toggle("lm-viewport", !showcase && size.mode === "viewport");
        article.dataset.imageCount = String(count);
        article.dataset.sizeMode = size.mode;
        article.dataset.width = String(size.width);
        article.dataset.height = String(size.height);
        article.style.setProperty("--cycle", (count * 3) + "s");
        track.style.setProperty("--row-track", count === 3 ? "section_7_imageslide1" : namespace + "-7");
        if (showcase) head.append(node("span", "effect-number", String(n).padStart(2, "0")), node("h3", "effect-name", name));
        stage.setAttribute("role", "group");
        stage.setAttribute("aria-label", name + ", 이미지 " + count + "장");
        function fitStage() {
          if (!active) return;
          if (!showcase && size.mode === "viewport") return;
          const width = size.mode === "viewport" ? window.innerWidth : size.width;
          const height = size.mode === "viewport" ? Math.max(80, window.innerHeight - (count > 1 ? 44 : 0)) : size.height;
          stage.style.aspectRatio = width + " / " + height;
          if (showcase) {
            stage.style.width = "min(100%, " + Math.min(width, 420 * width / height) + "px)";
            stage.style.alignSelf = "center";
          }
        }
        fitStage();
        if (showcase && size.mode === "viewport") listen(window, "resize", fitStage);
        logical.forEach((idx, order) => {
          const panel = node(n === 9 ? "button" : "div", "slide-panel");
          panel.dataset.imageIndex = String(idx);
          const clone = count > 1 && (n === 10 ? order >= count : n === 7 ? order === count : n < 3 ? order === 0 || order === count + 1 : false);
          panel.classList.toggle("is-clone", clone);
          if (clone) panel.setAttribute("aria-hidden", "true");
          if (n === 9) {
            panel.type = "button";
            panel.setAttribute("aria-label", pictures[idx].name + " 펼치기");
            panel.disabled = count === 1;
            listen(panel, "click", () => { selected = idx; paused = true; sync(); });
          }
          const image = node("img");
          image.src = pictures[idx].url;
          image.alt = "";
          image.draggable = false;
          panel.append(image);
          if (n >= 3 && n !== 7) {
            const frameName = count === 3 ? "section_" + n + "_imageslide" + (order + 1)
              : n === 10 ? namespace + "-10-" + order : namespace + "-" + n;
            panel.style.setProperty("--track-name", frameName);
            if (count !== 3 && n !== 10) panel.style.setProperty("--delay", ((idx - count) * 3 - 1.1) + "s");
          }
          track.append(panel);
        });

        function sync() {
          if (!active) return;
          clearInterval(timer);
          article.classList.toggle("is-paused", paused);
          article.classList.toggle("is-offscreen", !visible);
          article.classList.toggle("is-reduced", motion.matches);
          article.dataset.selected = String(selected);
          if (toggle) {
            toggle.textContent = count === 1 ? "이미지 1장" : motion.matches ? "다음 장면" : paused ? "재생" : "일시 정지";
            toggle.setAttribute("aria-label", name + " " + toggle.textContent);
            toggle.disabled = count === 1;
          }
          actions.forEach((button, i) => button.setAttribute("aria-pressed", String(i === selected)));
          [...track.children].forEach((panel, i) => {
            panel.classList.toggle("is-selected", logical[i] === selected && !panel.classList.contains("is-clone"));
            if (n === 9) panel.setAttribute("aria-pressed", String(logical[i] === selected && (paused || motion.matches)));
          });
          if (count > 1 && n === 1 && !motion.matches && !paused && visible) timer = setInterval(() => move(1), 3000);
        }
        function position(step, snap) {
          track.classList.toggle("snap", snap);
          track.style.transform = "translateX(" + (-100 * step) + "%)";
          if (snap) {
            void track.offsetWidth;
            track.classList.remove("snap");
          }
        }
        function move(delta, target) {
          const last = selected;
          selected = target === undefined ? (selected + delta + count) % count : target;
          if (n < 3 && count > 1) {
            if (target === undefined && last === count - 1 && delta === 1) position(0, true);
            if (target === undefined && last === 0 && delta === -1) position(count + 1, true);
            position(selected + 1, motion.matches);
          }
          sync();
        }

        if (n < 3 && count > 1) position(1, true);
        if (n === 1 && (showcase || count > 1)) {
          pictures.forEach((picture, i) => {
            const button = control(String(i + 1), () => { paused = true; move(0, i); }, picture.name + " 보기");
            button.disabled = count === 1;
            actions.push(button);
            controls.append(button);
          });
        }
        if (n === 2 && (showcase || count > 1)) {
          const previous = control("←", () => move(-1), "이전 이미지");
          const next = control("→", () => move(1), "다음 이미지");
          previous.disabled = next.disabled = count === 1;
          controls.append(previous, next);
        } else if (n !== 2 && (showcase || count > 1)) {
          toggle = control("", () => {
            if (motion.matches) { move(1); return; }
            paused = !paused;
            sync();
          });
          controls.append(toggle);
        }
        if (options.copy !== false) {
          const copy = control("코드 복사", () => {
            const snapshot = { effectNumber: n, name, images: pictures.map(image => ({ ...image })), size: { ...size } };
            window.copySlideCode(snapshot, copy);
          }, name + " 코드 복사");
          copy.className = "slide-copy";
          controls.append(copy);
        }
        stage.append(track);
        if (showcase) {
          foot.append(node("p", "slide-note", count === 1 ? "이미지 한 장을 표시하고 있어요." : note), controls);
          article.append(head, stage, foot);
        } else {
          article.append(stage);
          if (controls.childElementCount) article.append(controls);
        }
        gallery.append(article);
        sync();
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(([entry]) => {
            if (active) { visible = entry.isIntersecting; sync(); }
          });
          observer.observe(article);
          cleanups.push(() => observer.disconnect());
        }
        cleanups.push(() => clearInterval(timer));
        listen(motion, "change", sync);
      });
    };
  }

  window.defaultSlideImages = [
    { url: "slide-tide.svg", name: "Tide · 물결" },
    { url: "slide-orbit.svg", name: "Orbit · 궤도" },
    { url: "slide-fold.svg", name: "Fold · 접힌 면" }
  ];
  const renderGallery = initializeGallery();
  let currentSize = { mode: "custom", width: 640, height: 280 };
  let currentImages = window.defaultSlideImages;
  window.renderSlideGallery = images => {
    renderGallery(images, currentSize);
    currentImages = images;
  };
  window.setSlideSize = size => {
    renderGallery(currentImages, size);
    currentSize = { ...size };
  };
  window.renderSlideGallery(window.defaultSlideImages);

  function readImage(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("사진을 코드에 담지 못했습니다. 다시 시도해 주세요."));
      reader.onabort = () => reject(new Error("사진 읽기가 중단됐습니다."));
      reader.readAsDataURL(blob);
    });
  }

  function scriptJSON(value) {
    return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, char =>
      "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
  }

  window.buildSlideCode = async function buildSlideCode({ effectNumber, images, size = { mode: "custom", width: 640, height: 280 } }) {
    if (!Number.isInteger(effectNumber) || effectNumber < 1 || effectNumber > 10 ||
        !Array.isArray(images) || images.length < 1 || images.length > 10) {
      throw new TypeError("복사할 슬라이드와 이미지를 확인해 주세요.");
    }
    if (!size || !["custom", "viewport"].includes(size.mode) ||
        ![size.width, size.height].every(value => Number.isInteger(value) && value >= 80 && value <= 7680)) {
      throw new TypeError("복사할 슬라이드 크기를 확인해 주세요.");
    }
    const copiedSize = { mode: size.mode, width: size.width, height: size.height };
    const assets = window.slideExportAssets;
    if (!assets) throw new Error("복사 기능을 준비하지 못했습니다. 페이지를 다시 열어 주세요.");
    const embedded = await Promise.all(images.map(async (image, index) => {
      let url;
      if (image.blob instanceof Blob) {
        url = await readImage(image.blob);
      } else if (typeof image.url === "string" && image.url.startsWith("data:image/")) {
        url = image.url;
      } else {
        url = assets.defaultImages[image.url];
      }
      if (!url) throw new Error("사진을 코드에 담으려면 해당 사진을 다시 선택해 주세요.");
      return { url, name: typeof image.name === "string" ? image.name : "이미지 " + (index + 1) };
    }));
    const bootstrap = "(" + initializeGallery.toString() + ")(" +
      "{ root: document.currentScript.previousElementSibling, effectNumbers: [" + effectNumber +
      "], copy: false, showcase: false })(" + scriptJSON(embedded) + ", " + scriptJSON(copiedSize) + ");";
    return "<!-- 원하는 위치에 아래 코드를 붙여 넣으세요. 크기 설정은 마지막 인수의 mode, width, height로 바꿀 수 있습니다. -->\n" +
      "<style>\n" + assets.css + "\n</style>\n" +
      "<div class=\"lm-slide-mount\"></div>\n" +
      "<script>\n" + bootstrap + "\n</script>\n";
  };

})();
