'use strict'

var gSize = +localStorage.multSize || 4
var gIsStarted
var gSolvedCount
var gElSelectedCell
var gCandyInterval
var gAudioBg
var gSolved = JSON.parse(localStorage.solved || '[]')

const gAudioRights = [new Audio('sound/right1.mp3'), new Audio('sound/right2.mp3'), new Audio('sound/right3.mp3')]

const gAudioWrong = new Audio('sound/wrong.mp3')
const gAudioWin = new Audio('sound/win.mp3')
const gAudioCheer = new Audio('sound/cheer.mp3')
const gAudioBreak = new Audio('sound/broken.mp3')
const gAudioExplode = new Audio('sound/explode.mp3')
const gAudioBgs = [new Audio('sound/bg1.mp3'), new Audio('sound/bg2.mp3'), new Audio('sound/bg3.mp3')]
gAudioBgs.forEach(a => a.loop = true)


function onInit() {
    gSolvedCount = gSolved.length
    gIsStarted = false

    renderTable()
    if (gSize > 6) {
        if (gCandyInterval) clearInterval(gCandyInterval)
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

            var className = ''
            var tdContent = ''
            const cellWidth = 'auto' // 100 / gSize

            if (!i || !j) {
                strHTML += `<th style="width:${cellWidth}%" data-i="${i}" data-j="${j}" onclick="onThClicked(this, ${i}, ${j})"  ><div>${num}<div></th>`
            } else {
                const idx = gSolved.indexOf('' + num)
                if (idx >= 0) {
                    gSolved.splice(idx, 1)
                    className = 'solved'
                    tdContent = num
                }                
                strHTML += `<td  style="width:${cellWidth}%" class="${className}" data-diagonal="${i === j}" data-i="${i}" data-j="${j}" onclick="onTdClicked(this, ${i + 1}, ${j + 1})"><div>${tdContent}</div></td>`
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

    els = els.slice(0, Math.ceil(els.length / 2))
    var openedElsCount = 0
    els.forEach(el => {
        if (el.classList.contains('solved')) return
        el.classList.add('solved')
        el.innerHTML = (+el.dataset.i + 1) * (+el.dataset.j + 1)
        gSolvedCount++
        openedElsCount++
    })
    elCell.classList.add('solved')
    if (openedElsCount) {
        gAudioCheer.play()
        checkGameOver()
    }
}

function onTdClicked(elCell, x, y) {
    if (elCell.classList.contains('solved')) return

    if (!gIsStarted) {
        gIsStarted = true
        gAudioBg = gAudioBgs[getRandomInt(0, gAudioBgs.length)]
        gAudioBg.play()
    }

    gElSelectedCell = elCell
    const elModal = document.querySelector('dialog')
    elModal.querySelector('h2 span').innerText = `${x} * ${y} =`
    elModal.querySelector('input').value = ''
    elModal.querySelector('button').dataset.mult = x * y
    elModal.classList.add('show')
    elModal.showModal()
}

function onAns() {
    const elModal = document.querySelector('dialog')
    const ans = elModal.querySelector('input').value
    const mult = elModal.querySelector('button').dataset.mult

    if (ans === mult) {
        gAudioRights[getRandomInt(0, gAudioRights.length)].play()
        gElSelectedCell.classList.add('solved')
        gElSelectedCell.innerHTML = ans
        saveProgress(ans)

    } else {
        gAudioWrong.play()
        highlightEl(gElSelectedCell, 'wrong')
        setTimeout(()=>{
            breakScreen()
        }, 1000)
    }
    gElSelectedCell = null
    elModal.classList.remove('show')
    elModal.close()
}

function onRestart() {
    localStorage.clear()
    gSize = 4
    gSolved = []
    onInit()
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
        gAudioBg.pause()
        gAudioWin.play()
        clearInterval(gCandyInterval)
        gSize++
        localStorage.multSize = gSize
        setTimeout(()=>{
            explodeScreen()
            setTimeout(onInit, 1000)
        }, 2500)
        
        return true
    }
    return false
}

function saveProgress(ans) {
    gSolvedCount++
    const isOver = checkGameOver()
    if (isOver) {
        localStorage.solved = '[]'
    } else {
        const solved = JSON.parse(localStorage.solved || '[]')
        solved.push(ans)
        localStorage.solved = JSON.stringify(solved)
    }
}

function breakScreen() {
    gAudioBreak.play()
    const el = document.querySelector('.broken')
    el.style.display = 'block'
    setTimeout(()=>{
        el.style.display = 'none'
    }, 2500) 
}

function explodeScreen() {
    gAudioExplode.play()
    const el = document.querySelector('.explode')
    el.style.display = 'block'
    setTimeout(()=>{
        el.style.display = 'none'
    }, 2500) 
    
}

function onSelectLevel(val) {
    gSize = val
    gSolved = []
    onInit()
}