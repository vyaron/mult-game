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
    localStorage.isMuted = gIsMuted
    setAudioMuted(gIsMuted)
    renderMuteBtn()
}