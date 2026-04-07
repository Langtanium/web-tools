export async function processFileData(reader, fileName, game) {
  return new Promise(async (resolve) => {
    const fileData = new DataView(reader);
    let newFileData = null;
    
    switch (game) {
      case "sonicRumbleTrim":
        newFileData = sonicRumbleTrim(fileData);
        break;
      case "sonicRumbleDecrypt":
        newFileData = sonicRumbleDecrypt(fileData);
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

function sonicRumbleTrim(fileData) {
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

function sonicRumbleDecrypt(fileData) {
  let keyOffset = 0;
  let skip = false;
  let tempArray = [];
  let key = [114, 172, 9, 247, 86, 136, 163, 245, 48, 136, 180];
  
  if (fileData.getUint8(0) === 39 && fileData.getUint8(1) === 194) {
    keyOffset = 0;
  } else if (fileData.getUint8(0) === 249 && fileData.getUint8(1) === 103) {
    keyOffset = 1;
  } else if (fileData.getUint8(0) === 92 && fileData.getUint8(1) === 153) {
    keyOffset = 2;
  } else if (fileData.getUint8(0) === 162 && fileData.getUint8(1) === 56) {
    keyOffset = 3;
  } else if (fileData.getUint8(0) === 3 && fileData.getUint8(1) === 230) {
    keyOffset = 4;
  } else if (fileData.getUint8(0) === 221 && fileData.getUint8(1) === 205) {
    keyOffset = 5;
  } else if (fileData.getUint8(0) === 246 && fileData.getUint8(1) === 155) {
    keyOffset = 6;
  } else if (fileData.getUint8(0) === 160 && fileData.getUint8(1) === 94) {
    keyOffset = 7;
  } else if (fileData.getUint8(0) === 101 && fileData.getUint8(1) === 230) {
    keyOffset = 8;
  } else if (fileData.getUint8(0) === 221 && fileData.getUint8(1) === 218) {
    keyOffset = 9;
  } else if (fileData.getUint8(0) === 225 && fileData.getUint8(1) === 28) {
    keyOffset = 10;
  } else {
    skip = true;
  }
  // Run decryption code only if it is not already decrypted
  if (!skip) {
    // Decrypt the first 256 bytes
    for (let i = 0; i < 256; i++) {
      if (keyOffset >= 11) {
        keyOffset = 0;
      }
      tempArray.push(fileData.getUint8(i)^key[keyOffset]);
      keyOffset++;
    }
    // Copy the rest of the bytes as is
    for (let i = 0; i < (fileData.byteLength-256); i++) {
      let currentBite = fileData.getUint8(i+256);
      tempArray.push(currentBite);
    }
    // Return proccessed data as an Uint8Array object
    return new Uint8Array(tempArray);
  } else {
    // Returned unproccessed data as an Uint8Array object
    return new Uint8Array(fileData.buffer);
  }
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