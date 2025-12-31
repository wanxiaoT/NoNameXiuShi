
import { Realm, PlayerStats } from './types';

export const REALMS_ORDER: Realm[] = [
  Realm.Mortal,
  Realm.QiRefining,
  Realm.Foundation,
  Realm.GoldenCore,
  Realm.NascentSoul,
  Realm.SoulFormation,
  Realm.VoidRefining,
  Realm.BodyIntegration,
  Realm.GreatTribulation,
  Realm.Immortal
];

export const INITIAL_PLAYER: PlayerStats = {
  name: "无名修士",
  realm: Realm.Mortal,
  stage: 1,
  qi: 0,
  maxQi: 100,
  health: 100,
  maxHealth: 100,
  spiritStones: 10,
  luck: 50,
  talent: 10,
  age: 18
};

export const REALM_REQUIREMENTS: Record<Realm, number> = {
  [Realm.Mortal]: 100,
  [Realm.QiRefining]: 500,
  [Realm.Foundation]: 2000,
  [Realm.GoldenCore]: 10000,
  [Realm.NascentSoul]: 50000,
  [Realm.SoulFormation]: 200000,
  [Realm.VoidRefining]: 1000000,
  [Realm.BodyIntegration]: 5000000,
  [Realm.GreatTribulation]: 20000000,
  [Realm.Immortal]: 100000000,
};
