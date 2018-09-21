const readline = require('readline');
const cronTimings = {
    daily : { },
    hourly: { },
    everyMinute : { },
    sixtyTimes: { }
}

let cronInput = []
const input = "16:10".split(':')

let rl = readline.createInterface({
    input: require('fs').createReadStream('cron.file')
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
let currentDate = new Date(today).getDate()

const dailyCron = () =>{
    let daily = new Date().setHours(cronTimings.daily.hour,cronTimings.daily.mins,00,00)
    let t = daily < today ? 'tomorrow': 'today'
    return `${cronTimings.daily.hour}:${cronTimings.daily.mins} ${t} - ${cronTimings.daily.path}`
}

const hourlyCron = () =>{
    if(Number(cronTimings.hourly.mins) >= Number(input[1])){
        return `${new Date(today).getHours()}:${cronTimings.hourly.mins} today - ${cronTimings.daily.path}`
    }
    else{
        let hour = new Date(today + (60 * 60 * 1000))
        return `${hour.getHours()}:${cronTimings.hourly.mins} ${hour.getDate() == currentDate ? "today" : "tomorrow"} - ${cronTimings.daily.path}`
    }
}

const everyMinute = () =>{
    return `${new Date(today).getHours()}:${new Date(today).getMinutes()} today - ${cronTimings.everyMinute.path}`
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
