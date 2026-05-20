'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function createProductAction(data) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'seller') {
      return { success: false, error: 'Unauthorized' };
    }

    const { title, description, price, categoryId, tags, inventoryQty, images, status } = data;

    if (!title || !description || !price || !categoryId) {
      return { success: false, error: 'Title, description, price, and category are required' };
    }

    // Generate unique slug
    let slug = slugify(title);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        sellerId: session.id,
        categoryId: parseInt(categoryId),
        title,
        slug,
        description,
        price: parseFloat(price),
        inventoryQty: parseInt(inventoryQty) || 0,
        tags: tags || [],
        status: status || 'active',
        images: images?.length
          ? {
              create: images.map((img, i) => ({
                url: img.url,
                publicId: img.publicId || null,
                displayOrder: i,
                isPrimary: i === 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        seller: { select: { id: true, name: true } },
      },
    });

    revalidatePath('/shop');
    revalidatePath('/dashboard/products');
    return { success: true, data: product };
  } catch (error) {
    console.error('createProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateProductAction(id, data) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const productId = parseInt(id);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== session.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    const { title, description, price, categoryId, tags, inventoryQty, status, images } = data;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(tags && { tags }),
        ...(inventoryQty !== undefined && { inventoryQty: parseInt(inventoryQty) }),
        ...(status && { status }),
      },
      include: {
        images: true,
        category: true,
      },
    });

    // Handle images if provided
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.createMany({
        data: images.map((img, i) => ({
          productId,
          url: img.url,
          publicId: img.publicId || null,
          displayOrder: i,
          isPrimary: i === 0,
        })),
      });
    }

    revalidatePath('/shop');
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${productId}/edit`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('updateProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteProductAction(id) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const productId = parseInt(id);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== session.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await prisma.product.delete({ where: { id: productId } });

    revalidatePath('/shop');
    revalidatePath('/dashboard/products');
    return { success: true, message: 'Product deleted' };
  } catch (error) {
    console.error('deleteProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
