export type CharacterFilter = {
  season: number | 'ALL';
  karma: 'GOOD' | 'NEUTRAL' | 'EVIL' | 'ALL';
  sort: 'RATING' | 'NAME' | 'KARMA';
};
