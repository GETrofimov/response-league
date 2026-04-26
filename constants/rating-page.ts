export const RatingPageColumnHeaders = {
    POSITION: 'МЕСТО',
    PLAYER: 'ИГРОК',
    REGION: 'РЕГИОН',
    POINTS:'ОЧКИ'
} as const;

export type  RatingPageColumnHeaders = typeof RatingPageColumnHeaders[keyof typeof RatingPageColumnHeaders]