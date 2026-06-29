import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IProduct } from '../types/product.types';

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
    },
    productCollection: {
      type: String,
      required: [true, 'Collection is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    badge: {
      type: String,
      enum: ['NEW', 'SALE', ''],
      default: '',
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [String],
      required: [true, 'At least one size is required'],
      validate: {
        validator: (sizes: string[]) => sizes.length > 0,
        message: 'Product must have at least one size',
      },
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isBestseller: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Auto-generate slug before save
// Fix 1: pre save hook
productSchema.pre('save', async function () {
  if (!this.isModified('name')) return;

  let baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (
    await mongoose.model('Product').exists({ slug, _id: { $ne: this._id } })
  ) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

// Fix 2: toJSON
productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const r = ret as unknown as Record<string, unknown>;
    delete r['__v'];
    return r;
  },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;