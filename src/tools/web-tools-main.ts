import '../../web-tools/style.css'
import { generateMatrixMultiplicationMultiple } from './matrix-generator';


type HTMLMatrixData = { matrixContainer: HTMLDivElement; rowContainers: HTMLDivElement[]; };

const matrixCountInput = document.querySelector<HTMLInputElement>('#matrix-count')!;
const matricesContainer = document.querySelector<HTMLDivElement>('#matrices-container')!;

const generateMatrixButton = document.querySelector<HTMLButtonElement>('#generate-matrix')!;
const resultsContainer = document.querySelector<HTMLDivElement>('#results-container')!;

matrixCountInput.addEventListener('input', onMatrixCountChange);
function onMatrixCountChange() {
    const matrixCount = parseInt(matrixCountInput.value);
    const difference = matrixCount - matricesContainer.children.length;

    if (difference > 0) {
        for (let count = 0; count < difference; count++) {
            prepareNewMatrix();
        }
    } else {
        for (let count = 0; count < Math.abs(difference); count++) {
            matricesContainer.lastChild?.remove();
        }
    }
}

function prepareNewMatrix() {
    const htmlMatrixData = generateMatrixHtml(3, 3, "input", "matrix-input");
    
    htmlMatrixData.matrixContainer.addEventListener("wheel", e => {
        e.preventDefault();
        
        if (e.shiftKey) {
            handleCols(htmlMatrixData, e.deltaY > 0);
            return;
        }
        handleRows(htmlMatrixData, e.deltaY > 0);
    })

    matricesContainer.appendChild(htmlMatrixData.matrixContainer);
}

function handleRows(htmlMatrixData: HTMLMatrixData, more: boolean) {
    const colCount = htmlMatrixData.rowContainers[0].children.length;
    
    if (more) {
        const newRowContainer = document.createElement('div');
        for (let col = 0; col < colCount; col++) {
            const input = document.createElement('input');
            input.classList.add('matrix-input');
            newRowContainer.appendChild(input);
        }
        htmlMatrixData.rowContainers.push(newRowContainer);
        htmlMatrixData.matrixContainer.appendChild(newRowContainer);
        return;
    }

    if (htmlMatrixData.rowContainers.length <= 1) return;
    htmlMatrixData.rowContainers.pop()?.remove();
}

function handleCols(htmlMatrixData: HTMLMatrixData, more: boolean) {
    if (more) {
        for (const row of htmlMatrixData.rowContainers) {
            const input = document.createElement('input');
            input.classList.add('matrix-input');
            row.appendChild(input);
        }
        return;
    }

    for (const row of htmlMatrixData.rowContainers) {
        if (row.children.length <= 1) return;
        row.lastChild?.remove();
    }
}

function generateMatrixHtml<T extends keyof HTMLElementTagNameMap>(cols: number, rows: number, element: T, ...cssClasses: string[]): HTMLMatrixData;
function generateMatrixHtml(cols: number, rows: number, element: string, ...cssClasses: string[]): HTMLMatrixData {
    const rowContainers: HTMLDivElement[] = [];

    const matrixContainer = document.createElement('div');
    matrixContainer.style.whiteSpace = 'nowrap';
    for (let row = 0; row < rows; row++) {
        const rowContainer = document.createElement('div');
        rowContainers.push(rowContainer);
        for (let col = 0; col < cols; col++) {
            const createdElement = document.createElement(element);
            createdElement.classList.add(...cssClasses);
            rowContainer.appendChild(createdElement);
        }
        matrixContainer.appendChild(rowContainer);
    }

    return { matrixContainer, rowContainers };
}

generateMatrixButton.addEventListener('click', () => {
    
    const matrixData: string[][][] = []
    const matrixContainers = matricesContainer.children;

    for (const matrixContainer of matrixContainers) {
        const rowContainers = matrixContainer.children;
        const matrix: string[][] = [];

        for (const rowContainer of rowContainers) {
            const inputs = rowContainer.children;
            const row: string[] = [];

            for (const input of inputs) {
                if (!(input instanceof HTMLInputElement)) continue;
                row.push(input.value);
            }
            matrix.push(row);
        }
        matrixData.push(matrix);
    }

    const result = generateMatrixMultiplicationMultiple(...matrixData);
    resultsContainer.innerHTML = '';

    const htmlMatrixData = generateMatrixHtml(result.length, result[0].length, "div", "matrix-result")

    for (let row = 0; row < result.length; row++) {
        const rowContainer = htmlMatrixData.rowContainers[row];
        for (let col = 0; col < result[row].length; col++) {
            const valueElement = rowContainer.children[col];
            valueElement.textContent = result[row][col];
        }
    }

    resultsContainer.appendChild(htmlMatrixData.matrixContainer);
});

onMatrixCountChange()
