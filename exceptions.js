export class WidgetErrorException extends Error {
    constructor(message) {
        super();
        this.message = this.messageToString(message);
    }
    messageToString(data) {
        switch (typeof data) {
            case "object":
                return `${JSON.stringify(data)}`;
            default:
                return `${data}`;
        }
    }
}
