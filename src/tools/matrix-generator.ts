
export function generateMatrixMultiplication(m1: string[][], m2: string[][]) {
    const cols1 = m1[0].length;
    const rows1 = m1.length;
    const cols2 = m2[0].length;
    const rows2 = m2.length;

    if (cols1 !== rows2) {
        throw new Error("Matrix multiplication is not possible with the given matrices.")
    }

    const result: string[][] = Array.from({ length: rows1 }, () => Array(cols2).fill(""));

    return generateMatrixMultiplicationRecursively(0, 0, m1, m2, result);
}

export function generateMatrixMultiplicationRecursively(row: number, col: number, m1: string[][], m2: string[][], result: string[][]) {
    const rows1 = m1.length;
    const cols1 = m1[0].length;
    const cols2 = m2[0].length;

    for (let i = 0; i < cols1; i++) {
        result[row][col] += m1[row][i] + " * " + m2[i][col];
        if (i < cols1 - 1) result[row][col] += " + "
    }

    if (row < rows1 - 1) {
        return generateMatrixMultiplicationRecursively(row + 1, col, m1, m2, result);
    } else if (col < cols2 - 1) {
        return generateMatrixMultiplicationRecursively(0, col + 1, m1, m2, result);
    }
    
    return result;
}

export function generateMatrixMultiplicationMultiple(...matrices: string[][][]) {
    if (matrices.length < 2) {
        throw new Error("At least two matrices are required for multiplication.")
    }

    let result = matrices[0];
    for (let i = 1; i < matrices.length; i++) {
        result = generateMatrixMultiplication(result, matrices[i]);
    }

    return result;
}