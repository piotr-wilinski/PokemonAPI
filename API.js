const getJSON = (url, callback) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'json'

  xhr.onload = () => {
    let status = xhr.status
    if (status === 200) callback(null, xhr.response)
    else callback(status)
  }
  xhr.send()
}

class Pokemon {
  constructor(name, id, image, superType, subType, rarity, indexElement) {
    this.name = name
    this.id = id
    this.image = image
    this.superType = superType
    this.subType = subType
    this.rarity = rarity
    this.indexElement = indexElement
    this.section = document.querySelector('.cards-container')
  }

  showPokemonInformations() {
    const div = document.createElement('div')
    const spanName = document.createElement('span')
    const spanNumber = document.createElement('span')
    const image = document.createElement('img')
    const superType = document.createElement('p')
    const subType = document.createElement('p')
    const rarity = document.createElement('p')

    div.setAttribute('data-key', this.indexElement)
    spanName.classList.add('left')
    spanNumber.classList.add('right')

    spanName.textContent = this.name
    spanNumber.textContent = `Nr. ${this.id}`
    image.setAttribute('src', this.image)
    superType.innerHTML = `<strong>Supertype:</strong> ${this.superType}`
    subType.innerHTML = `<strong>Subtype:</strong> ${this.subType}`
    rarity.innerHTML = `<strong>Rarity:</strong> ${this.rarity}`

    this.section.appendChild(div)
    div.appendChild(spanName)
    div.appendChild(spanNumber)
    div.appendChild(image)
    div.appendChild(superType)
    div.appendChild(subType)
    div.appendChild(rarity)
  }
}

class EventListeners {
  constructor(render, catalog, array) {
    this.render = render
    this.catalog = catalog
    this.array = array

    document.querySelector('.show-more').addEventListener('click', this.render.bind(this))
    document.querySelector('.top__search input').addEventListener('keydown', this.showFilteredCatalog.bind(this))
  }

  showFilteredCatalog(e) {
    const searchText = e.target.value.toLowerCase()

    const filterArray = []
    this.catalog.forEach(element => element.name.toLowerCase().includes(searchText) ? filterArray.push(element) : console.log('no'))

    console.log(filterArray)

    this.array(filterArray)

    // this.catalog.forEach((element, index) => {
    //   if (element.name.toLowerCase().includes(searchText)) {
    //     console.log(index)
    //     document.querySelector(`.cards-container div[data-key="${index}"]`).classList.add('inactive')
    //   }
    // })
  }
}


getJSON('https://api.pokemontcg.io/v1/cards', (err, data) => {
  if (err != null) {
    console.log(err)
  } else {
    const catalogIndexArray = []
    console.log('yes')

    const render = () => {
      for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * data.cards.length)
        catalogIndexArray.push({
          index,
          name: data.cards[index].name
        })

        console.log(catalogIndexArray)

        const pokemon = new Pokemon(data.cards[index].name, data.cards[index].number, data.cards[index].imageUrl, data.cards[index].supertype, data.cards[index].subtype, data.cards[index].rarity, catalogIndexArray.length)

        pokemon.showPokemonInformations()
      }
    }

    const showFiltered = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        console.log(arr)
        console.log(data.cards[arr.index])

        const pokemon = new Pokemon(data.cards[arr.index].name, data.cards[arr.index].number, data.cards[arr.index].imageUrl, data.cards[arr.index].supertype, data.cards[arr.index].subtype, data.cards[arr.index].rarity, catalogIndexArray.length)

        pokemon.showPokemonInformations()
      }
    }

    render()

    const eventListeners = new EventListeners(render, catalogIndexArray, showFiltered)
  }

})