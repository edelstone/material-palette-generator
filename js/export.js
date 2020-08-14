function ExportColor() {
    const colorPalettes = document.querySelectorAll(".color-palette__row");
    const colorSelector = document.querySelectorAll(".color-palette__cell-hex-value");
    const colors = [...colorSelector];
    const textArea = document.querySelector("#jsonText");
    const colorLabels = ["900", "800", "700", "600", "500", "400", "300", "200", "100", "50"]
    let exported = {};

    if (colorPalettes.length > 2) {
      let labelIndex = 0;
        colorPalettes.forEach((palette, paletteIndex) => {
          if (paletteIndex === 0) {
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex < 10)
            filteredColors.forEach((hex, hexIndex) => {exported["Primary"] = {...exported["Primary"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++})
          }
          if (paletteIndex === 1) {
            let labelIndex = 0;
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 10 && colorIndex < 20)
            filteredColors.forEach((hex, hexIndex) => {exported["Complementary"] = {...exported["Complementary"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++})
          }
          if (paletteIndex === 2) {
            let labelIndex = 0;
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 20 && colorIndex < 30)
            filteredColors.forEach((hex, hexIndex) => {exported["Analogous - 1"] = {...exported["Analogous - 1"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++
          })
          }
          if (paletteIndex === 3) {
            let labelIndex = 0;
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 30 && colorIndex < 40)
            filteredColors.forEach((hex, hexIndex) => {exported["Analogous - 2"] = {...exported["Analogous - 2"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++
          })
          }
          if (paletteIndex === 4) {
            let labelIndex = 0;
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 40 && colorIndex < 50)
            filteredColors.forEach((hex, hexIndex) => {exported["Triadic - 1"] = {...exported["Triadic - 1"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++
          })
          }
          if (paletteIndex === 5) {
            let labelIndex = 0;
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 50)
            filteredColors.forEach((hex, hexIndex) => {exported["Triadic - 2"] = {...exported["Triadic - 2"], [colorLabels[labelIndex]]: hex.textContent}
            labelIndex++
          })
          }
         
        })
    } else {
        colorPalettes.forEach((palette, paletteIndex) => {
            if (paletteIndex === 0) {
              let labelIndex = 0;
                const filteredColors = colors.filter((color, colorIndex) =>  colorIndex < 10)
                filteredColors.forEach((hex, hexIndex) => {exported["Primary"] = {...exported["Primary"], [colorLabels[labelIndex]]: hex.textContent}
                labelIndex++
              })
            } else {
              let labelIndex = 0;
                const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 10)
                filteredColors.forEach((hex, hexIndex) => {exported["Secondary"] = {...exported["Secondary"], [colorLabels[labelIndex]]: hex.textContent}
                labelIndex++
              })
            }
    })}

 textArea.textContent = JSON.stringify(exported, null, "  ");
 modal.style.display = "block";
}

// Controls

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const contentArea = document.querySelector(".color-tool")

contentArea.insertAdjacentHTML("beforeend", `
<div class="buttonContainer"><button class="exportButton" onclick="ExportColor()">Export Palette</button></div>
`)

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}