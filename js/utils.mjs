export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function setPageGame(gameType, inputElement) {
  const titleElement = document.querySelector("title");
  const gameInfoElement = document.createElement("div");
  gameInfoElement.setAttribute("id", "game-info");
  const gameTitleElement = document.createElement("h2");
  const gameTextElement = document.createElement("p");
  const gameElement = document.querySelector("#game");
  const companyElement = document.querySelector("#company");
  switch (gameType) {
    case "sonicRumbleTrim":
      titleElement.textContent += "Sonic Rumble";
      gameTitleElement.textContent = "Sonic Rumble File Trimmer";
      gameTextElement.innerHTML = `<b>Note:</b> The Unity files will be unversioned. 
      To open them in Asset Studio you will need to go to <b>"Options>Import Options>Specify Unity Version"</b> 
      and insert the version <b>"2022.3.45f1"</b>.`;
      inputElement.setAttribute("accept", ".bdl");
      gameElement.textContent = "Sonic Rumble";
      companyElement.textContent = "Sega";
      break;
    case "sonicRumbleDecrypt":
      titleElement.textContent += "Sonic Rumble";
      gameTitleElement.textContent = "Sonic Rumble File Decryptor";
      gameTextElement.innerHTML = `<b>Note:</b> The Unity files will be unversioned. 
      To open them in Asset Studio you will need to go to <b>"Options>Import Options>Specify Unity Version"</b> 
      and insert the version <b>"2022.3.45f1"</b>.`;
      inputElement.setAttribute("accept", ".bdl");
      gameElement.textContent = "Sonic Rumble";
      companyElement.textContent = "Sega";
      break;
    default:
      inputElement.setAttribute("accept", "");
      break;
  }
  gameInfoElement.appendChild(gameTitleElement);
  if (gameTextElement.textContent !== "") {
    gameInfoElement.appendChild(gameTextElement);
  }
  document.querySelector("main").prepend(gameInfoElement);
}