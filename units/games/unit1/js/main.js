// DOM 요소
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const rulesModal = document.getElementById('rulesModal');
const winModal = document.getElementById('winModal');

const playerCountSelect = document.getElementById('playerCount');
const playerNamesContainer = document.getElementById('playerNamesContainer');
const startGameBtn = document.getElementById('startGameBtn');
const rulesBtn = document.getElementById('rulesBtn');
const rulesGameBtn = document.getElementById('rulesGameBtn');
const closeRulesBtn = document.getElementById('closeRulesBtn');
const closeRulesBtn2 = document.getElementById('closeRulesBtn2');
const restartBtn = document.getElementById('restartBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');

const currentTurnDisplay = document.getElementById('currentTurnDisplay');
const goldGrid = document.getElementById('goldGrid');
const jewelGrid = document.getElementById('jewelGrid');
const goldValue = document.getElementById('goldValue');
const jewelValue = document.getElementById('jewelValue');
const resultValue = document.getElementById('resultValue');
const bingoBoard = document.getElementById('bingoBoard');
const playerStatusDisplay = document.getElementById('playerStatusDisplay');

const winnerName = document.getElementById('winnerName');
const totalTurnsDisplay = document.getElementById('totalTurns');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToStartBtn = document.getElementById('backToStartBtn');

// 플레이어 수 변경 시 입력 필드 업데이트
playerCountSelect.addEventListener('change', () => {
    const count = parseInt(playerCountSelect.value);
    updatePlayerInputs(count);
});

function updatePlayerInputs(count) {
    playerNamesContainer.innerHTML = '';
    const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D'];
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input';
        div.innerHTML = `
            <label>플레이어 ${i + 1} <span class="player-color-dot" style="background: ${colors[i]};"></span></label>
            <input type="text" id="player${i + 1}Name" value="플레이어${i + 1}" maxlength="10">
        `;
        playerNamesContainer.appendChild(div);
    }
}

// 게임 시작
startGameBtn.addEventListener('click', () => {
    const playerCount = parseInt(playerCountSelect.value);
    const playerNames = [];
    
    for (let i = 1; i <= playerCount; i++) {
        const input = document.getElementById(`player${i}Name`);
        playerNames.push(input.value.trim() || `플레이어${i}`);
    }
    
    // 🎮 게임 시작 사운드
    gameSound.playGameStartSound();
    
    game.initGame(playerCount, playerNames);
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    initGameUI();
});

// 게임 UI 초기화
function initGameUI() {
    createBingoBoard();
    updateTurnDisplay();
    updatePlayerStatus();
    updateSelectionButtons();
    resetCalculation();
}

// 빙고판 생성
function createBingoBoard() {
    bingoBoard.innerHTML = '';
    
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const number = game.bingoBoardNumbers[row][col];
            const cell = document.createElement('button');
            cell.className = 'bingo-cell';
            cell.textContent = number;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.number = number;
            
            cell.addEventListener('click', () => handleBingoCellClick(row, col, number));
            
            bingoBoard.appendChild(cell);
        }
    }
}

// 턴 표시 업데이트
function updateTurnDisplay() {
    const currentPlayer = game.getCurrentPlayer();
    const playerNameSpan = currentTurnDisplay.querySelector('.turn-player-name');
    const playerDot = currentTurnDisplay.querySelector('.turn-player-dot');
    
    playerNameSpan.textContent = currentPlayer.name;
    playerDot.style.background = currentPlayer.color;
    
    // 힌트 텍스트 업데이트
    updateHintText();
}

// 힌트 텍스트 업데이트
function updateHintText() {
    const hintText = document.getElementById('hintText');
    
    if (game.isFirstTurn) {
        hintText.innerHTML = '🪙 금화와 💎 보석을 각각 하나씩 선택하세요';
    } else if (game.turnMoveCount === 0) {
        hintText.innerHTML = '⚠️ 금화 또는 보석 중 <strong>하나만</strong> 이동할 수 있습니다';
    } else if (game.lastMovedArea === 'gold') {
        hintText.innerHTML = '🪙 금화만 이동 가능합니다 (같은 줄에서 다른 숫자 선택)';
    } else if (game.lastMovedArea === 'jewel') {
        hintText.innerHTML = '💎 보석만 이동 가능합니다 (같은 줄에서 다른 숫자 선택)';
    }
}

// 플레이어 현황 업데이트
function updatePlayerStatus() {
    playerStatusDisplay.innerHTML = '';
    
    game.players.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'status-item';
        if (index === game.currentPlayerIndex) {
            div.classList.add('current');
        }
        
        div.innerHTML = `
            <span class="status-dot" style="background: ${player.color};"></span>
            <span>${player.name}: ${player.coloredCells}칸</span>
        `;
        
        playerStatusDisplay.appendChild(div);
    });
}

// 선택 버튼 활성화/비활성화
function updateSelectionButtons() {
    const goldButtons = goldGrid.querySelectorAll('.number-btn');
    const jewelButtons = jewelGrid.querySelectorAll('.number-btn');
    
    const canSelectGold = game.canSelectGold();
    const canSelectJewel = game.canSelectJewel();
    
    // 모든 핀과 wrapper 제거
    document.querySelectorAll('.pin-marker').forEach(pin => pin.remove());
    document.querySelectorAll('.button-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.number-btn');
        if (btn) {
            wrapper.parentElement.insertBefore(btn, wrapper);
            wrapper.remove();
        }
    });
    
    goldButtons.forEach(btn => {
        btn.disabled = !canSelectGold;
        if (parseInt(btn.dataset.value) === game.currentGold) {
            btn.classList.add('selected');
            addPinMarker(btn, 'gold');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    jewelButtons.forEach(btn => {
        btn.disabled = !canSelectJewel;
        if (parseInt(btn.dataset.value) === game.currentJewel) {
            btn.classList.add('selected');
            addPinMarker(btn, 'jewel');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// 핀 마커 추가
function addPinMarker(button, type) {
    // 버튼을 wrapper로 감싸기
    const wrapper = document.createElement('div');
    wrapper.className = 'button-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    // 버튼을 wrapper로 감싸기
    const parent = button.parentElement;
    parent.insertBefore(wrapper, button);
    wrapper.appendChild(button);
    
    // 핀 생성
    const pin = document.createElement('div');
    pin.className = `pin-marker pin-${type}`;
    pin.textContent = '📌';
    
    // wrapper에 핀 추가 (버튼 밖)
    wrapper.appendChild(pin);
}

// 금화 버튼 클릭
goldGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('number-btn') && !e.target.disabled) {
        const value = parseInt(e.target.dataset.value);
        if (game.selectGold(value)) {
            // 🪙 금화 선택 사운드
            gameSound.playCoinSound();
            
            updateSelectionButtons();
            updateCalculation();
            updateHintText();
        }
    }
});

// 보석 버튼 클릭
jewelGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('number-btn') && !e.target.disabled) {
        const value = parseInt(e.target.dataset.value);
        if (game.selectJewel(value)) {
            // 💎 보석 선택 사운드
            gameSound.playJewelSound();
            
            updateSelectionButtons();
            updateCalculation();
            updateHintText();
        }
    }
});

// 계산 표시 업데이트 (결과는 숨김)
function updateCalculation() {
    if (game.currentGold !== null) {
        goldValue.textContent = game.currentGold;
    } else {
        goldValue.textContent = '-';
    }
    
    if (game.currentJewel !== null) {
        jewelValue.textContent = game.currentJewel;
    } else {
        jewelValue.textContent = '-';
    }
    
    const result = game.getCalculationResult();
    // 결과를 표시하지 않고 ? 로 표시
    if (result !== null) {
        resultValue.textContent = '?';
    } else {
        resultValue.textContent = '?';
    }
    
    // 하이라이트도 제거
    clearHighlight();
}

// 계산 초기화
function resetCalculation() {
    goldValue.textContent = '-';
    jewelValue.textContent = '-';
    resultValue.textContent = '?';
}

// 강조 제거
function clearHighlight() {
    const cells = bingoBoard.querySelectorAll('.bingo-cell');
    cells.forEach(cell => cell.classList.remove('highlight'));
}

// 턴 재시도 (이미 색칠된 칸 선택 시)
function resetCurrentTurn() {
    // 이전 값으로 복구 (이전 플레이어가 마지막으로 사용한 값)
    game.restorePreviousValues();
    
    // UI 업데이트
    updateSelectionButtons();
    updateCalculation(); // 이전 값으로 계산 표시
}

// 확인 버튼 제거됨 - 빙고판 직접 클릭으로 대체

// 빙고판 셀 업데이트
function updateBingoCell(row, col) {
    const cells = bingoBoard.querySelectorAll('.bingo-cell');
    const index = row * 5 + col;
    const cell = cells[index];
    
    const currentPlayer = game.getCurrentPlayer();
    cell.classList.add('colored');
    cell.style.background = currentPlayer.color;
    cell.dataset.player = `P${currentPlayer.id}`;
}

// 빙고판 셀 클릭
function handleBingoCellClick(row, col, number) {
    const result = game.getCalculationResult();
    
    if (result === null) {
        alert('먼저 금화와 보석 숫자를 선택해주세요!');
        return;
    }
    
    // 정답 여부 확인
    if (result !== number) {
        // ❌ 오답 사운드
        gameSound.playWrongSound();
        alert('❌ 틀렸습니다! 다시 선택해보세요.');
        return;
    }
    
    // 정답!
    // ✅ 정답 사운드
    gameSound.playCorrectSound();
    alert('✅ 정답입니다!');
    
    
    // 이미 색칠된 칸인지 확인
    if (game.boardState[row][col].colored) {
        alert('⚠️ 이미 색칠된 칸입니다! 다시 선택해주세요.');
        // 턴 재시도 - 다시 선택할 수 있도록 활성화
        resetCurrentTurn();
        return;
    }
    
    // 칸 색칠
    if (game.colorCell(row, col)) {
        // 🎯 페인트 사운드
        gameSound.playPaintSound();
        
        updateBingoCell(row, col);
        
        // 빙고 체크
        const currentPlayer = game.getCurrentPlayer();
        if (game.checkBingo(currentPlayer.id)) {
            // 🎊 빙고 승리 사운드
            setTimeout(() => {
                gameSound.playBingoSound();
            }, 300);
            
            game.setWinner(currentPlayer.id);
            setTimeout(() => {
                showWinModal();
            }, 500);
            return;
        }
        
        // 다음 턴으로
        game.nextTurn();
        
        // 🔄 턴 전환 사운드
        gameSound.playTurnChangeSound();
        
        updateTurnDisplay();
        updatePlayerStatus();
        updateSelectionButtons();
        resetCalculation();
        clearHighlight();
    }
}

// 승리 모달 표시
function showWinModal() {
    winnerName.textContent = game.winner.name;
    winnerName.style.background = `linear-gradient(135deg, ${game.winner.color} 0%, ${game.playerColors[(game.winner.id) % game.playerColors.length]} 100%)`;
    winnerName.style.webkitBackgroundClip = 'text';
    winnerName.style.backgroundClip = 'text';
    winnerName.style.webkitTextFillColor = 'transparent';
    
    totalTurnsDisplay.textContent = game.totalTurns;
    
    winModal.classList.add('active');
}

// 규칙 모달 열기
rulesBtn.addEventListener('click', () => {
    rulesModal.classList.add('active');
});

rulesGameBtn.addEventListener('click', () => {
    rulesModal.classList.add('active');
});

// 규칙 모달 닫기
closeRulesBtn.addEventListener('click', () => {
    rulesModal.classList.remove('active');
});

closeRulesBtn2.addEventListener('click', () => {
    rulesModal.classList.remove('active');
});

// 모달 배경 클릭 시 닫기
rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
        rulesModal.classList.remove('active');
    }
});

// 다시 하기 (게임 화면에서)
restartBtn.addEventListener('click', () => {
    if (confirm('게임을 다시 시작하시겠습니까?')) {
        game.initGame(game.players.length, game.players.map(p => p.name));
        initGameUI();
    }
});

// 다시 하기 (승리 모달에서)
playAgainBtn.addEventListener('click', () => {
    winModal.classList.remove('active');
    game.initGame(game.players.length, game.players.map(p => p.name));
    initGameUI();
});

// 처음으로
backToStartBtn.addEventListener('click', () => {
    winModal.classList.remove('active');
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
});

// 사운드 토글 버튼
soundToggleBtn.addEventListener('click', () => {
    const isEnabled = gameSound.toggle();
    const icon = soundToggleBtn.querySelector('i');
    
    if (isEnabled) {
        icon.className = 'fas fa-volume-up';
        soundToggleBtn.title = '사운드 켜기/끄기 (현재: 켜짐)';
        // 간단한 테스트 사운드
        gameSound.playTone(523, 0.1);
    } else {
        icon.className = 'fas fa-volume-mute';
        soundToggleBtn.title = '사운드 켜기/끄기 (현재: 꺼짐)';
    }
});

// 초기 플레이어 입력 필드 생성
updatePlayerInputs(2);

// 홈으로 이동
function goHome() {
    window.location.href = '../../../index.html';
}
