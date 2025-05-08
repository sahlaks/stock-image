interface ITemp extends Document{
    _id: string
    email: string
    mobile: string
    password: string
    otp: string
    createdAt: Date
}

export default ITemp;