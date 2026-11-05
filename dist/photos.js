(() => {
  "use strict";

  const input = document.querySelector("#photo-input");
  const countInput = document.querySelector("#photo-count");
  const reset = document.querySelector("#reset-photos");
  const thumbnails = document.querySelector("#photo-thumbs");
  const status = document.querySelector("#photo-status");
  const label = document.querySelector("#photo-button-text");
  const panel = document.querySelector(".photo-panel");
  const defaults = window.defaultSlideImages;
  const maximumFiles = 10;
  const maximumBytes = 10 * 1024 * 1024;
  let slots = defaultSlots();
  let displayedCount = defaults.length;
  let revision = 0;
  let bulkLoading = false;
  const pendingSlots = new Map();

  function defaultSlots() {
    return Array.from({ length: maximumFiles }, (_, index) => ({ ...defaults[index % defaults.length] }));
  }

  function revoke(images) {
    images.forEach(image => {
      if (image.blob) URL.revokeObjectURL(image.url);
    });
  }

  function showMessage(message, error = false) {
    status.textContent = message;
    status.classList.toggle("has-error", error);
  }

  function syncControls() {
    const busy = bulkLoading || pendingSlots.size > 0;
    const hasUploads = slots.some(image => image.blob);
    panel.setAttribute("aria-busy", String(busy));
    reset.disabled = !busy && !hasUploads && displayedCount === defaults.length;
    label.textContent = hasUploads ? "여러 사진 바꾸기" : "여러 사진 선택";
  }

  function cancelPending() {
    revision++;
    bulkLoading = false;
    pendingSlots.clear();
  }

  function showThumbnails() {
    const focusedSlot = document.activeElement?.dataset.slotIndex;
    const fragment = document.createDocumentFragment();
    slots.slice(0, displayedCount).forEach((image, index) => {
      const item = document.createElement("li");
      const picker = document.createElement("label");
      picker.className = "photo-slot-picker";
      const thumbnail = document.createElement("img");
      thumbnail.src = image.url;
      thumbnail.alt = "";
      const caption = document.createElement("span");
      caption.className = "photo-slot-action";
      caption.textContent = (index + 1) + "번 사진 바꾸기";
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.dataset.slotIndex = String(index);
      fileInput.setAttribute("aria-label", (index + 1) + "번 사진 바꾸기, 현재 " + image.name);
      fileInput.setAttribute("aria-describedby", "photo-help photo-status");
      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        fileInput.value = "";
        if (file) replaceSlot(index, file);
      });
      const name = document.createElement("span");
      name.className = "photo-slot-name";
      name.textContent = image.name;
      name.title = image.name;
      picker.append(thumbnail, caption, fileInput);
      item.append(picker, name);
      fragment.append(item);
    });
    thumbnails.replaceChildren(fragment);
    if (focusedSlot !== undefined) {
      thumbnails.querySelector('[data-slot-index="' + focusedSlot + '"]')?.focus({ preventScroll: true });
    }
  }

  function render() {
    window.renderSlideGallery(slots.slice(0, displayedCount));
    countInput.value = String(displayedCount);
    countInput.removeAttribute("aria-invalid");
    showThumbnails();
    syncControls();
  }

  async function readPhoto(file) {
    if (file.size > maximumBytes || (file.type && !file.type.startsWith("image/"))) {
      throw new Error("지원하지 않는 파일");
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    try {
      image.src = url;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error("이미지를 읽을 수 없음");
      return { url, name: file.name, blob: file };
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  async function replaceSlot(index, file) {
    if (bulkLoading) cancelPending();
    const currentRevision = revision;
    const token = {};
    pendingSlots.set(index, token);
    syncControls();
    showMessage((index + 1) + "번 사진을 불러오고 있어요…");
    let image;
    try {
      image = await readPhoto(file);
    } catch {
      if (revision !== currentRevision || pendingSlots.get(index) !== token) return;
      pendingSlots.delete(index);
      syncControls();
      showMessage("사진을 읽지 못했어요. 이미지 형식과 장당 10MB 이하인지 확인해 주세요.", true);
      return;
    }
    if (revision !== currentRevision || pendingSlots.get(index) !== token) {
      revoke([image]);
      return;
    }
    pendingSlots.delete(index);
    const previous = slots[index];
    slots[index] = image;
    render();
    revoke([previous]);
    showMessage(index < displayedCount
      ? (index + 1) + "번 사진을 10개 효과에 적용했어요."
      : (index + 1) + "번 사진을 보관했어요. 이미지 개수를 늘리면 다시 볼 수 있어요.");
  }

  countInput.addEventListener("input", () => {
    const count = countInput.valueAsNumber;
    if (!Number.isInteger(count) || count < 1 || count > maximumFiles) {
      countInput.setAttribute("aria-invalid", "true");
      showMessage("이미지 개수는 1부터 10까지의 정수로 입력해 주세요.", true);
      return;
    }
    countInput.removeAttribute("aria-invalid");
    if (bulkLoading) cancelPending();
    displayedCount = count;
    render();
    showMessage(count + "개의 이미지를 10개 효과에 적용했어요.");
  });

  countInput.addEventListener("blur", () => {
    if (countInput.getAttribute("aria-invalid") !== "true") return;
    countInput.value = String(displayedCount);
    countInput.removeAttribute("aria-invalid");
    showMessage("이미지 개수는 1부터 10까지 입력할 수 있어요. " + displayedCount + "개를 유지했어요.", true);
  });

  input.addEventListener("change", async () => {
    const files = Array.from(input.files);
    input.value = "";
    if (!files.length) return;
    cancelPending();
    const currentRevision = revision;
    if (files.length > maximumFiles) {
      syncControls();
      showMessage("사진은 한 번에 최대 10장까지 선택해 주세요.", true);
      return;
    }
    bulkLoading = true;
    syncControls();
    showMessage("사진을 불러오고 있어요…");
    const results = await Promise.allSettled(files.map(readPhoto));
    const images = results.filter(result => result.status === "fulfilled").map(result => result.value);
    if (currentRevision !== revision) {
      revoke(images);
      return;
    }
    bulkLoading = false;
    if (!images.length) {
      syncControls();
      showMessage("사진을 읽지 못했어요. 이미지 형식과 장당 10MB 이하인지 확인해 주세요.", true);
      return;
    }
    const previous = slots.slice(0, images.length);
    images.forEach((image, index) => { slots[index] = image; });
    displayedCount = images.length;
    render();
    revoke(previous);
    const failed = results.length - images.length;
    const message = images.length + "장의 사진을 10개 효과에 적용했어요.";
    showMessage(failed ? message + " 읽지 못한 " + failed + "개 파일은 제외했어요." : message, failed > 0);
  });

  reset.addEventListener("click", () => {
    cancelPending();
    const previous = slots;
    slots = defaultSlots();
    displayedCount = defaults.length;
    input.value = "";
    render();
    revoke(previous);
    showMessage("기본 예시 3장으로 비교하고 있어요.");
  });

  showThumbnails();
  syncControls();
})();
