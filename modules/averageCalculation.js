const averageCalculation = (array, key) => {
    const total = array.reduce((total, element) => total + element[key], 0);

    if (array.length === 0) {
        return 0; 
    }

    const average = total / array.length;;
    return average;
}

export default averageCalculation;