export default class FormattingHelpers {
    public static prettyPrintSecondsAsDurationString(seconds: number): string {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = Math.floor(seconds % 60);

        return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
    }
}
