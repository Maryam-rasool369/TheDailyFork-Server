import { PREVIEW_RATIO } from "../comman/constants";

// Cuts content at a word boundary near PREVIEW_RATIO of its length, so
// the frontend can render the visible part + a blurred/faded remainder.
export const truncateContent = (content: string): string => {
    const cutoff = Math.floor(content.length * PREVIEW_RATIO);
    const lastSpace = content.lastIndexOf(" ", cutoff); // where there is last index of  " " space before the cutoff
    const safeCutoff = lastSpace > 0 ? lastSpace : cutoff;
    return content.slice(0, safeCutoff).trim(); // trim will remove any trailing whitespace form start and end 
};