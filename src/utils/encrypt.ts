import bcrypt from 'bcrypt'
export const encryptPassword=(password:string)=>{
    const salt=10;
    return bcrypt.hashSync(password,salt)
}
export const checkPassword=(password:string,hash:string)=>{
    return bcrypt.compareSync(password,hash)
}