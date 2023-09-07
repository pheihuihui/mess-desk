import { DBStorage } from "./meta";

export const formatDate = (date?: DBStorage.DateInfo) => date ? `${date.yyyy ?? '????'}/${date.mm ?? '??'}/${date.dd ?? '??'}` : '????/??/??'
export const formatPeriod = (from?: DBStorage.DateInfo, to?: DBStorage.DateInfo) => `${formatDate(from)} - ${formatDate(to)}`

