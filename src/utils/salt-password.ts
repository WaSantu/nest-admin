import * as crypto from 'crypto'

export function initSalt():string{
	return crypto.randomBytes(3).toString('base64')
}


export function encryptPwd(pwd:string,salt:string):Boolean|string{
	if(!pwd || !salt){
		return false
	}
	const tempSalt = Buffer.from(salt, 'base64')
	return crypto.pbkdf2Sync(pwd, tempSalt, 10000, 16, 'sha1').toString('base64')
}