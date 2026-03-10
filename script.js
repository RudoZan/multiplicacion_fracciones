// Estado de la aplicación
let state = {
    square1: {
        divisions: 1,
        selectedColumns: []
    },
    square2: {
        divisions: 1,
        selectedRows: []
    },
    showingResult: false
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeButtons();
    initializeSquares();
    initializeResultButton();
    updateSquare1();
    updateSquare2();
});

// Inicializar botones numéricos
function initializeButtons() {
    const buttons = document.querySelectorAll('.num-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const square = e.target.dataset.square;
            const value = parseInt(e.target.dataset.value);
            
            // Desactivar todos los botones del mismo cuadrado
            document.querySelectorAll(`.num-btn[data-square="${square}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activar el botón seleccionado
            e.target.classList.add('active');
            
            // Actualizar estado
            if (square === '1') {
                state.square1.divisions = value;
                state.square1.selectedColumns = [];
                updateSquare1();
            } else {
                state.square2.divisions = value;
                state.square2.selectedRows = [];
                updateSquare2();
            }
            
            // Si se cambia el número de divisiones y se está mostrando el resultado, ocultarlo
            if (state.showingResult) {
                hideResult();
            }
        });
    });
}

// Inicializar cuadrados
function initializeSquares() {
    const square1 = document.getElementById('square1');
    const square2 = document.getElementById('square2');
    
    square1.addEventListener('click', handleSquare1Click);
    square2.addEventListener('click', handleSquare2Click);
}

// Manejar clics en el primer cuadrado (columnas)
function handleSquare1Click(e) {
    const column = e.target.closest('.column');
    if (!column) return;
    
    const index = Array.from(column.parentElement.children).indexOf(column);
    
    if (state.square1.selectedColumns.includes(index)) {
        state.square1.selectedColumns = state.square1.selectedColumns.filter(i => i !== index);
    } else {
        state.square1.selectedColumns.push(index);
    }
    
    updateSquare1();
    
    // Si se está mostrando el resultado, actualizarlo en tiempo real
    if (state.showingResult) {
        updateResult();
    }
}

// Manejar clics en el segundo cuadrado (filas)
function handleSquare2Click(e) {
    const row = e.target.closest('.row');
    if (!row) return;
    
    const index = Array.from(row.parentElement.children).indexOf(row);
    
    if (state.square2.selectedRows.includes(index)) {
        state.square2.selectedRows = state.square2.selectedRows.filter(i => i !== index);
    } else {
        state.square2.selectedRows.push(index);
    }
    
    updateSquare2();
    
    // Si se está mostrando el resultado, actualizarlo en tiempo real
    if (state.showingResult) {
        updateResult();
    }
}

// Actualizar primer cuadrado (columnas)
function updateSquare1() {
    const square = document.getElementById('square1');
    square.innerHTML = '';
    square.className = 'square columns';
    
    const divisions = state.square1.divisions;
    
    for (let i = 0; i < divisions; i++) {
        const column = document.createElement('div');
        column.className = 'column';
        if (state.square1.selectedColumns.includes(i)) {
            column.classList.add('selected');
        }
        square.appendChild(column);
    }
}

// Actualizar segundo cuadrado (filas)
function updateSquare2() {
    const square = document.getElementById('square2');
    square.innerHTML = '';
    square.className = 'square rows';
    
    const divisions = state.square2.divisions;
    
    for (let i = 0; i < divisions; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        if (state.square2.selectedRows.includes(i)) {
            row.classList.add('selected');
        }
        square.appendChild(row);
    }
}

// Inicializar botón de resultado
function initializeResultButton() {
    const resultBtn = document.getElementById('showResult');
    resultBtn.addEventListener('click', showResult);
}

// Mostrar resultado
function showResult() {
    state.showingResult = true;
    const resultContainer = document.querySelector('.result-container');
    const resultBtn = document.getElementById('showResult');
    
    resultContainer.classList.add('showing-result');
    resultBtn.style.display = 'none';
    
    updateResult();
}

// Actualizar resultado
function updateResult() {
    const resultSquare = document.getElementById('resultSquare');
    resultSquare.innerHTML = '';
    resultSquare.className = 'square grid';
    resultSquare.classList.remove('hidden');
    
    const cols = state.square1.divisions;
    const rows = state.square2.divisions;
    
    resultSquare.style.setProperty('--cols', cols);
    resultSquare.style.setProperty('--rows', rows);
    
    // Crear celdas
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Marcar como seleccionada si la fila y columna correspondientes están seleccionadas
            if (state.square2.selectedRows.includes(row) && 
                state.square1.selectedColumns.includes(col)) {
                cell.classList.add('selected');
            }
            
            resultSquare.appendChild(cell);
        }
    }
}

// Ocultar resultado
function hideResult() {
    state.showingResult = false;
    const resultSquare = document.getElementById('resultSquare');
    const resultContainer = document.querySelector('.result-container');
    const resultBtn = document.getElementById('showResult');
    
    resultContainer.classList.remove('showing-result');
    resultSquare.classList.add('hidden');
    resultBtn.style.display = 'block';
}
