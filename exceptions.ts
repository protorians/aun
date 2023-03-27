import { IWidgerErrorException } from "./types";

export class WidgetErrorException extends Error implements IWidgerErrorException {
	message: string;

	constructor(message: string) {
		super();

		this.message = this.messageToString(message);
	}

	messageToString(data: string): string {
		switch (typeof data) {
			case "object":
				return `${JSON.stringify(data)}`;

			default:
				return `${data}`;
		}
	}
}
