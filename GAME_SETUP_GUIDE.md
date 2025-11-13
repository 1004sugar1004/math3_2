# 🎮 게임 코드 추가 완벽 가이드

## 🎯 현재 상태

프로젝트 구조가 완성되었습니다! 이제 각 단원별로 완성된 게임 코드만 추가하면 됩니다.

```
✅ 메인 페이지 (index.html)
✅ 6개 단원 페이지 (unit1.html ~ unit6.html)
✅ 6개 게임 파일 템플릿 (unit1-game.html ~ unit6-game.html)
✅ 스타일 및 JavaScript
✅ iframe 자동 연결
```

## 📁 게임 파일 위치

```
units/games/
├── unit1/  👈 1단원 곱셈 게임 파일들을 여기에!
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit2/  👈 2단원 나눗셈 게임 파일들을 여기에!
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit3/  👈 3단원 원 게임 파일들을 여기에!
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit4/  👈 4단원 들이와 무게 게임 파일들을 여기에!
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit5/  👈 5단원 분수 게임 파일들을 여기에!
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
└── unit6/  👈 6단원 그림그래프 게임 파일들을 여기에!
    ├── index.html
    ├── css/
    ├── js/
    └── images/
```

## 🚀 게임 파일 추가 방법

### 방법 1: 게임 폴더 전체 복사 (가장 간단! ⭐)

완성된 게임 폴더가 있다면:

**예시: 곱셈 게임을 1단원에 추가**
```
📂 내 게임 폴더/
├── multiplication-game.html
├── style.css
├── script.js
└── images/
    └── bg.png
```

**→ 이렇게 복사:**
```
📂 units/games/unit1/
├── index.html          ← multiplication-game.html 이름 변경
├── css/
│   └── style.css      ← style.css 복사
├── js/
│   └── main.js        ← script.js 이름 변경 후 복사
└── images/
    └── bg.png         ← images 폴더 내용 복사
```

**단계:**
1. 게임 HTML 파일 → `index.html`로 이름 변경 후 복사
2. CSS 파일들 → `css/` 폴더에 복사
3. JavaScript 파일들 → `js/` 폴더에 복사
4. 이미지 파일들 → `images/` 폴더에 복사
5. `index.html`에서 경로 수정:
   - `<link href="style.css">` → `<link href="css/style.css">`
   - `<script src="script.js">` → `<script src="js/main.js">`
   - `<img src="bg.png">` → `<img src="images/bg.png">`

### 방법 2: 파일별로 추가

기존 템플릿을 수정하면서 게임 추가:

#### Step 1: CSS 추가
```html
<style>
    /* 기존 스타일... */
    
    /* 여기에 게임 CSS 추가 */
    .game-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
</style>
```

#### Step 2: HTML 추가
```html
<!-- 이 부분 삭제 -->
<div class="placeholder">
    <h2>🎮 게임 코드를 여기에 넣어주세요</h2>
    ...
</div>

<!-- 게임 HTML로 교체 -->
<div class="game-board">
    <button>버튼 1</button>
    <button>버튼 2</button>
    ...
</div>
```

#### Step 3: JavaScript 추가
```html
<script>
    // 기존 코드...
    
    // 여기에 게임 JavaScript 추가
    function startGame() {
        console.log('게임 시작!');
    }
</script>
```

## 🎨 단원별 색상 테마

각 게임의 배경색이 자동으로 설정되어 있습니다:

| 단원 | 색상 | 이모지 |
|------|------|--------|
| 1. 곱셈 | 보라-파랑 그라데이션 | ✖️ |
| 2. 나눗셈 | 청록 그라데이션 | ➗ |
| 3. 원 | 주황-노랑 그라데이션 | ⭕ |
| 4. 들이와 무게 | 보라 그라데이션 | ⚖️ |
| 5. 분수 | 핑크 그라데이션 | 🍕 |
| 6. 그림그래프 | 파랑 그라데이션 | 📊 |

## 💡 예시: 5단원(분수)에 외부 게임 링크 추가

만약 외부 웹사이트의 게임을 사용하고 싶다면:

### iframe 방식
```html
<div class="game-container">
    <h1>🍕 5단원: 분수 게임</h1>
    
    <!-- placeholder 삭제하고 iframe 추가 -->
    <iframe 
        src="https://외부게임주소.com/game" 
        width="100%" 
        height="600px"
        style="border: none; border-radius: 10px;">
    </iframe>
</div>
```

### 링크 버튼 방식
```html
<div class="game-container">
    <h1>🍕 5단원: 분수 게임</h1>
    
    <div style="text-align: center; padding: 60px 20px;">
        <h2 style="color: #E91E63; margin-bottom: 30px;">
            분수 학습 게임
        </h2>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">
            재미있는 분수 게임으로 이동합니다!
        </p>
        <a href="https://외부게임주소.com/game" 
           target="_blank"
           style="display: inline-block; background: linear-gradient(135deg, #E91E63 0%, #F06292 100%); 
                  color: white; padding: 20px 50px; border-radius: 50px; 
                  text-decoration: none; font-size: 1.2rem; font-weight: 700;">
            🎮 게임 시작하기
        </a>
    </div>
</div>
```

## 🧪 테스트 방법

### 방법 1: 게임 파일 직접 열기
1. `units/games/unit1-game.html` 파일을 브라우저로 드래그
2. 게임이 잘 작동하는지 확인

### 방법 2: 메인 페이지에서 확인
1. `index.html` 파일 열기
2. 원하는 단원 클릭
3. iframe으로 게임이 표시되는지 확인

## ✅ 체크리스트

게임 추가 전 확인사항:

- [ ] 게임 코드가 완성되었나요?
- [ ] HTML, CSS, JavaScript가 모두 포함되어 있나요?
- [ ] 브라우저에서 단독 실행 시 잘 작동하나요?
- [ ] 모바일에서도 잘 보이나요?
- [ ] 한글이 깨지지 않나요? (UTF-8 확인)

## 🔗 외부 라이브러리 추가

필요한 경우 `<head>` 태그 안에 추가:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게임 제목</title>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    
    <!-- 한글 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
    
    <!-- jQuery (필요시) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <style>
        /* 게임 스타일 */
    </style>
</head>
```

## 🎯 추천 개발 순서

1. **5단원(분수)** 부터 시작 - 외부 링크 연결 예정
2. **6단원(그림그래프)** - 시각적이라 재미있음
3. **1단원(곱셈)** - 기본적인 퀴즈 형식
4. **2단원(나눗셈)** - 곱셈과 유사
5. **3단원(원)** - Canvas 활용
6. **4단원(들이와 무게)** - 시뮬레이션

## 🚨 주의사항

1. **파일 경로**: 상대 경로 사용 (`../../images/logo.png`)
2. **이미지**: 외부 URL 또는 base64 사용 (큰 파일 주의)
3. **CORS**: 외부 API 사용 시 CORS 정책 확인
4. **성능**: 너무 무거운 게임은 피하기
5. **접근성**: 초등학생이 쉽게 이해할 수 있는 UI

## 📞 도움이 필요하신가요?

- 게임 코드 오류: nalrary@mensakorea.org
- 상세 가이드: `units/games/README.md` 참고

---

## 🎉 완성 후

모든 게임을 추가한 후:
1. 각 단원 페이지에서 게임이 잘 작동하는지 확인
2. 메인 페이지에서 모든 링크가 작동하는지 테스트
3. **Publish 탭**에서 배포!

즐거운 게임 개발 되세요! 🚀
