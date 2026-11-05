(() => {
  "use strict";

  const panel = document.querySelector(".slide-size-panel");
  const modes = [...document.querySelectorAll('[name="slide-size-mode"]')];
  const dimensions = {
    width: document.querySelector("#slide-width"),
    height: document.querySelector("#slide-height")
  };
  const help = document.querySelector("#slide-size-help");
  const status = document.querySelector("#slide-size-status");
  const labels = { width: "가로", height: "세로" };
  const size = {
    mode: modes.find(input => input.checked).value,
    width: dimensions.width.valueAsNumber,
    height: dimensions.height.valueAsNumber
  };

  function announce(message, error = false) {
    status.textContent = message;
    status.classList.toggle("has-error", error);
  }

  function applySize() {
    window.setSlideSize({ ...size });
  }

  function syncMode() {
    const viewport = size.mode === "viewport";
    panel.classList.toggle("is-viewport", viewport);
    for (const [key, input] of Object.entries(dimensions)) {
      input.value = String(size[key]);
      input.disabled = viewport;
      input.removeAttribute("aria-invalid");
    }
    help.textContent = viewport
      ? "브라우저 화면 너비·높이에 맞춰요. 버튼은 이미지 아래에 표시돼요. 목록에서는 크기를 줄여 미리 보여드려요."
      : "입력한 크기는 이미지 영역에 적용돼요. 좁은 화면에서는 비율을 유지하며 축소되고, 목록에서도 크기를 줄여 미리 보여드려요.";
  }

  for (const [key, input] of Object.entries(dimensions)) {
    input.addEventListener("input", () => {
      const value = input.valueAsNumber;
      if (!Number.isInteger(value) || value < 80 || value > 7680) {
        input.setAttribute("aria-invalid", "true");
        announce(labels[key] + "는 80부터 7,680까지의 정수로 입력해 주세요.", true);
        return;
      }
      input.removeAttribute("aria-invalid");
      size[key] = value;
      applySize();
      const invalid = Object.entries(dimensions).find(([, field]) => field.getAttribute("aria-invalid") === "true");
      announce(invalid
        ? labels[invalid[0]] + "는 80부터 7,680까지의 정수로 입력해 주세요."
        : size.width + " × " + size.height + "px를 적용했어요.", Boolean(invalid));
    });

    input.addEventListener("blur", () => {
      if (input.getAttribute("aria-invalid") !== "true") return;
      input.value = String(size[key]);
      input.removeAttribute("aria-invalid");
      announce(labels[key] + "는 80~7,680px로 입력할 수 있어요. " + size[key] + "px를 유지했어요.", true);
    });
  }

  modes.forEach(input => input.addEventListener("change", () => {
    if (!input.checked) return;
    size.mode = input.value;
    syncMode();
    applySize();
    announce(size.mode === "viewport"
      ? "화면 꽉 채우기를 적용했어요."
      : size.width + " × " + size.height + "px를 적용했어요.");
  }));

  syncMode();
  applySize();
})();
