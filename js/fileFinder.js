let inputFileList = [];

const formElem = document.querySelector("form");
const fileInput = document.querySelector("#file-input");
const searchInput = document.querySelector("#search");
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
  const search = document.createElement("p");
  search.textContent = "Searching files...";
  downloadLinksElement.appendChild(search);
  // Load files and process them
  let waitReader = new Promise((resolve) =>{
    let fileCount = inputFileList.length;
    let count = [];
    let found = false;
    inputFileList.forEach(async (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", () => {
        if (reader.result.includes(searchInput.value)) {
          found = true;
        }
        count.push(0);
        if (found) {
          resolve(file.name);
        } else if (count.length === fileCount) {
          resolve(null);
        }
      });
    });
  });
  waitReader.then((data) => {
    downloadLinksElement.removeChild(search);
    const p = document.createElement("p");
    if (data !== null) {
      p.textContent = `Text found in: ${data}`;
    } else {
      p.textContent = "Couldn't find any files with specified text"
    }
    downloadLinksElement.appendChild(p);
  });
}