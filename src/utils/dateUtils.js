export const formatDate = date => {
    return date.toISOString().split('T')[0];
}

export const getToday = () => {
    return formatDate(new Date());
}

export const getWeekAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDate(date);
}

export const getMonthAgo = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return formatDate(date);
}