let formatBytes = (bytes, decimals = 3) => {
    if (bytes === 0) return '0';

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* usage */
export const transformedFormatBytes = (size) => formatBytes(size);


export let bytesConverter = (size, unit) => {

    const b = 1024;
    const unitInUpperCase = unit.toUpperCase();
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    if(units.includes(unitInUpperCase)){
        const i = units.indexOf(unitInUpperCase);
        return Math.pow(b, i+1) * size;
    }

}