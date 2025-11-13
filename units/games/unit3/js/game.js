// 게임 상태
const gameState = {
    gameMode: null, // 'solo' 또는 '2player'
    players: [
        { name: '플레이어 1', color: '#ff6b6b', score: 0 },
        { name: '플레이어 2', color: '#4ecdc4', score: 0 }
    ],
    currentPlayerIndex: 0,
    gamePhase: 'mode-select', // 'mode-select', 'rps', 'flag', 'board'
    selectedFlagValue: null,
    drawnCircles: [],
    rpsChoices: {
        player1: null,
        player2: null
    },
    // 모눈 1칸 = 1cm = 50px
    gridSize: 50
};

// 보드 데이터 (모눈 좌표 기준) - 그리드 오프셋 25px 고려
const gridOffset = 25; // 눈금자 공간

const boardData = {
    // 깃발 위치 (x, y는 모눈 칸 수 - 정수만 사용하여 교차점에 정확히 위치, value는 반지름 cm)
    flags: [
        // 1번 깃발들 (반지름 1cm)
        { x: 3, y: 3, value: 1 },
        { x: 10, y: 2, value: 1 },
        { x: 4, y: 13, value: 1 },
        { x: 9, y: 13, value: 1 },
        
        // 2번 깃발들 (반지름 2cm)
        { x: 7, y: 2, value: 2 },
        { x: 5, y: 5, value: 2 },
        { x: 9, y: 4, value: 2 },
        { x: 12, y: 5, value: 2 },
        { x: 5, y: 10, value: 2 },
        { x: 10, y: 10, value: 2 },
        { x: 12, y: 8, value: 2 },
        
        // 3번 깃발들 (반지름 3cm)
        { x: 4, y: 6, value: 3 },
        { x: 5, y: 8, value: 3 },
        { x: 7, y: 9, value: 3 },
        { x: 9, y: 7, value: 3 },
        { x: 11, y: 7, value: 3 },
        { x: 6, y: 12, value: 3 },
        { x: 11, y: 12, value: 3 }
    ],
    
    // 황금 열쇠 위치 (x, y는 모눈 칸 수 - 정수와 0.5 사용)
    keys: [
        // 위쪽 영역
        { x: 3.5, y: 2.5 }, { x: 6, y: 2.5 }, { x: 9.5, y: 2.5 },
        { x: 3, y: 4 }, { x: 5.5, y: 3.5 }, { x: 8, y: 3.5 }, { x: 10.5, y: 3 },
        { x: 7, y: 4.5 }, { x: 9, y: 5 }, { x: 11, y: 5 },
        
        // 중간 영역
        { x: 3, y: 6.5 }, { x: 5, y: 6.5 }, { x: 8, y: 6 }, { x: 11, y: 6 },
        { x: 4, y: 8.5 }, { x: 6, y: 7.5 }, { x: 8, y: 7.5 }, { x: 12, y: 7.5 },
        { x: 7, y: 9 }, { x: 9, y: 8 }, { x: 11, y: 9 },
        
        // 아래쪽 영역
        { x: 5, y: 11 }, { x: 7, y: 10.5 }, { x: 10, y: 11 }, { x: 12, y: 10 },
        { x: 3, y: 12 }, { x: 6, y: 12 }, { x: 8, y: 12.5 }, { x: 12, y: 12.5 },
        { x: 4, y: 13.5 }, { x: 7, y: 13 }, { x: 9, y: 13.5 }
    ]
};

// SVG 네임스페이스
const svgNS = "http://www.w3.org/2000/svg";

// 초기화
window.addEventListener('load', () => {
    initGame();
    setupEventListeners();
});

function initGame() {
    drawGridLines();
    drawGridPoints();
    drawKeys();
    drawFlags();
    updatePlayerDisplay();
    updateScores();
    setGamePhase('rps');
}

function drawGridLines() {
    const gridLinesGroup = document.getElementById('gridLines');
    gridLinesGroup.innerHTML = '';
    
    // 그리드 선 그리기 (0부터 14까지, 총 15개 선)
    for (let i = 0; i <= 14; i++) {
        const pos = i * gameState.gridSize + gridOffset;
        
        // 가로선
        const hLine = document.createElementNS(svgNS, 'line');
        hLine.setAttribute('x1', gridOffset);
        hLine.setAttribute('y1', pos);
        hLine.setAttribute('x2', gridOffset + 14 * gameState.gridSize);
        hLine.setAttribute('y2', pos);
        hLine.setAttribute('stroke', i % 5 === 0 ? '#888' : '#bbb');
        hLine.setAttribute('stroke-width', i % 5 === 0 ? 2 : 1);
        gridLinesGroup.appendChild(hLine);
        
        // 세로선
        const vLine = document.createElementNS(svgNS, 'line');
        vLine.setAttribute('x1', pos);
        vLine.setAttribute('y1', gridOffset);
        vLine.setAttribute('x2', pos);
        vLine.setAttribute('y2', gridOffset + 14 * gameState.gridSize);
        vLine.setAttribute('stroke', i % 5 === 0 ? '#888' : '#bbb');
        vLine.setAttribute('stroke-width', i % 5 === 0 ? 2 : 1);
        gridLinesGroup.appendChild(vLine);
    }
}

function drawGridPoints() {
    const gridPointsGroup = document.getElementById('gridPoints');
    gridPointsGroup.innerHTML = '';
    
    // 모눈 교차점에 점 표시 (1cm 간격)
    for (let x = 0; x <= 14; x++) {
        for (let y = 0; y <= 14; y++) {
            const px = x * gameState.gridSize + gridOffset;
            const py = y * gameState.gridSize + gridOffset;
            
            // 교차점 표시
            const point = document.createElementNS(svgNS, 'circle');
            point.setAttribute('cx', px);
            point.setAttribute('cy', py);
            point.setAttribute('r', 1.5);
            point.setAttribute('fill', '#666');
            point.setAttribute('opacity', '0.7');
            gridPointsGroup.appendChild(point);
        }
    }
}

function setupEventListeners() {
    // 모드 선택 버튼
    document.getElementById('soloModeBtn').addEventListener('click', () => {
        soundEffects.playButtonClick();
        selectGameMode('solo');
    });
    
    document.getElementById('twoPlayerModeBtn').addEventListener('click', () => {
        soundEffects.playButtonClick();
        selectGameMode('2player');
    });
    
    // 1인 모드 가위바위보 시작 버튼
    document.getElementById('soloRpsStartBtn').addEventListener('click', () => {
        soundEffects.playButtonClick();
        playSoloRPS();
    });
    
    // 2인 모드 가위바위보 시작 버튼
    document.getElementById('twoPlayerRpsStartBtn').addEventListener('click', () => {
        soundEffects.playButtonClick();
        play2PlayerRPS();
    });
    
    // 리셋 버튼
    document.getElementById('resetBtn').addEventListener('click', () => {
        soundEffects.playButtonClick();
        if (confirm('게임을 초기화하시겠습니까?')) {
            resetGame();
        }
    });
    
    // 게임 규칙 토글
    document.getElementById('gameRulesToggle').addEventListener('click', () => {
        toggleGameRules();
    });
}

// 게임 규칙 토글 함수
function toggleGameRules() {
    const content = document.getElementById('gameRulesContent');
    const icon = document.querySelector('.toggle-icon');
    
    content.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

function drawKeys() {
    const keysGroup = document.getElementById('keysGroup');
    keysGroup.innerHTML = '';
    
    boardData.keys.forEach((key, index) => {
        const x = key.x * gameState.gridSize + gridOffset;
        const y = key.y * gameState.gridSize + gridOffset;
        
        // 열쇠 그룹
        const keyGroup = document.createElementNS(svgNS, 'g');
        keyGroup.classList.add('key');
        keyGroup.dataset.index = index;
        
        // 열쇠 머리 (원)
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y - 5);
        circle.setAttribute('r', 4);
        circle.setAttribute('fill', '#ffd700');
        circle.setAttribute('stroke', '#daa520');
        circle.setAttribute('stroke-width', 1);
        
        // 열쇠 몸통
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y - 1);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y + 8);
        line.setAttribute('stroke', '#daa520');
        line.setAttribute('stroke-width', 2);
        
        // 열쇠 이빨
        const tooth1 = document.createElementNS(svgNS, 'line');
        tooth1.setAttribute('x1', x);
        tooth1.setAttribute('y1', y + 5);
        tooth1.setAttribute('x2', x + 3);
        tooth1.setAttribute('y2', y + 5);
        tooth1.setAttribute('stroke', '#daa520');
        tooth1.setAttribute('stroke-width', 2);
        
        const tooth2 = document.createElementNS(svgNS, 'line');
        tooth2.setAttribute('x1', x);
        tooth2.setAttribute('y1', y + 8);
        tooth2.setAttribute('x2', x + 3);
        tooth2.setAttribute('y2', y + 8);
        tooth2.setAttribute('stroke', '#daa520');
        tooth2.setAttribute('stroke-width', 2);
        
        keyGroup.appendChild(circle);
        keyGroup.appendChild(line);
        keyGroup.appendChild(tooth1);
        keyGroup.appendChild(tooth2);
        
        keysGroup.appendChild(keyGroup);
        
        // 상태 저장
        key.element = keyGroup;
        key.collected = false;
        key.collectedBy = null;
    });
}

function drawFlags() {
    const flagsGroup = document.getElementById('flagsGroup');
    flagsGroup.innerHTML = '';
    
    // 모든 깃발을 처음부터 표시
    boardData.flags.forEach((flag, index) => {
        const flagElement = createFlagElement(flag, index);
        flagsGroup.appendChild(flagElement);
        flag.element = flagElement;
        flag.used = false;
    });
}

function createFlagElement(flag, index) {
    const x = flag.x * gameState.gridSize + gridOffset;
    const y = flag.y * gameState.gridSize + gridOffset;
    
    // 깃발 그룹
    const flagGroup = document.createElementNS(svgNS, 'g');
    flagGroup.classList.add('flag-marker');
    flagGroup.dataset.index = index;
    flagGroup.dataset.value = flag.value;
    
    // 깃발 색상 (번호에 따라 다르게)
    const flagColors = {
        1: '#ff6b6b',
        2: '#51c9e8',
        3: '#9b7ed6'
    };
    
    // 깃발 기둥 (가는 선)
    const pole = document.createElementNS(svgNS, 'line');
    pole.setAttribute('x1', x);
    pole.setAttribute('y1', y);
    pole.setAttribute('x2', x);
    pole.setAttribute('y2', y - 25);
    pole.setAttribute('stroke', '#8b4513');
    pole.setAttribute('stroke-width', 1.5);
    
    // 깃발 천 (사각형)
    const flagRect = document.createElementNS(svgNS, 'rect');
    flagRect.setAttribute('x', x);
    flagRect.setAttribute('y', y - 25);
    flagRect.setAttribute('width', 18);
    flagRect.setAttribute('height', 12);
    flagRect.setAttribute('fill', flagColors[flag.value]);
    flagRect.setAttribute('stroke', '#333');
    flagRect.setAttribute('stroke-width', 1);
    
    // 깃발 번호 텍스트
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', x + 9);
    text.setAttribute('y', y - 16);
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', 'white');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = flag.value;
    
    // 깃발 끝 (교차점) 표시 - 작은 원
    const baseDot = document.createElementNS(svgNS, 'circle');
    baseDot.setAttribute('cx', x);
    baseDot.setAttribute('cy', y);
    baseDot.setAttribute('r', 3);
    baseDot.setAttribute('fill', '#d63384');
    baseDot.setAttribute('stroke', '#fff');
    baseDot.setAttribute('stroke-width', 1.5);
    
    flagGroup.appendChild(pole);
    flagGroup.appendChild(flagRect);
    flagGroup.appendChild(text);
    flagGroup.appendChild(baseDot);
    
    // 클릭 이벤트
    flagGroup.addEventListener('click', () => handleFlagClick(flag, index));
    
    return flagGroup;
}

function selectGameMode(mode) {
    gameState.gameMode = mode;
    
    // 플레이어 이름 가져오기
    const player1Name = document.getElementById('player1NameInput').value.trim() || '플레이어 1';
    const player2Name = document.getElementById('player2NameInput').value.trim() || '플레이어 2';
    
    gameState.players[0].name = player1Name;
    gameState.players[1].name = player2Name;
    
    // 모드 선택 화면 숨기기
    document.getElementById('modeSelectSection').classList.add('hidden');
    
    // 해당 모드 화면 표시 및 점수 표시 업데이트
    if (mode === 'solo') {
        document.getElementById('soloRpsSection').classList.remove('hidden');
        updateSoloScoreDisplay();
    } else {
        document.getElementById('twoPlayerRpsSection').classList.remove('hidden');
        updateTwoPlayerScoreDisplay();
        updatePlayerNamesInRPS();
    }
    
    updatePlayerDisplay();
    setGamePhase('rps');
}

function playSoloRPS() {
    const resultDiv = document.getElementById('soloRpsResult');
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // 가위바위보 소리 재생
    soundEffects.playRockPaperScissors();
    
    // 애니메이션 효과
    resultDiv.innerHTML = `<span style="font-size: 1.3rem; color: #667eea;">가위바위보...</span>`;
    
    setTimeout(() => {
        // 컴퓨터가 랜덤으로 결과 선택
        const results = [
            { name: '가위', value: 2, icon: '✌️' },
            { name: '바위', value: 1, icon: '✊' },
            { name: '보', value: 3, icon: '🖐️' }
        ];
        
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        // 결과 소리 재생
        soundEffects.playResultSound(true);
        
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin: 15px 0;">${randomResult.icon}</div>
                <div style="font-size: 1.3rem; color: #333; margin-bottom: 10px;">
                    <strong>${randomResult.name}</strong> 나왔습니다!
                </div>
                <div style="font-size: 1.5rem; color: #4caf50; font-weight: bold;">
                    ${currentPlayer.name}님, 반지름 <strong style="color: #667eea;">${randomResult.value}cm</strong>의 원을 그리세요!
                </div>
            </div>
        `;
        
        setTimeout(() => {
            showFlagSelection(randomResult.value);
        }, 1500);
    }, 800);
}

function play2PlayerRPS() {
    const resultDiv = document.getElementById('twoPlayerRpsResult');
    
    // 가위바위보 소리 재생
    soundEffects.playRockPaperScissors();
    
    // 애니메이션 효과
    resultDiv.innerHTML = `<span style="font-size: 1.3rem; color: #667eea;">가위바위보...</span>`;
    
    // 결과 표시를 물음표로 초기화
    document.querySelector('#player1Result .rps-choice-display').textContent = '?';
    document.querySelector('#player2Result .rps-choice-display').textContent = '?';
    
    setTimeout(() => {
        // 컴퓨터가 양쪽 플레이어의 가위바위보를 랜덤으로 선택
        const choices = ['rock', 'scissors', 'paper'];
        const choice1 = choices[Math.floor(Math.random() * choices.length)];
        const choice2 = choices[Math.floor(Math.random() * choices.length)];
        
        const choiceIcons = {
            rock: '✊',
            scissors: '✌️',
            paper: '🖐️'
        };
        
        const choiceNames = {
            rock: '바위',
            scissors: '가위',
            paper: '보'
        };
        
        const flagValues = {
            rock: 1,
            scissors: 2,
            paper: 3
        };
        
        // 선택 결과 표시
        document.querySelector('#player1Result .rps-choice-display').textContent = choiceIcons[choice1];
        document.querySelector('#player2Result .rps-choice-display').textContent = choiceIcons[choice2];
        
        // 승부 판정
        const result = getRPSWinner(choice1, choice2);
        
        setTimeout(() => {
            if (result === 'draw') {
                // 무승부 소리
                soundEffects.playResultSound(false);
                
                resultDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #ff9800; margin: 15px 0;">
                            비겼습니다! 다시 시작하세요!
                        </div>
                    </div>
                `;
                
            } else {
                const winner = result === 1 ? gameState.players[0] : gameState.players[1];
                const winnerChoice = result === 1 ? choice1 : choice2;
                const flagValue = flagValues[winnerChoice];
                
                // 현재 플레이어를 승자로 설정
                gameState.currentPlayerIndex = result === 1 ? 0 : 1;
                
                // 승리 소리
                soundEffects.playResultSound(true);
                
                resultDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: ${winner.color}; font-weight: bold; margin: 15px 0;">
                            ${winner.name} 승리!
                        </div>
                        <div style="font-size: 1.3rem; color: #4caf50; font-weight: bold;">
                            ${choiceNames[winnerChoice]} → 반지름 <strong style="color: #667eea;">${flagValue}cm</strong>의 원을 그리세요!
                        </div>
                    </div>
                `;
                
                setTimeout(() => {
                    showFlagSelection(flagValue);
                }, 2000);
            }
        }, 1000);
        
    }, 800);
}

function getRPSWinner(choice1, choice2) {
    if (choice1 === choice2) return 'draw';
    
    const winConditions = {
        rock: 'scissors',
        scissors: 'paper',
        paper: 'rock'
    };
    
    return winConditions[choice1] === choice2 ? 1 : 2;
}

function resetRPSChoices() {
    gameState.rpsChoices.player1 = null;
    gameState.rpsChoices.player2 = null;
    
    // 2인 모드 결과 초기화
    const player1Display = document.querySelector('#player1Result .rps-choice-display');
    const player2Display = document.querySelector('#player2Result .rps-choice-display');
    
    if (player1Display) player1Display.textContent = '?';
    if (player2Display) player2Display.textContent = '?';
    
    document.getElementById('twoPlayerRpsResult').textContent = '';
}

function showFlagSelection(flagValue) {
    setGamePhase('flag');
    gameState.selectedFlagValue = flagValue;
    
    const instruction = document.getElementById('flagInstruction');
    instruction.innerHTML = `<strong style="color: #667eea; font-size: 1.2rem;">${flagValue}cm</strong> 반지름의 원! 보드에서 진한 <strong style="color: #667eea;">${flagValue}번 깃발</strong>을 클릭하세요!`;
    
    // 모든 깃발의 선택 가능 여부 업데이트
    boardData.flags.forEach((flag, index) => {
        if (flag.element) {
            // 선택 가능한 깃발: 진하게 표시
            if (flag.value === flagValue && !flag.used) {
                flag.element.classList.add('selectable');
                flag.element.classList.remove('used');
            } 
            // 이미 사용된 깃발: 매우 흐리게
            else if (flag.used) {
                flag.element.classList.remove('selectable');
                flag.element.classList.add('used');
            }
            // 다른 번호 깃발: 흐리게
            else {
                flag.element.classList.remove('selectable');
                flag.element.classList.remove('used');
            }
        }
    });
    
    // 보드 클릭 가능하게
    document.getElementById('gameBoard').classList.add('selectable');
}

function handleFlagClick(flag, index) {
    if (gameState.gamePhase !== 'flag') return;
    if (flag.value !== gameState.selectedFlagValue) return;
    if (flag.used) return;
    
    // 깃발 선택 소리
    soundEffects.playFlagSelect();
    
    // 깃발 사용 표시
    flag.used = true;
    
    // 원 그리기
    drawCircleAndCollectKeys(flag, index);
    
    // 클릭한 깃발을 매우 흐리게 표시
    if (flag.element) {
        flag.element.classList.remove('selectable');
        flag.element.classList.add('used');
    }
    
    // 컴퍼스 애니메이션 + 열쇠 수집 시간을 고려하여 대기
    setTimeout(() => {
        nextPlayer();
    }, 3000); // 2초 애니메이션 + 1초 여유
}

function drawCircleAndCollectKeys(flag, flagIndex) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const centerX = flag.x * gameState.gridSize + gridOffset;
    const centerY = flag.y * gameState.gridSize + gridOffset;
    const radius = flag.value * gameState.gridSize; // 1cm = 50px
    
    const circlesGroup = document.getElementById('circlesGroup');
    
    // 원 그리기 시작 소리
    soundEffects.playCircleStart();
    
    // 1단계: 원의 중심점 표시
    const centerMarker = document.createElementNS(svgNS, 'circle');
    centerMarker.setAttribute('cx', centerX);
    centerMarker.setAttribute('cy', centerY);
    centerMarker.setAttribute('r', 4);
    centerMarker.setAttribute('fill', currentPlayer.color);
    centerMarker.setAttribute('stroke', '#000');
    centerMarker.setAttribute('stroke-width', 2);
    circlesGroup.appendChild(centerMarker);
    
    // 2단계: 컴퍼스 바늘 (중심에서 반지름까지 선) 애니메이션
    const compassNeedle = document.createElementNS(svgNS, 'line');
    compassNeedle.setAttribute('x1', centerX);
    compassNeedle.setAttribute('y1', centerY);
    // 12시 방향(위쪽)으로 초기 위치 설정
    compassNeedle.setAttribute('x2', centerX);
    compassNeedle.setAttribute('y2', centerY - radius);
    compassNeedle.setAttribute('stroke', currentPlayer.color);
    compassNeedle.setAttribute('stroke-width', 2);
    compassNeedle.setAttribute('stroke-dasharray', '5,3');
    compassNeedle.classList.add('compass-needle');
    circlesGroup.appendChild(compassNeedle);
    
    // 컴퍼스 끝점 (연필 역할)
    const compassPoint = document.createElementNS(svgNS, 'circle');
    // 12시 방향(위쪽)으로 초기 위치 설정
    compassPoint.setAttribute('cx', centerX);
    compassPoint.setAttribute('cy', centerY - radius);
    compassPoint.setAttribute('r', 5);
    compassPoint.setAttribute('fill', currentPlayer.color);
    compassPoint.setAttribute('stroke', '#000');
    compassPoint.setAttribute('stroke-width', 2);
    compassPoint.classList.add('compass-point');
    circlesGroup.appendChild(compassPoint);
    
    // 3단계: 원을 그리는 애니메이션 (컴퍼스가 회전하며 그리기)
    setTimeout(() => {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', centerX);
        circle.setAttribute('cy', centerY);
        circle.setAttribute('r', radius);
        circle.setAttribute('stroke', currentPlayer.color);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke-width', 3);
        circle.setAttribute('opacity', '0.7');
        
        // 원 둘레 계산
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        circle.classList.add('drawing-circle');
        
        // 12시 방향에서 시작하도록 -90도 회전
        circle.style.transform = `rotate(-90deg)`;
        circle.style.transformOrigin = `${centerX}px ${centerY}px`;
        
        circlesGroup.appendChild(circle);
        
        // 원 그리기 애니메이션 시작
        requestAnimationFrame(() => {
            circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
            circle.style.strokeDashoffset = '0';
        });
        
        // 컴퍼스 바늘 회전 애니메이션 + 소리
        animateCompass(compassNeedle, compassPoint, centerX, centerY, radius, 2000);
        
        // 4단계: 애니메이션 완료 후 컴퍼스 제거 및 열쇠 수집
        setTimeout(() => {
            // 원 완성 소리
            soundEffects.playCircleComplete();
            
            compassNeedle.remove();
            compassPoint.remove();
            collectKeysInCircle(centerX, centerY, radius, currentPlayer);
        }, 2000);
        
    }, 500); // 중심점 표시 후 0.5초 대기
}

// 컴퍼스 바늘 회전 애니메이션
function animateCompass(needle, point, centerX, centerY, radius, duration) {
    const startTime = Date.now();
    let lastSoundTime = 0;
    
    function rotate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // -90도(12시 방향)에서 시작하여 시계방향으로 360도 회전
        // -π/2 (시작) → 3π/2 (끝)
        const startAngle = -Math.PI / 2;
        const angle = startAngle + (progress * Math.PI * 2);
        
        // 바늘 끝점 위치 계산
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // 바늘 업데이트
        needle.setAttribute('x2', x);
        needle.setAttribute('y2', y);
        
        // 컴퍼스 끝점 업데이트
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        
        // 원 그리기 소리 (일정 간격마다)
        if (elapsed - lastSoundTime > 200) {
            soundEffects.playCircleDrawing(progress);
            lastSoundTime = elapsed;
        }
        
        if (progress < 1) {
            requestAnimationFrame(rotate);
        }
    }
    
    rotate();
}

// 열쇠 수집 함수
function collectKeysInCircle(centerX, centerY, radius, currentPlayer) {
    let collectedCount = 0;
    const collectedKeysGroup = document.getElementById('collectedKeysGroup');
    
    boardData.keys.forEach((key, index) => {
        if (!key.collected) {
            const keyX = key.x * gameState.gridSize + gridOffset;
            const keyY = key.y * gameState.gridSize + gridOffset;
            const distance = Math.sqrt(
                Math.pow(keyX - centerX, 2) + 
                Math.pow(keyY - centerY, 2)
            );
            
            // 원 안에 있는지 확인
            if (distance <= radius) {
                key.collected = true;
                key.collectedBy = gameState.currentPlayerIndex;
                collectedCount++;
                
                // 열쇠 수집 소리 (약간의 딜레이를 두고 재생)
                setTimeout(() => {
                    soundEffects.playKeyCollect();
                }, collectedCount * 100); // 연속으로 수집될 때 간격을 둠
                
                // 열쇠에 플레이어 색상 오버레이
                const overlay = document.createElementNS(svgNS, 'circle');
                overlay.setAttribute('cx', keyX);
                overlay.setAttribute('cy', keyY - 5);
                overlay.setAttribute('r', 8);
                overlay.setAttribute('fill', currentPlayer.color);
                overlay.setAttribute('opacity', 0.7);
                overlay.setAttribute('stroke', currentPlayer.color);
                overlay.setAttribute('stroke-width', 2);
                overlay.classList.add('collected-key');
                collectedKeysGroup.appendChild(overlay);
                
                // 원래 열쇠 숨기기
                key.element.style.opacity = '0.3';
            }
        }
    });
    
    currentPlayer.score += collectedCount;
    updateScores();
    
    // 수집 정보 저장
    gameState.drawnCircles.push({
        player: gameState.currentPlayerIndex,
        centerX: centerX,
        centerY: centerY,
        radius: radius,
        count: collectedCount
    });
}

function nextPlayer() {
    // 1인 모드에서만 플레이어 전환
    if (gameState.gameMode === 'solo') {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }
    // 2인 모드에서는 승자가 이미 설정되어 있으므로 다음 턴만 전환
    else if (gameState.gameMode === '2player') {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        resetRPSChoices();
    }
    
    gameState.selectedFlagValue = null;
    
    // 모든 깃발을 다시 흐리게 (선택 가능 상태 해제)
    boardData.flags.forEach(flag => {
        if (flag.element) {
            flag.element.classList.remove('selectable');
            if (flag.used) {
                flag.element.classList.add('used');
            }
        }
    });
    
    // 보드 클릭 비활성화
    document.getElementById('gameBoard').classList.remove('selectable');
    
    updatePlayerDisplay();
    setGamePhase('rps');
    
    // 결과 메시지 초기화
    if (gameState.gameMode === 'solo') {
        document.getElementById('soloRpsResult').textContent = '';
    } else {
        document.getElementById('twoPlayerRpsResult').textContent = '';
    }
    
    // 게임 종료 확인
    checkGameEnd();
}

function checkGameEnd() {
    const allKeysCollected = boardData.keys.every(key => key.collected);
    const allFlagsUsed = boardData.flags.every(flag => flag.used);
    
    if (allKeysCollected || allFlagsUsed) {
        const winner = gameState.players.reduce((prev, current) => 
            current.score > prev.score ? current : prev
        );
        
        setTimeout(() => {
            alert(`🎉 게임 종료!\n\n승자: ${winner.name}\n획득한 열쇠: ${winner.score}개\n\n${getGameSummary()}`);
        }, 500);
    }
}

function getGameSummary() {
    let summary = '\n=== 최종 점수 ===\n';
    gameState.players.forEach(player => {
        summary += `${player.name}: ${player.score}개\n`;
    });
    return summary;
}

function updatePlayerDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const indicator = document.getElementById('currentPlayerIndicator');
    const name = document.getElementById('currentPlayerName');
    
    indicator.style.backgroundColor = currentPlayer.color;
    name.textContent = currentPlayer.name;
}

function updateScores() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';
    
    gameState.players.forEach(player => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <div class="score-player">
                <div class="score-color" style="background-color: ${player.color}"></div>
                <span>${player.name}</span>
            </div>
            <div class="score-value">${player.score}개</div>
        `;
        scoreList.appendChild(scoreItem);
    });
    
    // 가위바위보 화면의 점수도 업데이트
    if (gameState.gameMode === 'solo') {
        updateSoloScoreDisplay();
    } else if (gameState.gameMode === '2player') {
        updateTwoPlayerScoreDisplay();
    }
}

// 1인 모드 점수 표시 업데이트
function updateSoloScoreDisplay() {
    const player = gameState.players[0];
    document.getElementById('soloScoreLabel').textContent = player.name;
    document.getElementById('soloScoreValue').textContent = player.score;
}

// 2인 모드 점수 표시 업데이트
function updateTwoPlayerScoreDisplay() {
    document.getElementById('player1ScoreLabel').textContent = gameState.players[0].name;
    document.getElementById('player1ScoreValue').textContent = gameState.players[0].score;
    document.getElementById('player2ScoreLabel').textContent = gameState.players[1].name;
    document.getElementById('player2ScoreValue').textContent = gameState.players[1].score;
}

// 2인 모드 가위바위보 화면의 플레이어 이름 업데이트
function updatePlayerNamesInRPS() {
    document.querySelector('#player1Result h4').textContent = gameState.players[0].name;
    document.querySelector('#player2Result h4').textContent = gameState.players[1].name;
}

function setGamePhase(phase) {
    gameState.gamePhase = phase;
    
    const flagSection = document.getElementById('flagSection');
    const board = document.getElementById('gameBoard');
    
    if (phase === 'rps') {
        flagSection.classList.add('hidden');
        board.classList.remove('selectable');
        board.classList.add('disabled');
    } else if (phase === 'flag') {
        flagSection.classList.remove('hidden');
        board.classList.remove('disabled');
        board.classList.add('selectable');
    }
}

function resetGame() {
    // 점수 초기화
    gameState.players.forEach(player => player.score = 0);
    gameState.currentPlayerIndex = 0;
    gameState.drawnCircles = [];
    gameState.selectedFlagValue = null;
    gameState.gameMode = null;
    gameState.rpsChoices.player1 = null;
    gameState.rpsChoices.player2 = null;
    
    // 플레이어 이름 초기화
    gameState.players[0].name = '플레이어 1';
    gameState.players[1].name = '플레이어 2';
    document.getElementById('player1NameInput').value = '플레이어 1';
    document.getElementById('player2NameInput').value = '플레이어 2';
    
    // 열쇠 상태 초기화
    boardData.keys.forEach(key => {
        key.collected = false;
        key.collectedBy = null;
        if (key.element) {
            key.element.style.opacity = '1';
        }
    });
    
    // 깃발 상태 초기화
    boardData.flags.forEach(flag => {
        flag.used = false;
        if (flag.element) {
            flag.element.classList.remove('selectable');
            flag.element.classList.remove('used');
        }
    });
    
    // SVG 그룹 초기화
    document.getElementById('circlesGroup').innerHTML = '';
    document.getElementById('collectedKeysGroup').innerHTML = '';
    
    // 깃발 다시 그리기
    drawFlags();
    
    // 모든 화면 숨기기
    document.getElementById('soloRpsSection').classList.add('hidden');
    document.getElementById('twoPlayerRpsSection').classList.add('hidden');
    document.getElementById('flagSection').classList.add('hidden');
    
    // 모드 선택 화면 표시
    document.getElementById('modeSelectSection').classList.remove('hidden');
    
    // 결과 텍스트 초기화
    document.getElementById('soloRpsResult').textContent = '';
    document.getElementById('twoPlayerRpsResult').textContent = '';
    resetRPSChoices();
    
    // 플레이어 이름 초기화
    document.querySelector('#player1Result h4').textContent = '플레이어 1';
    document.querySelector('#player2Result h4').textContent = '플레이어 2';
    
    // 화면 업데이트
    updatePlayerDisplay();
    updateScores();
    gameState.gamePhase = 'mode-select';
}
