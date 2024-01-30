'use strict'

var gSize = 4
var gIsStarted
var gSolvedCount
var gElSelectedCell
var gCandyInterval

const gAudioRight = new Audio('sound/right.mp3')
const gAudioWrong = new Audio('sound/wrong.mp3')
const gAudioWin = new Audio('sound/win.mp3')
const gAudioCheer = new Audio('sound/cheer.mp3')
const gAudioBg = new Audio('sound/bg.ogg')

function onInit() {
    gSolvedCount = 0
    gIsStarted = false

    renderTable()
    if (gSize > 6) {
        gCandyInterval = setInterval(placeCandy, 7000)
    }
}

function placeCandy() {
    const els = [...document.querySelectorAll('th:not(.solved)')]
    const idx = getRandomInt(0, els.length)
    const el = els[idx]
    el.classList.add('candy')

    setTimeout(() => {
        el.classList.remove('candy')
    }, 5000)
}

function renderTable() {
    var strHTML = ''
    for (var i = 0; i < gSize; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gSize; j++) {
            const num = (i + 1) * (j + 1)

            if (!i || !j) {
                strHTML += `<th data-i="${i}" data-j="${j}" onclick="onThClicked(this, ${i}, ${j})"  >${num}</th>`
            } else {
                strHTML += `<td data-diagonal="${i === j}" data-i="${i}" data-j="${j}" onclick="onTdClicked(this, ${i + 1}, ${j + 1})"></td>`
            }
        }
        strHTML += '</tr>'
    }

    document.querySelector('.mult-table').style.backgroundImage = `url(img/${gSize}.jpg)`
    document.querySelector('.mult-table').innerHTML = strHTML
}

function onThClicked(elCell, i, j) {
    if (!elCell.classList.contains('candy')) return
    elCell.classList.remove('candy')

    var els
    if (i === 0 && j === 0) {
        els = [...document.querySelectorAll(`td[data-diagonal="true"]`)]
    } else {
        els = (i === 0) ?
            [...document.querySelectorAll(`td[data-j="${j}"]`)] :
            [...document.querySelectorAll(`td[data-i="${i}"]`)]
    }

    els.forEach(el => {
        if (el.classList.contains('solved')) return
        el.classList.add('solved')
        el.innerHTML = (+el.dataset.i + 1) * (+el.dataset.j + 1)
        gSolvedCount++
    })
    gAudioCheer.play()

    elCell.classList.add('solved')
    checkGameOver()
}

function onTdClicked(elCell, x, y) {
    if (elCell.classList.contains('solved')) return

    if (!gIsStarted) {
        gIsStarted = true
        gAudioBg.play()
    }

    gElSelectedCell = elCell
    const elModal = document.querySelector('dialog')
    elModal.querySelector('h2 span').innerText = `${x} * ${y} =`
    elModal.querySelector('input').value = ''
    elModal.querySelector('button').dataset.mult = x * y
    elModal.classList.add('show')
    elModal.showModal()

    // const ans = +prompt(`${x} * ${y} =`)
}

function onAns() {
    const elModal = document.querySelector('dialog')
    const ans = elModal.querySelector('input').value
    const mult = elModal.querySelector('button').dataset.mult

    if (ans === mult) {
        gAudioRight.play()
        gElSelectedCell.classList.add('solved')
        gElSelectedCell.innerHTML = ans
        gSolvedCount++
        checkGameOver()
    } else {
        gAudioWrong.play()
        highlightEl(gElSelectedCell, 'wrong')
    }
    gElSelectedCell = null
    elModal.classList.remove('show')
    elModal.close()
}

function highlightEl(el, className = 'highlight') {
    el.classList.add(className)
    setTimeout(() => {
        el.classList.remove(className)
    }, 500)

}


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function checkGameOver() {
    if (gSolvedCount === (gSize - 1) * (gSize - 1)) {
        gAudioWin.play()
        gAudioBg.pause()
        clearInterval(gCandyInterval)
        gSize++
        onInit()
        return true
    }
    return false
}