(() => {
  "use strict";

  const dialog = document.querySelector("#copy-dialog");
  const snippet = document.querySelector("#snippet");
  const feedback = document.querySelector("#slide-copy-feedback");
  const status = document.querySelector("#status");
  const retry = document.querySelector("#slide-copy-again");
  let prepared = null;
  let operation = 0;
  let noticeTimer = 0;

  function announce(message) {
    clearTimeout(noticeTimer);
    status.textContent = message;
    noticeTimer = setTimeout(() => { status.textContent = ""; }, 6000);
  }

  function showCode(result) {
    prepared = result;
    retry.disabled = false;
    const large = result.code.length > 4 * 1024 * 1024;
    snippet.hidden = large;
    snippet.value = large ? "" : result.code;
    feedback.textContent = large
      ? "사진이 포함돼 코드가 길어요. 아래에서 전체 코드를 복사하거나 HTML로 저장하세요."
      : "자동 복사가 허용되지 않았어요. 아래 버튼으로 다시 시도하거나 코드를 직접 선택해 복사하세요.";
    if (!dialog.open) dialog.showModal();
    if (large) {
      retry.focus();
    } else {
      snippet.focus();
      snippet.select();
    }
  }

  window.copySlideCode = async (snapshot, button) => {
    const id = ++operation;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "코드 준비 중…";
    try {
      const code = await window.buildSlideCode(snapshot);
      if (id !== operation) return;
      const result = { code, effectNumber: snapshot.effectNumber };
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(code);
        if (id !== operation) return;
        button.textContent = "복사 완료";
        announce(snapshot.name + " 코드를 복사했어요. 원하는 위치에 붙여 넣으면 슬라이드만 표시돼요.");
        setTimeout(() => { if (button.isConnected) button.textContent = "코드 복사"; }, 2000);
      } catch {
        if (id !== operation) return;
        button.textContent = "코드 복사";
        showCode(result);
      }
    } catch {
      if (id === operation) announce("코드를 준비하지 못했어요. 사진을 다시 선택하고 복사해 주세요.");
      button.textContent = "코드 복사";
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (button.textContent === "코드 준비 중…") button.textContent = "코드 복사";
    }
  };

  retry.addEventListener("click", async () => {
    if (!prepared) return;
    const result = prepared;
    retry.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(result.code);
      if (prepared !== result || !dialog.open) return;
      feedback.textContent = "전체 코드를 복사했어요.";
    } catch {
      if (prepared !== result || !dialog.open) return;
      feedback.textContent = snippet.hidden
        ? "브라우저에서 복사가 제한돼 있어요. HTML 저장 버튼으로 가져갈 수 있어요."
        : "코드를 선택했어요. Ctrl+C 또는 기기의 복사 메뉴로 복사하세요.";
      if (!snippet.hidden) {
        snippet.focus();
        snippet.select();
      }
    } finally {
      if (prepared === result) retry.disabled = false;
    }
  });

  document.querySelector("#slide-download").addEventListener("click", () => {
    if (!prepared) return;
    const documentCode = '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>이미지 슬라이드</title>\n<style>body { margin: 0; }</style>\n</head>\n<body>\n' +
      prepared.code + '\n</body>\n</html>\n';
    const url = URL.createObjectURL(new Blob([documentCode], { type: "text/html;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "slide-" + String(prepared.effectNumber).padStart(2, "0") + ".html";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  });

  document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    prepared = null;
    snippet.value = "";
  });
})();
