export interface registerUserProps {
    username: string,
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

export interface tokenPayload {
    id: number,
    username: string,
    display_name: string,
}

export interface loggedInUserProps {
    id: number,
    username: string,
    display_name: string
    iat: number
    exp: number
}

export interface loggedInUser {
    user: loggedInUserProps
}