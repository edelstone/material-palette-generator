const modal = document.querySelector(".modal");

function ExportColor() {
  const exportType = document.querySelector('select#export-type')?.value;
  const colorPalettes = document.querySelectorAll(".color-palette__row");
  const colorSelector = document.querySelectorAll(
    ".color-palette__cell-hex-value"
  );
  const colors = [...colorSelector];
  const textArea = document.querySelector("#jsonText");
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
      textArea.textContent = convertJSONtoCSS(exported);
      break;
    case 'json':
      textArea.textContent = JSON.stringify(exported, null, "  ");
      break;
    default:
      textArea.textContent = JSON.stringify(exported, null, "  ")
  }

  modal.style.display = "block";

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

  //return paletteCSS;
  return `:root {\n\t${paletteCSS.join('\n\t')}\n\n}`;
}

// Controls

const closeButton = document.querySelector(".close");
const contentArea = document.querySelector(".color-tool");
const exportTypeSelect = document.querySelector('select#export-type');

contentArea.insertAdjacentHTML(
  "beforeend",
  `
<div class="buttonContainer"><button class="exportButton" onclick="ExportColor()">Export Palette</button></div>
`
);

// When the user clicks on <button> (x), close the modal
closeButton.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};