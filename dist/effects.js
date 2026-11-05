/* Adapted from APP/13.text-animation/css/style1.css. The original 18 letter tracks
 * run over five seconds. Their offsets, opacity, transforms and timing are preserved.
 * Original left: 90px / top: 60px layout margins are rebased to the text baseline.
 * Repeated source keyframes use the last definition, as CSS does.
 */
(() => {
  "use strict";

  function makeEffect(number, name, tracks, parentTrack) {
    const id = "fx" + String(number).padStart(2, "0");
    const scope = ".lm-" + id;
    const letters = scope + " .lm-letter";
    const timing = [
      "animation-duration: var(--lm-duration, 5s);",
      "animation-timing-function: linear;",
      "animation-iteration-count: var(--lm-iterations, 1);",
      "animation-play-state: var(--lm-play-state, running);",
      "animation-fill-mode: none;"
    ].join("\n  ");
    function keyframes(name, declarations) {
      return "@keyframes " + name + " {\n  " + declarations.join("\n  ") + "\n}";
    }
    const rules = [
      letters + " {\n  display: inline-block;\n  position: relative;\n  left: 0;\n  top: 0;\n  " +
        (number === 10 ? "transform-origin: center bottom;\n  " : "") + timing + "\n}"
    ];
    tracks.forEach((declarations, index) => {
      const slot = index + 1;
      const animation = "lm-" + id + "-s" + slot;
      rules.push(
        letters + '[data-slot="' + slot + '"],\n' +
        letters + ":not([data-slot]):nth-of-type(18n+" + slot + ") { animation-name: " + animation + "; }",
        keyframes(animation, declarations)
      );
    });
    if (parentTrack) {
      const animation = "lm-" + id + "-phrase";
      rules.push(scope + " {\n  animation-name: " + animation + ";\n  " + timing + "\n}", keyframes(animation, parentTrack));
    }
    const motionSelectors = parentTrack ? scope + ", " + letters : letters;
    rules.push("@media (prefers-reduced-motion: reduce) {\n  " + motionSelectors + " { animation: none !important; }\n}");
    return { id, name, css: rules.join("\n\n") };
  }

  window.motionEffects = [
    makeEffect(1, "회전하며 모이기", [
      [
        "0% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "5% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "4% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "5% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "10% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "9% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "10% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "15% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "14% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "15% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "20% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "19% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "20% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "25% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "24% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "25% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "30% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "29% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "30% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "35% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "34% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "35% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "40% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "39% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "40% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "45% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "44% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "45% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "50% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "49% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "50% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "55% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "54% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "55% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "60% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "59% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "60% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "65% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "64% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "65% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "70% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "69% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "70% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "75% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "74% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "75% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "80% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "79% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "80% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "85% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "84% { opacity: 0; transform: scale(10) rotate(-360deg); }",
        "85% { opacity: 1; transform: scale(10) rotate(-360deg); }",
        "90% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ]
    ]),
    makeEffect(2, "확대 후 사라지기", [
      [
        "0% { opacity: 1; }",
        "5% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "2.4% { opacity: 0; }",
        "2.5% { opacity: 1; }",
        "10% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "7.4% { opacity: 0; }",
        "7.5% { opacity: 1; }",
        "15% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "9.9% { opacity: 0; }",
        "10% { opacity: 1; }",
        "20% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "12.4% { opacity: 0; }",
        "12.5% { opacity: 1; }",
        "25% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "14.9% { opacity: 0; }",
        "15% { opacity: 1; }",
        "30% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "17.4% { opacity: 0; }",
        "17.5% { opacity: 1; }",
        "35% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "19.9% { opacity: 0; }",
        "20% { opacity: 1; }",
        "40% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "22.4% { opacity: 0; }",
        "22.5% { opacity: 1; }",
        "45% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "24.9% { opacity: 0; }",
        "25% { opacity: 1; }",
        "50% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "27.4% { opacity: 0; }",
        "27.5% { opacity: 1; }",
        "55% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "29.9% { opacity: 0; }",
        "30% { opacity: 1; }",
        "60% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "32.4% { opacity: 0; }",
        "32.5% { opacity: 1; }",
        "65% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "34.9% { opacity: 0; }",
        "35% { opacity: 1; }",
        "70% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "37.4% { opacity: 0; }",
        "37.5% { opacity: 1; }",
        "75% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "39.9% { opacity: 0; }",
        "40% { opacity: 1; }",
        "80% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "42.4% { opacity: 0; }",
        "42.5% { opacity: 1; }",
        "85% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "44.9% { opacity: 0; }",
        "45% { opacity: 1; }",
        "90% { opacity: 0; transform: scale(2); }",
        "100% { opacity: 0; }"
      ]
    ]),
    makeEffect(3, "왼쪽에서 밀려오기", [
      [
        "0% { opacity: 0; }",
        "5% { opacity: 1; }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "5% { opacity: 0; left: -90px; }",
        "10% { opacity: 1; left: 0; }",
        "100% { opacity: 1; left: 0; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "10% { opacity: 0; left: -90px; }",
        "15% { opacity: 1; left: 1px; }",
        "100% { opacity: 1; left: 1px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "15% { opacity: 0; left: -90px; }",
        "20% { opacity: 1; left: 2px; }",
        "100% { opacity: 1; left: 2px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "20% { opacity: 0; left: -90px; }",
        "25% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "25% { opacity: 0; left: -90px; }",
        "30% { opacity: 1; left: 3.5px; }",
        "100% { opacity: 1; left: 3.5px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "30% { opacity: 0; left: -90px; }",
        "35% { opacity: 1; left: 4.5px; }",
        "100% { opacity: 1; left: 4.5px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "35% { opacity: 0; left: -90px; }",
        "40% { opacity: 1; left: 4.8px; }",
        "100% { opacity: 1; left: 4.8px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "40% { opacity: 0; left: -90px; }",
        "45% { opacity: 1; left: 5.8px; }",
        "100% { opacity: 1; left: 5.8px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "45% { opacity: 0; left: -90px; }",
        "50% { opacity: 1; left: 2px; }",
        "100% { opacity: 1; left: 2px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "50% { opacity: 0; left: -90px; }",
        "55% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "55% { opacity: 0; left: -90px; }",
        "60% { opacity: 1; left: 4px; }",
        "100% { opacity: 1; left: 4px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "60% { opacity: 0; left: -90px; }",
        "65% { opacity: 1; left: 4.5px; }",
        "100% { opacity: 1; left: 4.5px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "65% { opacity: 0; left: -90px; }",
        "70% { opacity: 1; left: 4px; }",
        "100% { opacity: 1; left: 4px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "70% { opacity: 0; left: -90px; }",
        "75% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "75% { opacity: 0; left: -90px; }",
        "80% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "80% { opacity: 0; left: -90px; }",
        "85% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ],
      [
        "0% { opacity: 0; left: -90px; }",
        "85% { opacity: 0; left: -90px; }",
        "90% { opacity: 1; left: 3px; }",
        "100% { opacity: 1; left: 3px; }"
      ]
    ]),
    makeEffect(4, "차례로 팝업 후 점멸", [
      [
        "0% { opacity: 0; }",
        "8.9% { opacity: 0; }",
        "9% { opacity: 1; transform: scale(2.5); }",
        "13% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "11.9% { opacity: 0; }",
        "12% { opacity: 1; transform: scale(2.5); }",
        "16% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "14.9% { opacity: 0; }",
        "15% { opacity: 1; transform: scale(2.5); }",
        "19% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "17.9% { opacity: 0; }",
        "18% { opacity: 1; transform: scale(2.5); }",
        "22% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "20.9% { opacity: 0; }",
        "21% { opacity: 1; transform: scale(2.5); }",
        "25% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "23.9% { opacity: 0; }",
        "24% { opacity: 1; transform: scale(2.5); }",
        "28% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "26.9% { opacity: 0; }",
        "27% { opacity: 1; transform: scale(2.5); }",
        "31% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "29.9% { opacity: 0; }",
        "30% { opacity: 1; transform: scale(2.5); }",
        "34% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "32.9% { opacity: 0; }",
        "33% { opacity: 1; transform: scale(2.5); }",
        "37% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "38.9% { opacity: 0; }",
        "39% { opacity: 1; transform: scale(2.5); }",
        "43% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "41.9% { opacity: 0; }",
        "42% { opacity: 1; transform: scale(2.5); }",
        "46% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "47.9% { opacity: 0; }",
        "48% { opacity: 1; transform: scale(2.5); }",
        "52% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "50.9% { opacity: 0; }",
        "51% { opacity: 1; transform: scale(2.5); }",
        "55% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "53.9% { opacity: 0; }",
        "54% { opacity: 1; transform: scale(2.5); }",
        "58% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "56.9% { opacity: 0; }",
        "57% { opacity: 1; transform: scale(2.5); }",
        "61% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "59.9% { opacity: 0; }",
        "60% { opacity: 1; transform: scale(2.5); }",
        "64% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "62.9% { opacity: 0; }",
        "63% { opacity: 1; transform: scale(2.5); }",
        "67% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ],
      [
        "0% { opacity: 0; }",
        "65.9% { opacity: 0; }",
        "66% { opacity: 1; transform: scale(2.5); }",
        "70% { opacity: 1; transform: scale(1); }",
        "100% { opacity: 1; }"
      ]
    ], [
      "0% { opacity: 1; }",
      "89.9% { opacity: 1; }",
      "90% { opacity: 0; }",
      "91.9% { opacity: 0; }",
      "92% { opacity: 1; }",
      "93.9% { opacity: 1; }",
      "94% { opacity: 0; }",
      "95.9% { opacity: 0; }",
      "96% { opacity: 1; }",
      "98% { opacity: 1; }",
      "98.1% { opacity: 0; }",
      "100% { opacity: 0; }"
    ]),
    makeEffect(5, "한 글자씩 튀어 오르기", [
      [
        "0% { opacity: 0; }",
        "4% { opacity: 0; top: 0; }",
        "5% { opacity: 1; top: -63px; }",
        "6% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "9% { opacity: 0; top: 0; }",
        "10% { opacity: 1; top: -63px; }",
        "11% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "14% { opacity: 0; top: 0; }",
        "15% { opacity: 1; top: -63px; }",
        "16% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "19% { opacity: 0; top: 0; }",
        "20% { opacity: 1; top: -63px; }",
        "21% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "24% { opacity: 0; top: 0; }",
        "25% { opacity: 1; top: -63px; }",
        "26% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "29% { opacity: 0; top: 0; }",
        "30% { opacity: 1; top: -63px; }",
        "31% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "34% { opacity: 0; top: 0; }",
        "35% { opacity: 1; top: -63px; }",
        "36% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "39% { opacity: 0; top: 0; }",
        "40% { opacity: 1; top: -63px; }",
        "41% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "44% { opacity: 0; top: 0; }",
        "45% { opacity: 1; top: -63px; }",
        "46% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "49% { opacity: 0; top: 0; }",
        "50% { opacity: 1; top: -63px; }",
        "51% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "54% { opacity: 0; top: 0; }",
        "55% { opacity: 1; top: -63px; }",
        "56% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "59% { opacity: 0; top: 0; }",
        "60% { opacity: 1; top: -63px; }",
        "61% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "64% { opacity: 0; top: 0; }",
        "65% { opacity: 1; top: -63px; }",
        "66% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "69% { opacity: 0; top: 0; }",
        "70% { opacity: 1; top: -63px; }",
        "71% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "74% { opacity: 0; top: 0; }",
        "75% { opacity: 1; top: -63px; }",
        "76% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "79% { opacity: 0; top: 0; }",
        "80% { opacity: 1; top: -63px; }",
        "81% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "84% { opacity: 0; top: 0; }",
        "85% { opacity: 1; top: -63px; }",
        "86% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "89% { opacity: 0; top: 0; }",
        "90% { opacity: 1; top: -63px; }",
        "91% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ]
    ]),
    makeEffect(6, "물결치며 내려앉기", [
      [
        "0% { opacity: 1; top: -63px; }",
        "10% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "5% { opacity: 1; top: -63px; }",
        "15% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "10% { opacity: 1; top: -63px; }",
        "20% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "15% { opacity: 1; top: -63px; }",
        "25% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "20% { opacity: 1; top: -63px; }",
        "30% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "25% { opacity: 1; top: -63px; }",
        "35% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "30% { opacity: 1; top: -63px; }",
        "40% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "35% { opacity: 1; top: -63px; }",
        "45% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "40% { opacity: 1; top: -63px; }",
        "50% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "45% { opacity: 1; top: -63px; }",
        "55% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "50% { opacity: 1; top: -63px; }",
        "60% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "55% { opacity: 1; top: -63px; }",
        "65% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "60% { opacity: 1; top: -63px; }",
        "70% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "65% { opacity: 1; top: -63px; }",
        "75% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "70% { opacity: 1; top: -63px; }",
        "80% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "75% { opacity: 1; top: -63px; }",
        "85% { opacity: 1; top: 0; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "80% { opacity: 1; top: -63px; }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: 0; }",
        "85% { opacity: 1; top: -63px; }",
        "95% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ]
    ]),
    makeEffect(7, "엇갈려 회전하기", [
      [
        "0% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "5% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "4% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "5% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "10% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "9% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "10% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "15% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "14% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "15% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "20% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "19% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "20% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "25% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "24% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "25% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "30% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "29% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "30% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "35% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "34% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "35% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "40% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "39% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "40% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "45% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "44% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "45% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "50% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "49% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "50% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "55% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "54% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "55% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "60% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "59% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "60% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "65% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "64% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "65% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "70% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "69% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "70% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "75% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "74% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "75% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "80% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "79% { opacity: 0; transform: scale(10) rotate(90deg); }",
        "80% { opacity: 1; transform: scale(10) rotate(90deg); }",
        "85% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ],
      [
        "0% { opacity: 0; }",
        "84% { opacity: 0; transform: scale(10) rotate(-90deg); }",
        "85% { opacity: 1; transform: scale(10) rotate(-90deg); }",
        "90% { opacity: 1; transform: scale(1) rotate(0deg); }",
        "100% { opacity: 1; transform: scale(1) rotate(0deg); }"
      ]
    ]),
    makeEffect(8, "한 글자씩 나타나기", [
      [
        "0% { opacity: 0; }",
        "4% { opacity: 0; }",
        "5% { opacity: 1; }",
        "6% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "9% { opacity: 0; }",
        "10% { opacity: 1; }",
        "11% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "14% { opacity: 0; }",
        "15% { opacity: 1; }",
        "16% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "19% { opacity: 0; }",
        "20% { opacity: 1; }",
        "21% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "24% { opacity: 0; }",
        "25% { opacity: 1; }",
        "26% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "29% { opacity: 0; }",
        "30% { opacity: 1; }",
        "31% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "34% { opacity: 0; }",
        "35% { opacity: 1; }",
        "36% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "39% { opacity: 0; }",
        "40% { opacity: 1; }",
        "41% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "44% { opacity: 0; }",
        "45% { opacity: 1; }",
        "46% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "49% { opacity: 0; }",
        "50% { opacity: 1; }",
        "51% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "54% { opacity: 0; }",
        "55% { opacity: 1; }",
        "56% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "59% { opacity: 0; }",
        "60% { opacity: 1; }",
        "61% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "64% { opacity: 0; }",
        "65% { opacity: 1; }",
        "66% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "69% { opacity: 0; }",
        "70% { opacity: 1; }",
        "71% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "74% { opacity: 0; }",
        "75% { opacity: 1; }",
        "76% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "79% { opacity: 0; }",
        "80% { opacity: 1; }",
        "81% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "84% { opacity: 0; }",
        "85% { opacity: 1; }",
        "86% { opacity: 1; }",
        "90% { opacity: 1; }",
        "100% { opacity: 0; }"
      ],
      [
        "0% { opacity: 0; }",
        "89% { opacity: 0; }",
        "90% { opacity: 1; }",
        "91% { opacity: 1; }",
        "100% { opacity: 0; }"
      ]
    ]),
    makeEffect(9, "위에서 떨어지며 커지기", [
      [
        "0% { opacity: 1; top: -140px; transform: scale(0.1); }",
        "10% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "5% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "15% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "10% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "20% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "15% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "25% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "20% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "30% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 1; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "25% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "35% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "30% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "40% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "35% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "45% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "40% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "50% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "45% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "55% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "50% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "60% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "55% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "65% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "60% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "70% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "65% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "75% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "70% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "80% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "75% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "85% { opacity: 1; top: 0; transform: scale(1); }",
        "90% { opacity: 1; top: 0; }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "80% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "90% { opacity: 1; top: 0; transform: scale(1); }",
        "100% { opacity: 0; top: 0; }"
      ],
      [
        "0% { opacity: 0; top: -140px; transform: scale(0.1); }",
        "85% { opacity: 1; top: -90px; transform: scale(0.1); }",
        "95% { opacity: 1; top: 0; transform: scale(1); }",
        "100% { opacity: 0; top: 0; }"
      ]
    ]),
    makeEffect(10, "아래에서 펼쳐지기", [
      [
        "0% { opacity: 1; transform: scaleY(0); }",
        "5% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "4% { opacity: 0; transform: scaleY(0); }",
        "5% { opacity: 1; transform: scaleY(0); }",
        "10% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; transform: scaleY(0); }",
        "9% { opacity: 0; transform: scaleY(0); }",
        "10% { opacity: 1; transform: scaleY(0); }",
        "15% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "14% { opacity: 0; transform: scaleY(0); }",
        "15% { opacity: 1; transform: scaleY(0); }",
        "20% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "19% { opacity: 0; transform: scaleY(0); }",
        "20% { opacity: 1; transform: scaleY(0); }",
        "25% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "24% { opacity: 0; transform: scaleY(0); }",
        "25% { opacity: 1; transform: scaleY(0); }",
        "30% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "29% { opacity: 0; transform: scaleY(0); }",
        "30% { opacity: 1; transform: scaleY(0); }",
        "35% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "34% { opacity: 0; transform: scaleY(0); }",
        "35% { opacity: 1; transform: scaleY(0); }",
        "40% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "39% { opacity: 0; transform: scaleY(0); }",
        "40% { opacity: 1; transform: scaleY(0); }",
        "45% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "44% { opacity: 0; transform: scaleY(0); }",
        "45% { opacity: 1; transform: scaleY(0); }",
        "50% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "49% { opacity: 0; transform: scaleY(0); }",
        "50% { opacity: 1; transform: scaleY(0); }",
        "55% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "54% { opacity: 0; transform: scaleY(0); }",
        "55% { opacity: 1; transform: scaleY(0); }",
        "60% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "59% { opacity: 0; transform: scaleY(0); }",
        "60% { opacity: 1; transform: scaleY(0); }",
        "65% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "64% { opacity: 0; transform: scaleY(0); }",
        "65% { opacity: 1; transform: scaleY(0); }",
        "70% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "69% { opacity: 0; transform: scaleY(0); }",
        "70% { opacity: 1; transform: scaleY(0); }",
        "75% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "74% { opacity: 0; transform: scaleY(0); }",
        "75% { opacity: 1; transform: scaleY(0); }",
        "80% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "79% { opacity: 0; transform: scaleY(0); }",
        "80% { opacity: 1; transform: scaleY(0); }",
        "85% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ],
      [
        "0% { opacity: 0; }",
        "84% { opacity: 0; transform: scaleY(0); }",
        "85% { opacity: 1; transform: scaleY(0); }",
        "90% { opacity: 1; transform: scaleY(1); }",
        "100% { opacity: 1; transform: scaleY(1); }"
      ]
    ])
  ];
})();

