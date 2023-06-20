export default class GeneralHelpers {
    public static printTimeAsGermanString(date: Date): string {
        return date.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
    }
}
