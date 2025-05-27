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
    inputFileList.forEach(async (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", async () => {
        processedFiles.push({name: file.name, lastModified: new Date(), input: obfuscateString(reader.result)});
        if (processedFiles.length === fileCount) {
          resolve(processedFiles);
        }
      });
    });
  });
  // Generate zip file and download link
  waitReader.then(async (data) => {
    const p = document.createElement("p");
    p.textContent = `Zipping Files...`;
    downloadLinksElement.appendChild(p);
    if (data.length > 1) {
      switch (game) {
          case "sonicRumble":
            downloadBlob(await downloadZip(data).blob(), "sonic_rumble_tf.zip");
            break;
          default:
            break;
      }
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


function obfuscateString(text) {
  let trimText = text.split(" ").join("").split("\n").join("");
  let obfuscate = false;
  let newText = []; 

  for (let i = 0; i < trimText.length; i++) {
    if (obfuscate) {
      if (trimText[i] !== `"`) {
          newText.push(obfuscateCharacter(trimText[i]));
      } else {
          obfuscate = false;
          newText.push(trimText[i]);
      }
    } else {
      newText.push(trimText[i]);
      if (trimText[i] === `"`) {
        obfuscate = true;
      }
    }
  }

  return newText.join("");
}

function obfuscateCharacter(character) {
  let temp = character.charCodeAt(0).toString(16);
  if (temp.length < 3) {
      return `\\u00${character.charCodeAt(0).toString(16)}`;
  } else if (temp.length < 4) {
      return `\\u0${character.charCodeAt(0).toString(16)}`;
  } else {
      return `\\u${character.charCodeAt(0).toString(16)}`;
  }
}