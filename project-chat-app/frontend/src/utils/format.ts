import { format } from 'date-fns';

export const formatMessageTime = (isoString: string): string => {
    try {
        return format(new Date(isoString), 'HH:mm');
    } catch (error) {
        return 'Invalid Date';
    }
};
