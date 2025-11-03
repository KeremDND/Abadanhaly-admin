export type Product = {
  id: string;
  name: string; // display name shown under card
  image: string; // "/Images/Halylar/…/file.jpg"
  category: 'new' | 'bestseller';
  color: string; // color for filtering
  slug?: string; // optional future PDP
  altTK: string; altRU: string; altEN: string; // for <img alt> i18n
}

export const products: Product[] = [
  // Bestsellers (20+ products)
  {
    id: 'nusay-cream-2048',
    name: 'Nusay Cream 2048',
    image: '/Images/Halylar/abadan-haly-Nusay- Cream- 2048- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'nusay-cream-2048',
    altTK: 'Nusay 2048 — çal reňk — 200×300',
    altRU: 'Нусай 2048 — кремовый цвет — 200×300',
    altEN: 'Nusay 2048 — cream color — 200×300'
  },
  {
    id: 'gunes-cream-2004',
    name: 'Güneş Cream 2004',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2004',
    altTK: 'Güneş 2004 — çal reňk — 200×300',
    altRU: 'Гюнеш 2004 — кремовый цвет — 200×300',
    altEN: 'Güneş 2004 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2051',
    name: 'Güneş Grey 2051',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2051- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2051',
    altTK: 'Güneş 2051 — boz reňk — 200×300',
    altRU: 'Гюнеш 2051 — серый цвет — 200×300',
    altEN: 'Güneş 2051 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2021',
    name: 'Güneş Cream 2021',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2021- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2021',
    altTK: 'Güneş 2021 — çal reňk — 200×300',
    altRU: 'Гюнеш 2021 — кремовый цвет — 200×300',
    altEN: 'Güneş 2021 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2078',
    name: 'Güneş Grey 2078',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2078- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2078',
    altTK: 'Güneş 2078 — boz reňk — 200×300',
    altRU: 'Гюнеш 2078 — серый цвет — 200×300',
    altEN: 'Güneş 2078 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2030',
    name: 'Güneş Cream 2030',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2030- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2030',
    altTK: 'Güneş 2030 — çal reňk — 200×300',
    altRU: 'Гюнеш 2030 — кремовый цвет — 200×300',
    altEN: 'Güneş 2030 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2086',
    name: 'Güneş Grey 2086',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2086- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2086',
    altTK: 'Güneş 2086 — boz reňk — 200×300',
    altRU: 'Гюнеш 2086 — серый цвет — 200×300',
    altEN: 'Güneş 2086 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2051',
    name: 'Güneş Cream 2051',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2051- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2051',
    altTK: 'Güneş 2051 — çal reňk — 200×300',
    altRU: 'Гюнеш 2051 — кремовый цвет — 200×300',
    altEN: 'Güneş 2051 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2095',
    name: 'Güneş Grey 2095',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2095- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2095',
    altTK: 'Güneş 2095 — boz reňk — 200×300',
    altRU: 'Гюнеш 2095 — серый цвет — 200×300',
    altEN: 'Güneş 2095 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2078',
    name: 'Güneş Cream 2078',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2078- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2078',
    altTK: 'Güneş 2078 — çal reňk — 200×300',
    altRU: 'Гюнеш 2078 — кремовый цвет — 200×300',
    altEN: 'Güneş 2078 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2052',
    name: 'Güneş Grey 2052',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2052- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2052',
    altTK: 'Güneş 2052 — boz reňk — 200×300',
    altRU: 'Гюнеш 2052 — серый цвет — 200×300',
    altEN: 'Güneş 2052 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2086',
    name: 'Güneş Cream 2086',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2086- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2086',
    altTK: 'Güneş 2086 — çal reňk — 200×300',
    altRU: 'Гюнеш 2086 — кремовый цвет — 200×300',
    altEN: 'Güneş 2086 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-1718',
    name: 'Güneş Grey 1718',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 1718- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-1718',
    altTK: 'Güneş 1718 — boz reňk — 200×300',
    altRU: 'Гюнеш 1718 — серый цвет — 200×300',
    altEN: 'Güneş 1718 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2088',
    name: 'Güneş Cream 2088',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2088- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2088',
    altTK: 'Güneş 2088 — çal reňk — 200×300',
    altRU: 'Гюнеш 2088 — кремовый цвет — 200×300',
    altEN: 'Güneş 2088 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2089',
    name: 'Güneş Grey 2089',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2089- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2089',
    altTK: 'Güneş 2089 — boz reňk — 200×300',
    altRU: 'Гюнеш 2089 — серый цвет — 200×300',
    altEN: 'Güneş 2089 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2096',
    name: 'Güneş Cream 2096',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2096- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2096',
    altTK: 'Güneş 2096 — çal reňk — 200×300',
    altRU: 'Гюнеш 2096 — кремовый цвет — 200×300',
    altEN: 'Güneş 2096 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2099',
    name: 'Güneş Grey 2099',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2099- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2099',
    altTK: 'Güneş 2099 — boz reňk — 200×300',
    altRU: 'Гюнеш 2099 — серый цвет — 200×300',
    altEN: 'Güneş 2099 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2218',
    name: 'Güneş Cream 2218',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2218- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2218',
    altTK: 'Güneş 2218 — çal reňk — 200×300',
    altRU: 'Гюнеш 2218 — кремовый цвет — 200×300',
    altEN: 'Güneş 2218 — cream color — 200×300'
  },
  {
    id: 'gunes-grey-2218',
    name: 'Güneş Grey 2218',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Grey- 2218- carpet.jpg',
    category: 'bestseller',
    color: 'Grey',
    slug: 'gunes-grey-2218',
    altTK: 'Güneş 2218 — boz reňk — 200×300',
    altRU: 'Гюнеш 2218 — серый цвет — 200×300',
    altEN: 'Güneş 2218 — grey color — 200×300'
  },
  {
    id: 'gunes-cream-2099',
    name: 'Güneş Cream 2099',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2099- carpet.jpg',
    category: 'bestseller',
    color: 'Cream',
    slug: 'gunes-cream-2099',
    altTK: 'Güneş 2099 — çal reňk — 200×300',
    altRU: 'Гюнеш 2099 — кремовый цвет — 200×300',
    altEN: 'Güneş 2099 — cream color — 200×300'
  },

  // New (20+ products)
  {
    id: 'gunes-green-2361',
    name: 'Güneş Green 2361',
    image: '/Images/Halylar/Green/abadan-haly-Gunes- Green- 2361- carpet.jpg',
    category: 'new',
    color: 'Green',
    slug: 'gunes-green-2361',
    altTK: 'Güneş 2361 — ýaşyl reňk — 200×300',
    altRU: 'Гюнеш 2361 — зеленый цвет — 200×300',
    altEN: 'Güneş 2361 — green color — 200×300'
  },
  {
    id: 'gunes-red-2361',
    name: 'Güneş Red 2361',
    image: '/Images/Halylar/Red/abadan-haly-Gunes- Red- 2361- carpet.jpg',
    category: 'new',
    color: 'Red',
    slug: 'gunes-red-2361',
    altTK: 'Güneş 2361 — gyzyl reňk — 200×300',
    altRU: 'Гюнеш 2361 — красный цвет — 200×300',
    altEN: 'Güneş 2361 — red color — 200×300'
  },
  {
    id: 'gunes-dark-grey-2095',
    name: 'Güneş Dark Grey 2095',
    image: '/Images/Halylar/Dark Gery/abadan-haly-Gunes- Dark Grey- 2095- carpet.jpg',
    category: 'new',
    color: 'Dark Grey',
    slug: 'gunes-dark-grey-2095',
    altTK: 'Güneş 2095 — goňur boz reňk — 200×300',
    altRU: 'Гюнеш 2095 — темно-серый цвет — 200×300',
    altEN: 'Güneş 2095 — dark grey color — 200×300'
  },
  {
    id: 'gunes-grey-green-2382',
    name: 'Güneş Grey Green 2382',
    image: '/Images/Halylar/Green/abadan-haly-Gunes- Grey Green- 2382- carpet.jpg',
    category: 'new',
    color: 'Grey Green',
    slug: 'gunes-grey-green-2382',
    altTK: 'Güneş 2382 — boz-ýaşyl reňk — 200×300',
    altRU: 'Гюнеш 2382 — серо-зеленый цвет — 200×300',
    altEN: 'Güneş 2382 — grey-green color — 200×300'
  },
  {
    id: 'gunes-yellow-grey-2382',
    name: 'Güneş Yellow Grey 2382',
    image: '/Images/Halylar/Grey/abadan-haly-Gunes- Yellow Grey- 2382- carpet.jpg',
    category: 'new',
    color: 'Yellow Grey',
    slug: 'gunes-yellow-grey-2382',
    altTK: 'Güneş 2382 — sary-boz reňk — 200×300',
    altRU: 'Гюнеш 2382 — желто-серый цвет — 200×300',
    altEN: 'Güneş 2382 — yellow-grey color — 200×300'
  },
  {
    id: 'gunes-cream-2219',
    name: 'Güneş Cream 2219',
    image: '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2219- carpet.jpg',
    category: 'new',
    color: 'Cream',
    slug: 'gunes-cream-2219',
    altTK: 'Güneş 2219 — çal reňk — 200×300',
    altRU: 'Гюнеш 2219 — кремовый цвет — 200×300',
    altEN: 'Güneş 2219 — cream color — 200×300'
  },
  {
    id: 'gunes-dark-grey-2355',
    name: 'Güneş Dark Grey 2355',
    image: '/Images/Halylar/Dark Gery/abadan-haly-Gunes- Dark Grey- 2355- carpet.jpg',
    category: 'new',
    color: 'Dark Grey',
    slug: 'gunes-dark-grey-2355',
    altTK: 'Güneş 2355 — goňur boz reňk — 200×300',
    altRU: 'Гюнеш 2355 — темно-серый цвет — 200×300',
    altEN: 'Güneş 2355 — dark grey color — 200×300'
  },
  {
    id: 'gunes-dark-grey-2380',
    name: 'Güneş Dark Grey 2380',
    image: '/Images/Halylar/Dark Gery/abadan-haly-Gunes- Dark Grey- 2380- carpet.jpg',
    category: 'new',
    color: 'Dark Grey',
    slug: 'gunes-dark-grey-2380',
    altTK: 'Güneş 2380 — goňur boz reňk — 200×300',
    altRU: 'Гюнеш 2380 — темно-серый цвет — 200×300',
    altEN: 'Güneş 2380 — dark grey color — 200×300'
  },
  {
    id: 'gunes-dark-grey-2382',
    name: 'Güneş Dark Grey 2382',
    image: '/Images/Halylar/Dark Gery/abadan-haly-Gunes- Dark Grey- 2382- carpet.jpg',
    category: 'new',
    color: 'Dark Grey',
    slug: 'gunes-dark-grey-2382',
    altTK: 'Güneş 2382 — goňur boz reňk — 200×300',
    altRU: 'Гюнеш 2382 — темно-серый цвет — 200×300',
    altEN: 'Güneş 2382 — dark grey color — 200×300'
  },
];