// 페이지 로딩 시 애니메이션
document.addEventListener('DOMContentLoaded', () => {
    console.log('수학 놀이에 풍덩! 로딩 완료');
    
    // 카드 호버 효과 강화
    const unitCards = document.querySelectorAll('.unit-card');
    
    unitCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.unit-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.unit-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // 카드 클릭 시 애니메이션
    unitCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-button') && 
                !e.target.closest('.play-button')) {
                const button = card.querySelector('.play-button');
                button.click();
            }
        });
    });
});

// 단원 페이지로 이동
function goToUnit(unitNumber) {
    console.log(`${unitNumber}단원으로 이동`);
    
    // 클릭 효과
    playClickSound();
    
    // 페이지 전환 애니메이션
    const body = document.body;
    body.style.opacity = '0.8';
    body.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        // 단원별 페이지로 이동
        switch(unitNumber) {
            case 1:
                window.location.href = 'units/unit1.html';
                break;
            case 2:
                window.location.href = 'units/unit2.html';
                break;
            case 3:
                window.location.href = 'units/unit3.html';
                break;
            case 4:
                window.location.href = 'units/unit4.html';
                break;
            case 5:
                window.location.href = 'units/unit5.html';
                break;
            case 6:
                window.location.href = 'units/games/unit6/index.html';
                break;
            default:
                alert('준비 중인 단원입니다!');
                body.style.opacity = '1';
                body.style.transform = 'scale(1)';
        }
    }, 300);
}

// 클릭 사운드 효과 (시각적 피드백)
function playClickSound() {
    // 실제 사운드 대신 시각적 효과로 대체
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.left = event.clientX + 'px';
    ripple.style.top = event.clientY + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// CSS에 ripple 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 스크롤 애니메이션
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.wave-bg');
    
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    // 숫자 키로 단원 이동
    if (e.key >= '1' && e.key <= '6') {
        const unitNumber = parseInt(e.key);
        goToUnit(unitNumber);
    }
    
    // ESC 키로 홈으로 (단원 페이지에서)
    if (e.key === 'Escape') {
        if (window.location.pathname.includes('/units/')) {
            goHome();
        }
    }
});

// 홈으로 돌아가기
function goHome() {
    window.location.href = '../index.html';
}

// 성능 최적화: Intersection Observer로 카드 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 모든 카드에 observer 적용
document.querySelectorAll('.unit-card').forEach(card => {
    observer.observe(card);
});

// 브라우저 뒤로가기 버튼 처리
window.addEventListener('popstate', () => {
    location.reload();
});

// 개발자 정보
console.log('%c수학 놀이에 풍덩! 🌊', 'color: #4A90E2; font-size: 24px; font-weight: bold;');
console.log('%c초등학교 3학년 2학기 수학 학습 플랫폼', 'color: #F39C12; font-size: 14px;');
console.log('%c단원별로 재미있는 놀이를 즐겨보세요!', 'color: #2ECC71; font-size: 12px;');
