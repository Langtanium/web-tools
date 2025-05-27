export async function processFileData(reader, fileName, game) {
  return new Promise(async (resolve) => {
    const fileData = new DataView(reader);
    let newFileData = null;
    
    switch (game) {
      case "sonicRumble":
        newFileData = sonicRumble(fileData);
        break;
      default:
        break;
    }
    if (newFileData !== null) {
      // Notify that the file has been processed
      fileProcessedNotify(fileName);
      // Resolve the Promise and return an obect containing 
      // processed file data and the file's name
      resolve(newFileData.buffer);
    }
  });
}

function sonicRumble(fileData) {
  let offset = 0;
  let tempArray = [];
  
  // Counts empty bytes in the header
  for (let i = 0; i < fileData.byteLength; i++) {
    if (fileData.getUint8(i) === 0) {
      offset += 1;
    } else {
      break;
    }
  }
  const readFileLength = fileData.byteLength - offset;
  // Remove empty bytes from header
  for (let i = 0; i < readFileLength; i++) {
    let currentBite = fileData.getUint8(i+offset);
    tempArray.push(currentBite);
  }
  // Return prossesed data as an Uint8Array object
  return new Uint8Array(tempArray);
}

function fileProcessedNotify() {
  const downloadLinksElement = document.querySelector(".file-downloads");
  let p = downloadLinksElement.querySelector("p") || null;
  if (p === null) {
    p = document.createElement("p");
    p.innerHTML = `Processed <span>1</span> file(s)`
    downloadLinksElement.appendChild(p);
  } else {
    const span = p.querySelector("span");
    span.textContent = parseInt(span.textContent)+1;
  }
}