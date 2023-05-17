const fs = require('fs');
const colors = require('colors')

// Set current FilePath
let logsPath = ""


// @ts-ignore
const {
    LOG_INFO = 1,
    LOG_ERROR = 2
}



function initLogs() {
    // Set logs path
    const date = new Date()
    logsPath = `logs/${date.toDateString() + "_" + date.getHours()+ ":" + date.getMinutes() + ":" + date.getSeconds()}.txt`

    // Creating logs dir if does not exist
    var dir = './logs';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    // Creating or opening file
    fs.writeFile(logsPath, 'LOGS OF ' + date + '\n\n', (err) => {
        if (err) {
        }

        // Preparing inital logs
        const date = new Date()
        const log  = date.getHours() + ":"
            + date.getMinutes() + ":"
            + date.getSeconds() + " - Logging file created \n"

        // Writing initial logs
        fs.appendFile(logsPath, log, (err) => {
            if (err) console.log("Failed to write after title in logs file ")
        })
    })

}

function logging(currentLog : string, goal : number) {
    const date = new Date()
    let log  = date.getHours() + ":"
        + date.getMinutes() + ":"
        + date.getSeconds() + " - "
        + currentLog

    // Set color
    if (goal === LOG_INFO){
        log = colors.blue(log)
    }else if (goal == LOG_ERROR){
        log = colors.red(log)
    }

    // Put log in the file
    fs.appendFile(logsPath, log + '\n', (err) => {
        if (err) console.log("Failed to write logs in file")
    })

    // Login console
    console.log(log)
}

function interaction(interaction){
    logging(interaction.member.guild.name + " - "
        + interaction.member.user.username + " - "
        + interaction.commandName, LOG_INFO)
}

function info(obj : any){
      logging(JSON.stringify(obj) , LOG_INFO)
}

function error(text : string){
    logging(text, LOG_ERROR)
}



// Initialisation
initLogs()

// Set interaction logger
module.exports = {
    interaction,
    info,
    error
}