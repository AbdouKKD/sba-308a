document.addEventListener("DOMContentLoaded", () => {
  const getCatImage = async (breed = "") => {
    const url = breed
      ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breed}`
      : "https://api.thecatapi.com/v1/images/search";
    const response = await fetch(url);
    const data = await response.json();
    return data[0].url;
  };

  const getCatBreeds = async () => {
    const response = await fetch("https://api.thecatapi.com/v1/breeds");
    const data = await response.json();
    return data;
  };

  const postFavorite = async (catImage) => {
    console.log("Favorite cat added:", catImage);
  };

  let currentPage = 1;
  let breed = "";
  const africanBreeds = ["abys", "siam"];
  const galleryContainer = document.getElementById("gallery");
  const searchInput = document.getElementById("search");
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("prev");
  const favoriteButton = document.getElementById("favorite-btn");

  const updateGallery = async () => {
    galleryContainer.innerHTML = "";
    const catImages = [];
    for (let i = 0; i < 5; i++) {
      const imageUrl = await getCatImage(breed);
      catImages.push(imageUrl);
    }
    catImages.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = `Cat ${catImages.indexOf(url) + 1}`;
      galleryContainer.appendChild(img);
    });
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = false;
  };

  const searchHandler = async () => {
    breed = searchInput.value.trim().toLowerCase();
    await updateGallery();
  };

  const favoriteHandler = async () => {
    const imageUrl = galleryContainer.querySelector("img").src;
    await postFavorite(imageUrl);
  };

  nextButton.addEventListener("click", async () => {
    currentPage++;
    await updateGallery();
  });

  prevButton.addEventListener("click", async () => {
    currentPage--;
    await updateGallery();
  });

  searchInput.addEventListener("input", searchHandler);
  favoriteButton.addEventListener("click", favoriteHandler);

  const initGallery = async () => {
    await getCatBreeds();
    africanBreeds.forEach(async (breedId) => {
      await getCatImage(breedId);
    });
    await updateGallery();
  };

  initGallery();
});
