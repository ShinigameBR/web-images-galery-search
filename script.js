const imagesWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = lightBox.querySelector(".uil-times")
const downloadImgBtn = lightBox.querySelector(".uil-import")

const perPage = 15
let currentPage = 1
let searchTerm = null

const showLightbox = (img, photographer, photographer_url) => {
    lightBox.querySelector("img").src = img
    lightBox.querySelector("span").innerText = photographer
    lightBox.querySelector("a").href = photographer_url
    downloadImgBtn.setAttribute("data-img", img)
    lightBox.classList.add('show')
    document.body.style.overflow = "hidden"
}

const hideLightbox = () => {
    lightBox.classList.remove('show')
    document.body.style.overflow = "auto"
}

const downloadImg = (imgURL) => {
    fetch(imgURL).then(response => response.blob()).then(file => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click()
    }).catch(() => alert("Erro ao baixar imagem!"))
}

const generateHTML=(images) => {
    imagesWrapper.innerHTML += images.map(img => `
        <li class="card" onclick="showLightbox('${img.src.large2x}', '${img.photographer}', '${img.photographer_url}')">
        <img src="${img.src.large2x}" alt="image">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <a href="${img.photographer_url}"><span>${img.photographer}</span></a>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation()"><i class="uil uil-import"></i></button>
            </div>
        </li>
        
    `).join("");
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Carregando..."
    loadMoreBtn.classList.add('disabled')
    fetch(apiURL, {
        headers:{Authorization: config.API_KEY}
    }).then(response => response.json()).then(data =>{
        generateHTML(data.photos)
        loadMoreBtn.innerText = "Ver Mais"
        loadMoreBtn.classList.remove('disabled')
    }).catch((error) => alert("Erro ao carregar as imagens! "))
}

const loadMoreImages = () =>{
    currentPage++
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL
    getImages(apiURL)
}

const loadSearchImages = (e) => {
    if (e.target.value === "") return searchTerm = null

    if (e.key == "Enter") {
        searchTerm = e.target.value
        imagesWrapper.innerHTML = ""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`)
loadMoreBtn.addEventListener('click', loadMoreImages)
searchInput.addEventListener('keyup', loadSearchImages)
closeBtn.addEventListener('click', hideLightbox)
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))