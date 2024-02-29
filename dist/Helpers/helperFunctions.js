"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNormalDate = void 0;
const formatNormalDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
};
exports.formatNormalDate = formatNormalDate;
