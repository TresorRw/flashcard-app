export const convertTimestamp = (date: number | string | Date) => {
    return new Date(date).toLocaleString()
}
