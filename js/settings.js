function onShowSettings() {
    const elModal = document.querySelector('dialog.settings')
    elModal.showModal()
}

function onCloseSettings() {
    const elModal = document.querySelector('dialog.settings')
    elModal.close()
}

function onSelectLevel(val) {
    gSize = val
    gSolved = []
    onInit()
}

function onMute(elBtn) {
    gIsMuted = !gIsMuted
    elBtn.innerText = !gIsMuted ? '🔊' : '🔇'
    if (gIsMuted) {
        gAudioBg.pause()
    } else {
        gAudioBg.play()
    }
}