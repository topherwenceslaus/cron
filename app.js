
if(process.argv[2] && process.argv[3]){
    //Go on
}
else{
    console.log(`Invalid input
    Valid Format: app 16:10 cron.file`)
    process.exit()
}
const readline = require('readline');
const cronTimings = {
    daily : { },
    hourly: { },
    everyMinute : { },
    sixtyTimes: { }
}

let cronInput = []
const input = process.argv[2].split(':')

let rl = readline.createInterface({
    input: require('fs').createReadStream(process.argv[3])
});
 

rl.on('line', function (line) {
    if(line){
        cronInput.push(line)
    }
});
  
rl.on('close', function () {
    let cronTime = Object.keys(cronTimings)
    cronInput.map((cron,i)=>{
        let d = cron.split(' ')
        Object.assign(cronTimings[cronTime[i]],{
            mins:d[0] == '*' ? 0 : d[0],
            hour:d[1] == '*' ? 0 : d[1],
            path:d[2]
        })
    })

   
let today = new Date().setHours(input[0],input[1],00,00)
let now = {
    currentDate : new Date(today).getDate(),
    hours: new Date(today).getHours(),
    mins: new Date(today).getMinutes()
}


const dailyCron = () =>{
    let daily = new Date().setHours(cronTimings.daily.hour,cronTimings.daily.mins,00,00)
    let t = daily < today ? 'tomorrow': 'today'
    return `${cronTimings.daily.hour}:${cronTimings.daily.mins} ${t} - ${cronTimings.daily.path}`
}

const hourlyCron = () =>{
    if(Number(cronTimings.hourly.mins) >= Number(input[1])){
        return `${now.hours}:${cronTimings.hourly.mins} today - ${cronTimings.daily.path}`
    }
    else{
        let hour = new Date(today + (60 * 60 * 1000))
        return `${hour.getHours()}:${cronTimings.hourly.mins} ${hour.getDate() == now.currentDate ? "today" : "tomorrow"} - ${cronTimings.daily.path}`
    }
}

const everyMinute = () =>{
    return `${now.hours}:${now.mins} today - ${cronTimings.everyMinute.path}`
}

const everyHour = () =>{
    let t = today  >=  new Date().setHours(cronTimings.sixtyTimes.hour,cronTimings.sixtyTimes.mins,00,00) ? 'tomorrow' : 'today'
        return `${cronTimings.sixtyTimes.hour}:00 ${t} - ${cronTimings.sixtyTimes.path}`
}

const output = `${dailyCron()}
${hourlyCron()}
${everyMinute()}
${everyHour()}`
console.log(output)

});
