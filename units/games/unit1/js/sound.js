// 🎵 브라우저 내장 Web Audio API를 사용한 사운드 효과
// API 없이 순수 JavaScript로 재미있는 사운드 생성

class GameSound {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.initAudioContext();
    }
    
    initAudioContext() {
        try {
            // Safari를 포함한 모든 브라우저 호환성
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.enabled = false;
        }
    }
    
    // 사용자 인터랙션 시 AudioContext 재개 (브라우저 정책)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // 기본 톤 재생 함수
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;
        
        this.resumeAudioContext();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // 🪙 금화 선택 사운드 (동전 소리)
    playCoinSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 메탈릭한 링 사운드 (여러 주파수 조합)
        [800, 1000, 1200, 1500].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            const delay = index * 0.02;
            const startVolume = 0.15 / (index + 1);
            
            gainNode.gain.setValueAtTime(startVolume, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.15);
        });
    }
    
    // 💎 보석 선택 사운드 (반짝이는 소리)
    playJewelSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 반짝이는 마법 소리 (올라가는 음계)
        [523, 659, 784, 988, 1175].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;
            
            const delay = index * 0.05;
            
            gainNode.gain.setValueAtTime(0.12, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.2);
        });
    }
    
    // ✅ 정답 사운드 (성공 멜로디)
    playCorrectSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 도-미-솔 화음 (C-E-G 코드)
        const melody = [
            { freq: 523, time: 0 },     // C5
            { freq: 659, time: 0.15 },  // E5
            { freq: 784, time: 0.3 }    // G5
        ];
        
        melody.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.value = note.freq;
            
            gainNode.gain.setValueAtTime(0.2, now + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.3);
            
            oscillator.start(now + note.time);
            oscillator.stop(now + note.time + 0.3);
        });
    }
    
    // ❌ 오답 사운드 (부정 효과음)
    playWrongSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 낮은 버저 소리
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
    
    // 🎯 빙고판 칠하기 사운드 (페인트 칠하는 소리)
    playPaintSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 짧은 스와이프 소리
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.linearRampToValueAtTime(200, now + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
    
    // 🎊 빙고! 승리 사운드 (팬파레)
    playBingoSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 승리 팬파레 멜로디 (도-도-솔-도 높은음)
        const fanfare = [
            { freq: 523, time: 0 },      // C5
            { freq: 523, time: 0.15 },   // C5
            { freq: 784, time: 0.3 },    // G5
            { freq: 1047, time: 0.5 }    // C6
        ];
        
        fanfare.forEach(note => {
            // 메인 톤
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.type = 'square';
            osc.frequency.value = note.freq;
            
            gain.gain.setValueAtTime(0.25, now + note.time);
            gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.4);
            
            osc.start(now + note.time);
            osc.stop(now + note.time + 0.4);
            
            // 하모니 추가
            const osc2 = this.audioContext.createOscillator();
            const gain2 = this.audioContext.createGain();
            
            osc2.connect(gain2);
            gain2.connect(this.audioContext.destination);
            
            osc2.type = 'sine';
            osc2.frequency.value = note.freq * 1.5; // 5도 화음
            
            gain2.gain.setValueAtTime(0.15, now + note.time);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.4);
            
            osc2.start(now + note.time);
            osc2.stop(now + note.time + 0.4);
        });
    }
    
    // 🔄 턴 전환 사운드 (간단한 딩동)
    playTurnChangeSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 딩-동 소리
        [660, 523].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            const delay = index * 0.15;
            
            gainNode.gain.setValueAtTime(0.2, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.2);
        });
    }
    
    // 🎮 게임 시작 사운드 (상승하는 음계)
    playGameStartSound() {
        if (!this.enabled || !this.audioContext) return;
        this.resumeAudioContext();
        
        const now = this.audioContext.currentTime;
        
        // 도-레-미-솔-도 (C-D-E-G-C)
        const scale = [262, 294, 330, 392, 523];
        
        scale.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;
            
            const delay = index * 0.1;
            
            gainNode.gain.setValueAtTime(0.15, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.2);
        });
    }
    
    // 🔇 사운드 토글
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    // 사운드 활성화 상태 확인
    isEnabled() {
        return this.enabled;
    }
}

// 전역 사운드 인스턴스 생성
const gameSound = new GameSound();
