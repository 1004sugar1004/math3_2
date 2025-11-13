// 게임 상태 관리
let gameState = {
    currentStep: 'start',
    orderData: {
        egg: { total: 3, order: 1, fraction: null },
        patty: { total: 4, order: 2, fraction: null },  // 4장의 1/2 = 2개
        cheese: { total: 6, order: 3, fraction: null },
        cabbage: { total: 8, order: 2, fraction: null }  // 8장의 1/4 = 2개
    },
    burgerStack: ['bottom-bun'], // 아래 빵부터 시작
    expectedOrder: ['egg', 'patty', 'cheese', 'cabbage', 'top-bun'], // 마지막은 위 빵
    currentIngredientIndex: 0,
    // 3단계용 상태
    step3Order: {},
    step3Stack: ['bottom-bun'],
    step3Index: 0
};

// 재료 한글 이름 매핑
const ingredientNames = {
    egg: '달걀부침',
    patty: '고기 패티',
    cheese: '치즈',
    cabbage: '양배추',
    'bottom-bun': '아래 빵',
    'top-bun': '위 빵'
};

// 재료 아이콘 매핑
const ingredientIcons = {
    egg: '🍳',
    patty: '🥩',
    cheese: '🧀',
    cabbage: '🥬',
    'bottom-bun': '🍞',
    'top-bun': '🍔'
};

// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 게임 시작
function startGame() {
    gameState.currentStep = 'step1';
    showScreen('step1Screen');
}

// 시작 화면으로
function showStartScreen() {
    gameState.currentStep = 'start';
    showScreen('startScreen');
}

// 1단계 답안 체크
function checkStep1Answer() {
    const inputs = document.querySelectorAll('.numerator');
    let allCorrect = true;
    let errorMessages = [];

    inputs.forEach(input => {
        const ingredient = input.getAttribute('data-ingredient');
        const numerator = parseInt(input.value);
        const expectedNumerator = gameState.orderData[ingredient].order;

        if (isNaN(numerator)) {
            allCorrect = false;
            errorMessages.push(`${ingredientNames[ingredient]}의 분수를 입력해주세요.`);
        } else if (numerator !== expectedNumerator) {
            allCorrect = false;
            errorMessages.push(`${ingredientNames[ingredient]}의 분수가 틀렸어요. (정답: ${expectedNumerator}/${gameState.orderData[ingredient].total})`);
        } else {
            gameState.orderData[ingredient].fraction = {
                numerator: numerator,
                denominator: gameState.orderData[ingredient].total
            };
        }
    });

    if (allCorrect) {
        showSuccessModal('1단계를 완료했어요! 이제 햄버거를 만들어볼까요?');
        setTimeout(() => {
            closeModal();
            goToStep2();
        }, 2000);
    } else {
        showErrorModal(errorMessages.join('<br>'));
    }
}

// 2단계로 이동
function goToStep2() {
    gameState.currentStep = 'step2';
    gameState.burgerStack = ['bottom-bun']; // 아래 빵부터 시작
    gameState.currentIngredientIndex = 0;
    
    // 주문서 요약 표시
    displayOrderSummary();
    
    // 다음 재료 표시
    updateNextIngredient();
    
    // 햄버거 렌더링
    renderBurger();
    updateOrderCountBoxes();
    
    showScreen('step2Screen');
}

// 주문서 요약 표시
function displayOrderSummary() {
    const tbody = document.getElementById('orderSummaryBody');
    tbody.innerHTML = '';

    for (const [key, data] of Object.entries(gameState.orderData)) {
        // 약분된 분수 계산
        let numerator = data.fraction.numerator;
        let denominator = data.fraction.denominator;
        
        // 고기 패티: 2/4 -> 1/2
        if (key === 'patty' && numerator === 2 && denominator === 4) {
            numerator = 1;
            denominator = 2;
        }
        // 양배추: 2/8 -> 1/4
        else if (key === 'cabbage' && numerator === 2 && denominator === 8) {
            numerator = 1;
            denominator = 4;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold;">${ingredientNames[key]}</td>
            <td>${data.total}개</td>
            <td>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
                    <span style="font-weight: bold;">${numerator}</span>
                    <div style="width: 30px; height: 2px; background: #333;"></div>
                    <span style="font-weight: bold;">${denominator}</span>
                </div>
            </td>
            <td>
                <div class="order-count-box" data-ingredient="${key}">
                    <span class="count-display">0</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    }
}

// 다음 재료 업데이트
function updateNextIngredient() {
    if (gameState.currentIngredientIndex < gameState.expectedOrder.length) {
        const nextIngredient = gameState.expectedOrder[gameState.currentIngredientIndex];
        document.getElementById('nextIngredient').textContent = ingredientNames[nextIngredient];
        document.getElementById('currentIngredientLabel').textContent = ingredientNames[nextIngredient];
    } else {
        document.getElementById('nextIngredient').textContent = '빵';
        document.getElementById('currentIngredientLabel').textContent = '빵';
    }
}

// 드래그 앤 드롭 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
    const paletteItems = document.querySelectorAll('.palette-item');
    const burgerPlate = document.querySelector('.burger-plate');

    paletteItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });

    if (burgerPlate) {
        burgerPlate.addEventListener('dragover', handleDragOver);
        burgerPlate.addEventListener('dragleave', handleDragLeave);
        burgerPlate.addEventListener('drop', handleDrop);
    }
});

let draggedType = null;

function handleDragStart(e) {
    draggedType = this.getAttribute('data-type');
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedType) {
        addIngredientToBurger(draggedType);
        draggedType = null;
    }
    
    // 모든 palette item의 opacity 복원
    document.querySelectorAll('.palette-item').forEach(item => {
        item.style.opacity = '1';
    });
}

// 햄버거에 재료 추가
function addIngredientToBurger(type) {
    // 현재 필요한 재료 확인
    const expectedIngredient = gameState.currentIngredientIndex < gameState.expectedOrder.length 
        ? gameState.expectedOrder[gameState.currentIngredientIndex]
        : null;

    // 재료가 맞는지 확인
    if (type !== expectedIngredient) {
        showErrorModal(`지금은 ${ingredientNames[expectedIngredient]}을(를) 올려야 해요!`);
        return;
    }

    // 각 재료별 필요한 개수 확인
    if (type !== 'top-bun' && type !== 'bottom-bun') {
        const currentCount = gameState.burgerStack.filter(item => item === type).length;
        const requiredCount = gameState.orderData[type].order;
        
        if (currentCount >= requiredCount) {
            showErrorModal(`${ingredientNames[type]}은(는) 이미 ${requiredCount}개를 다 올렸어요!`);
            return;
        }
    }

    // 재료 추가
    gameState.burgerStack.push(type);
    renderBurger();
    updateOrderCountBoxes(); // 주문서 네모칸 업데이트

    // 현재 재료가 모두 올려졌는지 확인
    if (type !== 'top-bun' && type !== 'bottom-bun') {
        const currentCount = gameState.burgerStack.filter(item => item === type).length;
        const requiredCount = gameState.orderData[type].order;
        
        if (currentCount >= requiredCount) {
            // 다음 재료로 이동
            gameState.currentIngredientIndex++;
            updateNextIngredient();
        }
    } else if (type === 'top-bun') {
        // 위 빵을 올리면 완성
        gameState.currentIngredientIndex++;
        updateNextIngredient();
        checkBurgerCompletion();
    }
}

// 주문서 네모칸 업데이트
function updateOrderCountBoxes() {
    for (const [key, data] of Object.entries(gameState.orderData)) {
        const currentCount = gameState.burgerStack.filter(item => item === key).length;
        const box = document.querySelector(`.order-count-box[data-ingredient="${key}"] .count-display`);
        if (box) {
            box.textContent = currentCount;
            const parentBox = box.parentElement;
            
            // 정답이면 초록색, 오답이면 빨간색
            if (currentCount === data.order) {
                parentBox.style.background = '#C8E6C9';
                parentBox.style.borderColor = '#66BB6A';
            } else if (currentCount > data.order) {
                parentBox.style.background = '#FFCDD2';
                parentBox.style.borderColor = '#EF5350';
            } else {
                parentBox.style.background = '#FFF9E6';
                parentBox.style.borderColor = '#FFB74D';
            }
        }
    }
}

// 햄버거 렌더링
function renderBurger() {
    const burgerStack = document.getElementById('burgerStack');
    burgerStack.innerHTML = '<div class="plate-bottom">🍽️</div>';

    // 햄버거 완성 여부 확인
    const isCompleted = gameState.burgerStack.includes('top-bun') && isAllIngredientsCorrect();

    if (isCompleted) {
        // 완성된 햄버거 표시
        const completedBurger = document.createElement('div');
        completedBurger.className = 'completed-burger';
        completedBurger.innerHTML = `
            <div class="completed-burger-icon">🍔</div>
            <div class="completed-text">완성!</div>
        `;
        burgerStack.appendChild(completedBurger);
    } else {
        // 재료 쌓기 (아래에서 위로)
        gameState.burgerStack.forEach((type, index) => {
            const layer = document.createElement('div');
            layer.className = `burger-layer ${type}`;
            layer.innerHTML = ''; // 텍스트 대신 배경 이미지 사용
            
            // 아래 빵은 제거할 수 없음
            if (type !== 'bottom-bun') {
                layer.onclick = function() {
                    if (confirm('이 재료를 제거하시겠어요?')) {
                        removeSpecificIngredient(type);
                    }
                };
                layer.style.cursor = 'pointer';
            } else {
                layer.style.cursor = 'default';
            }
            
            // 아래에서 위로 쌓기
            burgerStack.appendChild(layer);
        });
    }

    // instruction-text 업데이트
    const instructionText = document.querySelector('.instruction-text');
    if (gameState.burgerStack.length <= 1) {
        if (instructionText && !document.querySelector('.burger-plate').contains(instructionText)) {
            document.querySelector('.burger-plate').appendChild(instructionText);
        }
    } else {
        if (instructionText) {
            instructionText.remove();
        }
    }
}

// 모든 재료가 정확한지 확인
function isAllIngredientsCorrect() {
    for (const [key, data] of Object.entries(gameState.orderData)) {
        const count = gameState.burgerStack.filter(item => item === key).length;
        if (count !== data.order) {
            return false;
        }
    }
    return true;
}

// 특정 재료 제거 (클릭으로)
function removeSpecificIngredient(type) {
    if (type === 'bottom-bun') {
        showErrorModal('아래 빵은 제거할 수 없어요!');
        return;
    }
    
    const index = gameState.burgerStack.lastIndexOf(type);
    if (index > -1) {
        gameState.burgerStack.splice(index, 1);
        renderBurger();
        updateOrderCountBoxes(); // 주문서 네모칸 업데이트
        
        // 현재 재료 인덱스 재계산
        recalculateCurrentIngredient();
        updateNextIngredient();
    }
}

// 마지막 재료 제거
function removeLastIngredient() {
    if (gameState.burgerStack.length > 1) { // 아래 빵은 제거 불가
        const lastItem = gameState.burgerStack[gameState.burgerStack.length - 1];
        if (lastItem === 'bottom-bun') {
            showErrorModal('아래 빵은 제거할 수 없어요!');
            return;
        }
        gameState.burgerStack.pop();
        renderBurger();
        updateOrderCountBoxes(); // 주문서 네모칸 업데이트
        
        // 현재 재료 인덱스 재계산
        recalculateCurrentIngredient();
        updateNextIngredient();
    } else {
        showErrorModal('제거할 재료가 없어요!');
    }
}

// 현재 재료 인덱스 재계산
function recalculateCurrentIngredient() {
    gameState.currentIngredientIndex = 0;
    
    for (let i = 0; i < gameState.expectedOrder.length; i++) {
        const ingredient = gameState.expectedOrder[i];
        
        // 빵 종류는 개수 확인 제외
        if (ingredient === 'top-bun') {
            const hasTopBun = gameState.burgerStack.includes('top-bun');
            if (!hasTopBun) {
                gameState.currentIngredientIndex = i;
                return;
            }
        } else {
            const currentCount = gameState.burgerStack.filter(item => item === ingredient).length;
            const requiredCount = gameState.orderData[ingredient].order;
            
            if (currentCount < requiredCount) {
                gameState.currentIngredientIndex = i;
                return;
            }
        }
    }
    
    // 모든 재료가 다 올려졌으면
    gameState.currentIngredientIndex = gameState.expectedOrder.length;
}

// 햄버거 완성 확인
function checkBurgerCompletion() {
    // 위 빵이 있는지 확인
    const hasTopBun = gameState.burgerStack.includes('top-bun');
    if (!hasTopBun) return;

    // 모든 재료가 올바른 개수만큼 있는지 확인
    if (isAllIngredientsCorrect()) {
        // 햄버거 완성!
        setTimeout(() => {
            renderBurger(); // 완성된 햄버거 표시
            showSuccessModal('🎉 축하합니다! 햄버거를 완벽하게 만들었어요! 🍔');
        }, 500);
    }
}

// 햄버거 초기화
function resetBurger() {
    if (confirm('햄버거를 다시 만드시겠어요?')) {
        gameState.burgerStack = ['bottom-bun']; // 아래 빵부터 시작
        gameState.currentIngredientIndex = 0;
        renderBurger();
        updateOrderCountBoxes(); // 주문서 네모칸 업데이트
        updateNextIngredient();
    }
}

// 햄버거 확인
function checkBurger() {
    // 위 빵이 있는지 확인
    const hasTopBun = gameState.burgerStack.includes('top-bun');
    if (!hasTopBun) {
        showErrorModal('햄버거를 완성하려면 위에 빵을 올려주세요!');
        return;
    }

    // 각 재료별 개수 확인
    let errors = [];
    
    for (const [key, data] of Object.entries(gameState.orderData)) {
        const count = gameState.burgerStack.filter(item => item === key).length;
        if (count < data.order) {
            errors.push(`${ingredientNames[key]}이(가) ${data.order - count}개 부족해요!`);
        } else if (count > data.order) {
            errors.push(`${ingredientNames[key]}이(가) ${count - data.order}개 많아요!`);
        }
    }

    if (errors.length > 0) {
        showErrorModal(errors.join('<br>'));
    } else {
        renderBurger(); // 완성된 햄버거 표시
        showSuccessModal('🎉 완벽해요! 햄버거를 정확하게 만들었어요! 🍔<br><br>주문서에 적힌 대로 재료를 정확히 사용했어요!');
    }
}

// 성공 모달 표시
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    const nextButton = document.getElementById('nextStepButton');
    messageElement.innerHTML = message;
    
    // 2단계 완료 시 다음 단계 버튼 표시
    if (gameState.currentStep === 'step2') {
        nextButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'none';
    }
    
    modal.classList.add('active');
}

// 다음 단계로 이동
function goToNextStep() {
    closeModal();
    if (gameState.currentStep === 'step2') {
        goToStep3();
    }
}

// 오류 모달 표시
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorMessage');
    messageElement.innerHTML = message;
    modal.classList.add('active');
}

// 모달 닫기
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// 모달 외부 클릭시 닫기
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
}

// 키보드 이벤트 (ESC로 모달 닫기)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ============ 3단계: 도전 모드 ============

// 3단계로 이동
function goToStep3() {
    gameState.currentStep = 'step3';
    generateNewOrder();
    showScreen('step3Screen');
}

// 랜덤 주문서 생성
function generateNewOrder() {
    // 각 재료별로 랜덤 개수 생성
    const orderData = {
        egg: { total: 3, order: Math.floor(Math.random() * 3) + 1 },      // 1~3개
        patty: { total: 4, order: Math.floor(Math.random() * 4) + 1 },    // 1~4개
        cheese: { total: 6, order: Math.floor(Math.random() * 6) + 1 },   // 1~6개
        cabbage: { total: 8, order: Math.floor(Math.random() * 8) + 1 }   // 1~8개
    };
    
    gameState.step3Order = orderData;
    gameState.step3Stack = ['bottom-bun'];
    gameState.step3Index = 0;
    
    // 주문서 표시
    displayRandomOrder();
    
    // 햄버거 초기화
    renderBurgerStep3();
    updateNextIngredientStep3();
    
    // 드래그 이벤트 설정
    setupStep3DragEvents();
}

// 3단계 드래그 이벤트 설정
function setupStep3DragEvents() {
    const paletteItems = document.querySelectorAll('#ingredientsPalette3 .palette-item');
    const burgerPlate = document.querySelector('#burgerStack3').parentElement;
    
    paletteItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedType = this.getAttribute('data-type');
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
        });
    });
    
    if (burgerPlate) {
        burgerPlate.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        burgerPlate.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        burgerPlate.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedType) {
                addIngredientStep3(draggedType);
                draggedType = null;
            }
        });
    }
}

// 랜덤 주문서 표시
function displayRandomOrder() {
    const tbody = document.getElementById('randomOrderBody');
    tbody.innerHTML = '';
    
    const ingredients = [
        { key: 'egg', name: '달걀부침' },
        { key: 'patty', name: '고기 패티' },
        { key: 'cheese', name: '치즈' },
        { key: 'cabbage', name: '양배추' }
    ];
    
    ingredients.forEach(ing => {
        const data = gameState.step3Order[ing.key];
        
        // 재료 아이콘 생성
        let iconsHtml = '';
        for (let i = 0; i < data.total; i++) {
            iconsHtml += `<span class="mini-food-icon ${ing.key}"></span>`;
        }
        
        // 약분된 분수 계산
        let numerator = data.order;
        let denominator = data.total;
        
        // 최대공약수 계산 함수
        function gcd(a, b) {
            return b === 0 ? a : gcd(b, a % b);
        }
        
        // 약분
        const divisor = gcd(numerator, denominator);
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${ing.name}</div>
                <div class="mini-food-container">${iconsHtml}</div>
            </td>
            <td>
                <div class="fraction-display">
                    <span class="fraction-text">${data.total}장의 
                        <span class="fraction-highlight">
                            <span class="fraction-numerator">${simplifiedNumerator}</span>
                            <div class="fraction-line"></div>
                            <span class="fraction-denominator">${simplifiedDenominator}</span>
                        </span>
                    </span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 3단계 햄버거 렌더링
function renderBurgerStep3() {
    const burgerStack = document.getElementById('burgerStack3');
    burgerStack.innerHTML = '<div class="plate-bottom">🍽️</div>';
    
    // 햄버거 완성 여부 확인
    const isCompleted = gameState.step3Stack.includes('top-bun') && isAllIngredientsCorrectStep3();
    
    if (isCompleted) {
        // 완성된 햄버거 표시
        const completedBurger = document.createElement('div');
        completedBurger.className = 'completed-burger';
        completedBurger.innerHTML = `
            <div class="completed-burger-icon">🍔</div>
            <div class="completed-text">완성!</div>
        `;
        burgerStack.appendChild(completedBurger);
    } else {
        // 재료 쌓기 (아래에서 위로)
        gameState.step3Stack.forEach((type, index) => {
            const layer = document.createElement('div');
            layer.className = `burger-layer ${type}`;
            layer.innerHTML = '';
            
            // 아래 빵은 제거할 수 없음
            if (type !== 'bottom-bun') {
                layer.onclick = function() {
                    if (confirm('이 재료를 제거하시겠어요?')) {
                        removeSpecificIngredientStep3(type);
                    }
                };
                layer.style.cursor = 'pointer';
            } else {
                layer.style.cursor = 'default';
            }
            
            burgerStack.appendChild(layer);
        });
    }
    
    // instruction-text 업데이트
    const instructionText = document.querySelector('#burgerStack3 ~ .instruction-text');
    if (gameState.step3Stack.length <= 1) {
        if (instructionText && !document.querySelector('#burgerStack3').parentElement.contains(instructionText)) {
            const plate = document.querySelector('#burgerStack3').parentElement;
            if (plate && !plate.querySelector('.instruction-text')) {
                const newText = document.createElement('p');
                newText.className = 'instruction-text';
                newText.textContent = '이곳에 재료를 쌓아주세요';
                plate.appendChild(newText);
            }
        }
    } else {
        if (instructionText) {
            instructionText.remove();
        }
    }
}

// 3단계 재료 추가
function addIngredientStep3(type) {
    // 순서 확인 안함 - 자유롭게 추가 가능
    gameState.step3Stack.push(type);
    renderBurgerStep3();
    updateNextIngredientStep3();
    
    // 위 빵을 올리면 완성 확인
    if (type === 'top-bun') {
        checkBurgerCompletionStep3();
    }
}

// 3단계 다음 재료 업데이트
function updateNextIngredientStep3() {
    const label = document.getElementById('currentIngredientLabel3');
    if (!label) return;
    
    // 아직 안 올린 재료 찾기
    const needed = [];
    for (const [key, data] of Object.entries(gameState.step3Order)) {
        const currentCount = gameState.step3Stack.filter(item => item === key).length;
        if (currentCount < data.order) {
            needed.push(ingredientNames[key]);
        }
    }
    
    if (needed.length > 0) {
        label.textContent = needed.join(', ');
    } else if (!gameState.step3Stack.includes('top-bun')) {
        label.textContent = '위 빵';
    } else {
        label.textContent = '완성!';
    }
}

// 3단계 재료 제거
function removeSpecificIngredientStep3(type) {
    if (type === 'bottom-bun') {
        showErrorModal('아래 빵은 제거할 수 없어요!');
        return;
    }
    
    const index = gameState.step3Stack.lastIndexOf(type);
    if (index > -1) {
        gameState.step3Stack.splice(index, 1);
        renderBurgerStep3();
        updateNextIngredientStep3();
    }
}

// 3단계 마지막 재료 제거
function removeLastIngredientStep3() {
    if (gameState.step3Stack.length > 1) {
        const lastItem = gameState.step3Stack[gameState.step3Stack.length - 1];
        if (lastItem === 'bottom-bun') {
            showErrorModal('아래 빵은 제거할 수 없어요!');
            return;
        }
        gameState.step3Stack.pop();
        renderBurgerStep3();
        updateNextIngredientStep3();
    } else {
        showErrorModal('제거할 재료가 없어요!');
    }
}

// 3단계 햄버거 초기화
function resetBurgerStep3() {
    if (confirm('햄버거를 다시 만드시겠어요?')) {
        gameState.step3Stack = ['bottom-bun'];
        renderBurgerStep3();
        updateNextIngredientStep3();
    }
}

// 3단계 모든 재료 정확한지 확인
function isAllIngredientsCorrectStep3() {
    for (const [key, data] of Object.entries(gameState.step3Order)) {
        const count = gameState.step3Stack.filter(item => item === key).length;
        if (count !== data.order) {
            return false;
        }
    }
    return true;
}

// 3단계 햄버거 완성 확인
function checkBurgerCompletionStep3() {
    const hasTopBun = gameState.step3Stack.includes('top-bun');
    if (!hasTopBun) return;
    
    if (isAllIngredientsCorrectStep3()) {
        setTimeout(() => {
            renderBurgerStep3();
            showSuccessModal('🎉 정확해요! 주문서대로 완벽하게 만들었어요! 🍔');
        }, 500);
    }
}

// 3단계 햄버거 확인
function checkBurgerStep3() {
    const hasTopBun = gameState.step3Stack.includes('top-bun');
    if (!hasTopBun) {
        showErrorModal('햄버거를 완성하려면 위에 빵을 올려주세요!');
        return;
    }
    
    let errors = [];
    
    for (const [key, data] of Object.entries(gameState.step3Order)) {
        const count = gameState.step3Stack.filter(item => item === key).length;
        if (count < data.order) {
            errors.push(`${ingredientNames[key]}이(가) ${data.order - count}개 부족해요!`);
        } else if (count > data.order) {
            errors.push(`${ingredientNames[key]}이(가) ${count - data.order}개 많아요!`);
        }
    }
    
    if (errors.length > 0) {
        showErrorModal(errors.join('<br>'));
    } else {
        renderBurgerStep3();
        showSuccessModal('🎉 완벽해요! 주문서대로 정확하게 만들었어요! 🍔<br><br>"새로운 주문서" 버튼을 눌러 계속 도전하세요!');
    }
}