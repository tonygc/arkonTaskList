
/**
 * Función para retornar la fecha actual YYYY-MM-DD HH:mm:ss
 */
const dateYYYYMMDDHHMMSS=()=>{
    return new Date().toISOString().
                replace(/T/, ' ').      // replace T with a space
                replace(/\..+/, '');
}

/**
 * Función para retornar una fecha dada con formato YYYY-MM-DD HH:mm:ss
 */
 const dateFormatYYYYMMDDHHMMSS=(days)=>{
    let date = new Date()
    return date.getFullYear()+"-"+
        (date.getMonth()+1<10?"0":"")+(date.getMonth()+1)+"-"+
        (date.getDate() + days<10?"0":"")+(date.getDate() + days)+" "+
        (date.getHours()<10?"0":"")+date.getHours()+":"+
        (date.getMinutes()<10?"0":"")+date.getMinutes()+":"+
        (date.getSeconds()<10?"0":"")+date.getSeconds();
}

module.exports={
    getToday:dateYYYYMMDDHHMMSS,
    transformDate:dateFormatYYYYMMDDHHMMSS
}