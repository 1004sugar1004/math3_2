// ==================== 게임 설정 ====================
const gameConfig = {
    numTeams: 4,
    playersPerTeam: 3,
    bagsPerPlayer: 10,
    maxRounds: 2,
    difficulty: 'normal' // easy, normal, hard, expert
};

// 난이도별 성공 확률
const difficultySettings = {
    easy: { successRate: 0.80, label: '쉬움 (80%)' },
    normal: { successRate: 0.60, label: '보통 (60%)' },
    hard: { successRate: 0.40, label: '어려움 (40%)' },
    expert: { successRate: 0.20, label: '전문가 (20%)' }
};

// 사용 가능한 색상 팔레트
const colorPalette = [
    { color: '#4A90E2', class: 'team-hope' },
    { color: '#7ED321', class: 'team-future' },
    { color: '#E74C3C', class: 'team-strong' },
    { color: '#FF6B9D', class: 'team-love' },
    { color: '#F5A623', class: 'team-orange' },
    { color: '#9013FE', class: 'team-purple' },
    { color: '#50E3C2', class: 'team-cyan' },
    { color: '#BD10E0', class: 'team-magenta' }
];

// 기본 모둠 이름
const defaultTeamNames = ['희망', '미래', '최강', '사랑', '도전', '열정', '승리', '꿈나무'];

// ==================== 게임 상태 관리 ====================
const gameState = {
    teams: [],
    currentTeamIndex: 0,
    currentPlayer: 1,
    currentRound: 1,
    bagsPerPlayer: 10,
    bagsRemaining: 10,
    maxRounds: 2,
    // 파워 게이지 시스템
    powerGaugeActive: false,
    powerValue: 0,
    powerDirection: 1, // 1: 증가, -1: 감소
    powerInterval: null,
    throwPower: 0
};

// ==================== 효과음 생성 (Web Audio API) ====================
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playThrowSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playSuccessSound() {
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + index * 0.1;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    });
}

function playFailSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ==================== DOM 요소 ====================
const elements = {
    // 화면
    startScreen: document.getElementById('startScreen'),
    setupScreen: document.getElementById('setupScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    
    // 시작 화면
    setupButton: document.getElementById('setupButton'),
    
    // 설정 화면
    numTeams: document.getElementById('numTeams'),
    playersPerTeam: document.getElementById('playersPerTeam'),
    bagsPerPlayer: document.getElementById('bagsPerPlayer'),
    difficulty: document.getElementById('difficulty'),
    teamNamesContainer: document.getElementById('teamNamesContainer'),
    backToStartButton: document.getElementById('backToStartButton'),
    startGameButton: document.getElementById('startGameButton'),
    
    // 게임 화면
    currentTeamName: document.getElementById('currentTeamName'),
    currentPlayerInfo: document.getElementById('currentPlayerInfo'),
    currentRound: document.getElementById('currentRound'),
    bagsRemaining: document.getElementById('bagsRemaining'),
    beanbag: document.getElementById('beanbag'),
    hulahoop: document.getElementById('hulahoop'),
    powerGauge: document.getElementById('powerGauge'),
    powerFill: document.getElementById('powerFill'),
    throwHint: document.getElementById('throwHint'),
    scoreGrid: document.getElementById('scoreGrid'),
    
    // 결과 화면
    resultTableBody: document.getElementById('resultTableBody'),
    iconPalette: document.getElementById('iconPalette'),
    graphTable: document.getElementById('graphTable'),
    graphTableBody: document.getElementById('graphTableBody'),
    scaleLabels: document.getElementById('scaleLabels'),
    clearGraphButton: document.getElementById('clearGraphButton'),
    checkGraphButton: document.getElementById('checkGraphButton'),
    graphResult: document.getElementById('graphResult'),
    resultTitle: document.getElementById('resultTitle'),
    resultMessage: document.getElementById('resultMessage'),
    comparisonGrid: document.getElementById('comparisonGrid'),
    firstPlace: document.getElementById('firstPlace'),
    avgScore: document.getElementById('avgScore'),
    maxScore: document.getElementById('maxScore'),
    minScore: document.getElementById('minScore'),
    restartButton: document.getElementById('restartButton'),
    
    // 피드백 메시지
    feedbackMessage: document.getElementById('feedbackMessage'),
    feedbackText: document.getElementById('feedbackText')
};

// ==================== 초기화 ====================
function init() {
    // 이벤트 리스너 등록
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', goHome);
    }
    elements.setupButton.addEventListener('click', showSetupScreen);
    elements.backToStartButton.addEventListener('click', () => switchScreen('startScreen'));
    elements.startGameButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', resetGame);
    elements.clearGraphButton.addEventListener('click', clearGraph);
    elements.checkGraphButton.addEventListener('click', checkGraph);
    
    // 설정 화면 이벤트
    elements.numTeams.addEventListener('change', updateTeamNameInputs);
    
    // 콩 주머니 클릭 이벤트 (타이밍 게임)
    elements.beanbag.addEventListener('click', onBeanbagClick);
    elements.beanbag.addEventListener('touchend', onBeanbagClick);
}

// ==================== 설정 화면 표시 ====================
function showSetupScreen() {
    switchScreen('setupScreen');
    updateTeamNameInputs();
}

function updateTeamNameInputs() {
    const numTeams = parseInt(elements.numTeams.value);
    elements.teamNamesContainer.innerHTML = '';
    
    for (let i = 0; i < numTeams; i++) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-name-input';
        
        const color = colorPalette[i % colorPalette.length].color;
        const defaultName = defaultTeamNames[i % defaultTeamNames.length];
        
        teamDiv.innerHTML = `
            <label>
                <div class="team-color-indicator" style="background: ${color};"></div>
                모둠 ${i + 1}
            </label>
            <input type="text" 
                   id="teamName${i}" 
                   value="${defaultName}" 
                   placeholder="모둠 이름 입력"
                   maxlength="10">
        `;
        
        elements.teamNamesContainer.appendChild(teamDiv);
    }
}

// ==================== 게임 시작 ====================
function startGame() {
    // 설정 값 읽기
    gameConfig.numTeams = parseInt(elements.numTeams.value);
    gameConfig.playersPerTeam = parseInt(elements.playersPerTeam.value);
    gameConfig.bagsPerPlayer = Math.min(30, Math.max(1, parseInt(elements.bagsPerPlayer.value))); // 1~30으로 제한
    gameConfig.maxRounds = 1; // 항상 1라운드로 고정
    gameConfig.difficulty = elements.difficulty.value;
    
    // 던지기 횟수 검증
    if (gameConfig.bagsPerPlayer < 1 || gameConfig.bagsPerPlayer > 30) {
        alert('던지기 횟수는 1~30개 사이여야 합니다.');
        return;
    }
    
    // 모둠 생성
    gameState.teams = [];
    for (let i = 0; i < gameConfig.numTeams; i++) {
        const nameInput = document.getElementById(`teamName${i}`);
        const teamName = nameInput ? nameInput.value.trim() : defaultTeamNames[i];
        
        gameState.teams.push({
            name: teamName || `모둠${i + 1}`,
            players: gameConfig.playersPerTeam,
            score: 0,
            color: colorPalette[i % colorPalette.length].color,
            class: colorPalette[i % colorPalette.length].class
        });
    }
    
    // 게임 상태 초기화
    resetGameState();
    
    // 게임 화면으로 전환
    switchScreen('gameScreen');
    updateUI();
    createScoreboard();
}



function resetGameState() {
    gameState.currentTeamIndex = 0;
    gameState.currentPlayer = 1;
    gameState.currentRound = 1;
    gameState.bagsPerPlayer = gameConfig.bagsPerPlayer;
    gameState.bagsRemaining = gameConfig.bagsPerPlayer;
    gameState.maxRounds = gameConfig.maxRounds;
    gameState.teams.forEach(team => team.score = 0);
}

function resetGame() {
    switchScreen('startScreen');
}

// ==================== 화면 전환 ====================
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ==================== UI 업데이트 ====================
function updateUI() {
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    elements.currentTeamName.textContent = `${currentTeam.name} 모둠`;
    elements.currentTeamName.style.color = currentTeam.color;
    
    elements.currentPlayerInfo.textContent = `플레이어 ${gameState.currentPlayer}/${currentTeam.players}`;
    elements.currentRound.textContent = `${gameState.currentRound}/${gameState.maxRounds}`;
    elements.bagsRemaining.textContent = gameState.bagsRemaining;
    
    // 콩 주머니 색상 변경
    elements.beanbag.style.background = `linear-gradient(135deg, ${currentTeam.color} 0%, ${adjustBrightness(currentTeam.color, -20)} 100%)`;
}

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// ==================== 점수판 생성 ====================
function createScoreboard() {
    elements.scoreGrid.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = `score-item ${team.class}`;
        if (index === gameState.currentTeamIndex) {
            scoreItem.classList.add('active');
        }
        
        scoreItem.innerHTML = `
            <h4>${team.name} 모둠</h4>
            <p>${team.score}개</p>
        `;
        
        elements.scoreGrid.appendChild(scoreItem);
    });
}

function updateScoreboard() {
    const scoreItems = elements.scoreGrid.querySelectorAll('.score-item');
    
    gameState.teams.forEach((team, index) => {
        const scoreItem = scoreItems[index];
        scoreItem.querySelector('p').textContent = `${team.score}개`;
        
        // 현재 모둠 강조
        if (index === gameState.currentTeamIndex) {
            scoreItem.classList.add('active');
        } else {
            scoreItem.classList.remove('active');
        }
    });
}

// ==================== 파워 게이지 시스템 ====================
function startPowerGauge() {
    // 이미 실행 중이면 무시
    if (gameState.powerGaugeActive) return;
    
    gameState.powerGaugeActive = true;
    gameState.powerValue = 0;
    gameState.powerDirection = 1;
    elements.powerGauge.classList.add('active');
    elements.throwHint.textContent = '적절한 타이밍에 다시 클릭!';
    
    // 파워 게이지 애니메이션 (60fps)
    gameState.powerInterval = setInterval(() => {
        // 파워 값 증가/감소
        gameState.powerValue += gameState.powerDirection * 2;
        
        // 방향 전환 (0% ~ 100%)
        if (gameState.powerValue >= 100) {
            gameState.powerValue = 100;
            gameState.powerDirection = -1;
        } else if (gameState.powerValue <= 0) {
            gameState.powerValue = 0;
            gameState.powerDirection = 1;
        }
        
        // 게이지 업데이트
        elements.powerFill.style.width = `${gameState.powerValue}%`;
    }, 1000 / 60); // 60fps
}

function stopPowerGauge() {
    if (!gameState.powerGaugeActive) return;
    
    clearInterval(gameState.powerInterval);
    gameState.powerGaugeActive = false;
    
    // 현재 파워 값 저장
    gameState.throwPower = gameState.powerValue;
}

function resetPowerGauge() {
    elements.powerGauge.classList.remove('active');
    elements.powerFill.style.width = '0%';
    elements.throwHint.textContent = '콩 주머니를 클릭하여 시작!';
    gameState.powerValue = 0;
}

// ==================== 콩 주머니 클릭 이벤트 ====================
function onBeanbagClick(e) {
    e.preventDefault();
    
    if (!gameState.powerGaugeActive) {
        // 첫 클릭: 파워 게이지 시작
        startPowerGauge();
    } else {
        // 두 번째 클릭: 파워 게이지 정지 및 던지기
        stopPowerGauge();
        throwBeanbag();
    }
}

// ==================== 파워 레벨에 따른 성공률 계산 ====================
function calculatePowerSuccessRate(power) {
    // 최적 파워 중심: 55% (최고 성공률)
    // 최적 존에 가까울수록 성공률이 점진적으로 높아짐
    
    const optimalCenter = 55; // 최적 중심점
    const optimalZone = 10;   // 최적 존 반경 (±10%, 즉 45~65%)
    
    // 최적 중심에서의 거리 계산
    const distance = Math.abs(power - optimalCenter);
    
    if (distance <= optimalZone) {
        // 최적 존 내부 (45~65%): 거리에 따라 100% ~ 80% 성공률
        // 중심(55%) = 100%, 끝(45% or 65%) = 80%
        const successRate = 1.0 - (distance / optimalZone) * 0.2;
        return successRate;
    } else {
        // 최적 존 외부: 거리에 따라 성공률 급격히 감소
        const excessDistance = distance - optimalZone;
        
        if (power < 45) {
            // 45% 미만: 0%까지 선형 감소
            // 45% = 80%, 0% = 0%
            const maxExcess = 45; // 45에서 0까지의 거리
            return Math.max(0, 0.8 * (1 - excessDistance / maxExcess));
        } else {
            // 65% 초과: 100%까지 선형 감소
            // 65% = 80%, 100% = 0%
            const maxExcess = 35; // 65에서 100까지의 거리
            return Math.max(0, 0.8 * (1 - excessDistance / maxExcess));
        }
    }
}

// ==================== 콩 주머니 던지기 ====================
function throwBeanbag() {
    playThrowSound();
    
    const beanbag = elements.beanbag;
    const hulahoop = elements.hulahoop;
    
    // 시작 위치 - 뷰포트 기준으로 정확히 계산
    const startRect = beanbag.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    
    // 훌라후프 위치 정보 - 뷰포트 기준으로 정확히 계산
    const targetRect = hulahoop.getBoundingClientRect();
    const centerX = targetRect.left + targetRect.width / 2;
    const centerY = targetRect.top + targetRect.height / 2;
    
    // 훌라후프 실제 반경 계산 (width와 height 중 작은 값 사용)
    const actualWidth = targetRect.width;
    const actualHeight = targetRect.height;
    const radius = Math.min(actualWidth, actualHeight) / 2;
    
    // 안전한 성공 반경 (실제 반경의 85% - 테두리 고려)
    const safeSuccessRadius = radius * 0.85;
    
    // 파워 레벨에 따른 성공률 계산
    const powerSuccessRate = calculatePowerSuccessRate(gameState.throwPower);
    
    // 난이도에 따른 기본 성공률
    const diffSetting = difficultySettings[gameConfig.difficulty];
    
    // 최종 성공률 = 난이도 성공률 × 파워 성공률
    const finalSuccessRate = diffSetting.successRate * powerSuccessRate;
    const isSuccess = Math.random() < finalSuccessRate;
    
    // 최적 중심(55%)에서의 거리 계산 (0~45)
    const optimalCenter = 55;
    const distanceFromOptimal = Math.abs(gameState.throwPower - optimalCenter);
    
    // 정확도 비율 계산 (1.0 = 완벽, 0.0 = 최악)
    const accuracyRatio = 1 - (distanceFromOptimal / 45);
    
    let targetX, targetY;
    
    if (isSuccess) {
        // 성공: 최적에 가까울수록 훌라후프 정중앙에 떨어짐!
        const angle = Math.random() * Math.PI * 2;
        
        // 정확도에 따른 거리 계산 (훨씬 중심 집중!)
        // accuracyRatio가 1.0 (완벽) → 정중앙! (안전반경의 0~10%)
        // accuracyRatio가 0.7 (좋음) → 중심 근처 (안전반경의 0~30%)
        // accuracyRatio가 0.3 (보통) → 중간 정도 (안전반경의 0~60%)
        // accuracyRatio가 0.0 (나쁨) → 가장자리 (안전반경의 0~75%)
        const maxDistanceRatio = 0.75 - (accuracyRatio * 0.65); // 0.10 ~ 0.75 (훨씬 중심 집중!)
        const distance = Math.random() * (safeSuccessRadius * maxDistanceRatio);
        
        targetX = centerX + Math.cos(angle) * distance;
        targetY = centerY + Math.sin(angle) * distance;
        
        // 디버깅: 성공 위치가 실제로 훌라후프 안에 있는지 확인
        const distFromCenter = Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2));
        console.log(`✅ 성공! 파워:${gameState.throwPower}% 정확도:${(accuracyRatio*100).toFixed(1)}% 중심거리:${distFromCenter.toFixed(1)}px (반경:${safeSuccessRadius.toFixed(1)}px)`);
        
    } else {
        // 실패: 최적에서 멀수록 훌라후프에서 더 멀리 떨어짐
        const angle = Math.random() * Math.PI * 2;
        
        // 화면 크기에 따른 실패 거리 조정
        const screenSize = Math.min(window.innerWidth, window.innerHeight);
        const failDistanceScale = screenSize / 1000; // 기본 1000px 기준
        
        // 정확도에 따른 실패 거리 계산
        // accuracyRatio가 높으면 (거의 성공할 뻔) → 가까이 실패
        // accuracyRatio가 낮으면 (완전 실패) → 멀리 실패
        const minFailDistance = 15 * failDistanceScale + (1 - accuracyRatio) * 15 * failDistanceScale; // 15~30px (scaled)
        const maxFailDistance = 30 * failDistanceScale + (1 - accuracyRatio) * 50 * failDistanceScale; // 30~80px (scaled)
        const distance = radius + minFailDistance + Math.random() * (maxFailDistance - minFailDistance);
        
        targetX = centerX + Math.cos(angle) * distance;
        targetY = centerY + Math.sin(angle) * distance;
        
        // 디버깅: 실패 위치 확인
        const distFromCenter = Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2));
        console.log(`❌ 실패! 파워:${gameState.throwPower}% 정확도:${(accuracyRatio*100).toFixed(1)}% 중심거리:${distFromCenter.toFixed(1)}px (반경:${radius.toFixed(1)}px)`);
    }
    
    // 애니메이션 준비
    beanbag.classList.add('flying');
    
    // 화면 크기에 따른 포물선 높이 조정
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    const arcHeight = isSuccess ? screenSize * 0.35 : screenSize * 0.15; // 성공 시 매우 높은 포물선 (35%!)
    
    const duration = isSuccess ? 1500 : 1000; // 성공 시 긴 애니메이션 (1.5초)
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 부드러운 easing (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // 포물선 운동 - 화면 크기에 맞춰 조정
        let currentX = startX + (targetX - startX) * easeProgress;
        let currentY;
        
        if (isSuccess && progress > 0.5) {
            // 성공 시: 높은 포물선으로 훌라후프 중심까지 이동 후 급속 수직 낙하
            if (progress <= 0.75) {
                // 0.5~0.75: 높은 포물선 궤적 (25% 구간)
                const arcProgress = (progress - 0.5) / 0.25;
                const arc = Math.sin(arcProgress * Math.PI) * arcHeight * 0.4;
                currentY = startY + (targetY - startY) * easeProgress - Math.sin(progress * Math.PI) * arcHeight + arc;
            } else {
                // 0.75~1.0: 급속 수직 낙하 (25% 구간, 빨려들어감!)
                const fallProgress = (progress - 0.75) / 0.25;
                const fallEase = Math.pow(fallProgress, 2.5); // 강력한 가속 낙하 (2.5 제곱!)
                const arcEnd = startY + (targetY - startY) * (1 - Math.pow(1 - 0.75, 3)) - Math.sin(0.75 * Math.PI) * arcHeight;
                currentY = arcEnd + (targetY - arcEnd + 150) * fallEase; // 훨씬 아래로!
            }
        } else {
            // 일반 포물선 운동
            const arc = Math.sin(progress * Math.PI) * arcHeight;
            currentY = startY + (targetY - startY) * easeProgress - arc;
        }
        
        // 성공 시 3D 효과 (훌라후프 안으로 빨려들어가는 효과 극대화)
        let scale = 1;
        let opacity = 1;
        if (isSuccess && progress > 0.5) {
            // 0.5~1.0 구간에서 점점 작아지고 투명해짐 (50% 구간)
            const shrinkProgress = (progress - 0.5) / 0.5;
            const shrinkEase = Math.pow(shrinkProgress, 2); // 가속 축소
            
            if (progress > 0.75) {
                // 0.75~1.0: 급격한 소멸 (마지막 25%)
                const finalShrink = (progress - 0.75) / 0.25;
                const finalEase = Math.pow(finalShrink, 3); // 강력한 가속!
                scale = 0.4 * (1 - finalEase); // 0.4 → 0
                opacity = 0.4 * (1 - finalEase); // 0.4 → 0
            } else {
                // 0.5~0.75: 점진적 축소
                scale = 1 - (shrinkEase * 0.6); // 1.0 → 0.4
                opacity = 1 - (shrinkEase * 0.6); // 1.0 → 0.4
            }
        }
        
        // 위치 설정 - fixed 포지션으로 정확한 위치 보장
        beanbag.style.position = 'fixed';
        beanbag.style.left = `${currentX}px`;
        beanbag.style.top = `${currentY}px`;
        beanbag.style.transform = `translate(-50%, -50%) rotate(${progress * 720}deg) scale(${scale})`;
        beanbag.style.opacity = opacity;
        beanbag.style.zIndex = '1000';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // 애니메이션 종료 후 최종 위치 확정
            beanbag.style.left = `${targetX}px`;
            beanbag.style.top = `${targetY}px`;
            
            // 성공 시 완전히 사라지는 효과
            if (isSuccess) {
                beanbag.style.opacity = '0';
                beanbag.style.transform = 'translate(-50%, -50%) scale(0)';
            }
            
            // 성공/실패 처리
            if (isSuccess) {
                onSuccess();
            } else {
                onFail();
            }
            resetBeanbag();
        }
    }
    
    animate();
}

// ==================== 성공/실패 처리 ====================
function onSuccess() {
    playSuccessSound();
    gameState.teams[gameState.currentTeamIndex].score++;
    showFeedback('성공! 🎉', 'success');
    updateScoreboard();
    nextTurn();
}

function onFail() {
    playFailSound();
    showFeedback('아쉬워요! 😢', 'fail');
    nextTurn();
}

function showFeedback(message, type) {
    elements.feedbackText.textContent = message;
    elements.feedbackMessage.className = `feedback-message ${type} show`;
    
    setTimeout(() => {
        elements.feedbackMessage.classList.remove('show');
    }, 1500);
}

// ==================== 콩 주머니 리셋 ====================
function resetBeanbag() {
    setTimeout(() => {
        elements.beanbag.style.position = 'relative';
        elements.beanbag.style.left = '0';
        elements.beanbag.style.top = '0';
        elements.beanbag.style.transform = '';
        elements.beanbag.style.opacity = '1'; // 투명도 복구
        elements.beanbag.classList.remove('flying');
        
        // 파워 게이지 리셋
        resetPowerGauge();
    }, 500);
}

// ==================== 다음 턴 ====================
function nextTurn() {
    gameState.bagsRemaining--;
    
    // 주머니가 남아있으면 계속
    if (gameState.bagsRemaining > 0) {
        updateUI();
        return;
    }
    
    // 주머니 다 썼으면 다음 플레이어
    gameState.bagsRemaining = gameState.bagsPerPlayer;
    gameState.currentPlayer++;
    
    // 플레이어가 남아있으면 계속
    if (gameState.currentPlayer <= gameState.teams[gameState.currentTeamIndex].players) {
        updateUI();
        return;
    }
    
    // 모든 플레이어 끝났으면 다음 모둠
    gameState.currentPlayer = 1;
    gameState.currentTeamIndex++;
    
    // 모둠이 남아있으면 계속
    if (gameState.currentTeamIndex < gameState.teams.length) {
        updateUI();
        updateScoreboard();
        return;
    }
    
    // 모든 모둠 끝났으면 라운드 체크
    gameState.currentTeamIndex = 0;
    gameState.currentRound++;
    
    // 라운드가 남아있으면 계속
    if (gameState.currentRound <= gameState.maxRounds) {
        showFeedback(`${gameState.currentRound}라운드 시작! 🚀`, 'success');
        updateUI();
        updateScoreboard();
        return;
    }
    
    // 게임 종료
    endGame();
}

// ==================== 게임 종료 ====================
function endGame() {
    setTimeout(() => {
        switchScreen('resultScreen');
        displayResults();
    }, 1000);
}

// ==================== 결과 표시 ====================
function displayResults() {
    // 순위 정렬
    const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
    
    // 테이블 생성
    elements.resultTableBody.innerHTML = '';
    sortedTeams.forEach((team, index) => {
        const row = document.createElement('tr');
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
        row.className = rankClass;
        
        let rankIcon = '';
        if (index === 0) rankIcon = '🥇';
        else if (index === 1) rankIcon = '🥈';
        else if (index === 2) rankIcon = '🥉';
        else rankIcon = index + 1;
        
        row.innerHTML = `
            <td>${rankIcon}</td>
            <td>${team.name} 모둠</td>
            <td>${team.score}개</td>
        `;
        
        elements.resultTableBody.appendChild(row);
    });
    
    // 통계 계산
    const scores = sortedTeams.map(team => team.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    
    elements.firstPlace.textContent = `${sortedTeams[0].name} 모둠`;
    elements.maxScore.textContent = `${maxScore}개`;
    elements.minScore.textContent = `${minScore}개`;
    elements.avgScore.textContent = `${avgScore}개`;
    
    // 그림그래프 작업 영역 초기화
    initGraphWorkspace();
}

// ==================== 그림그래프 작업 영역 초기화 ====================
function initGraphWorkspace() {
    // 하나의 아이콘만 생성 (계속 드래그 가능)
    elements.iconPalette.innerHTML = '';
    const icon = createDraggableIcon();
    elements.iconPalette.appendChild(icon);
    
    // 한 행당 셀 개수 (10개)
    const cellsPerRow = 10;
    // 고정 행 수 (항상 3행 = 30개까지)
    const fixedRows = 3;
    
    // 표 형식 그래프 생성
    elements.graphTableBody.innerHTML = '';
    gameState.teams.forEach((team, teamIndex) => {
        // 모든 모둠에 항상 3행을 표시
        const rowsNeeded = fixedRows;
        
        // 각 모둠당 필요한 만큼 행 생성
        for (let rowIndex = 0; rowIndex < rowsNeeded; rowIndex++) {
            const row = document.createElement('tr');
            row.dataset.teamIndex = teamIndex;
            row.dataset.rowIndex = rowIndex;
            
            // 첫 번째 행에만 모둠 이름 셀 추가 (rowspan 사용)
            if (rowIndex === 0) {
                const teamCell = document.createElement('td');
                teamCell.className = 'team-name-cell';
                teamCell.rowSpan = rowsNeeded; // 필요한 행 수만큼 병합
                teamCell.style.background = `linear-gradient(135deg, ${team.color} 0%, ${adjustBrightness(team.color, -20)} 100%)`;
                teamCell.innerHTML = `
                    <div class="team-info">
                        <div class="team-name">${team.name}</div>
                        <div class="team-input-group">
                            <input type="number" 
                                   class="count-input" 
                                   value="0" 
                                   min="0" 
                                   max="30"
                                   data-team-index="${teamIndex}">
                            <button class="apply-count-btn" data-team-index="${teamIndex}">
                                <i class="fas fa-check"></i> 적용
                            </button>
                        </div>
                    </div>
                `;
                row.appendChild(teamCell);
            }
            
            // 그래프 셀들 (한 행에 10개)
            const startIndex = rowIndex * cellsPerRow;
            for (let i = 0; i < cellsPerRow; i++) {
                const cell = document.createElement('td');
                cell.className = 'graph-cell';
                cell.dataset.teamIndex = teamIndex;
                cell.dataset.cellIndex = startIndex + i;
                cell.dataset.rowIndex = rowIndex;
                
                // 드래그 이벤트
                cell.addEventListener('dragover', onCellDragOver);
                cell.addEventListener('dragleave', onCellDragLeave);
                cell.addEventListener('drop', onCellDrop);
                cell.addEventListener('click', onCellClick);
                
                row.appendChild(cell);
            }
            
            elements.graphTableBody.appendChild(row);
        }
    });
    
    // 개수 입력 이벤트 리스너
    document.querySelectorAll('.apply-count-btn').forEach(btn => {
        btn.addEventListener('click', onApplyCount);
    });
    
    // 엔터키로 적용
    document.querySelectorAll('.count-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const teamIndex = this.dataset.teamIndex;
                const btn = document.querySelector(`.apply-count-btn[data-team-index="${teamIndex}"]`);
                btn.click();
            }
        });
    });
    
    // 눈금 라벨 생성 (1~10, 11~20, 21~30)
    elements.scaleLabels.innerHTML = '';
    
    // 항상 3행 표시
    const maxRows = fixedRows;
    
    // 각 행마다 1~10 라벨 생성 (3행 고정)
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const rowLabels = document.createElement('div');
        rowLabels.className = 'scale-labels-row';
        
        for (let i = 0; i < cellsPerRow; i++) {
            const label = document.createElement('div');
            label.className = 'scale-label';
            label.textContent = (rowIndex * cellsPerRow) + i + 1;
            rowLabels.appendChild(label);
        }
        
        elements.scaleLabels.appendChild(rowLabels);
    }
}

// ==================== 드래그 가능한 아이콘 생성 ====================
function createDraggableIcon() {
    const icon = document.createElement('div');
    icon.className = 'palette-icon';
    icon.draggable = true;
    icon.innerHTML = '<i class="fas fa-shopping-bag"></i><div class="icon-label">드래그하세요</div>';
    
    icon.addEventListener('dragstart', onDragStart);
    icon.addEventListener('dragend', onDragEnd);
    
    return icon;
}

// ==================== 드래그 시작 ====================
function onDragStart(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/html', '<i class="fas fa-shopping-bag"></i>');
    this.classList.add('dragging');
}

function onDragEnd(e) {
    this.classList.remove('dragging');
    // 드래그가 끝나도 아이콘은 그대로 유지 (계속 사용 가능)
}

// ==================== 셀 드래그 오버 ====================
function onCellDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    
    // 이미 채워진 셀이 아닐 때만 drag-over 효과
    if (!this.classList.contains('filled')) {
        this.classList.add('drag-over');
    }
    return false;
}

function onCellDragLeave(e) {
    this.classList.remove('drag-over');
}

// ==================== 셀 드롭 ====================
function onCellDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    this.classList.remove('drag-over');
    
    const teamIndex = parseInt(this.dataset.teamIndex);
    
    // 해당 모둠의 모든 행 가져오기 (같은 teamIndex를 가진 모든 tr)
    const rows = elements.graphTableBody.querySelectorAll(`tr[data-team-index="${teamIndex}"]`);
    
    // 모든 셀 수집 (모든 행의 셀)
    const allCells = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('.graph-cell');
        allCells.push(...cells);
    });
    
    // 앞에서부터 빈 칸 찾아서 채우기
    for (let i = 0; i < allCells.length; i++) {
        if (!allCells[i].classList.contains('filled')) {
            fillCell(allCells[i], teamIndex, i);
            break;
        }
    }
    
    return false;
}

// ==================== 셀 클릭 (삭제) ====================
function onCellClick(e) {
    if (this.classList.contains('filled')) {
        const teamIndex = parseInt(this.dataset.teamIndex);
        const cellIndex = parseInt(this.dataset.cellIndex);
        
        // 해당 모둠의 모든 행 가져오기
        const rows = elements.graphTableBody.querySelectorAll(`tr[data-team-index="${teamIndex}"]`);
        
        // 모든 셀 수집 (모든 행의 셀)
        const allCells = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('.graph-cell');
            allCells.push(...cells);
        });
        
        // 클릭한 위치부터 뒤의 모든 아이콘을 앞으로 당기기
        for (let i = cellIndex; i < allCells.length - 1; i++) {
            if (allCells[i + 1].classList.contains('filled')) {
                allCells[i].classList.add('filled');
                allCells[i].innerHTML = allCells[i + 1].innerHTML;
            } else {
                clearCell(allCells[i]);
                break;
            }
        }
        
        // 마지막 셀 비우기
        const lastFilledIndex = Array.from(allCells).findIndex((c, i) => i > cellIndex && !c.classList.contains('filled'));
        if (lastFilledIndex > 0) {
            clearCell(allCells[lastFilledIndex - 1]);
        } else {
            clearCell(allCells[allCells.length - 1]);
        }
    }
}

// ==================== 셀 채우기 ====================
function fillCell(cell, teamIndex, cellIndex) {
    cell.classList.add('filled');
    cell.innerHTML = `
        <div class="cell-icon">
            <i class="fas fa-shopping-bag"></i>
        </div>
    `;
}

// ==================== 셀 비우기 ====================
function clearCell(cell) {
    cell.classList.remove('filled');
    cell.innerHTML = '';
}

// ==================== 그래프 지우기 ====================
function clearGraph() {
    const cells = elements.graphTableBody.querySelectorAll('.graph-cell');
    cells.forEach(cell => {
        clearCell(cell);
    });
    
    elements.graphResult.style.display = 'none';
}

// ==================== 개수 입력으로 아이콘 채우기 ====================
function onApplyCount(e) {
    const teamIndex = parseInt(this.dataset.teamIndex);
    const input = document.querySelector(`.count-input[data-team-index="${teamIndex}"]`);
    const count = parseInt(input.value) || 0;
    
    if (count < 0) {
        alert('0 이상의 숫자를 입력하세요.');
        return;
    }
    
    // 해당 모둠의 모든 행 가져오기
    const rows = elements.graphTableBody.querySelectorAll(`tr[data-team-index="${teamIndex}"]`);
    
    // 모든 셀 수집
    const allCells = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('.graph-cell');
        allCells.push(...cells);
    });
    
    // 모든 셀 초기화
    allCells.forEach(cell => clearCell(cell));
    
    // 입력한 개수만큼 채우기
    for (let i = 0; i < count && i < allCells.length; i++) {
        fillCell(allCells[i], teamIndex, i);
    }
}

// ==================== 그래프 확인 ====================
function checkGraph() {
    let allCorrect = true;
    const results = [];
    
    gameState.teams.forEach((team, teamIndex) => {
        // 해당 모둠의 모든 행 가져오기
        const rows = elements.graphTableBody.querySelectorAll(`tr[data-team-index="${teamIndex}"]`);
        
        // 모든 행에서 채워진 셀 개수 세기
        let iconCount = 0;
        rows.forEach(row => {
            const filledCells = row.querySelectorAll('.graph-cell.filled');
            iconCount += filledCells.length;
        });
        
        const studentAnswer = iconCount; // 1개 아이콘 = 1개 콩주머니
        const correctAnswer = team.score;
        const isCorrect = studentAnswer === correctAnswer;
        
        if (!isCorrect) {
            allCorrect = false;
        }
        
        results.push({
            team: team,
            studentAnswer: studentAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });
    });
    
    // 결과 표시
    displayGraphResult(allCorrect, results);
}

// ==================== 그래프 결과 표시 ====================
function displayGraphResult(allCorrect, results) {
    elements.graphResult.style.display = 'block';
    
    if (allCorrect) {
        elements.resultTitle.textContent = '완벽해요! 🎉';
        elements.resultMessage.textContent = '그림그래프를 정확하게 완성했습니다!';
    } else {
        elements.resultTitle.textContent = '다시 한 번 확인해보세요!';
        elements.resultMessage.textContent = '일부 모둠의 개수가 맞지 않아요.';
    }
    
    // 비교 그리드 생성
    elements.comparisonGrid.innerHTML = '';
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'comparison-item';
        
        item.innerHTML = `
            <h4 style="background: linear-gradient(135deg, ${result.team.color} 0%, ${adjustBrightness(result.team.color, -20)} 100%);">
                ${result.team.name} 모둠
            </h4>
            <div class="comparison-numbers">
                <div>
                    <div class="label">내가 그린 개수</div>
                    <div class="value">${result.studentAnswer}</div>
                </div>
                <div class="divider">:</div>
                <div>
                    <div class="label">실제 개수</div>
                    <div class="value">${result.correctAnswer}</div>
                </div>
            </div>
            <div class="comparison-result ${result.isCorrect ? 'correct' : 'incorrect'}">
                ${result.isCorrect ? '✅ 정확해요!' : '❌ 다시 확인하세요'}
            </div>
        `;
        
        elements.comparisonGrid.appendChild(item);
    });
    
    // 스크롤 이동
    elements.graphResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==================== 홈으로 이동 ====================
function goHome() {
    window.location.href = '../../../index.html';
}

// ==================== 초기화 실행 ====================
init();
