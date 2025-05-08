import bcrypt from 'bcrypt';

export async function generatePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function checkPasswrdMatch(password: string, existingPassword: string): Promise<boolean>{
    return await bcrypt.compare(password, existingPassword);
}

