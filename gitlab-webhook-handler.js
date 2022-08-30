class GitlabWebHookHandler {
    /**
     * 
     * @param {express object} app 
     */
    constructor(app) {
        this.app = app
        this.lock = {}
    }

    /**
     * 
     * @param {route} route 
     * @param {The function that needs to be executed after the webhook responds} func 
     * @param {The token set in your gitlab} gitlabToken 
     * @param {Locking means that the next webhook request will not be responded to before the current request is completed to avoid conflicts.} needLocking 
     */
    on(route, func,gitlabToken,needLocking = true) {
        if(needLocking) this.lock[route] = false
        let that = this
        this.app.post(route, async function(req, res) {
            console.log(route," has been called")
            let headers = req.headers
            let isLocking 
            if(needLocking) isLocking = that.lock[route]
            else isLocking = false

            if (!isLocking && headers['x-gitlab-token'] === gitlabToken) {
                try{
                    isLocking = true
                    await func()
                }catch(err){
                    console.log("func err",err)
                }finally{
                    isLocking = false
                }  
            }else{
                console.log("is Locked")
            }
        })
    }
}

module.exports = {GitlabWebHookHandler}