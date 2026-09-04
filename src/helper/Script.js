const genreSelect = document.getElementById("genre-select");

genres.forEach((genre) => {
  const option = document.createElement("option");

  option.value = genre.id;
  option.textContent = genre.name;

  genreSelect.appendChild(option);
});