export interface registerUserProps {
    usernames: string,
    display_name: string,
    password: string
}

export interface loginUserProps {
    username: string,
    password: string
}

export interface singleUserProps {
    username: string
}

export interface userIdProps {
    userId: number
}