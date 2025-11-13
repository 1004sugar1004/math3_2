// 게임 상태 관리
const gameState = {
    numPlayers: 0,
    players: [],
    cups: [
        { id: 1, name: '종이컵', actualVolume: 190, image: 'images/paper-cup-190ml.jpg' },
        { id: 2, name: '머그컵', actualVolume: 350, image: 'images/mug-cup.png' },
        { id: 3, name: '작은 플라스틱컵', actualVolume: 150, image: 'images/cup-small-plastic-150ml.png' },
        { id: 4, name: '큰 플라스틱컵', actualVolume: 500, image: 'images/cup-large-plastic-500ml.png' }
    ],
    currentPlayerIndex: 0,
    currentEstimatorIndex: 0,
    targetVolume: 1000,
    phase: 'start', // start, estimation, game, result
    diceRolled: false,
    diceValue: 0,
    selectedCupsForTurn: [], // 이번 턴에 선택한 컵들 (순서대로)
    requiredSelections: 0 // 선택해야 하는 컵의 개수
};

// 플레이어 수 선택
function selectPlayers(num) {
    gameState.numPlayers = num;
    const playerInputsDiv = document.getElementById('playerInputs');
    playerInputsDiv.innerHTML = '';
    
    for (let i = 1; i <= num; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'flex flex-col items-center';
        inputDiv.innerHTML = `
            <label class="text-lg font-bold text-gray-700 mb-2">플레이어 ${i}</label>
            <input type="text" id="player${i}Name" class="input-field w-full" placeholder="이름을 입력하세요" value="플레이어 ${i}">
        `;
        playerInputsDiv.appendChild(inputDiv);
    }
    
    document.getElementById('playerNamesSection').classList.remove('hidden');
}

// 게임 시작
function startGame() {
    gameSounds.playGameStart();
    gameState.players = [];
    
    for (let i = 1; i <= gameState.numPlayers; i++) {
        const name = document.getElementById(`player${i}Name`).value || `플레이어 ${i}`;
        gameState.players.push({
            name: name,
            estimations: {},
            estimationScore: 0,
            currentVolume: 0,
            turns: [],
            finalDifference: 0
        });
    }
    
    gameState.phase = 'estimation';
    gameState.currentEstimatorIndex = 0;
    
    showScreen('estimationScreen');
    displayCupsForEstimation();
}

// 어림하기 화면에 컵 표시
function displayCupsForEstimation() {
    const currentPlayer = gameState.players[gameState.currentEstimatorIndex];
    document.getElementById('currentEstimator').textContent = currentPlayer.name;
    
    const container = document.getElementById('cupsContainer');
    container.innerHTML = '';
    
    gameState.cups.forEach(cup => {
        const cupDiv = document.createElement('div');
        cupDiv.className = 'cup-container bg-white p-6 rounded-2xl border-4 border-purple-200 hover:border-purple-400';
        cupDiv.innerHTML = `
            <div class="relative mb-4">
                <img src="${cup.image}" alt="${cup.name}" class="cup-image mx-auto" style="height: 180px; object-fit: contain;">
            </div>
            <h3 class="text-xl font-bold text-center text-gray-800 mb-3">${cup.name}</h3>
            <input type="number" 
                   id="estimate-${cup.id}" 
                   class="input-field w-full" 
                   placeholder="예상 들이 (mL)"
                   min="0"
                   step="10">
        `;
        container.appendChild(cupDiv);
    });
}

// 어림 제출
function submitEstimations() {
    gameSounds.playButtonClick();
    const currentPlayer = gameState.players[gameState.currentEstimatorIndex];
    let allFilled = true;
    let totalError = 0;
    
    for (const cup of gameState.cups) {
        const inputElement = document.getElementById(`estimate-${cup.id}`);
        const estimate = parseInt(inputElement?.value || '0');
        
        if (!estimate || estimate <= 0) {
            allFilled = false;
            break;
        }
        
        currentPlayer.estimations[cup.id] = estimate;
        const error = Math.abs(estimate - cup.actualVolume);
        totalError += error;
    }
    
    if (!allFilled) {
        gameSounds.playError();
        alert('모든 컵의 들이를 입력해주세요!');
        return;
    }
    
    // 평균 오차 계산 (점수가 낮을수록 좋음)
    currentPlayer.estimationScore = totalError / gameState.cups.length;
    
    // 다음 플레이어로
    gameState.currentEstimatorIndex++;
    
    if (gameState.currentEstimatorIndex < gameState.players.length) {
        // 다음 플레이어의 어림 차례
        displayCupsForEstimation();
    } else {
        // 모든 플레이어의 어림이 끝남
        showEstimationResults();
    }
}

// 어림 결과 표시
function showEstimationResults() {
    gameSounds.playCheckAnswer();
    // 정확도순으로 정렬
    gameState.players.sort((a, b) => a.estimationScore - b.estimationScore);
    
    const resultsDiv = document.getElementById('estimationResults');
    resultsDiv.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const rankDiv = document.createElement('div');
        rankDiv.className = `bg-gradient-to-r ${index === 0 ? 'from-yellow-200 to-yellow-300' : 'from-purple-100 to-purple-200'} p-6 rounded-2xl mb-4`;
        
        let detailsHTML = '<div class="mt-4 grid grid-cols-2 gap-2 text-sm">';
        gameState.cups.forEach(cup => {
            const estimate = player.estimations[cup.id];
            const error = Math.abs(estimate - cup.actualVolume);
            detailsHTML += `
                <div class="bg-white p-2 rounded">
                    <div class="font-bold">${cup.name}</div>
                    <div>예상: ${estimate}mL</div>
                    <div>실제: ${cup.actualVolume}mL</div>
                    <div class="text-red-600">오차: ${error}mL</div>
                </div>
            `;
        });
        detailsHTML += '</div>';
        
        rankDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                    <span class="text-4xl font-black ${index === 0 ? 'text-yellow-600' : 'text-purple-600'}">${index + 1}위</span>
                    <span class="text-2xl font-bold text-gray-800">${player.name}</span>
                </div>
                <div class="text-right">
                    <div class="text-lg text-gray-600">평균 오차</div>
                    <div class="text-2xl font-bold text-purple-600">${player.estimationScore.toFixed(1)} mL</div>
                </div>
            </div>
            ${detailsHTML}
        `;
        resultsDiv.appendChild(rankDiv);
    });
    
    gameState.currentPlayerIndex = 0;
    showScreen('estimationResultScreen');
}

// 2단계 시작
function startPhase2() {
    gameState.phase = 'game';
    showScreen('gameScreen');
    updatePlayersStatus();
    updateCurrentPlayer();
}

// 화면 전환
function showScreen(screenId) {
    const screens = ['startScreen', 'estimationScreen', 'estimationResultScreen', 'gameScreen', 'resultScreen', 'leaderboardScreen'];
    screens.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// 플레이어 상태 업데이트
function updatePlayersStatus() {
    const statusDiv = document.getElementById('playersStatus');
    statusDiv.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const isCurrentTurn = index === gameState.currentPlayerIndex;
        const playerDiv = document.createElement('div');
        playerDiv.className = `bg-gradient-to-b from-purple-100 to-purple-200 p-4 rounded-2xl ${isCurrentTurn ? 'player-turn' : ''}`;
        
        const percentage = (player.currentVolume / gameState.targetVolume) * 100;
        
        playerDiv.innerHTML = `
            <div class="text-lg font-bold text-gray-800 mb-2">${player.name}</div>
            <div class="bg-gray-200 h-32 rounded-xl overflow-hidden relative">
                <div class="water-level absolute bottom-0 w-full" style="height: ${Math.min(percentage, 100)}%"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-700 z-10">${player.currentVolume} mL</span>
                </div>
            </div>
            <div class="mt-2 text-center text-sm text-gray-600">
                목표까지: ${gameState.targetVolume - player.currentVolume} mL
            </div>
        `;
        statusDiv.appendChild(playerDiv);
    });
}

// 현재 플레이어 표시 업데이트
function updateCurrentPlayer() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
}

// 주사위 굴리기
function rollDice() {
    if (gameState.diceRolled) {
        return;
    }
    
    const diceElement = document.getElementById('dice');
    diceElement.classList.add('rolling');
    gameSounds.playDiceRoll();
    
    setTimeout(() => {
        gameState.diceValue = Math.floor(Math.random() * 6) + 1;
        gameState.requiredSelections = gameState.diceValue;
        gameState.selectedCupsForTurn = [];
        
        diceElement.innerHTML = gameState.diceValue;
        diceElement.classList.remove('rolling');
        
        document.getElementById('diceResult').textContent = `컵을 선택하세요. 단 ${gameState.diceValue}번만 물을 옮길 수 있습니다.`;
        gameState.diceRolled = true;
        
        gameSounds.playDiceResult();
        showCupSelection();
    }, 600);
}

// 컵 선택 화면 표시
function showCupSelection() {
    document.getElementById('cupSelectionArea').classList.remove('hidden');
    updateCupSelectionUI();
}

// 컵 선택 UI 업데이트
function updateCupSelectionUI() {
    const remaining = gameState.requiredSelections - gameState.selectedCupsForTurn.length;
    
    // 메시지 업데이트
    const messageElement = document.getElementById('cupSelectionMessage');
    if (remaining > 0) {
        messageElement.innerHTML = `
            <span class="text-2xl">🎯</span> 
            <span class="text-gray-800">컵을 선택하세요!</span>
            <span class="text-purple-600 font-black">(${gameState.selectedCupsForTurn.length}/${gameState.requiredSelections})</span>
        `;
    } else {
        messageElement.innerHTML = `
            <span class="text-2xl">✅</span> 
            <span class="text-green-600 font-bold">모든 선택이 완료되었습니다! 아래 버튼을 눌러주세요.</span>
        `;
    }
    
    // 선택된 컵 목록 표시
    const selectedListDiv = document.getElementById('selectedCupsList');
    if (gameState.selectedCupsForTurn.length > 0) {
        selectedListDiv.classList.remove('hidden');
        let listHTML = '<div class="flex flex-wrap gap-3 justify-center">';
        gameState.selectedCupsForTurn.forEach((cupId, index) => {
            const cup = gameState.cups.find(c => c.id === cupId);
            listHTML += `
                <div class="bg-white border-3 border-purple-400 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                    <span class="text-xl font-black text-purple-600">${index + 1}</span>
                    <img src="${cup.image}" alt="${cup.name}" style="height: 50px; object-fit: contain;">
                    <div class="text-left">
                        <div class="font-bold text-sm text-gray-800">${cup.name}</div>
                        <div class="text-xs text-purple-600">${cup.actualVolume}mL</div>
                    </div>
                    <button onclick="removeCupSelection(${index})" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        ×
                    </button>
                </div>
            `;
        });
        listHTML += '</div>';
        selectedListDiv.innerHTML = listHTML;
    } else {
        selectedListDiv.classList.add('hidden');
    }
    
    // 컵 선택 가능 여부에 따라 UI 업데이트
    const container = document.getElementById('cupSelection');
    container.innerHTML = '';
    
    gameState.cups.forEach(cup => {
        const cupDiv = document.createElement('div');
        const canSelect = gameState.selectedCupsForTurn.length < gameState.requiredSelections;
        cupDiv.className = `cup-container bg-white p-6 rounded-2xl border-4 ${canSelect ? 'cursor-pointer border-blue-300 hover:border-blue-500' : 'opacity-50 border-gray-300 cursor-not-allowed'}`;
        cupDiv.id = `select-cup-${cup.id}`;
        
        if (canSelect) {
            cupDiv.onclick = () => selectCup(cup.id);
        }
        
        cupDiv.innerHTML = `
            <div class="relative mb-4">
                <img src="${cup.image}" alt="${cup.name}" class="cup-image mx-auto" style="height: 180px; object-fit: contain;">
            </div>
            <h3 class="text-xl font-bold text-center text-gray-800 mb-2">${cup.name}</h3>
            <p class="text-center text-lg font-bold text-blue-600">${cup.actualVolume} mL</p>
        `;
        container.appendChild(cupDiv);
    });
    
    // 확인 버튼 활성화/비활성화
    const confirmBtn = document.getElementById('confirmCupBtn');
    if (gameState.selectedCupsForTurn.length === gameState.requiredSelections) {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// 컵 선택
function selectCup(cupId) {
    // 선택 가능 횟수 확인
    if (gameState.selectedCupsForTurn.length >= gameState.requiredSelections) {
        return;
    }
    
    // 선택된 컵 목록에 추가
    gameState.selectedCupsForTurn.push(cupId);
    
    gameSounds.playCupSelect();
    
    // UI 업데이트
    updateCupSelectionUI();
}

// 선택한 컵 제거
function removeCupSelection(index) {
    gameSounds.playCupRemove();
    gameState.selectedCupsForTurn.splice(index, 1);
    updateCupSelectionUI();
}

// 컵 선택 확인
function confirmCupSelection() {
    if (gameState.selectedCupsForTurn.length !== gameState.requiredSelections) {
        gameSounds.playError();
        alert(`${gameState.requiredSelections}개의 컵을 선택해주세요!`);
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // 선택한 모든 컵의 물을 더함
    let totalAddedVolume = 0;
    const cupDetails = [];
    
    gameState.selectedCupsForTurn.forEach(cupId => {
        const cup = gameState.cups.find(c => c.id === cupId);
        totalAddedVolume += cup.actualVolume;
        cupDetails.push(`${cup.name}(${cup.actualVolume}mL)`);
    });
    
    currentPlayer.currentVolume += totalAddedVolume;
    
    gameSounds.playWaterPour();
    
    currentPlayer.turns.push({
        dice: gameState.diceValue,
        cups: cupDetails,
        addedVolume: totalAddedVolume,
        totalVolume: currentPlayer.currentVolume
    });
    
    // 최종 오차 계산
    currentPlayer.finalDifference = Math.abs(currentPlayer.currentVolume - gameState.targetVolume);
    
    // 다음 턴으로
    gameState.currentPlayerIndex++;
    gameState.diceRolled = false;
    gameState.selectedCupsForTurn = [];
    gameState.requiredSelections = 0;
    
    // 주사위와 컵 선택 초기화
    document.getElementById('dice').innerHTML = '<i class="fas fa-dice"></i>';
    document.getElementById('diceResult').textContent = '';
    document.getElementById('cupSelectionArea').classList.add('hidden');
    
    updatePlayersStatus();
    
    if (gameState.currentPlayerIndex < gameState.players.length) {
        // 다음 플레이어 턴
        gameSounds.playTurnChange();
        updateCurrentPlayer();
    } else {
        // 게임 종료
        showGameResult();
    }
}

// 게임 결과 표시
function showGameResult() {
    // 최종 오차가 적은 순서대로 정렬
    gameState.players.sort((a, b) => a.finalDifference - b.finalDifference);
    
    // 공동 우승자 찾기
    const topScore = gameState.players[0].finalDifference;
    const winners = gameState.players.filter(p => p.finalDifference === topScore);
    
    // 우승자 표시
    const winnerNameElement = document.getElementById('winnerName');
    const winnerScoreElement = document.getElementById('winnerScore');
    const resultTitleElement = document.getElementById('resultTitle');
    
    if (winners.length > 1) {
        // 비긴 경우
        gameSounds.playDrawSound();
        const winnerNames = winners.map(w => w.name).join(', ');
        winnerNameElement.textContent = `${winnerNames}`;
        winnerScoreElement.textContent = `비겼습니다! 🤝 (오차: ${topScore} mL)`;
        resultTitleElement.textContent = '무승부!';
        
        // 트로피를 악수 이모지로 변경
        const trophyElement = document.querySelector('#resultScreen .trophy');
        if (trophyElement) {
            trophyElement.textContent = '🤝';
        }
    } else {
        // 단독 우승
        gameSounds.playVictoryFanfare();
        winnerNameElement.textContent = winners[0].name;
        winnerScoreElement.textContent = `목표와의 오차: ${topScore} mL`;
        resultTitleElement.textContent = '우승자';
        
        // 트로피 유지
        const trophyElement = document.querySelector('#resultScreen .trophy');
        if (trophyElement) {
            trophyElement.textContent = '🏆';
        }
    }
    
    // 최종 순위 표시
    const rankingsDiv = document.getElementById('finalRankings');
    rankingsDiv.innerHTML = '';
    
    // 순위 계산 (동점자 처리)
    let currentRank = 1;
    let previousScore = -1;
    
    gameState.players.forEach((player, index) => {
        // 이전 플레이어와 점수가 다르면 순위 업데이트
        if (player.finalDifference !== previousScore) {
            currentRank = index + 1;
        }
        previousScore = player.finalDifference;
        
        // 1위(공동 1위 포함) 여부 확인
        const isFirstPlace = player.finalDifference === gameState.players[0].finalDifference;
        
        const rankDiv = document.createElement('div');
        rankDiv.className = `bg-gradient-to-r ${isFirstPlace ? 'from-yellow-200 to-yellow-300' : 'from-purple-100 to-purple-200'} p-6 rounded-2xl mb-4`;
        
        let turnsHTML = '<div class="mt-4 space-y-2">';
        player.turns.forEach((turn, turnIndex) => {
            const cupsList = Array.isArray(turn.cups) ? turn.cups.join(' + ') : turn.cup;
            turnsHTML += `
                <div class="bg-white p-3 rounded-lg text-sm">
                    <span class="font-bold">턴 ${turnIndex + 1}:</span>
                    주사위 ${turn.dice} → ${cupsList} → +${turn.addedVolume}mL = ${turn.totalVolume}mL
                </div>
            `;
        });
        turnsHTML += '</div>';
        
        rankDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-4">
                    <span class="text-4xl font-black ${isFirstPlace ? 'text-yellow-600' : 'text-purple-600'}">${currentRank}위</span>
                    <span class="text-2xl font-bold text-gray-800">${player.name}</span>
                    ${isFirstPlace && winners.length > 1 ? '<span class="text-xl">🤝</span>' : ''}
                </div>
                <div class="text-right">
                    <div class="text-lg text-gray-600">최종 들이</div>
                    <div class="text-2xl font-bold text-blue-600">${player.currentVolume} mL</div>
                    <div class="text-lg text-red-600">오차: ${player.finalDifference} mL</div>
                </div>
            </div>
            ${turnsHTML}
        `;
        rankingsDiv.appendChild(rankDiv);
    });
    
    // 게임 기록 저장
    saveGameRecords();
    
    showScreen('resultScreen');
    createConfetti();
}

// 게임 기록 저장
async function saveGameRecords() {
    try {
        for (const player of gameState.players) {
            const record = {
                player_name: player.name,
                estimation_accuracy: player.estimationScore,
                final_difference: player.finalDifference,
                total_score: player.estimationScore + player.finalDifference, // 낮을수록 좋음
                game_date: new Date().toISOString()
            };
            
            await fetch('tables/game_records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
        }
    } catch (error) {
        console.error('게임 기록 저장 실패:', error);
    }
}

// 리더보드 표시
async function showLeaderboard() {
    try {
        const response = await fetch('tables/game_records?sort=total_score&limit=20');
        const data = await response.json();
        
        const contentDiv = document.getElementById('leaderboardContent');
        contentDiv.innerHTML = '';
        
        if (!data.data || data.data.length === 0) {
            contentDiv.innerHTML = '<p class="text-center text-gray-600 text-xl">아직 기록이 없습니다.</p>';
        } else {
            data.data.forEach((record, index) => {
                const recordDiv = document.createElement('div');
                recordDiv.className = `bg-gradient-to-r ${index < 3 ? 'from-yellow-200 to-yellow-300' : 'from-purple-100 to-purple-200'} p-4 rounded-xl mb-3 flex items-center justify-between`;
                
                const date = new Date(record.game_date);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                
                recordDiv.innerHTML = `
                    <div class="flex items-center gap-4">
                        <span class="text-3xl font-black ${index < 3 ? 'text-yellow-600' : 'text-purple-600'}">${index + 1}</span>
                        <div>
                            <div class="text-xl font-bold text-gray-800">${record.player_name}</div>
                            <div class="text-sm text-gray-600">${dateStr}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-600">어림 오차: ${record.estimation_accuracy.toFixed(1)}mL</div>
                        <div class="text-sm text-gray-600">최종 오차: ${record.final_difference}mL</div>
                        <div class="text-lg font-bold text-purple-600">총점: ${record.total_score.toFixed(1)}</div>
                    </div>
                `;
                contentDiv.appendChild(recordDiv);
            });
        }
        
        showScreen('leaderboardScreen');
    } catch (error) {
        console.error('리더보드 로딩 실패:', error);
        alert('리더보드를 불러오는데 실패했습니다.');
    }
}

// 리더보드 숨기기
function hideLeaderboard() {
    if (gameState.phase === 'start') {
        showScreen('startScreen');
    } else {
        showScreen('resultScreen');
    }
}

// 축하 효과
function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// 사운드 토글
function toggleSound() {
    const enabled = gameSounds.toggleSound();
    const icon = document.getElementById('soundIcon');
    const toggle = document.getElementById('soundToggle');
    
    if (enabled) {
        icon.className = 'fas fa-volume-up text-2xl text-purple-600';
        toggle.classList.remove('muted');
        toggle.title = '사운드 끄기';
        gameSounds.playButtonClick();
    } else {
        icon.className = 'fas fa-volume-mute text-2xl text-red-600';
        toggle.classList.add('muted');
        toggle.title = '사운드 켜기';
    }
}

// 초기화
window.addEventListener('DOMContentLoaded', () => {
    console.log('들이의 어림왕 게임이 시작되었습니다!');
    gameSounds.playGameStart();
});

// 홈으로 이동
function goHome() {
    window.location.href = '../../../index.html';
}
