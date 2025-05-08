import IImages from "../entities/images";
import IUser from "../entities/User";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<IUser | null>
    saveUser(date: { email: string; mobile: string; password: string }): Promise<IUser | null>
    saveImages(images: { userId: string | undefined; url: string; title: string; }[]): Promise<boolean>
    selectImages(id: string): Promise<IImages[]|null>
    deleteImage(id: string, uId: string): Promise<boolean>
    findImage(id: string, userId: string): Promise<IImages|null>
    updateImage(id: string, updates: { url?: string; title?: string }): Promise<IImages | null>
    rearrangePositions(id: string, data:{id: string, position: number}[]): Promise<IImages[]>
    updatePassword(newpassword: string, uId: string): Promise<boolean>
    findUserById(id: string): Promise<IUser>
}