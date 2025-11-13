// Web Audio API를 사용한 사운드 생성 (API 없이 브라우저 내장 기능만 사용)

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3; // 기본 볼륨 (0.0 ~ 1.0)
        this.initAudioContext();
    }
    
    initAudioContext() {
        try {
            // AudioContext 생성 (브라우저 내장)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // 사용자 상호작용 후 AudioContext 재개
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // 가위바위보 소리 - 재미있는 "가위바위보!" 소리
    playRockPaperScissors() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // "가위" 소리 (높은 톤)
        this.playTone(800, now, 0.15, 'sine');
        
        // "바위" 소리 (중간 톤)
        this.playTone(500, now + 0.2, 0.15, 'sine');
        
        // "보" 소리 (낮은 톤)
        this.playTone(300, now + 0.4, 0.15, 'sine');
    }
    
    // 결과 발표 소리 - 승리/무승부
    playResultSound(isWin = true) {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        if (isWin) {
            // 승리 소리 - 상승하는 멜로디
            this.playTone(523, now, 0.1, 'sine'); // C
            this.playTone(659, now + 0.1, 0.1, 'sine'); // E
            this.playTone(784, now + 0.2, 0.2, 'sine'); // G
        } else {
            // 무승부 소리 - 중립적인 소리
            this.playTone(400, now, 0.15, 'sine');
            this.playTone(400, now + 0.2, 0.15, 'sine');
        }
    }
    
    // 원 그리기 시작 소리 - "위잉" 소리
    playCircleStart() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // 상승하는 주파수
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.3);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
    
    // 원 그리기 중 소리 - 연속적인 "쓱쓱" 소리
    playCircleDrawing(progress) {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // 진행도에 따라 피치 변화
        const frequency = 300 + (progress * 200);
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
    
    // 원 그리기 완료 소리 - "딩!" 소리
    playCircleComplete() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // 맑은 종소리
        this.playTone(880, now, 0.1, 'sine'); // A5
        this.playTone(1046, now + 0.05, 0.15, 'sine'); // C6
        
        // 배음 추가
        this.playTone(1320, now + 0.1, 0.2, 'sine', 0.3);
    }
    
    // 열쇠 수집 소리 - "땡그랑" 소리
    playKeyCollect() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // 여러 주파수로 금속성 소리 생성
        this.playTone(1200, now, 0.05, 'sine');
        this.playTone(1600, now + 0.03, 0.05, 'sine');
        this.playTone(2000, now + 0.06, 0.1, 'sine', 0.5);
        
        // 낮은 울림 추가
        this.playTone(400, now + 0.02, 0.15, 'sine', 0.3);
    }
    
    // 버튼 클릭 소리 - "탁" 소리
    playButtonClick() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.value = 150;
        
        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }
    
    // 깃발 선택 소리 - "띵" 소리
    playFlagSelect() {
        this.resumeAudioContext();
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        this.playTone(700, now, 0.08, 'sine');
        this.playTone(900, now + 0.05, 0.08, 'sine');
    }
    
    // 기본 톤 생성 헬퍼 함수
    playTone(frequency, startTime, duration, waveType = 'sine', volumeMultiplier = 1.0) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = waveType;
        oscillator.frequency.value = frequency;
        
        const volume = this.masterVolume * volumeMultiplier;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // 볼륨 설정
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}

// 전역 사운드 인스턴스
const soundEffects = new SoundEffects();
