const body = document.querySelector("body")

const create = (tagName, container, text=null, className=null, id=null) => {
    // return HTML element (tagName.className#id) in container with text, class and id
    let elt = container.appendChild(document.createElement(tagName))
    text ? elt.appendChild(document.createTextNode(text)) : elt
    className ? elt.classList.add(className) : elt
    id ? elt.id = id : elt
    return elt
}

const main = document.querySelector("main")

const createCrousel = (container) => {
    const carousel = create("div",container,null,"carousel")
    const carouselElts = [
        {img : "carousel1", title : "Your style", comment : "Get Up To 40% OFF", id : 0},
        {img : "carousel2", title : "Your style", comment : "Get Up To 40% OFF", id : 1},
        {img : "carousel3", title : "Your style", comment : "Get Up To 40% OFF", id : 2}
    ]
    carouselElts.forEach(elt => {
        const carouselElt = create("div",carousel,null,"carousel__element") 
        carouselElt.style.setProperty('--item', elt.id)
        const image = create("img",carouselElt)
        image.src = `./src/images/carousel/${elt.img}.jpg`
        image.alt = `carousel image ${elt.id}`
        const comment = create("div",carouselElt,null,"comment")
        create("h2",comment,elt.title)
        create("p",comment,elt.comment)
    })
    return carousel
}

const searchForArticles = (e) => {
    const articles = document.querySelectorAll(".articles-container>.article-item")
	const searchedString = e.target.value.toLowerCase()
    articles.forEach(elt => elt.querySelector(".article-item__infos h3").textContent.toLowerCase().includes(searchedString) ? elt.classList.remove("hide-item") : elt.classList.add("hide-item"))
}

const createSearchBox = (container) => {
    const searchBox = create("div",container,null,"search-box")
    const input = create("input",searchBox,null,"search-box__input")
    input.type = "text"
    input.placeholder = "Start Looking For A Specific Article"
    input.addEventListener("input", searchForArticles)
    const label = create("label",searchBox,null,"search-box__label","search-input")
    label.htmlFor = "search-input"
    const icon = create("i",label,null,"fas")
    icon.classList.add("fa-search")
    return searchBox
}

const createListItem = (item) => {
    // return the article displaying item's informations
    const container = document.querySelector("main>.articles-container")
    const art = create("article",container,null,"article-item")
    art.idItem = item.id
    const image = create("img",art,null,"article-item__image")
    image.src = `./src/images/articles/${item.images[0]}.jpg`
    image.alt = `article ${item.id}`
    const infos = create("div",art,null,"article-item__infos")
    create("h3",infos,item.name)
    const tags = create("p",infos,null,"tags")
    item.tags.forEach(tag => create("span",tags,tag,"tags__tag"))
    const price = create("div",infos,null,"price")
    create("span",price,`${item.price.toFixed(2)} $`)
    createAddToCartButton(price, item.id)
    art.addEventListener("click", e => createArticlePage(e, art))
    return art
}

let cart = []

async function fetchData() {
    let data = []
    await fetch("./services/articles.json")
    .then(response => response.json())
    .then(response => {data = response})
    return data;
}

async function addToCart(e, indice) {
    e.stopPropagation()
    // alert("Wow ! Trop cool 🎉")

    const data = await fetchData();
    const article = data.filter(obj => obj.id === indice)

    cart.push(...article)
}

const createArticleCarousel = (container, arr) => {
    const carDiv =  create("div",container,null,"carousel-manual")
    arr.forEach(elt => {
        const image = create("img",carDiv,null,"carousel-manual__image")
        image.src = `./src/images/articles/${elt}.jpg`
        image.alt = elt
    })
    return carDiv
}

const createBackButton = (container, onClick) => {
    const back = create("button",container,null,"second-button")
    back.classList.add("back-button")
    back.addEventListener("click", onClick)
    const icon = create("i",back,null,"fas")
    icon.classList.add("fa-chevron-left")
    return back
}

const createAddToCartAnimation = () => {
    const anim = create("p",body,"+ 1","add-to-cart-anim")
    setTimeout(() => body.removeChild(anim),2000)
    console.log("coucou")
}

const createAddToCartButton = (container, indice) => {
    const add = create("button",container,null,"add-button")
    add.addEventListener("click", e => addToCart(e,indice))
    const icon = create("i",add, null,"fas")
    icon.classList.add("fa-plus")
    add.addEventListener("click",createAddToCartAnimation)
    return add
}


async function createArticlePage(e, elt) {
    document.querySelectorAll("main>*").forEach(elt => main.removeChild(elt))

    const data = await fetchData();
    let article = data.filter(obj => obj.id === elt.idItem)
    article = article[0]

    const container = create("div",main,null,"article-page")
    const heading = create("div",container,null,"article-page__heading")
    const title = create("h2",heading)
    createBackButton(title, createArticlesList)
    title.appendChild(document.createTextNode(article.name))
    const tags = create("p",heading,null,"tags")
    article.tags.forEach(tag => create("span",tags,tag,"tags__tag"))
    createAddToCartButton(heading, elt.idItem)

    create("p",container,article.description)

    createArticleCarousel(container, article.images)

    return container
}

async function addArticleToList() {
    const data = await fetchData();
    data.forEach(elt => createListItem(elt))
}

async function createArticlesList() {
    
    document.querySelectorAll("main>*").forEach(elt => main.removeChild(elt))

    const data = await fetchData();

    createCrousel(main)
    createSearchBox(main)

    create("div",main,null,"articles-container")
    data.forEach(elt => createListItem(elt))

    const seeMoreButton = create("button",main,"See more...","main-button")
    seeMoreButton.classList.add("see-more")
    seeMoreButton.addEventListener("click", addArticleToList)

}

createArticlesList()