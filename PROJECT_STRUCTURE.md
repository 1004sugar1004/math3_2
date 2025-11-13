# 📁 프로젝트 전체 구조

## 🌳 파일 트리

```
수학-놀이에-풍덩/
│
├── 📄 index.html                    # 메인 페이지 (6개 단원 카드)
├── 📄 README.md                     # 프로젝트 설명서
├── 📄 GAME_SETUP_GUIDE.md          # 게임 추가 완벽 가이드
├── 📄 PROJECT_STRUCTURE.md         # 이 파일
│
├── 📁 css/
│   ├── style.css                   # 메인 페이지 스타일
│   └── unit.css                    # 단원 페이지 + iframe 스타일
│
├── 📁 js/
│   └── main.js                     # 네비게이션 및 인터랙션
│
└── 📁 units/
    ├── unit1.html                  # 1단원 페이지 (곱셈)
    ├── unit2.html                  # 2단원 페이지 (나눗셈)
    ├── unit3.html                  # 3단원 페이지 (원)
    ├── unit4.html                  # 4단원 페이지 (들이와 무게)
    ├── unit5.html                  # 5단원 페이지 (분수)
    ├── unit6.html                  # 6단원 페이지 (그림그래프)
    │
    └── 📁 games/                    # 🎮 게임 폴더
        ├── README.md               # 게임 폴더 가이드
        │
        ├── 📁 unit1/                # 1단원 곱셈 게임
        │   ├── index.html          # 게임 메인 HTML
        │   ├── 📁 css/
        │   │   └── style.css       # 게임 스타일
        │   ├── 📁 js/
        │   │   └── main.js         # 게임 로직
        │   └── 📁 images/          # 게임 이미지
        │       └── .gitkeep
        │
        ├── 📁 unit2/                # 2단원 나눗셈 게임
        │   ├── index.html
        │   ├── 📁 css/
        │   │   └── style.css
        │   ├── 📁 js/
        │   │   └── main.js
        │   └── 📁 images/
        │
        ├── 📁 unit3/                # 3단원 원 게임
        │   ├── index.html
        │   ├── 📁 css/
        │   │   └── style.css
        │   ├── 📁 js/
        │   │   └── main.js
        │   └── 📁 images/
        │
        ├── 📁 unit4/                # 4단원 들이와 무게 게임
        │   ├── index.html
        │   ├── 📁 css/
        │   │   └── style.css
        │   ├── 📁 js/
        │   │   └── main.js
        │   └── 📁 images/
        │
        ├── 📁 unit5/                # 5단원 분수 게임
        │   ├── index.html
        │   ├── 📁 css/
        │   │   └── style.css
        │   ├── 📁 js/
        │   │   └── main.js
        │   └── 📁 images/
        │
        └── 📁 unit6/                # 6단원 그림그래프 게임
            ├── index.html
            ├── 📁 css/
            │   └── style.css
            ├── 📁 js/
            │   └── main.js
            └── 📁 images/
```

---

## 🎯 각 파일의 역할

### 루트 파일들
| 파일 | 역할 | 수정 여부 |
|------|------|-----------|
| `index.html` | 메인 페이지, 6개 단원 카드 표시 | ✅ 완성 |
| `README.md` | 프로젝트 전체 설명 | ✅ 완성 |
| `GAME_SETUP_GUIDE.md` | 게임 추가 상세 가이드 | ✅ 완성 |
| `PROJECT_STRUCTURE.md` | 프로젝트 구조 설명 | ✅ 완성 |

### CSS 파일들
| 파일 | 역할 | 수정 여부 |
|------|------|-----------|
| `css/style.css` | 메인 페이지 디자인 | ✅ 완성 |
| `css/unit.css` | 단원 페이지 + iframe 스타일 | ✅ 완성 |

### JavaScript 파일들
| 파일 | 역할 | 수정 여부 |
|------|------|-----------|
| `js/main.js` | 페이지 전환, 애니메이션, 네비게이션 | ✅ 완성 |

### 단원 페이지들
| 파일 | 역할 | iframe 연결 |
|------|------|-------------|
| `units/unit1.html` | 1단원 곱셈 페이지 | → `games/unit1/index.html` |
| `units/unit2.html` | 2단원 나눗셈 페이지 | → `games/unit2/index.html` |
| `units/unit3.html` | 3단원 원 페이지 | → `games/unit3/index.html` |
| `units/unit4.html` | 4단원 들이와 무게 페이지 | → `games/unit4/index.html` |
| `units/unit5.html` | 5단원 분수 페이지 | → `games/unit5/index.html` |
| `units/unit6.html` | 6단원 그림그래프 페이지 | → `games/unit6/index.html` |

### 게임 폴더들
| 폴더 | 상태 | 추가할 파일 |
|------|------|-------------|
| `units/games/unit1/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |
| `units/games/unit2/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |
| `units/games/unit3/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |
| `units/games/unit4/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |
| `units/games/unit5/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |
| `units/games/unit6/` | 🟡 템플릿 준비됨 | HTML, CSS, JS, 이미지 |

---

## 📋 다음 할 일

### 1단계: 게임 파일 준비 ⏳
각 단원별로 완성된 게임 파일들을 준비합니다.

### 2단계: 파일 복사 ⏳
```bash
# 예시: 1단원 곱셈 게임 추가
units/games/unit1/
├── index.html       ← 게임 메인 파일
├── css/
│   ├── style.css    ← 기본 스타일
│   └── game.css     ← 추가 스타일
├── js/
│   ├── main.js      ← 메인 로직
│   └── utils.js     ← 유틸리티
└── images/
    ├── bg.png
    ├── icon1.png
    └── ...
```

### 3단계: 경로 확인 ⏳
`index.html`에서 파일 경로가 올바른지 확인:
```html
<link rel="stylesheet" href="css/style.css">
<script src="js/main.js"></script>
<img src="images/bg.png">
```

### 4단계: 테스트 ⏳
1. 게임 파일 직접 열기: `units/games/unit1/index.html`
2. 메인 페이지에서 테스트: `index.html` → 1단원 클릭

### 5단계: 배포 🚀
Publish 탭에서 한 번에 배포!

---

## 🎨 단원별 색상 테마

각 게임의 배경색이 자동으로 설정됩니다:

| 단원 | 색상 | 그라데이션 |
|------|------|------------|
| 1. 곱셈 | 보라-파랑 | `#667eea` → `#764ba2` |
| 2. 나눗셈 | 청록 | `#4ECDC4` → `#44A08D` |
| 3. 원 | 주황-노랑 | `#F39C12` → `#F1C40F` |
| 4. 들이와 무게 | 보라 | `#9B59B6` → `#8E44AD` |
| 5. 분수 | 핑크 | `#E91E63` → `#F06292` |
| 6. 그림그래프 | 파랑 | `#3498DB` → `#2980B9` |

---

## 💡 참고 문서

- **게임 추가 방법**: `GAME_SETUP_GUIDE.md`
- **게임 폴더 가이드**: `units/games/README.md`
- **프로젝트 개요**: `README.md`

---

## 📞 문의

오류 발견 시: nalrary@mensakorea.org

---

© 수학 놀이에 풍덩! - 즐겁게 배우는 수학
