(() => {
  "use strict";

  const effects = window.motionEffects;
  const input = document.querySelector("#phrase");
  const counter = document.querySelector("#count");
  const gallery = document.querySelector("#gallery");
  const status = document.querySelector("#status");
  const dialog = document.querySelector("#copy-dialog");
  const snippet = document.querySelector("#snippet");
  const samplePhrase = "HTML5 CSS3 Animation";
  const limit = 80;
  const segmenter = typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter("ko", { granularity: "grapheme" })
    : null;
  const cards = [];
  let currentText = samplePhrase;
  let counterWarning = false;
  const appearance = { size: 36, color: "#493491" };
  const sizeInput = document.querySelector("#text-size");
  const colorInput = document.querySelector("#text-color");
  const colorHex = document.querySelector("#text-color-hex");
  const appearanceStatus = document.querySelector("#text-appearance-status");

  function applyAppearance(node) {
    node.style.fontSize = appearance.size + "px";
    node.style.color = appearance.color;
  }

  function updateAppearance() {
    gallery.querySelectorAll(".lm-text").forEach(applyAppearance);
  }

  function appearanceMessage(message, error = false) {
    appearanceStatus.textContent = message;
    appearanceStatus.classList.toggle("has-error", error);
  }

  function normalizeColor(value) {
    const match = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return null;
    const hex = match[1].toLowerCase();
    return "#" + (hex.length === 3 ? [...hex].map(char => char + char).join("") : hex);
  }

  sizeInput.addEventListener("input", () => {
    const value = sizeInput.valueAsNumber;
    if (!Number.isInteger(value) || value < 8 || value > 240) {
      sizeInput.setAttribute("aria-invalid", "true");
      appearanceMessage("글자 크기는 8~240의 정수로 입력해 주세요.", true);
      return;
    }
    sizeInput.removeAttribute("aria-invalid");
    appearance.size = value;
    updateAppearance();
    appearanceMessage(value + "px를 적용했어요.");
  });
  sizeInput.addEventListener("blur", () => {
    if (sizeInput.getAttribute("aria-invalid") !== "true") return;
    sizeInput.value = String(appearance.size);
    sizeInput.removeAttribute("aria-invalid");
    appearanceMessage("글자 크기는 8~240px로 입력할 수 있어요. " + appearance.size + "px를 유지했어요.", true);
  });
  colorInput.addEventListener("input", () => {
    const color = normalizeColor(colorInput.value);
    if (!color) return;
    appearance.color = color;
    colorHex.value = color;
    colorHex.removeAttribute("aria-invalid");
    updateAppearance();
    appearanceMessage(color.toUpperCase() + " 색상을 적용했어요.");
  });
  colorHex.addEventListener("input", () => {
    const color = normalizeColor(colorHex.value);
    if (!color) {
      colorHex.setAttribute("aria-invalid", "true");
      appearanceMessage("색상 코드는 #RGB 또는 #RRGGBB 형식으로 입력해 주세요.", true);
      return;
    }
    colorHex.removeAttribute("aria-invalid");
    appearance.color = color;
    colorInput.value = color;
    updateAppearance();
    appearanceMessage(color.toUpperCase() + " 색상을 적용했어요.");
  });
  colorHex.addEventListener("blur", () => {
    const invalid = colorHex.getAttribute("aria-invalid") === "true";
    colorHex.value = appearance.color;
    colorHex.removeAttribute("aria-invalid");
    if (invalid) appearanceMessage("올바른 색상 코드를 입력해 주세요. " + appearance.color.toUpperCase() + " 색상을 유지했어요.", true);
  });
  document.querySelector("#text-appearance-reset").addEventListener("click", () => {
    appearance.size = 36;
    appearance.color = "#493491";
    sizeInput.value = String(appearance.size);
    colorInput.value = colorHex.value = appearance.color;
    sizeInput.removeAttribute("aria-invalid");
    colorHex.removeAttribute("aria-invalid");
    updateAppearance();
    appearanceMessage("글자 크기와 색상을 초기화했어요.");
  });

  const baseCSS = `/* 새 HTML 파일에 붙여 넣어 사용할 수 있는 독립 예제입니다. */
.lm-text {
  display: block;
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: system-ui, sans-serif;
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
}
.lm-text .lm-letter { display: inline-block; }`;


  const fontPresets = {
    sans: 'system-ui, -apple-system, "Malgun Gothic", sans-serif',
    serif: '"Noto Serif KR", "Batang", "바탕", Georgia, serif',
    mono: '"D2Coding", "SFMono-Regular", Consolas, "Liberation Mono", monospace'
  };
  const fontSelect = document.querySelector("#font-preset");
  const fontName = document.querySelector("#font-family");
  const fontFile = document.querySelector("#font-file");
  const fontStatus = document.querySelector("#font-status");
  const fontStyles = document.createElement("style");
  document.head.append(fontStyles);
  let uploadedFont = null;
  let fontOperation = 0;
  const fontNamespace = window.crypto?.randomUUID?.() ||
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

  // Quote a font family as one CSS string, including HTML raw-text delimiters.
  function quoteFamily(value) {
    return '"' + value.replace(/[\0-\x1f\x7f"\\<>]/g, char =>
      "\\" + char.codePointAt(0).toString(16) + " ") + '"';
  }

  function selectedFamily() {
    if (fontSelect.value === "uploaded" && uploadedFont) return quoteFamily(uploadedFont.family) + ", sans-serif";
    if (fontSelect.value === "custom" && fontName.value.trim()) return quoteFamily(fontName.value.trim()) + ", sans-serif";
    return fontPresets[fontSelect.value] || fontPresets.sans;
  }

  function fontCSS(embed = false) {
    const face = embed && fontSelect.value === "uploaded" && uploadedFont
      ? "@font-face { font-family: " + quoteFamily(uploadedFont.family) +
        '; src: url("' + uploadedFont.dataURL + '"); font-display: swap; }\n'
      : "";
    return face + (embed ? "" : ".lm-text { font-family: " + selectedFamily() + "; }");
  }

  function updateFont(message = "") {
    document.querySelector("#font-custom").hidden = fontSelect.value !== "custom";
    fontStyles.textContent = fontCSS();
    fontStatus.textContent = message;
  }

  function cancelPendingFont() {
    fontOperation++;
    fontFile.removeAttribute("aria-busy");
  }

  function readFontData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("글꼴 파일을 읽을 수 없어요."));
      reader.onabort = () => reject(new Error("글꼴 파일 읽기가 중단됐어요."));
      reader.readAsDataURL(file);
    });
  }

  fontSelect.addEventListener("change", () => {
    cancelPendingFont();
    updateFont(fontSelect.value === "custom" ? "이 기기에 설치된 글꼴의 이름을 입력하세요."
      : fontSelect.value === "uploaded" && uploadedFont ? uploadedFont.name + " 적용됨" : "");
  });
  fontName.addEventListener("input", () => {
    updateFont(fontName.value.trim() ? "지정한 글꼴이 없으면 기본 고딕으로 표시돼요." : "");
  });
  fontFile.addEventListener("click", () => { fontFile.value = ""; });
  fontFile.addEventListener("change", async () => {
    const file = fontFile.files[0];
    if (!file) return;
    const operation = ++fontOperation;
    if (!/\.(woff2?|ttf|otf)$/i.test(file.name) || !file.size || file.size > 30 * 1024 * 1024) {
      fontStatus.textContent = "30MB 이하의 WOFF2·WOFF·TTF·OTF 글꼴 파일을 선택해 주세요.";
      fontFile.value = "";
      fontFile.removeAttribute("aria-busy");
      return;
    }
    fontStatus.textContent = "글꼴을 확인하고 있어요…";
    fontFile.setAttribute("aria-busy", "true");
    try {
      const [buffer, dataURL] = await Promise.all([file.arrayBuffer(), readFontData(file)]);
      if (operation !== fontOperation) return;
      const family = "MotionUploadedFont-" + fontNamespace + "-" + operation;
      const face = new FontFace(family, buffer);
      await face.load();
      if (operation !== fontOperation) return;
      document.fonts.add(face);
      if (uploadedFont) document.fonts.delete(uploadedFont.face);
      uploadedFont = { family, face, dataURL, name: file.name };
      const option = fontSelect.querySelector('[value="uploaded"]');
      option.disabled = false;
      option.textContent = "파일 · " + file.name;
      fontSelect.value = "uploaded";
      updateFont(file.name + " 적용됨 · 복사한 코드에 글꼴이 포함돼요.");
    } catch {
      if (operation !== fontOperation) return;
      fontStatus.textContent = "글꼴을 읽을 수 없어요. 다른 글꼴 파일을 선택해 주세요.";
      fontFile.value = "";
    } finally {
      if (operation === fontOperation) fontFile.removeAttribute("aria-busy");
    }
  });
  document.querySelector("#font-reset").addEventListener("click", () => {
    cancelPendingFont();
    if (uploadedFont) document.fonts.delete(uploadedFont.face);
    uploadedFont = null;
    fontSelect.querySelector('[value="uploaded"]').disabled = true;
    fontSelect.querySelector('[value="uploaded"]').textContent = "업로드한 글꼴";
    fontSelect.value = "sans";
    fontFile.value = "";
    fontName.value = "";
    updateFont("기본 글꼴로 돌아왔어요.");
  });
  updateFont();

  function graphemes(text) {
    return segmenter ? Array.from(segmenter.segment(text), item => item.segment) : Array.from(text);
  }

  function motionText(effect, text) {
    const node = document.createElement("span");
    node.className = "motion-text lm-text lm-" + effect.id;
    applyAppearance(node);
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", text);
    const characters = graphemes(text);
    const letters = characters.filter(char => char.trim() !== "").length;
    node.style.setProperty("--n", letters);
    let index = 0;
    for (const char of characters) {
      if (/^\s+$/u.test(char)) {
        node.append(document.createTextNode(char));
        continue;
      }
      const span = document.createElement("span");
      span.className = "lm-letter";
      span.setAttribute("aria-hidden", "true");
      span.dataset.slot = String((index % 18) + 1);
      span.style.setProperty("--i", index++);
      span.textContent = char;
      node.append(span);
    }
    return node;
  }

  function paint(card) {
    card.sample.replaceChildren(motionText(card.effect, currentText));
  }

  function setPhrase() {
    const raw = graphemes(input.value);
    const clipped = raw.length > limit;
    const value = clipped ? raw.slice(0, limit).join("") : input.value;
    if (clipped) input.value = value;
    counter.textContent = Math.min(raw.length, limit) + " / " + limit;
    if (clipped && !counterWarning) status.textContent = "문구는 최대 80자까지 입력할 수 있습니다.";
    counterWarning = clipped;
    const next = value.trim() ? value : samplePhrase;
    if (currentText === next) return;
    currentText = next;
    cards.forEach(paint);
  }

  function cssFor(effect) {
    return effect.css + "\n@media (prefers-reduced-motion: reduce) {\n" +
      "  .lm-" + effect.id + ", .lm-" + effect.id + " .lm-letter { animation: none !important; }\n}";
  }

  function exportMarkup(effect) {
    const preview = motionText(effect, currentText);
    preview.classList.remove("motion-text");
    preview.style.fontFamily = selectedFamily();
    return "<style>\n" + baseCSS + "\n\n" + cssFor(effect) + "\n" + fontCSS(true) + "\n</style>\n\n" + preview.outerHTML;
  }

  async function copyCode(effect, button) {
    const code = exportMarkup(effect);
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code);
      button.textContent = "복사 완료";
      status.textContent = effect.name + " 코드를 복사했습니다.";
      clearTimeout(button.restoreTimer);
      button.restoreTimer = setTimeout(() => { button.textContent = "코드 복사"; }, 1800);
    } catch {
      snippet.value = code;
      if (!dialog.open) dialog.showModal();
      snippet.focus();
      snippet.select();
    }
  }

  function makeButton(className, label, accessibleName, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.setAttribute("aria-label", accessibleName);
    button.addEventListener("click", () => action(button));
    return button;
  }

  const styles = document.createElement("style");
  styles.textContent = baseCSS + "\n" + effects.map(cssFor).join("\n");
  document.head.prepend(styles);
  for (const [index, effect] of effects.entries()) {
    const article = document.createElement("article");
    article.className = "effect-card";
    const head = document.createElement("div");
    head.className = "card-head";
    const number = document.createElement("span");
    number.className = "effect-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("h3");
    title.className = "effect-name";
    title.textContent = effect.name;
    head.append(number, title);
    const sample = document.createElement("div");
    sample.className = "sample";
    const card = { sample, effect };
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.append(
      makeButton("replay", "다시 재생", effect.name + " 다시 재생", () => {
        paint(card);
        status.textContent = effect.name + " 효과를 다시 재생했습니다.";
      }),
      makeButton("copy", "코드 복사", effect.name + " 코드 복사", button => copyCode(effect, button))
    );
    article.append(head, sample, actions);
    gallery.append(article);
    cards.push(card);
    paint(card);
  }

  // Show the motion when a card first comes into view, including lower rows.
  if ("IntersectionObserver" in window) {
    const cardMap = new Map(cards.map(card => [card.sample, card]));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        paint(cardMap.get(entry.target));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    cards.forEach(card => observer.observe(card.sample));
  }

  input.addEventListener("input", event => {
    if (!event.isComposing) setPhrase();
  });
  input.addEventListener("compositionend", setPhrase);
  document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
  setPhrase();
})();
