import fs from 'node:fs';

let content = fs.readFileSync('prisma/seed.js', 'utf8');

const replacements = {
  // Categories
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80': 'https://loremflickr.com/800/800/ceramics,pottery/all',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80': 'https://loremflickr.com/800/800/jewelry,necklace/all',
  'https://images.unsplash.com/photo-1531327431456-837da4b1d562?w=800&q=80': 'https://loremflickr.com/800/800/woodwork,wood/all',
  'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800&q=80': 'https://loremflickr.com/800/800/textiles,fabric/all',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80': 'https://loremflickr.com/800/800/leather,wallet/all',
  'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80': 'https://loremflickr.com/800/800/candles,candle/all',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80': 'https://loremflickr.com/800/800/art,print/all',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80': 'https://loremflickr.com/800/800/decor,home/all',
  
  // Avatars
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop': 'https://loremflickr.com/200/200/woman,portrait/all',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop': 'https://loremflickr.com/200/200/man,portrait/all',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop': 'https://loremflickr.com/200/200/girl,portrait/all',

  // Products
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80': 'https://loremflickr.com/800/800/planter,ceramic/all',
  'https://images.unsplash.com/photo-1596482163351-140b9cdb4807?w=800&q=80': 'https://loremflickr.com/800/800/matcha,bowl/all',
  'https://images.unsplash.com/photo-1584347530664-42f0672e8117?w=800&q=80': 'https://loremflickr.com/800/800/cuttingboard,wood/all',
  'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&q=80': 'https://loremflickr.com/800/800/wooden,spoon/all',
  'https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&q=80': 'https://loremflickr.com/800/800/knit,blanket/all',
  'https://images.unsplash.com/photo-1520981825232-ece5fae45120?w=800&q=80': 'https://loremflickr.com/800/800/scarf,indigo/all',
  'https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=800&q=80': 'https://loremflickr.com/800/800/silver,ring/all',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80': 'https://loremflickr.com/800/800/quartz,pendant/all',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80': 'https://loremflickr.com/800/800/leather,cardholder/all',
  'https://images.unsplash.com/photo-1585058253133-705a108a705e?w=800&q=80': 'https://loremflickr.com/800/800/macrame,plant/all',
  'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80': 'https://loremflickr.com/800/800/walnut,cuttingboard/all',
  'https://images.unsplash.com/photo-1616628188550-808682f392a4?w=800&q=80': 'https://loremflickr.com/800/800/white,bowls/all'
};

for (const [oldUrl, newUrl] of Object.entries(replacements)) {
  content = content.split(oldUrl).join(newUrl);
}

fs.writeFileSync('prisma/seed.js', content);
console.log('Seed file URLs updated successfully.');
