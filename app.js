const leftOverQueenTag = document.querySelector('#queens-left')
const restartBtn = document.querySelector('#restart')
const checkBtn = document.querySelector('#check')
const placeBtn = document.querySelector('#place')
const removeBtn = document.querySelector('#remove')
const toggleLabel = document.querySelector('#toggle-label')
const tilesContainer = document.querySelector('.tiles')
const queen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 112c30.88 0 56-25.12 56-56S286.9 0 256 0S199.1 25.12 199.1 56S225.1 112 256 112zM399.1 448H111.1c-26.51 0-48 21.49-48 47.1C63.98 504.8 71.15 512 79.98 512h352c8.837 0 16-7.163 16-16C447.1 469.5 426.5 448 399.1 448zM511.1 197.4c0-5.178-2.509-10.2-7.096-13.26L476.4 168.2c-2.684-1.789-5.602-2.62-8.497-2.62c-17.22 0-17.39 26.37-51.92 26.37c-29.35 0-47.97-25.38-47.97-50.63C367.1 134 361.1 128 354.6 128h-38.75c-6 0-11.63 4-12.88 9.875C298.2 160.1 278.7 176 255.1 176c-22.75 0-42.25-15.88-47-38.12C207.7 132 202.2 128 196.1 128h-38.75C149.1 128 143.1 134 143.1 141.4c0 18.45-13.73 50.62-47.95 50.62c-34.58 0-34.87-26.39-51.87-26.39c-2.909 0-5.805 .8334-8.432 2.645l-28.63 16C2.509 187.2 0 192.3 0 197.4C0 199.9 .5585 202.3 1.72 204.6L104.2 416h303.5l102.5-211.4C511.4 202.3 511.1 199.8 511.1 197.4z"/></svg>'
const helper = document.querySelector('#helper')

var helperMod = false



class Tile {
    constructor(x, y, tag) {
        this.x = x;
        this.y = y;
        this.tag = tag;
        this.status = 'empty';
    }
}


gameInit()


function gameInit() {
    let leftOverQueen = 8
    leftOverQueenTag.textContent = leftOverQueen
    let mode = 'place'
    placeBtn.classList.add('active')
    removeBtn.classList.remove('active')
    let tiles = []
    tiles = setTiles()
    renderTiles(tiles)
    // toggle btn
    toggleLabel.addEventListener('click', () => {
        if (mode == 'place') {
            mode = 'remove'
            removeBtn.classList.add('active')
            placeBtn.classList.remove('active')
        } else if (mode == 'remove') {
            mode = 'place'
            placeBtn.classList.add('active')
            removeBtn.classList.remove('active')
        }
    })
    helper.addEventListener('change', () => {
        helperAction(tiles)

    })
    // click
    tiles.forEach(tile => {
        tile.forEach(t => {
            t.tag.addEventListener('click', () => {

                if (mode == 'place' && t.status == 'empty') {
                    if (leftOverQueen) {
                        t.tag.classList.add('full')
                        t.status = 'full'
                        t.tag.innerHTML = queen
                        leftOverQueen--
                        leftOverQueenTag.textContent = leftOverQueen

                    }

                } else if (mode == 'remove' && t.status == 'full') {
                    t.tag.classList.remove('full')
                    t.status = 'empty'
                    t.tag.innerHTML = ''
                    leftOverQueen++
                    leftOverQueenTag.textContent = leftOverQueen
                }
                helperAction(tiles)
            })
        })
    })
    // restart
    restartBtn.addEventListener('click', () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                tiles[i][j].status = 'empty'
                tiles[i][j].tag.innerHTML = ''
                tiles[i][j].tag.classList.remove('checked')
                tiles[i][j].tag.classList.remove('full')
                tiles[i][j].tag.classList.remove('crash')
            }
        }



        leftOverQueen = 8
        leftOverQueenTag.textContent = leftOverQueen
        mode = 'place'
        placeBtn.classList.add('active')
        removeBtn.classList.remove('active')
    })
    // check
    checkBtn.addEventListener('click', () => {

        checkWon(tiles, leftOverQueen)
    })
}

function renderTiles(tiles) {
    tilesContainer.innerHTML = ''
    tiles.forEach(tile => {
        tile.forEach(t => {
            tilesContainer.appendChild(t.tag)
        })
    })
}
function helperAction(tiles) {
    if (helper.checked) {
        helperMod = true
        clearTiles(tiles)
        checkPosition(tiles)
    } else {
        helperMod = false
        clearTiles(tiles)
    }
}
function setTiles() {
    let tiles = []
    for (let i = 0; i < 8; i++) {
        let t = []
        for (let j = 0; j < 8; j++) {
            let tag = document.createElement('div')
            tag.classList.add('tile')
            if (i % 2 == 0 && j % 2 != 0 || j % 2 == 0 && i % 2 != 0) {
                tag.classList.add('black')
            } else {
                tag.classList.add('white')
            }


            let tile = new Tile(i, j, tag)
            t[j] = tile;
        }
        tiles[i] = t;
    }
    return tiles
}
function checkWon(tiles, leftOverQueen) {
    if (leftOverQueen) {
        alert('Please place all Queens')
        return false
    }
    clearTiles(tiles)
    let response = checkPosition(tiles)
    if (response != false) {
        console.log(response)
        // restartBtn.click()
        alert('All Queens were placed successfully :)')
    }else{
        alert('Wrong Solution :(')
    }

}
function checkPosition(tiles) {
    let successList = []
    let status = true
    tiles.forEach(tile => {
        tile.forEach(t => {
            if (t.status == 'full') {
                successList.push(t)
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (t.x == i || t.y == j || i - j == t.x - t.y || i + j == t.x + t.y) {
                            temp = tiles[i][j]
                            if (temp != t) {
                                if (temp.status == 'full') {
                                    temp.tag.classList.add('crash')
                                    status = false
                                } else {

                                    temp.tag.classList.add('checked')
                                }
                            }
                        }
                    }
                }
            }
        })
    })
    if (status) {
        return successList
    } else {
        return false
    }
}
function clearTiles(tiles) {
    tiles.forEach(tile => {
        tile.forEach(t => {
            t.tag.classList.remove('checked')
            t.tag.classList.remove('crash')
        })
    })

}