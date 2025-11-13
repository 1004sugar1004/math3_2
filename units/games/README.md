# 🎮 게임 파일 사용 가이드

이 폴더에는 각 단원별 게임 폴더가 있습니다. 각 폴더에 게임 파일들을 추가하면 됩니다.

## 📁 폴더 구조

```
units/games/
├── unit1/              # 1단원: 곱셈
│   ├── index.html     # 메인 HTML
│   ├── css/
│   │   └── style.css  # 게임 CSS
│   ├── js/
│   │   └── main.js    # 게임 JavaScript
│   └── images/        # 게임 이미지
│
├── unit2/              # 2단원: 나눗셈
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit3/              # 3단원: 원
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit4/              # 4단원: 들이와 무게
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── unit5/              # 5단원: 분수
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
└── unit6/              # 6단원: 그림그래프
    ├── index.html
    ├── css/
    ├── js/
    └── images/
```

## 🔧 게임 파일 추가 방법

### 방법 1: 전체 게임 폴더 복사 (가장 간단!)
완성된 게임 폴더가 있다면:
1. 게임 폴더의 모든 파일을 해당 단원 폴더에 복사
2. 예: 곱셈 게임 파일들 → `units/games/unit1/` 폴더에 복사
3. HTML, CSS, JS, 이미지 파일 모두 그대로 복사

### 방법 2: 파일별로 추가
각 폴더에는 이미 기본 구조가 있습니다. 필요한 파일만 추가하세요:

#### CSS 추가
```html
<style>
    /* 기존 스타일... */
    
    /* 여기에 게임 CSS 추가 */
    .your-game-class {
        /* 스타일 */
    }
</style>
```

#### HTML 수정
`units/games/unit1/index.html` 열기 → placeholder 부분 삭제 → 게임 HTML로 교체

#### CSS 추가
`units/games/unit1/css/style.css` 열기 → 게임 스타일 추가

#### JavaScript 추가  
`units/games/unit1/js/main.js` 열기 → 게임 로직 추가

#### 이미지 추가
`units/games/unit1/images/` 폴더에 이미지 파일 복사

### 방법 3: 여러 CSS/JS 파일 추가
게임에 여러 파일이 있다면:
```
units/games/unit1/
├── index.html
├── css/
│   ├── style.css      # 기본 파일
│   ├── game.css       # 추가 파일
│   └── animation.css  # 추가 파일
├── js/
│   ├── main.js        # 기본 파일
│   ├── game.js        # 추가 파일
│   └── utils.js       # 추가 파일
└── images/
    ├── bg.png
    ├── character.png
    └── ...
```

그리고 `index.html`에서 연결:
```html
<head>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/game.css">
    <link rel="stylesheet" href="css/animation.css">
</head>
<body>
    <!-- 게임 내용 -->
    
    <script src="js/main.js"></script>
    <script src="js/game.js"></script>
    <script src="js/utils.js"></script>
</body>
```

## 🎨 각 단원별 색상 테마

게임 디자인 시 참고하세요:

- **1단원 (곱셈)**: `#667eea` ~ `#764ba2` (보라-파랑)
- **2단원 (나눗셈)**: `#4ECDC4` ~ `#44A08D` (청록)
- **3단원 (원)**: `#F39C12` ~ `#F1C40F` (주황-노랑)
- **4단원 (들이와 무게)**: `#9B59B6` ~ `#8E44AD` (보라)
- **5단원 (분수)**: `#E91E63` ~ `#F06292` (핑크)
- **6단원 (그림그래프)**: `#3498DB` ~ `#2980B9` (파랑)

## 🔗 외부 라이브러리 사용

필요한 경우 CDN 링크를 추가할 수 있습니다:

```html
<head>
    <!-- Chart.js (그래프) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome (아이콘) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    
    <!-- 한글 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
</head>
```

## ✅ 테스트 방법

1. 해당 게임 파일(`unitX-game.html`)을 브라우저에서 직접 열어서 테스트
2. 또는 메인 페이지에서 해당 단원을 클릭해서 iframe으로 확인

## 💡 팁

- **반응형**: 모바일에서도 잘 보이도록 미디어 쿼리 사용
- **접근성**: 큰 버튼, 명확한 색상 대비
- **피드백**: 정답/오답 시 명확한 시각적, 청각적 피드백
- **재시작**: 게임 종료 후 다시 시작할 수 있는 버튼 제공

## 🚀 배포

게임 코드를 추가한 후:
1. 브라우저에서 테스트
2. 문제없으면 메인 페이지에서도 확인
3. Publish 탭에서 배포!

---

궁금한 점이 있으면 nalrary@mensakorea.org로 문의하세요! 😊
