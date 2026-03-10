// Datos de los desafíos. type 'input' = editable es cuadro 1 o 2; type 'result' = editable es el cuadro resultado.
const challenges = [
    {
        type: 'input',
        square1: { divisions: 4, selectedColumns: [] },
        square2: { divisions: 3, selectedRows: [0, 2] },
        instruction: 'Selecciona las columnas correctas en el primer cuadrado',
        answer: { type: 'input', square: 1, selectedColumns: [0, 2] }
    },
    {
        type: 'input',
        square1: { divisions: 2, selectedColumns: [0] },
        square2: { divisions: 4, selectedRows: [] },
        instruction: 'Selecciona las filas correctas en el segundo cuadrado',
        answer: { type: 'input', square: 2, selectedRows: [1, 3] }
    },
    {
        type: 'result',
        square1: { divisions: 2, selectedColumns: [0] },
        square2: { divisions: 3, selectedRows: [0, 1] },
        instruction: 'Marca en el cuadro resultado las celdas que corresponden al producto.',
        answer: { type: 'result', selectedCells: [0, 1, 2, 3] }
    },
    {
        type: 'input',
        square1: { divisions: 5, selectedColumns: [] },
        square2: { divisions: 2, selectedRows: [0] },
        instruction: 'Selecciona las columnas correctas en el primer cuadrado',
        answer: { type: 'input', square: 1, selectedColumns: [1, 3] }
    },
    {
        type: 'result',
        square1: { divisions: 3, selectedColumns: [1, 2] },
        square2: { divisions: 2, selectedRows: [0] },
        instruction: 'Marca en el cuadro resultado las celdas que corresponden al producto.',
        answer: { type: 'result', selectedCells: [3, 4] }
    },
    {
        type: 'input',
        square1: { divisions: 6, selectedColumns: [2, 4] },
        square2: { divisions: 3, selectedRows: [] },
        instruction: 'Selecciona las filas correctas en el segundo cuadrado',
        answer: { type: 'input', square: 2, selectedRows: [0, 2] }
    },
    {
        type: 'input',
        square1: { divisions: 3, selectedColumns: [] },
        square2: { divisions: 5, selectedRows: [1, 3, 4] },
        instruction: 'Selecciona las columnas correctas en el primer cuadrado',
        answer: { type: 'input', square: 1, selectedColumns: [0, 2] }
    },
    {
        type: 'result',
        square1: { divisions: 4, selectedColumns: [0, 1, 3] },
        square2: { divisions: 3, selectedRows: [1, 2] },
        instruction: 'Marca en el cuadro resultado las celdas que corresponden al producto.',
        answer: { type: 'result', selectedCells: [4, 5, 7, 8, 12, 13, 15, 16] }
    }
];

// Estado del desafío actual
let currentChallengeIndex = 0;
let userAnswer = {
    square1Columns: [],
    square2Rows: [],
    resultCells: []
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('totalChallenges').textContent = challenges.length;
    initializeChallengeButtons();
    initializeChallengeSquares();
    initializeInstructionsModal();
    loadChallenge(0);
});

// Modal de instrucciones (qué hay que hacer en Desafíos)
function initializeInstructionsModal() {
    const infoBtn = document.getElementById('infoBtnDesafios');
    const modal = document.getElementById('instructionsModalDesafios');
    const closeBtn = document.getElementById('closeModalDesafios');
    if (!infoBtn || !modal || !closeBtn) return;
    infoBtn.addEventListener('click', () => modal.classList.add('show'));
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) modal.classList.remove('show');
    });
}

// Inicializar botones de desafío (numerados 1-8 y botón "Siguiente desafío" al acertar)
function initializeChallengeButtons() {
    const checkBtn = document.getElementById('checkAnswer');
    const navContainer = document.getElementById('challengeNavNumbers');
    const nextAfterCorrectBtn = document.getElementById('nextAfterCorrect');
    
    checkBtn.addEventListener('click', checkAnswer);
    
    for (let i = 0; i < challenges.length; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'challenge-nav-num-btn' + (i === 0 ? ' active' : '');
        btn.textContent = i + 1;
        btn.dataset.index = i;
        btn.setAttribute('aria-label', 'Desafío ' + (i + 1));
        btn.addEventListener('click', () => loadChallenge(i));
        navContainer.appendChild(btn);
    }
    
    if (nextAfterCorrectBtn) {
        nextAfterCorrectBtn.addEventListener('click', () => {
            if (currentChallengeIndex < challenges.length - 1) {
                loadChallenge(currentChallengeIndex + 1);
                nextAfterCorrectBtn.style.display = 'none';
            }
        });
    }
}

// Inicializar cuadrados del desafío
function initializeChallengeSquares() {
    const square1 = document.getElementById('challengeSquare1');
    const square2 = document.getElementById('challengeSquare2');
    const resultWrapper = document.querySelector('.challenge-result-wrapper');
    
    square1.addEventListener('click', handleChallengeSquare1Click);
    square2.addEventListener('click', handleChallengeSquare2Click);
    if (resultWrapper) {
        resultWrapper.addEventListener('click', handleChallengeResultGridClick);
    }
}

// Cargar desafío
function loadChallenge(index) {
    if (index < 0 || index >= challenges.length) return;
    
    currentChallengeIndex = index;
    const challenge = challenges[index];
    
    const nextAfterCorrectBtn = document.getElementById('nextAfterCorrect');
    if (nextAfterCorrectBtn) nextAfterCorrectBtn.style.display = 'none';
    
    // Actualizar contador
    document.getElementById('currentChallenge').textContent = index + 1;
    
    // Actualizar botones numerados (marcar el activo)
    document.querySelectorAll('.challenge-nav-num-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Limpiar feedback
    document.getElementById('challengeFeedback').textContent = '';
    document.getElementById('challengeFeedback').className = 'challenge-feedback';
    
    // Actualizar instrucción
    document.getElementById('challengeInstruction').textContent = challenge.instruction;
    
    // Resetear respuesta del usuario
    userAnswer = {
        square1Columns: [],
        square2Rows: [],
        resultCells: []
    };
    
    // Configurar cuadrados según el desafío
    setupChallengeSquares(challenge);
}

// Configurar cuadrados del desafío
function setupChallengeSquares(challenge) {
    // Primer cuadrado
    const square1Divisions = challenge.square1.divisions;
    const square1Selected = challenge.square1.selectedColumns;
    
    updateChallengeSquare1(square1Divisions);
    challenge.square1.selectedColumns.forEach(col => {
        userAnswer.square1Columns.push(col);
    });
    
    // Segundo cuadrado
    const square2Divisions = challenge.square2.divisions;
    const square2Selected = challenge.square2.selectedRows;
    
    updateChallengeSquare2(square2Divisions);
    challenge.square2.selectedRows.forEach(row => {
        userAnswer.square2Rows.push(row);
    });
    
    // Tercer cuadro: resultado (siempre visible)
    updateChallengeResult(square1Divisions, square2Divisions);
    
    // Si el tipo es 'input': el cuadro editable inicia con las zonas deseleccionadas
    if (challenge.type === 'input') {
        if (challenge.answer.square === 1) {
            userAnswer.square1Columns = [];
            updateChallengeSquare1(square1Divisions);
        } else {
            userAnswer.square2Rows = [];
            updateChallengeSquare2(square2Divisions);
        }
    }
    triggerEditableFrameBlink();
}

function triggerEditableFrameBlink() {
    const challenge = challenges[currentChallengeIndex];
    let editable = null;
    if (challenge.type === 'result') {
        editable = document.getElementById('challengeResultSquare');
    } else {
        const square1 = document.getElementById('challengeSquare1');
        const square2 = document.getElementById('challengeSquare2');
        editable = square1 && square1.classList.contains('challenge-square-editable') ? square1 : (square2 && square2.classList.contains('challenge-square-editable') ? square2 : null);
    }
    if (!editable) return;
    editable.classList.remove('challenge-frame-blink');
    editable.offsetHeight;
    editable.classList.add('challenge-frame-blink');
    editable.addEventListener('animationend', () => editable.classList.remove('challenge-frame-blink'), { once: true });
}

// Actualizar primer cuadrado del desafío
function updateChallengeSquare1(divisions) {
    const square = document.getElementById('challengeSquare1');
    square.innerHTML = '';
    const challenge = challenges[currentChallengeIndex];
    const isEditable = challenge.type === 'input' && challenge.answer.square === 1;
    square.className = 'square columns' + (isEditable ? ' challenge-square-editable' : ' challenge-square-fixed');
    square.style.width = '170px';
    square.style.height = '170px';
    square.style.display = 'flex';
    
    const selected = isEditable ? userAnswer.square1Columns : challenge.square1.selectedColumns;
    
    for (let i = 0; i < divisions; i++) {
        const column = document.createElement('div');
        column.className = 'column';
        if (selected.includes(i)) {
            column.classList.add('selected');
        }
        square.appendChild(column);
    }
    
    updateChallengeSelectionText1();
}

// Actualizar segundo cuadrado del desafío
function updateChallengeSquare2(divisions) {
    const square = document.getElementById('challengeSquare2');
    square.innerHTML = '';
    const challenge = challenges[currentChallengeIndex];
    const isEditable = challenge.type === 'input' && challenge.answer.square === 2;
    square.className = 'square rows' + (isEditable ? ' challenge-square-editable' : ' challenge-square-fixed');
    square.style.width = '170px';
    square.style.height = '170px';
    square.style.display = 'flex';
    
    const selected = isEditable ? userAnswer.square2Rows : challenge.square2.selectedRows;
    
    for (let i = 0; i < divisions; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        if (selected.includes(i)) {
            row.classList.add('selected');
        }
        square.appendChild(row);
    }
    
    updateChallengeSelectionText2();
}

// Manejar clics en el primer cuadrado
function handleChallengeSquare1Click(e) {
    const challenge = challenges[currentChallengeIndex];
    if (challenge.type !== 'input' || challenge.answer.square !== 1) return;
    
    const column = e.target.closest('.column');
    if (!column) return;
    
    const index = Array.from(column.parentElement.children).indexOf(column);
    
    if (userAnswer.square1Columns.includes(index)) {
        userAnswer.square1Columns = userAnswer.square1Columns.filter(i => i !== index);
    } else {
        userAnswer.square1Columns.push(index);
    }
    
    clearChallengeFeedback();
    updateChallengeSquare1(challenge.square1.divisions);
}

// Manejar clics en el segundo cuadrado
function handleChallengeSquare2Click(e) {
    const challenge = challenges[currentChallengeIndex];
    if (challenge.type !== 'input' || challenge.answer.square !== 2) return;
    
    const row = e.target.closest('.row');
    if (!row) return;
    
    const index = Array.from(row.parentElement.children).indexOf(row);
    
    if (userAnswer.square2Rows.includes(index)) {
        userAnswer.square2Rows = userAnswer.square2Rows.filter(i => i !== index);
    } else {
        userAnswer.square2Rows.push(index);
    }
    
    clearChallengeFeedback();
    updateChallengeSquare2(challenge.square2.divisions);
}

function clearChallengeFeedback() {
    const feedback = document.getElementById('challengeFeedback');
    feedback.textContent = '';
    feedback.className = 'challenge-feedback';
}

// Actualizar tercer cuadro (resultado). Si type 'result' es editable (el usuario marca celdas); si type 'input' es fijo (muestra la respuesta correcta).
function updateChallengeResult(cols, rows) {
    const grid = document.getElementById('challengeResultSquare');
    const wrapper = grid && grid.closest('.challenge-result-wrapper');
    if (!grid) return;
    
    grid.innerHTML = '';
    grid.style.setProperty('--cols', cols);
    grid.style.setProperty('--rows', rows);
    
    const challenge = challenges[currentChallengeIndex];
    const isResultEditable = challenge.type === 'result';
    
    if (wrapper) {
        wrapper.classList.toggle('challenge-result-editable', isResultEditable);
    }
    grid.style.pointerEvents = isResultEditable ? 'auto' : 'none';
    grid.classList.toggle('challenge-result-grid-editable', isResultEditable);
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'challenge-result-cell';
            const cellIndex = row * cols + col;
            cell.dataset.cellIndex = cellIndex;
            if (col === cols - 1) cell.classList.add('cell-last-col');
            if (row === rows - 1) cell.classList.add('cell-last-row');
            if (isResultEditable) {
                if (userAnswer.resultCells.includes(cellIndex)) {
                    cell.classList.add('challenge-result-cell-marked');
                }
            } else {
                const selectedCols = challenge.answer.square === 1 ? challenge.answer.selectedColumns : challenge.square1.selectedColumns;
                const selectedRows = challenge.answer.square === 2 ? challenge.answer.selectedRows : challenge.square2.selectedRows;
                if (selectedCols.includes(col) && selectedRows.includes(row)) {
                    cell.classList.add('challenge-result-cell-marked');
                }
            }
            grid.appendChild(cell);
        }
    }
    
    const resultLabel = document.getElementById('challengeResultSelection');
    if (resultLabel) {
        const total = cols * rows;
        let marked;
        if (isResultEditable) {
            marked = userAnswer.resultCells.length;
        } else {
            const sc = challenge.answer.square === 1 ? challenge.answer.selectedColumns : challenge.square1.selectedColumns;
            const sr = challenge.answer.square === 2 ? challenge.answer.selectedRows : challenge.square2.selectedRows;
            marked = sc.length * sr.length;
        }
        resultLabel.textContent = `Marcado ${marked} de ${total}`;
    }
    
}

function handleChallengeResultGridClick(e) {
    const cell = e.target.closest('.challenge-result-cell');
    if (!cell || !cell.dataset.cellIndex) return;
    const challenge = challenges[currentChallengeIndex];
    if (challenge.type !== 'result') return;
    e.stopPropagation();
    const index = parseInt(cell.dataset.cellIndex, 10);
    if (userAnswer.resultCells.includes(index)) {
        userAnswer.resultCells = userAnswer.resultCells.filter(i => i !== index);
    } else {
        userAnswer.resultCells.push(index);
    }
    clearChallengeFeedback();
    updateChallengeResult(challenge.square1.divisions, challenge.square2.divisions);
}

// Actualizar textos: ambos muestran "Marcado X de Y"
function updateChallengeSelectionText1() {
    const challenge = challenges[currentChallengeIndex];
    const isEditable = challenge.type === 'input' && challenge.answer.square === 1;
    const selected = isEditable ? userAnswer.square1Columns.length : challenge.square1.selectedColumns.length;
    const total = challenge.square1.divisions;
    document.getElementById('challengeSelection1').textContent = `Marcado ${selected} de ${total}`;
}

function updateChallengeSelectionText2() {
    const challenge = challenges[currentChallengeIndex];
    const isEditable = challenge.type === 'input' && challenge.answer.square === 2;
    const selected = isEditable ? userAnswer.square2Rows.length : challenge.square2.selectedRows.length;
    const total = challenge.square2.divisions;
    document.getElementById('challengeSelection2').textContent = `Marcado ${selected} de ${total}`;
}

// Verificar respuesta
function checkAnswer() {
    const challenge = challenges[currentChallengeIndex];
    const feedback = document.getElementById('challengeFeedback');
    
    let isCorrect = false;
    if (challenge.type === 'result') {
        const cols = challenge.square1.divisions;
        const rows = challenge.square2.divisions;
        const selectedCols = challenge.square1.selectedColumns;
        const selectedRows = challenge.square2.selectedRows;
        const correctCells = [];
        for (const r of selectedRows) {
            for (const c of selectedCols) {
                correctCells.push(r * cols + c);
            }
        }
        const correct = correctCells.sort((a, b) => a - b);
        const user = [...userAnswer.resultCells].sort((a, b) => a - b);
        isCorrect = correct.length === user.length && correct.every((val, idx) => val === user[idx]);
    } else if (challenge.answer.square === 1) {
        const correct = [...challenge.answer.selectedColumns].sort((a, b) => a - b);
        const user = [...userAnswer.square1Columns].sort((a, b) => a - b);
        isCorrect = correct.length === user.length && 
                   correct.every((val, idx) => val === user[idx]);
    } else {
        const correct = [...challenge.answer.selectedRows].sort((a, b) => a - b);
        const user = [...userAnswer.square2Rows].sort((a, b) => a - b);
        isCorrect = correct.length === user.length && 
                   correct.every((val, idx) => val === user[idx]);
    }
    
    if (isCorrect) {
        feedback.textContent = 'Correcto.';
        feedback.className = 'challenge-feedback correct';
        const nextAfterCorrectBtn = document.getElementById('nextAfterCorrect');
        if (nextAfterCorrectBtn && currentChallengeIndex < challenges.length - 1) {
            nextAfterCorrectBtn.style.display = 'inline-flex';
        }
    } else {
        feedback.textContent = 'Incorrecto. Revisa e intenta de nuevo.';
        feedback.className = 'challenge-feedback incorrect';
        const nextAfterCorrectBtn = document.getElementById('nextAfterCorrect');
        if (nextAfterCorrectBtn) nextAfterCorrectBtn.style.display = 'none';
    }
}
