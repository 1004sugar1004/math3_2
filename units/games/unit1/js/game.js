// 게임 상태 관리
class BingoGame {
    constructor() {
        // 게임 데이터
        this.goldNumbers = [43, 62, 8, 37, 23];
        this.jewelNumbers = [32, 27, 55, 16, 40];
        
        // 빙고판 배치 (5x5)
        this.bingoBoardNumbers = [
            [688, 256, 320, 1184, 736],
            [440, 3410, 920, 992, 2365],
            [999, 368, 1161, 1984, 1265],
            [1720, 2480, 1480, 621, 216],
            [1674, 2035, 128, 1376, 592]
        ];
        
        // 플레이어 색상
        this.playerColors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D'];
        
        // 게임 상태
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentGold = null;
        this.currentJewel = null;
        this.previousGold = null; // 이전 금화 값 (복구용)
        this.previousJewel = null; // 이전 보석 값 (복구용)
        this.lastMovedArea = null;
        this.isFirstTurn = true;
        this.turnMoveCount = 0; // 현재 턴에서 몇 번 움직였는지
        this.totalTurns = 0;
        this.winner = null;
        
        // 빙고판 상태 (5x5 배열)
        this.boardState = Array(5).fill(null).map(() => 
            Array(5).fill(null).map(() => ({
                colored: false,
                playerId: null
            }))
        );
    }
    
    // 게임 초기화
    initGame(playerCount, playerNames) {
        this.players = [];
        for (let i = 0; i < playerCount; i++) {
            this.players.push({
                id: i + 1,
                name: playerNames[i] || `플레이어${i + 1}`,
                color: this.playerColors[i],
                coloredCells: 0
            });
        }
        
        this.currentPlayerIndex = 0;
        this.currentGold = null;
        this.currentJewel = null;
        this.previousGold = null; // 이전 금화 값 (복구용)
        this.previousJewel = null; // 이전 보석 값 (복구용)
        this.lastMovedArea = null;
        this.isFirstTurn = true;
        this.turnMoveCount = 0; // 현재 턴에서 몇 번 움직였는지
        this.totalTurns = 0;
        this.winner = null;
        
        // 빙고판 상태 초기화
        this.boardState = Array(5).fill(null).map(() => 
            Array(5).fill(null).map(() => ({
                colored: false,
                playerId: null
            }))
        );
    }
    
    // 현재 플레이어 가져오기
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
    
    // 금화 선택 가능 여부
    canSelectGold() {
        // 첫 턴: 둘 다 자유롭게 선택 가능
        if (this.isFirstTurn) return true;
        
        // 두 번째 턴부터: 한 영역만 변경 가능
        // 아직 이번 턴에 아무것도 안 움직였으면 선택 가능
        if (this.turnMoveCount === 0) return true;
        
        // 이미 움직였다면, 금화를 선택했을 때만 계속 가능
        return this.lastMovedArea === 'gold';
    }
    
    // 보석 선택 가능 여부
    canSelectJewel() {
        if (this.isFirstTurn) return true;
        
        // 아직 이번 턴에 아무것도 안 움직였으면 선택 가능
        if (this.turnMoveCount === 0) return true;
        
        // 이미 움직였다면, 보석을 선택했을 때만 계속 가능
        return this.lastMovedArea === 'jewel';
    }
    
    // 금화 선택
    selectGold(value) {
        if (!this.canSelectGold()) return false;
        
        // 값이 실제로 변경되었는지 체크 (같은 값 재선택은 카운트 안함)
        const isChanged = this.currentGold !== value;
        
        this.currentGold = value;
        
        // 두 번째 턴부터, 처음 영역 선택 시 기록
        if (!this.isFirstTurn && this.turnMoveCount === 0 && isChanged) {
            this.lastMovedArea = 'gold';
            this.turnMoveCount++;
        }
        
        return true;
    }
    
    // 보석 선택
    selectJewel(value) {
        if (!this.canSelectJewel()) return false;
        
        // 값이 실제로 변경되었는지 체크
        const isChanged = this.currentJewel !== value;
        
        this.currentJewel = value;
        
        // 두 번째 턴부터, 처음 영역 선택 시 기록
        if (!this.isFirstTurn && this.turnMoveCount === 0 && isChanged) {
            this.lastMovedArea = 'jewel';
            this.turnMoveCount++;
        }
        
        return true;
    }
    
    // 계산 결과 가져오기
    getCalculationResult() {
        if (this.currentGold === null || this.currentJewel === null) {
            return null;
        }
        return this.currentGold * this.currentJewel;
    }
    
    // 빙고판에서 숫자의 위치 찾기
    findNumberPosition(number) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.bingoBoardNumbers[row][col] === number) {
                    return { row, col };
                }
            }
        }
        return null;
    }
    
    // 빙고판 칸 색칠
    colorCell(row, col) {
        if (this.boardState[row][col].colored) {
            return false; // 이미 색칠된 칸
        }
        
        const currentPlayer = this.getCurrentPlayer();
        this.boardState[row][col] = {
            colored: true,
            playerId: currentPlayer.id
        };
        
        currentPlayer.coloredCells++;
        this.totalTurns++;
        
        return true;
    }
    
    // 빙고 체크 (가로, 세로, 대각선)
    checkBingo(playerId) {
        // 가로 체크
        for (let row = 0; row < 5; row++) {
            if (this.checkLine(this.boardState[row], playerId)) {
                return true;
            }
        }
        
        // 세로 체크
        for (let col = 0; col < 5; col++) {
            const column = this.boardState.map(row => row[col]);
            if (this.checkLine(column, playerId)) {
                return true;
            }
        }
        
        // 대각선 체크 (좌상 → 우하)
        const diagonal1 = [0, 1, 2, 3, 4].map(i => this.boardState[i][i]);
        if (this.checkLine(diagonal1, playerId)) {
            return true;
        }
        
        // 대각선 체크 (우상 → 좌하)
        const diagonal2 = [0, 1, 2, 3, 4].map(i => this.boardState[i][4 - i]);
        if (this.checkLine(diagonal2, playerId)) {
            return true;
        }
        
        return false;
    }
    
    // 라인 체크 (5개가 모두 같은 플레이어인지)
    checkLine(cells, playerId) {
        return cells.every(cell => cell.colored && cell.playerId === playerId);
    }
    
    // 다음 턴으로
    nextTurn() {
        this.isFirstTurn = false;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        // 다음 턴을 위해 초기화
        this.lastMovedArea = null;
        this.turnMoveCount = 0; // 턴 이동 횟수 리셋
        // 이전 값 저장 (다음 플레이어가 사용할 초기값)
        this.previousGold = this.currentGold;
        this.previousJewel = this.currentJewel;
    }
    
    // 게임 승리 설정
    setWinner(playerId) {
        this.winner = this.players.find(p => p.id === playerId);
    }
    
    // 게임 종료 여부
    isGameOver() {
        return this.winner !== null;
    }
    
    // 이전 값으로 복구 (이미 색칠된 칸 선택 시)
    restorePreviousValues() {
        this.currentGold = this.previousGold;
        this.currentJewel = this.previousJewel;
        this.lastMovedArea = null;
        this.turnMoveCount = 0;
    }
}

// 전역 게임 인스턴스
let game = new BingoGame();
