export interface PushNotification {
    notification: {
        title: string,
        body: string,
        image?: string,
    };
    registration_ids?: [];
    to?: string;
}
