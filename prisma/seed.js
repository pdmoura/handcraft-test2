import 'dotenv/config';
import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

const categories = [
  {
    name: 'Ceramics',
    slug: 'ceramics',
    description: 'Handmade pottery, mugs, bowls, and decorative ceramic pieces',
    imageUrl: 'https://loremflickr.com/800/800/ceramics,pottery/all',
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Unique handcrafted necklaces, bracelets, earrings, and rings',
    imageUrl: 'https://loremflickr.com/800/800/jewelry,necklace/all',
  },
  {
    name: 'Woodwork',
    slug: 'woodwork',
    description: 'Carved wooden items, furniture, cutting boards, and art pieces',
    imageUrl: 'https://loremflickr.com/800/800/woodwork,wood/all',
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Handwoven fabrics, knitted goods, quilts, and embroidery',
    imageUrl: 'https://loremflickr.com/800/800/textiles,fabric/all',
  },
  {
    name: 'Leather',
    slug: 'leather',
    description: 'Hand-tooled leather bags, wallets, belts, and accessories',
    imageUrl: 'https://loremflickr.com/800/800/leather,wallet/all',
  },
  {
    name: 'Candles',
    slug: 'candles',
    description: 'Artisan candles made with natural waxes and essential oils',
    imageUrl: 'https://loremflickr.com/800/800/candles,candle/all',
  },
  {
    name: 'Art Prints',
    slug: 'art-prints',
    description: 'Original artwork, illustrations, and limited edition prints',
    imageUrl: 'https://loremflickr.com/800/800/art,print/all',
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Handmade decorations, wall art, planters, and accessories',
    imageUrl: 'https://loremflickr.com/800/800/decor,home/all',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Categories
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { imageUrl: category.imageUrl },
      create: category,
    });
  }

  // 2. Seed Users (2 sellers, 1 buyer)
  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const seller1 = await prisma.user.upsert({
    where: { email: 'artisan@example.com' },
    update: {},
    create: {
      email: 'artisan@example.com',
      name: 'Elena Ramos',
      passwordHash,
      role: 'seller',
      bio: 'Creating beautiful ceramics and art inspired by nature in my home studio.',
      location: 'Portland, OR',
      avatarUrl: 'https://loremflickr.com/200/200/woman,portrait/all',
    }
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'woodcrafter@example.com' },
    update: {},
    create: {
      email: 'woodcrafter@example.com',
      name: 'Marcus Wood',
      passwordHash,
      role: 'seller',
      bio: 'Custom woodworking using reclaimed timber and traditional techniques.',
      location: 'Austin, TX',
      avatarUrl: 'https://loremflickr.com/200/200/man,portrait/all',
    }
  });

  const seller3 = await prisma.user.upsert({
    where: { email: 'weaver@example.com' },
    update: {},
    create: {
      email: 'weaver@example.com',
      name: 'Chloe Weaver',
      passwordHash,
      role: 'seller',
      bio: 'Passionate about sustainable textiles, natural dyes, and cozy living.',
      location: 'Denver, CO',
      avatarUrl: 'https://loremflickr.com/200/200/girl,portrait/all',
    }
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Sarah Customer',
      passwordHash,
      role: 'buyer',
    }
  });

  // Fetch all categories for quick mapping
  const cats = await prisma.category.findMany();
  const catMap = cats.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});

  // 3. Seed Products
  console.log('Seeding products...');
  
  const productsData = [
    {
      sellerId: seller1.id,
      categoryId: catMap['ceramics'],
      title: 'Hand-thrown Speckled Planter',
      slug: 'hand-thrown-speckled-planter',
      description: 'A beautiful, completely unique ceramic planter made from speckled clay. Perfect for indoor houseplants.',
      price: 45.00,
      inventoryQty: 8,
      status: 'active',
      tags: ['planter', 'speckled', 'ceramic'],
      avgRating: 4.8,
      reviewCount: 3,
      imageUrl: 'https://loremflickr.com/800/800/planter,ceramic/all',
    },
    {
      sellerId: seller1.id,
      categoryId: catMap['ceramics'],
      title: 'Glazed Matcha Bowl',
      slug: 'glazed-matcha-bowl',
      description: 'Handcrafted matcha tea bowl with a striking emerald glaze. Designed for traditional whisking.',
      price: 55.00,
      inventoryQty: 4,
      status: 'active',
      tags: ['bowl', 'tea', 'matcha'],
      avgRating: 5.0,
      reviewCount: 1,
      imageUrl: 'https://loremflickr.com/800/800/matcha,bowl/all',
    },
    {
      sellerId: seller2.id,
      categoryId: catMap['woodwork'],
      title: 'Olive Wood Cutting Board',
      slug: 'olive-wood-cutting-board',
      description: 'Premium cutting board made from sustainably sourced Olive wood. Finished with food-safe mineral oil and beeswax.',
      price: 120.00,
      inventoryQty: 5,
      status: 'active',
      tags: ['kitchen', 'wood', 'cutting board'],
      avgRating: 4.5,
      reviewCount: 2,
      imageUrl: 'https://loremflickr.com/800/800/cuttingboard,wood/all',
    },
    {
      sellerId: seller2.id,
      categoryId: catMap['woodwork'],
      title: 'Hand-carved Wooden Spoon',
      slug: 'hand-carved-wooden-spoon',
      description: 'Ergonomic wooden spoon carved from cherry wood. Perfect for stirring soups and stews.',
      price: 28.00,
      inventoryQty: 15,
      status: 'active',
      tags: ['kitchen', 'spoon', 'wood'],
      avgRating: 5.0,
      reviewCount: 4,
      imageUrl: 'https://loremflickr.com/800/800/wooden,spoon/all',
    },
    {
      sellerId: seller3.id,
      categoryId: catMap['textiles'],
      title: 'Chunky Knit Blanket',
      slug: 'chunky-knit-blanket',
      description: 'Ultra cozy chunky knit throw blanket made from 100% merino wool. Perfect for chilly evenings.',
      price: 180.00,
      inventoryQty: 3,
      status: 'active',
      tags: ['blanket', 'wool', 'cozy'],
      avgRating: 4.9,
      reviewCount: 6,
      imageUrl: 'https://loremflickr.com/800/800/knit,blanket/all',
    },
    {
      sellerId: seller3.id,
      categoryId: catMap['textiles'],
      title: 'Indigo Dyed Scarf',
      slug: 'indigo-dyed-scarf',
      description: 'Lightweight cotton scarf hand-dyed using natural indigo in a shibori pattern.',
      price: 42.00,
      inventoryQty: 7,
      status: 'active',
      tags: ['scarf', 'indigo', 'dyed'],
      avgRating: 0,
      reviewCount: 0,
      imageUrl: 'https://loremflickr.com/800/800/scarf,indigo/all',
    },
    {
      sellerId: seller1.id,
      categoryId: catMap['jewelry'],
      title: 'Hammered Silver Band',
      slug: 'hammered-silver-band',
      description: 'Sterling silver ring with a textured, hammered finish. Available in sizes 5 through 10.',
      price: 65.00,
      inventoryQty: 12,
      status: 'active',
      tags: ['ring', 'silver', 'jewelry'],
      avgRating: 4.7,
      reviewCount: 5,
      imageUrl: 'https://loremflickr.com/800/800/silver,ring/all',
    },
    {
      sellerId: seller1.id,
      categoryId: catMap['jewelry'],
      title: 'Rose Quartz Pendant',
      slug: 'rose-quartz-pendant',
      description: 'Raw rose quartz crystal wrapped in gold-filled wire on an 18-inch chain.',
      price: 50.00,
      inventoryQty: 4,
      status: 'active',
      tags: ['necklace', 'crystal', 'gold'],
      avgRating: 5.0,
      reviewCount: 2,
      imageUrl: 'https://loremflickr.com/800/800/quartz,pendant/all',
    },
    {
      sellerId: seller2.id,
      categoryId: catMap['leather'],
      title: 'Minimalist Leather Cardholder',
      slug: 'minimalist-leather-cardholder',
      description: 'Slim leather cardholder made from full-grain vegetable-tanned leather. Holds up to 6 cards.',
      price: 35.00,
      inventoryQty: 20,
      status: 'active',
      tags: ['wallet', 'leather', 'minimalist'],
      avgRating: 4.6,
      reviewCount: 8,
      imageUrl: 'https://loremflickr.com/800/800/leather,cardholder/all',
    },
    {
      sellerId: seller3.id,
      categoryId: catMap['candles'],
      title: 'Lavender & Cedarwood Soy Candle',
      slug: 'lavender-cedarwood-soy-candle',
      description: 'Hand-poured soy wax candle infused with lavender and cedarwood essential oils. 40-hour burn time.',
      price: 24.00,
      inventoryQty: 30,
      status: 'active',
      tags: ['candle', 'lavender', 'soy'],
      avgRating: 4.9,
      reviewCount: 15,
      imageUrl: 'https://loremflickr.com/800/800/candles,candle/all',
    },
    {
      sellerId: seller1.id,
      categoryId: catMap['art-prints'],
      title: 'Botanical Watercolor Print',
      slug: 'botanical-watercolor-print',
      description: 'Giclee print of an original watercolor monstera leaf painting. 8x10 inches, unframed.',
      price: 22.00,
      inventoryQty: 50,
      status: 'active',
      tags: ['art', 'print', 'botanical'],
      avgRating: 5.0,
      reviewCount: 4,
      imageUrl: 'https://loremflickr.com/800/800/art,print/all',
    },
    {
      sellerId: seller3.id,
      categoryId: catMap['home-decor'],
      title: 'Macrame Plant Hanger',
      slug: 'macrame-plant-hanger',
      description: 'Hand-knotted cotton macrame plant hanger. Measures 36 inches long, fits 4-6 inch pots.',
      price: 32.00,
      inventoryQty: 10,
      status: 'active',
      tags: ['macrame', 'plants', 'decor'],
      avgRating: 4.8,
      reviewCount: 7,
      imageUrl: 'https://loremflickr.com/800/800/macrame,plant/all',
    },
    {
      sellerId: seller2.id,
      categoryId: catMap['woodwork'],
      title: 'Walnut End Grain Cutting Board',
      slug: 'walnut-end-grain-cutting-board',
      description: 'Premium end-grain cutting board made from sustainably sourced American Walnut. Finished with food-safe mineral oil and beeswax.',
      price: 150.00,
      inventoryQty: 3,
      status: 'active',
      tags: ['kitchen', 'wood', 'cutting board'],
      avgRating: 4.9,
      reviewCount: 12,
      imageUrl: 'https://loremflickr.com/800/800/walnut,cuttingboard/all',
    },
    {
      sellerId: seller1.id,
      categoryId: catMap['ceramics'],
      title: 'Minimalist White Bowl Set',
      slug: 'minimalist-white-bowl-set',
      description: 'Set of 4 matte white ceramic bowls. Perfect for cereal, soup, or salads. Stackable design saves space in your cupboards.',
      price: 85.00,
      inventoryQty: 5,
      status: 'active',
      tags: ['bowl', 'minimalist', 'set'],
      avgRating: 5.0,
      reviewCount: 8,
      imageUrl: 'https://loremflickr.com/800/800/white,bowls/all',
    }
  ];

  for (const p of productsData) {
    if (!p.categoryId) continue;
    
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        inventoryQty: p.inventoryQty,
        status: p.status,
        images: {
          deleteMany: {},
          create: [
            { url: p.imageUrl, isPrimary: true, displayOrder: 0 },
            { url: p.imageUrl + '?lock=1', isPrimary: false, displayOrder: 1 },
            { url: p.imageUrl + '?lock=2', isPrimary: false, displayOrder: 2 }
          ]
        }
      },
      create: {
        sellerId: p.sellerId,
        categoryId: p.categoryId,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        inventoryQty: p.inventoryQty,
        status: p.status,
        tags: p.tags,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        images: {
          create: [
            { url: p.imageUrl, isPrimary: true, displayOrder: 0 },
            { url: p.imageUrl + '?lock=1', isPrimary: false, displayOrder: 1 },
            { url: p.imageUrl + '?lock=2', isPrimary: false, displayOrder: 2 }
          ]
        }
      }
    });
  }

  console.log(`Seeded ${productsData.length} products.`);
  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
