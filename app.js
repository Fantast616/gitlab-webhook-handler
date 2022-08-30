const exec = require('child_process').exec
const express = require('express')
const { GitlabWebHookHandler } = require('./gitlab-webhook-handler')
const app = express()

webhook_handler = new GitlabWebHookHandler(app)

/**Example1: Use common function to response webhook requests */
webhook_handler.on('/example1',()=>{
    console.log("This is Example One")
},'exampletoken1')


/**Example2: Use async function which return Promise to response webhook requests*/
webhook_handler.on('/example2',()=>{
    return new Promise((resolve,reject)=>{
        let cmdStr = "ls -l"
        exec(cmdStr, function(err, stdout, stderr) {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
},'exampletoken2')


app.listen(8888, '0.0.0.0', function() {
    console.log(`webhook listening on port 8888`)
})