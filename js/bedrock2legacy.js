import { downloadZip } from "./client-zip/index.js";

let inputFileList = [];
let url = null;

const formElem = document.querySelector("form");
const fileInput = document.querySelector("#file-input");
const downloadLinksElement = document.querySelector(".file-downloads");

formElem.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (inputFileList.length > 0) {
    handleForm();
  } else {
    alert("Please choose files.");
  }
});

fileInput.addEventListener("change", () => {
  const fileQuantity = fileInput.files.length;
  downloadLinksElement.innerHTML = ``;
  inputFileList = [];
  window.URL.revokeObjectURL(url);
  for (let i = 0; i < fileQuantity; i++) {
    inputFileList.push(fileInput.files[i]);
  }
  const uploadLabel = document.querySelector(".custom-file-input");
  if (fileQuantity > 1) {
    uploadLabel.textContent = `${fileQuantity} Files Selected`;
  } else if (fileQuantity === 1) {
    uploadLabel.textContent = `${inputFileList[0].name}`;
  } else {
    uploadLabel.textContent = `Upload Files`;
  }
});

async function handleForm() {
  // Load files and process them
  let waitReader = new Promise((resolve) =>{
    let fileCount = inputFileList.length;
    let processedFiles = [];
    let skinCount = 1;
    const defaultHeadOffsetY = 24;
    const defaultBodyOffsetY = 24;
    const defaultArmsOffsetY = 22;
    const defaultItemOffsetY = 15;
    const defaultArm0OffsetX = 5;
    const defaultArm1OffsetX = -5;
    const defaultLegsOffsetY = 12;
    const defaultLeg0OffsetX = 2;
    const defaultLeg1OffsetX = -2;
    let currentBodyOffsetY = 24;
    let currentArm0OffsetY = 22;
    let currentArm1OffsetY = 22;
    let currentLeg0OffsetY = 12;
    let currentLeg1OffsetY = 12;
    inputFileList.forEach(async (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", async () => {
        let skinObject = await JSON.parse(reader.result);
        let skinArray = [];
        let legacyGeoFormat = true;
        if (skinObject.format_version) {
          legacyGeoFormat = false;
          skinArray = skinObject["minecraft:geometry"];
        }
        let skinLegacy = `DISPLAYNAME:Skin${skinCount}\r\nANIM:0x7ff9fc00\r\n`;
        let offsets = "";
        if (legacyGeoFormat) {
          for (const skin in skinObject) {
            if (!Object.hasOwn(skinObject, skin)) continue;
            skinObject[skin].bones.forEach(bone => {
              let boneName = bone.name.toUpperCase();
              let xOrigin = 0;
              let yOrigin = bone.pivot[1]
              let hideWithArmor = 0;

              if (boneName == "HEAD") {
                if (yOrigin != defaultHeadOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultHeadOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "HAT") {
                boneName = "HEADWEAR";
              } else if (boneName == "BODY") {
                if (yOrigin != defaultBodyOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultBodyOffsetY - yOrigin}\r\n`;
                }
                currentBodyOffsetY = yOrigin;
              } else if (boneName == "RIGHTARM") {
                boneName = "ARM0";
                xOrigin = defaultArm0OffsetX;
                if (yOrigin != defaultArmsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultArmsOffsetY - yOrigin}\r\n`;
                }
                currentArm0OffsetY = yOrigin;
              } else if (boneName == "LEFTARM") {
                boneName = "ARM1";
                xOrigin = defaultArm1OffsetX;
                if (yOrigin != defaultArmsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultArmsOffsetY - yOrigin}\r\n`;
                }
                currentArm1OffsetY = yOrigin;
              } else if (boneName == "RIGHTSLEEVE") {
                boneName = "SLEEVE0";
                xOrigin = defaultArm0OffsetX;
              } else if (boneName == "LEFTSLEEVE") {
                boneName = "SLEEVE1";
                xOrigin = defaultArm1OffsetX;
              } else if (boneName == "RIGHTLEG") {
                boneName = "LEG0";
                xOrigin = defaultLeg0OffsetX;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
                currentLeg0OffsetY = yOrigin;
              } else if (boneName == "LEFTLEG") {
                boneName = "LEG1";
                xOrigin = defaultLeg1OffsetX;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
                currentLeg1OffsetY = yOrigin;
              } else if (boneName == "RIGHTPANTS") {
                boneName = "PANTS0";
                xOrigin = defaultLeg0OffsetX;
              } else if (boneName == "LEFTPANTS") {
                boneName = "PANTS1";
                xOrigin = defaultLeg1OffsetX;
              } else if (boneName == "HELMET") {
                boneName = "HEAD";
                hideWithArmor = 1;
                if (yOrigin != defaultHeadOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultHeadOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "BODYARMOR") {
                yOrigin = currentBodyOffsetY;
                hideWithArmor = 2;
              } else if (boneName == "BELT") {
                hideWithArmor = 4;
              } else if (boneName == "RIGHTARMARMOR") {
                boneName = "ARM0ARMOR";
                hideWithArmor = 2;
                xOrigin = defaultArm0OffsetX;
              } else if (boneName == "LEFTARMARMOR") {
                boneName = "ARM1ARMOR";
                xOrigin = defaultArm1OffsetX;
                hideWithArmor = 2;
              } else if (boneName == "RIGHTLEGGING") {
                boneName = "LEGGING0";
                xOrigin = defaultLeg0OffsetX;
                hideWithArmor = 4;
              } else if (boneName == "LEFTLEGGING") {
                boneName = "LEGGING1";
                xOrigin = defaultLeg1OffsetX;
                hideWithArmor = 4;
              } else if (boneName == "RIGHTBOOT") {
                boneName = "BOOT0";
                xOrigin = defaultLeg0OffsetX;
                yOrigin = currentLeg0OffsetY;
                hideWithArmor = 8;
              } else if (boneName == "LEFTBOOT") {
                boneName = "BOOT1";
                xOrigin = defaultLeg1OffsetX;
                yOrigin = currentLeg1OffsetY;
                hideWithArmor = 8;
              } else if (boneName == "RIGHTBOOTARMOROFFSET") {
                boneName = "BOOT0";
                yOrigin += defaultLegsOffsetY - currentLeg0OffsetY;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "LEFTBOOTARMOROFFSET") {
                boneName = "BOOT1";
                yOrigin += defaultLegsOffsetY - currentLeg1OffsetY;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "RIGHTITEM") {
                boneName = "TOOL0";
                yOrigin += defaultArmsOffsetY - currentArm0OffsetY;
                if (yOrigin != defaultItemOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultItemOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "LEFTITEM") {
                boneName = "TOOL1";
                yOrigin += defaultArmsOffsetY - currentArm1OffsetY;
                if (yOrigin != defaultItemOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultItemOffsetY - yOrigin}\r\n`;
                }
              }

              if (bone.cubes) {
                bone.cubes.forEach(cube => {
                  let mirror = 0;
                  let scale = 0;
                  xOrigin += cube.origin[0];
                  yOrigin += -cube.origin[1] - cube.size[1];
                  if (cube.mirror) {
                    mirror = 1;
                  }
                  if (cube.inflate) {
                    scale = cube.inflate;
                  }
                  skinLegacy += `BOX:${boneName} ${parseFloat(xOrigin.toFixed(3))} ${parseFloat(yOrigin.toFixed(3))} ${cube.origin[2]} ${cube.size[0]} ${cube.size[1]} ${cube.size[2]} ${cube.uv[0]} ${cube.uv[1]} ${hideWithArmor} ${mirror} ${scale}\r\n`;
                  xOrigin -= cube.origin[0];
                  yOrigin -= -cube.origin[1] - cube.size[1];
                });
              }
            });
            skinLegacy += offsets;
            processedFiles.push({name: `skin${skinCount}.txt`, lastModified: new Date(), input: skinLegacy});
            skinCount++;
            skinLegacy = `DISPLAYNAME:Skin${skinCount}\r\nANIM:0x7ff9fc00\r\n`;
            offsets = "";
          }
        } else {
          skinArray.forEach(skin => {
            skin.bones.forEach(bone => {
              let boneName = bone.name.toUpperCase();
              let xOrigin = 0;
              let yOrigin = bone.pivot[1]
              let hideWithArmor = 0;
              let mirror = 0;
              let scale = 0;

              if (boneName == "HEAD") {
                if (yOrigin != defaultHeadOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultHeadOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "HAT") {
                boneName = "HEADWEAR";
              } else if (boneName == "BODY") {
                if (yOrigin != defaultBodyOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultBodyOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "RIGHTARM") {
                boneName = "ARM0";
                xOrigin = defaultArm0OffsetX;
                if (yOrigin != defaultArmsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultArmsOffsetY - yOrigin}\r\n`;
                }
                currentArm0OffsetY = yOrigin;
              } else if (boneName == "LEFTARM") {
                boneName = "ARM1";
                xOrigin = defaultArm1OffsetX;
                if (yOrigin != defaultArmsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultArmsOffsetY - yOrigin}\r\n`;
                }
                currentArm1OffsetY = yOrigin;
              } else if (boneName == "RIGHTSLEEVE") {
                boneName = "SLEEVE0";
                xOrigin = defaultArm0OffsetX;
              } else if (boneName == "LEFTSLEEVE") {
                boneName = "SLEEVE1";
                xOrigin = defaultArm1OffsetX;
              } else if (boneName == "RIGHTLEG") {
                boneName = "LEG0";
                xOrigin = defaultLeg0OffsetX;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
                currentLeg0OffsetY = yOrigin;
              } else if (boneName == "LEFTLEG") {
                boneName = "LEG1";
                xOrigin = defaultLeg1OffsetX;
                if (yOrigin != defaultLegsOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultLegsOffsetY - yOrigin}\r\n`;
                }
                currentLeg1OffsetY = yOrigin;
              } else if (boneName == "RIGHTPANTS") {
                boneName = "PANTS0";
                xOrigin = defaultLeg0OffsetX;
              } else if (boneName == "LEFTPANTS") {
                boneName = "PANTS1";
                xOrigin = defaultLeg1OffsetX;
              } else if (boneName == "HELMET") {
                boneName = "HEAD";
                hideWithArmor = 1;
              } else if (boneName == "BODYARMOR") {
                hideWithArmor = 2;
              } else if (boneName == "BELT") {
                hideWithArmor = 4;
              } else if (boneName == "RIGHTARMARMOR") {
                boneName = "ARM0ARMOR";
                hideWithArmor = 2;
                xOrigin = defaultArm0OffsetX;
              } else if (boneName == "LEFTARMARMOR") {
                boneName = "ARM1ARMOR";
                xOrigin = defaultArm1OffsetX;
                hideWithArmor = 2;
              } else if (boneName == "RIGHTLEGGING") {
                boneName = "LEGGING0";
                xOrigin = defaultLeg0OffsetX;
                hideWithArmor = 4;
              } else if (boneName == "LEFTLEGGING") {
                boneName = "LEGGING1";
                xOrigin = defaultLeg1OffsetX;
                hideWithArmor = 4;
              } else if (boneName == "RIGHTBOOT") {
                boneName = "BOOT0";
                xOrigin = defaultLeg0OffsetX;
                yOrigin = currentLeg0OffsetY;
                hideWithArmor = 8;
              } else if (boneName == "LEFTBOOT") {
                boneName = "BOOT1";
                xOrigin = defaultLeg1OffsetX;
                yOrigin = currentLeg1OffsetY;
                hideWithArmor = 8;
              } else if (boneName == "RIGHTITEM") {
                boneName = "TOOL0";
                yOrigin += defaultArmsOffsetY - currentArm0OffsetY;
                if (yOrigin != defaultItemOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultItemOffsetY - yOrigin}\r\n`;
                }
              } else if (boneName == "LEFTITEM") {
                boneName = "TOOL1";
                yOrigin += defaultArmsOffsetY - currentArm1OffsetY;
                if (yOrigin != defaultItemOffsetY) {
                  offsets += `OFFSET:${boneName} Y ${defaultItemOffsetY - yOrigin}\r\n`;
                }
              }

              if (bone.cubes) {
                bone.cubes.forEach(cube => {
                  xOrigin += cube.origin[0];
                  yOrigin += -cube.origin[1] - cube.size[1];
                  if (cube.mirror) {
                    mirror = 1;
                  }
                  if (cube.inflate) {
                    scale = cube.inflate;
                  }
                  skinLegacy += `BOX:${boneName} ${parseFloat(xOrigin.toFixed(3))} ${parseFloat(yOrigin.toFixed(3))} ${cube.origin[2]} ${cube.size[0]} ${cube.size[1]} ${cube.size[2]} ${cube.uv[0]} ${cube.uv[1]} ${hideWithArmor} ${mirror} ${scale}\r\n`;
                  xOrigin -= cube.origin[0];
                  yOrigin -= -cube.origin[1] - cube.size[1];
                });
              }
            });
            skinLegacy += offsets;
            processedFiles.push({name: `skin${skinCount}.txt`, lastModified: new Date(), input: skinLegacy});
            skinCount++;
            skinLegacy = `DISPLAYNAME:Skin${skinCount}\r\nANIM:0x7ff9fc00\r\n`;
            offsets = "";
          });
        }

        if (processedFiles.length >= fileCount) {
          resolve(processedFiles);
        }
      });
    });
  });
  // Generate zip file and download link
  waitReader.then(async (data) => {
    const p = document.createElement("p");
    p.textContent = `Zipping Skins...`;
    downloadLinksElement.appendChild(p);
    if (data.length > 1) {
      downloadBlob(await downloadZip(data).blob(), "mlce_converted_skins.zip");
    } else {
      downloadBlob(new Blob([data[0].input]), data[0].name);
    }
    downloadLinksElement.removeChild(p);
    const div = document.createElement("div");
    div.className = "link";
    downloadLinksElement.appendChild(div);
  });
}

function downloadBlob(blob, fileName) {
  url = window.URL.createObjectURL(blob);
  downloadUrl(fileName);
}

function downloadUrl(fileName) {
  const div = document.createElement("div");
  div.className = "link";
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.textContent = `Download: ${fileName}`;
  div.appendChild(link);
  downloadLinksElement.appendChild(div);
}

function processFileData(data) {
    return 0;
}