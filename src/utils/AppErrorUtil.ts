export default class AppError extends Error {
    public message: any
    public data: any

    constructor(message: any, data: any){
        super()
        this.message = message
        this.data = data
    }

}