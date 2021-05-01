// COLORS

const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  dark: "#705848",
  ice: "#98D8D8",
  ghost: "#705898",
};

// CONSTANTS

const pokeContainer = document.querySelector(".pokemon");
const textContainer = document.querySelector(".text");
const typesContainer = document.querySelector("#Types");
const searchBar = document.querySelector("#search");
const initialDisplay = document.querySelector(".initial-displacontainer");
const randomButton = document.querySelector("#random");
//initialDisplay.classList.remove("hidden2");
let images = 0;
let ready;
let temp = [];
let num = 1;

let totalImages = 10;
//SEARCH EVENT LISTNER
searchBar.addEventListener("search", getPokemon);

randomButton.addEventListener("click", function () {
  getPokemonRandom();
});

// RENDER ERROR

function renderError(err) {
  const pokeDex = document.createElement("div");
  pokeDex.classList.add("poke-dex");

  const name = document.createElement("h2");
  name.style.color = "white";
  name.classList.add("center");
  name.textContent = `Name : ${err}`;
  name.style.textAlign = "center";

  const color = "#D8000C";
  pokeDex.style.background = color;

  const textContainer = document.createElement("div");
  textContainer.classList.add("error");
  textContainer.appendChild(name);

  pokeDex.appendChild(textContainer);
  pokeContainer.appendChild(pokeDex);
}

// DELETE ALL CHILD NODES

function deleteChild() {
  while (pokeContainer.firstChild) {
    pokeContainer.removeChild(pokeContainer.firstChild);
  }
}

// CHECK IF IMAGES LOADED

function checkImages(data) {
  if (images == totalImages) {
    ready = true;
    images = 0;
  }
}

// GET POKEMON DATA
async function getPokeData(data) {
  renderHtml(data);
}

// GENERATE RANDOM

async function getPokemonRandom() {
  try {
    let j = typesContainer.value == "all" ? 10 : 50;
    typesContainer.classList.remove("hidden");
    initialDisplay.classList.add("hidden2");

    for (let i = 0; i < j; i++) {
      const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
      num++;
      if (!resp.ok) {
        throw new Error("Invalid Pokemon Name!");
      }
      const data = await resp.json();

      images++;
      checkImages(images);
      getPokeData(data);
    }
  } catch (err) {
    console.log(err);
    renderError(err);
  }
}

// GET POKEMON 10 AT A TIME

async function getPokemon() {
  try {
    let j = typesContainer.value == "all" ? 10 : 50;
    if (searchBar.value != "Random" && searchBar.value != "") {
      initialDisplay.classList.add("hidden2");
      typesContainer.classList.add("hidden");
      typesContainer.value = "all";
      deleteChild();
      const resp = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchBar.value}`
      );
      if (!resp.ok) {
        throw new Error("Invalid Pokemon Name!");
      }
      const data = await resp.json();
      console.log(data);
      getPokeData(data);
    } else if (searchBar.value == "Random") {
      typesContainer.classList.remove("hidden");
      initialDisplay.classList.add("hidden2");

      for (let i = 0; i < j; i++) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
        num++;
        if (!resp.ok) {
          throw new Error("Invalid Pokemon Name!");
        }
        const data = await resp.json();

        images++;
        checkImages(images);
        getPokeData(data);
      }
    }
  } catch (error) {
    console.log(error);
    renderError(error);
  }
}

// RENDER THE DATA TO HTML

function renderHtml(pokdata) {
  if (
    typesContainer.value == pokdata.types[0].type.name ||
    typesContainer.value == "all"
  ) {
    const pokeDex = document.createElement("div");
    pokeDex.classList.add("poke-dex");
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      `https://pokeres.bastionbot.org/images/pokemon/${pokdata.id}.png`
    );
    const name = document.createElement("h2");
    name.classList.add("center");
    name.textContent = `Name : ${pokdata.name}`;
    const type = pokdata.types[0].type.name;
    const color = colors[type];
    pokeDex.style.background = color;
    const type1 = document.createElement("h2");
    type1.textContent = `Type : ${type}`;
    const textContainer = document.createElement("div");
    textContainer.classList.add("flexy");
    textContainer.appendChild(name);
    textContainer.appendChild(type1);
    pokeDex.appendChild(img);
    pokeDex.appendChild(textContainer);
    pokeContainer.appendChild(pokeDex);
  }
}
// ADD A SCROLL

window.addEventListener("scroll", function () {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    ready
  ) {
    ready = false;
    getPokemonRandom();
  }
});
