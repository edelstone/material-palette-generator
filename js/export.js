const modal = document.querySelector(".modal");
const EXPORT_TYPE_STORAGE_KEY = 'mp-export-type';
const COLOR_LABELS = [
  "900",
  "800",
  "700",
  "600",
  "500",
  "400",
  "300",
  "200",
  "100",
  "50",
];
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

let lastFocusedElement = null;
let isFocusTrapActive = false;
let isModalOpen = false;

const getStoredExportType = () => {
  try {
    return localStorage.getItem(EXPORT_TYPE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

const storeExportType = (type) => {
  try {
    localStorage.setItem(EXPORT_TYPE_STORAGE_KEY, type);
  } catch (error) {
    // Ignore storage errors (private mode, etc.)
  }
};

function getActiveExportType() {
  const activeTab = document.querySelector('.export-tab.is-active');
  return activeTab?.dataset.exportType || 'css';
}

function setActiveExportType(type) {
  const firstTab = document.querySelector('.export-tab');
  const exportOutput = document.querySelector('#exportOutput');
  const isFirstTab = firstTab && firstTab.dataset.exportType === type;

  document.querySelectorAll('.export-tab').forEach(tab => {
    const isActive = tab.dataset.exportType === type;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.tabIndex = isActive ? 0 : -1;
  });

  if (exportOutput) {
    exportOutput.classList.toggle('is-rounded', !isFirstTab);
  }
}

function getFocusableElements() {
  if (!modal) return [];

  return [...modal.querySelectorAll(FOCUSABLE_SELECTORS)].filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.tabIndex !== -1 &&
      el.offsetParent !== null
  );
}

const handleFocusTrapKeydown = (event) => {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first || !modal.contains(document.activeElement)) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

function activateFocusTrap() {
  if (!modal || isFocusTrapActive) return;

  modal.addEventListener('keydown', handleFocusTrapKeydown);
  isFocusTrapActive = true;
}

function deactivateFocusTrap() {
  if (!modal || !isFocusTrapActive) return;

  modal.removeEventListener('keydown', handleFocusTrapKeydown);
  isFocusTrapActive = false;
}

function focusActiveTab() {
  const activeTab = document.querySelector('.export-tab.is-active');
  if (activeTab) {
    activeTab.focus();
    return;
  }

  const focusable = getFocusableElements();
  if (focusable[0]) focusable[0].focus();
}

function openModal() {
  if (!modal || isModalOpen) return;

  lastFocusedElement = document.activeElement;
  modal.style.display = "flex";
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  focusActiveTab();
  activateFocusTrap();
  isModalOpen = true;
  if (document && document.body) {
    document.body.classList.add('modal-open');
  }
}

function closeModal() {
  if (!modal || !isModalOpen) return;

  modal.style.display = "none";
  deactivateFocusTrap();
  isModalOpen = false;
  resetExportOutputScroll();
  if (document && document.body) {
    document.body.classList.remove('modal-open');
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function ExportColor() {
  const exportType = getActiveExportType();
  if (exportType) storeExportType(exportType);
  const colorPalettes = document.querySelectorAll(".color-palette__row");
  const colorSelector = document.querySelectorAll(
    ".color-palette__cell-hex-value"
  );
  const colors = [...colorSelector];
  const exportOutput = document.querySelector("#exportOutput");
  if (!exportOutput) return;
  let exported = {};

  if (colorPalettes.length > 2) {
    let labelIndex = 0;
    colorPalettes.forEach((palette, paletteIndex) => {
      if (paletteIndex === 0) {
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex < 10
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Primary"] = {
            ...exported["Primary"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
      if (paletteIndex === 1) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 10 && colorIndex < 20
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Complementary"] = {
            ...exported["Complementary"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
      if (paletteIndex === 2) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 20 && colorIndex < 30
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Analogous - 1"] = {
            ...exported["Analogous - 1"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
      if (paletteIndex === 3) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 30 && colorIndex < 40
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Analogous - 2"] = {
            ...exported["Analogous - 2"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
      if (paletteIndex === 4) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 40 && colorIndex < 50
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Triadic - 1"] = {
            ...exported["Triadic - 1"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
      if (paletteIndex === 5) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 50
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Triadic - 2"] = {
            ...exported["Triadic - 2"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
    });
  } else {
    colorPalettes.forEach((palette, paletteIndex) => {
      if (paletteIndex === 0) {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex < 10
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Primary"] = {
            ...exported["Primary"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      } else {
        let labelIndex = 0;
        const filteredColors = colors.filter(
          (color, colorIndex) => colorIndex >= 10
        );
        filteredColors.forEach((hex, hexIndex) => {
          exported["Secondary"] = {
            ...exported["Secondary"],
            [COLOR_LABELS[labelIndex]]: hex.textContent,
          };
          labelIndex++;
        });
      }
    });
  }

  switch (exportType) {
    case 'css':
      exportOutput.textContent = convertJSONtoCSS(exported);
      break;
    case 'hex':
      exportOutput.textContent = convertJSONtoHexLists(exported, false);
      break;
    case 'hex-with-hash':
      exportOutput.textContent = convertJSONtoHexLists(exported, true);
      break;
    case 'json':
      exportOutput.textContent = JSON.stringify(exported, null, "  ");
      break;
    default:
      exportOutput.textContent = JSON.stringify(exported, null, "  ")
  }

  resetExportOutputScroll();

  openModal();

}

function convertJSONtoCSS(paletteJSON) {
  const paletteCSS = [];
  const mainColors = [];

  [...document.querySelectorAll('.color-palette__cell--selected')].forEach(mainColorElement => {
    mainColors.push(mainColorElement.querySelector('.color-palette__cell-hex-value').textContent)
  });

  for (const color in paletteJSON) {
    const colorName = color.replace(/ /g, '').toLowerCase();
    Object.entries(paletteJSON[color]).forEach(colorShade => {
      paletteCSS.push(`--clr-${colorName}-${colorShade[0]}: ${colorShade[1]};`);
      if (mainColors.includes(colorShade[1])) {
        paletteCSS.push(`--clr-${colorName}: var(--clr-${colorName}-${colorShade[0]});`);
      }
    });
  }

  return `:root {\n  ${paletteCSS.join('\n  ')}\n}`;
}

function normalizeHexValue(hexValue, includeHash) {
  const trimmedHex = hexValue.trim();
  if (includeHash) {
    return trimmedHex.startsWith('#') ? trimmedHex : `#${trimmedHex}`;
  }

  return trimmedHex.replace(/^#/, '');
}

function convertJSONtoHexLists(paletteJSON, includeHash) {
  const paletteHexes = [];
  const paletteNames = Object.keys(paletteJSON);
  const shadeOrder = [...COLOR_LABELS].reverse();

  paletteNames.forEach((paletteName, paletteIndex) => {
    const shades = shadeOrder.map(label => paletteJSON[paletteName]?.[label]).filter(Boolean);

    shades.forEach(hexValue => {
      paletteHexes.push(normalizeHexValue(hexValue, includeHash));
    });

    if (paletteIndex !== paletteNames.length - 1) {
      paletteHexes.push('');
    }
  });

  return paletteHexes.join('\n');
}

function selectExportOutput() {
  const output = document.querySelector('#exportOutput');
  if (!output || typeof window === 'undefined' || !window.getSelection) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(output);
  selection.removeAllRanges();
  selection.addRange(range);
}

function resetExportOutputScroll() {
  const output = document.querySelector('#exportOutput');
  if (!output) return;

  output.scrollTop = 0;
  output.scrollLeft = 0;

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      output.scrollTop = 0;
      output.scrollLeft = 0;
    });
  }
}

// Controls

const closeButton = document.querySelector(".close");
const contentArea = document.querySelector(".color-tool");
const exportTypeTabs = document.querySelectorAll('.export-tab');
const exportOutputElement = document.querySelector('#exportOutput');

if (exportTypeTabs.length) {
  const storedType = getStoredExportType();
  const hasStoredType = storedType && [...exportTypeTabs].some(tab => tab.dataset.exportType === storedType);
  const defaultType = exportTypeTabs[0].dataset.exportType;

  setActiveExportType(hasStoredType ? storedType : defaultType);

  exportTypeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.exportType;
      setActiveExportType(type);
      storeExportType(type);
      ExportColor();
    });

    tab.addEventListener('keydown', (event) => {
      const key = event.key;
      const tabs = [...exportTypeTabs];
      const currentIndex = tabs.indexOf(tab);

      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(key)) {
        event.preventDefault();
        const direction = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
        const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
        const type = nextTab.dataset.exportType;
        setActiveExportType(type);
        storeExportType(type);
        ExportColor();
        nextTab.focus();
      }

      if (key === 'Home') {
        event.preventDefault();
        const firstTab = tabs[0];
        const type = firstTab.dataset.exportType;
        setActiveExportType(type);
        storeExportType(type);
        ExportColor();
        firstTab.focus();
      }

      if (key === 'End') {
        event.preventDefault();
        const lastTab = tabs[tabs.length - 1];
        const type = lastTab.dataset.exportType;
        setActiveExportType(type);
        storeExportType(type);
        ExportColor();
        lastTab.focus();
      }

      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        tab.click();
      }
    });
  });
}

if (exportOutputElement) {
  exportOutputElement.addEventListener('click', selectExportOutput);
  exportOutputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectExportOutput();
    }
  });
}

contentArea.insertAdjacentHTML(
  "beforeend",
  `
<div class="buttonContainer"><button class="exportButton" onclick="ExportColor()"><i class="material-icons" aria-hidden="true">file_download</i><span>Export palette</span></button></div>
`
);

// When the user clicks on <button> (x), close the modal
closeButton.onclick = function () {
  closeModal();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
};

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
