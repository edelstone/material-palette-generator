const modal = document.querySelector(".modal");
const exportOutput = document.querySelector('#exportOutput');
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
const COLORS_PER_PALETTE = 10;
const DEFAULT_BASE_SHADE = '500';
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

let lastFocusedElement = null;
let isFocusTrapActive = false;
let isModalOpen = false;
let bodyScrollY = 0;

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
  bodyScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('modal-open');
  document.body.style.top = `-${bodyScrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.left = '0';
  document.body.style.right = '0';
  modal.style.display = "flex";
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  focusActiveTab();
  activateFocusTrap();
  isModalOpen = true;
  if (modal && typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => modal.classList.add('is-open'));
  } else if (modal) {
    modal.classList.add('is-open');
  }
}

function closeModal() {
  if (!modal || !isModalOpen) return;

  modal.style.display = "none";
  modal.classList.remove('is-open');
  deactivateFocusTrap();
  isModalOpen = false;
  resetExportOutputScroll();
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, bodyScrollY || 0);

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function ExportColor() {
  const exportType = getActiveExportType();
  if (exportType) storeExportType(exportType);
  const colorPalettes = document.querySelectorAll(".color-palette__row");
  const colors = [...document.querySelectorAll(".color-palette__cell-hex-value")];
  if (!exportOutput) return;

  const buildPaletteExportData = (paletteIndex) => {
    const paletteRow = colorPalettes[paletteIndex];
    const paletteColors = colors.slice(
      paletteIndex * COLORS_PER_PALETTE,
      (paletteIndex + 1) * COLORS_PER_PALETTE
    );

    if (!paletteColors.length) return { base: DEFAULT_BASE_SHADE };

    let labelIndex = 0;
    const paletteData = {};

    paletteColors.forEach((hexElement) => {
      const shadeLabel = COLOR_LABELS[labelIndex];
      paletteData[shadeLabel] = normalizeHexForExport(hexElement.textContent);
      labelIndex++;
    });

    const selectedHex = getSelectedHexFromRow(paletteRow);
    const baseShade = findBaseShadeLabel(paletteData, selectedHex) || DEFAULT_BASE_SHADE;

    paletteData.base = baseShade;

    return paletteData;
  };

  const paletteKeys = (colorPalettes.length > 2
    ? ['primary', 'complementary', 'analogous-1', 'analogous-2', 'triadic-1', 'triadic-2']
    : ['primary', 'secondary']).slice(0, colorPalettes.length);

  const exported = {};

  paletteKeys.forEach((paletteKey, paletteIndex) => {
    exported[paletteKey] = buildPaletteExportData(paletteIndex);
  });

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
      exportOutput.textContent = JSON.stringify(exported, null, "  ");
  }

  resetExportOutputScroll();

  openModal();

}

function convertJSONtoCSS(paletteJSON) {
  const paletteCSS = [];
  const mainColors = [];

  [...document.querySelectorAll('.color-palette__cell--selected')].forEach(mainColorElement => {
    const hexValue = mainColorElement.querySelector('.color-palette__cell-hex-value')?.textContent;
    if (hexValue) {
      mainColors.push(normalizeHexForExport(hexValue));
    }
  });

  for (const color in paletteJSON) {
    const colorName = color.replace(/ /g, '').toLowerCase();
    Object.entries(paletteJSON[color])
      .filter(([shade]) => COLOR_LABELS.includes(shade))
      .forEach(([shade, hexValue]) => {
        const normalizedHex = normalizeHexForExport(hexValue);
        paletteCSS.push(`--clr-${colorName}-${shade}: ${normalizedHex};`);
        if (mainColors.includes(normalizedHex)) {
          paletteCSS.push(`--clr-${colorName}: var(--clr-${colorName}-${shade});`);
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

function normalizeHexForExport(hexValue) {
  return normalizeHexValue(hexValue, true).toLowerCase();
}

function getSelectedHexFromRow(paletteRow) {
  if (!paletteRow) return null;

  const selectedHexElement = paletteRow.querySelector('.color-palette__cell--selected .color-palette__cell-hex-value');
  return selectedHexElement ? normalizeHexForExport(selectedHexElement.textContent) : null;
}

function findBaseShadeLabel(paletteData, selectedHex) {
  if (!selectedHex) return null;

  return COLOR_LABELS.find(label => {
    const hexValue = paletteData[label];
    if (!hexValue) return false;

    return normalizeHexForExport(hexValue) === normalizeHexForExport(selectedHex);
  }) || null;
}

function formatPaletteTitle(paletteName) {
  return paletteName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' - ');
}

function convertJSONtoHexLists(paletteJSON, includeHash) {
  const paletteHexes = [];
  const paletteNames = Object.keys(paletteJSON);
  const shadeOrder = [...COLOR_LABELS].reverse();

  paletteNames.forEach((paletteName, paletteIndex) => {
    paletteHexes.push(formatPaletteTitle(paletteName));
    paletteHexes.push('-----');

    const shades = shadeOrder
      .map(label => ({
        label,
        hex: paletteJSON[paletteName]?.[label]
      }))
      .filter(shade => Boolean(shade.hex));

    shades.forEach(({ hex }) => {
      const normalizedHex = normalizeHexValue(hex, includeHash);
      paletteHexes.push(normalizedHex);
    });

    if (paletteIndex !== paletteNames.length - 1) {
      paletteHexes.push('');
    }
  });

  return paletteHexes.join('\n');
}

function selectExportOutput() {
  if (!exportOutput || typeof window === 'undefined' || !window.getSelection) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(exportOutput);
  selection.removeAllRanges();
  selection.addRange(range);
}

function resetExportOutputScroll() {
  if (!exportOutput) return;

  exportOutput.scrollTop = 0;
  exportOutput.scrollLeft = 0;

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      exportOutput.scrollTop = 0;
      exportOutput.scrollLeft = 0;
    });
  }
}

// Controls

const closeButton = document.querySelector(".close");
const contentArea = document.querySelector(".color-tool");
const exportTypeTabs = document.querySelectorAll('.export-tab');

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

if (exportOutput) {
  exportOutput.addEventListener('click', selectExportOutput);
  exportOutput.addEventListener('keydown', (event) => {
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
