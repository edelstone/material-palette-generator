function ExportColor() {
    const colorPalettes = document.querySelectorAll(".color-palette__row");
    const colorSelector = document.querySelectorAll(".color-palette__cell-hex-value");
    const colors = [...colorSelector];
  //  const textArea = document.querySelector("#exported");
    let exported = {};

    if (colorPalettes.length > 2) {
        colorPalettes.forEach((palette, paletteIndex) => {
          if (paletteIndex === 0) {
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex < 10)
            filteredColors.forEach((hex, hexIndex) => exported["Primary"] = {...exported["Primary"], [hexIndex + 1]: hex.textContent})
          }
          if (paletteIndex === 1) {
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 10 && colorIndex < 20)
            filteredColors.forEach((hex, hexIndex) => exported["Complementary"] = {...exported["Complementary"], [hexIndex + 1]: hex.textContent})
          }
          if (paletteIndex === 2) {
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 20 && colorIndex < 40)
            filteredColors.forEach((hex, hexIndex) => exported["Analogous"] = {...exported["Analogous"], [hexIndex + 1]: hex.textContent})
          }
          if (paletteIndex === 3) {
            const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 40)
            filteredColors.forEach((hex, hexIndex) => exported["Triadic"] = {...exported["Triadic"], [hexIndex + 1]: hex.textContent})
          }
         
        })
    } else {
        colorPalettes.forEach((palette, paletteIndex) => {
            if (paletteIndex === 0) {
                const filteredColors = colors.filter((color, colorIndex) =>  colorIndex < 10)
                filteredColors.forEach((hex, hexIndex) => exported["Primary"] = {...exported["Primary"], [hexIndex + 1]: hex.textContent})
            } else {
                const filteredColors = colors.filter((color, colorIndex) =>  colorIndex >= 10)
                filteredColors.forEach((hex, hexIndex) => exported["Secondary"] = {...exported["Secondary"], [hexIndex + 1]: hex.textContent})
            }
    })}

  // textArea.textContent = JSON.stringify(exported, null, "\t");
}