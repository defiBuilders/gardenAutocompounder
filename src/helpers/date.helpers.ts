export const getDateStringEst = (date: Date) => {
    return date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
    })
}
