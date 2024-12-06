export function messageContainsAll(message: string, list: string[]): boolean {
    return list.every((item) => {
        if (item.includes("|")) {
            const options = item.split("|");
            return options.some((option) =>
                message.toLowerCase().includes(option.toLowerCase()),
            );
        } else {
            return message.toLowerCase().includes(item.toLowerCase());
        }
    });
}
