import {
  IconDefinition,
  faGhost,
  faDragon,
  faWandSparkles,
  faHatWizard,
  faScroll,
  faDungeon,
  faBookSkull,
  faDog,
  faCat,
  faHorse,
  faOtter,
  faFish,
  faDove,
  faCow,
  faSpider,
  faMeteor,
  faSatellite,
  faSpaceShuttle,
  faBolt,
  faRadiation,
  faFire,
  faAtom,
  faExplosion,
} from "@fortawesome/free-solid-svg-icons";

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export type ItemContainerProps = {
  indx: number;
  items: ItemType[];
};

export type DifficultyConfigurations = {
  // The number of containers the game should start with
  containers: number;
  // The number of items a container can hold, also the number of items, of each TYPE, that should be in the game.
  containerLimit: number;
  // The amount of types (icons) that should be in the game
  uniqueItemTypeCount: number;
  additionalContainers: number;
};

export const DIFFICULTY_CONFIGURATIONS: Record<
  Difficulty,
  DifficultyConfigurations
> = {
  easy: {
    containers: 6,
    containerLimit: 4,
    uniqueItemTypeCount: 4,
    additionalContainers: 3,
  },
  medium: {
    containers: 8,
    containerLimit: 5,
    uniqueItemTypeCount: 6,
    additionalContainers: 2,
  },
  hard: {
    containers: 8,
    containerLimit: 6,
    uniqueItemTypeCount: 7,
    additionalContainers: 1,
  },
};

export type ItemType =
  | "ghost"
  | "scroll"
  | "dragon"
  | "wand"
  | "dungeon"
  | "wizard"
  | "book"
  | "dog"
  | "cat"
  | "horse"
  | "otter"
  | "fish"
  | "dove"
  | "cow"
  | "spider"
  | "meteor"
  | "satellite"
  | "space-shuttle"
  | "bolt"
  | "radiation"
  | "fire"
  | "atom"
  | "explosion";

export const ITEM_ICONS = new Map<ItemType, IconDefinition>([
  ["ghost", faGhost],
  ["scroll", faScroll],
  ["dragon", faDragon],
  ["wand", faWandSparkles],
  ["dungeon", faDungeon],
  ["wizard", faHatWizard],
  ["book", faBookSkull],
  ["dog", faDog],
  ["cat", faCat],
  ["horse", faHorse],
  ["otter", faOtter],
  ["fish", faFish],
  ["dove", faDove],
  ["cow", faCow],
  ["spider", faSpider],
  ["meteor", faMeteor],
  ["satellite", faSatellite],
  ["space-shuttle", faSpaceShuttle],
  ["bolt", faBolt],
  ["radiation", faRadiation],
  ["fire", faFire],
  ["atom", faAtom],
  ["explosion", faExplosion],
]);
