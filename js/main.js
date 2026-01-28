const API_KEY = "54251351-6221a0d55e5ab0d40dfdae0df";

const per_page = 9;
const listEl = document.querySelector(".list"); 
const btnEl = document.querySelector(".btn");

let page = Number(localStorage.getItem("pixabay_page")) || 1;

function getPicturesApi(currentPage) {
  return fetch(
    `https://pixabay.com/api/?key=${API_KEY}&page=${currentPage}&per_page=${per_page}&orientation=horizontal`
  ).then(res => res.json());
}

function createImages(array) {
  const item = array
    .map(({ largeImageURL, tags }) => {
      return `
        <li class="item">
          <div class="img-wrapper">
            <img class="img" src="${largeImageURL}" alt="${tags}">
          </div>
        </li>
      `;
    })
    .join("");

  listEl.insertAdjacentHTML("beforeend", item);
}

async function loadInitialImages() {
  for (let i = 1; i <= page; i++) {
    const res = await getPicturesApi(i);

    if (res.hits.length === 0) {
      btnEl.style.display = "none";
      break;
    }

    createImages(res.hits);
  }
}

loadInitialImages();

btnEl.addEventListener("click", async () => {
  page += 1;
  localStorage.setItem("pixabay_page", page);

  const res = await getPicturesApi(page);

  if (res.hits.length === 0) {
    btnEl.style.display = "none";
    return;
  }

  createImages(res.hits);
});

const resetBtn = document.querySelector(".btn-reset");

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("pixabay_page");
  location.reload(); 
});
