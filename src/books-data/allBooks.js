import { classicsBooks } from "./classics";
import { fantasyBooks } from "./fantasy";
import { geographyBooks } from "./geography";
import { historyBooks } from "./history";
import { mysteryBooks } from "./mystery";
import { personalDevelopmentBooks } from "./personalDevelopmentBooks";
import { techBooks } from "./tech";

export const allBooks = [
  ...fantasyBooks,
  ...personalDevelopmentBooks,
  ...mysteryBooks,
  ...classicsBooks,
  ...techBooks,
  ...historyBooks,
  ...geographyBooks,
];
