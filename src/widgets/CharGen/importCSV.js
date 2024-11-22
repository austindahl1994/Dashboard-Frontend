import Papa from 'papaparse'

//Call from onChange file allow csv
const importCSV = (importTraitsFunc, file) => {
    if (file) {
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (result) => {
                importTraitsFunc(result.data);
            },
            error: (error) => {
                console.error(`There was an error of: ${error}`)
            }
        })
    }
}

export default importCSV
