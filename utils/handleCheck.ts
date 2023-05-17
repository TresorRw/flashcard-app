export function handleToken(token: string) {
    let realToken: string;
    if (token.includes("Bearer")) {
        realToken = token.split(" ")[1];
    } else {
        realToken = token;
    }
    return realToken;
}