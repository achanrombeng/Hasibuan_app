<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to allow truncation
        Schema::disableForeignKeyConstraints();
        ProductImage::truncate();
        Product::truncate();
        Schema::enableForeignKeyConstraints();

        $products = $this->getProductsData();

        foreach ($products as $productData) {
            $catName = $productData['category'];
            $category = Category::where('slug', Str::slug($catName))
                ->orWhere('name->en', $catName)
                ->orWhere('name->id', $catName)
                ->orWhere('name->en', 'like', '%'.$catName.'%')
                ->orWhere('name->id', 'like', '%'.$catName.'%')
                ->first();

            if (! $category) {
                $category = Category::first();
            }

            if (! $category) {
                continue;
            }

            Product::create([
                'category_id' => $category->id,
                'sku' => $productData['sku'],
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']).'-'.Str::random(5),
                'short_description' => $productData['short_description'],
                'description' => $productData['description'],
                'low_stock_threshold' => 5,
                'track_stock' => true,
                'material' => $productData['material'],
                'color' => $productData['color'],
                'weight' => $productData['weight'],
                'length' => $productData['dimensions']['length'],
                'width' => $productData['dimensions']['width'],
                'height' => $productData['dimensions']['height'],
                'specifications' => $productData['specifications'],
                'status' => ProductStatus::ACTIVE,
                'is_featured' => $productData['is_featured'] ?? false,
                'is_new_arrival' => $productData['is_new_arrival'] ?? false,
                'meta_title' => $productData['name'].' - Ronica Furniture',
                'meta_description' => $productData['short_description'],
            ]);
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function getProductsData(): array
    {
        return [
            // CHAIRS
            [
                'sku' => 'CHR-001',
                'name' => 'Verona Teak Dining Chair',
                'category' => 'Chairs',
                'short_description' => 'Solid teak outdoor dining chair with ergonomic curved backrest',
                'description' => 'Handcrafted from premium grade-A Indonesian teak wood. Designed with clean architectural lines and built to withstand harsh outdoor conditions while offering exceptional dining comfort.',
                'stock' => 50,
                'material' => 'Solid Teak Wood (Grade A)',
                'color' => 'Natural Teak',
                'weight' => 7.5,
                'dimensions' => ['length' => 58, 'width' => 55, 'height' => 88],
                'specifications' => ['Finish' => 'Fine Sanded Natural', 'Stackable' => 'Yes', 'Warranty' => '3 Years Structure'],
                'is_featured' => true,
                'is_new_arrival' => true,
            ],
            [
                'sku' => 'CHR-002',
                'name' => 'Riviera Rope Armchair',
                'category' => 'Chairs',
                'short_description' => 'Modern outdoor armchair woven with weather-resistant olefin rope',
                'description' => 'Features powder-coated aluminum framing interwoven with high-tensile UV-resistant rope weaving. Includes quick-dry foam seat cushion.',
                'stock' => 35,
                'material' => 'Aluminum Frame, Olefin Rope',
                'color' => 'Charcoal & Teak',
                'weight' => 6.8,
                'dimensions' => ['length' => 62, 'width' => 60, 'height' => 82],
                'specifications' => ['Cushion' => 'Sunproof Fabric', 'Frame' => 'Powder Coated Aluminum'],
                'is_featured' => true,
            ],

            // TABLES
            [
                'sku' => 'TBL-001',
                'name' => 'Nordic Teak Slat Dining Table',
                'category' => 'Tables',
                'short_description' => 'Large solid teak rectangular dining table for 8 persons',
                'description' => 'A statement centerpiece dining table made from sustainably harvested teak planks with slatted top for easy rainwater drainage.',
                'stock' => 15,
                'material' => 'Grade-A Solid Teak',
                'color' => 'Natural Golden Teak',
                'weight' => 55.0,
                'dimensions' => ['length' => 240, 'width' => 100, 'height' => 76],
                'specifications' => ['Top Thickness' => '3.5 cm', 'Capacity' => '8-10 Persons', 'Assembly' => 'Knock-down'],
                'is_featured' => true,
            ],
            [
                'sku' => 'TBL-002',
                'name' => 'Capri Round Bistro Table',
                'category' => 'Tables',
                'short_description' => 'Round outdoor cafe and patio table with pedestal base',
                'description' => 'Compact and elegant round table designed for terraces, balconies, and boutique cafe patios.',
                'stock' => 25,
                'material' => 'Teak Wood & Cast Base',
                'color' => 'Natural Teak',
                'weight' => 18.0,
                'dimensions' => ['length' => 90, 'width' => 90, 'height' => 75],
                'specifications' => ['Diameter' => '90 cm', 'Use' => 'Indoor & Outdoor'],
            ],

            // DINING SETS
            [
                'sku' => 'DNS-001',
                'name' => 'Monaco 8-Seater Teak Dining Set',
                'category' => 'Dining Sets',
                'short_description' => 'Complete outdoor luxury dining set including large table and 8 armchairs',
                'description' => 'The complete alfresco dining experience featuring a 240cm solid teak table and 8 matching ergonomic armchairs with quick-dry cushions.',
                'stock' => 8,
                'material' => 'Grade-A Teak, Sunbrella Fabric',
                'color' => 'Natural Teak & Sand Beige',
                'weight' => 115.0,
                'dimensions' => ['length' => 240, 'width' => 100, 'height' => 76],
                'specifications' => ['Set Includes' => '1 Table + 8 Chairs', 'Weather Resistance' => 'All-Weather'],
                'is_featured' => true,
                'is_new_arrival' => true,
            ],

            // CORNER SETS
            [
                'sku' => 'CNR-001',
                'name' => 'Santorini Modular L-Shape Lounge Set',
                'category' => 'Corner Sets',
                'short_description' => 'Deep seating modular sectional sofa with teak coffee table',
                'description' => 'Luxurious outdoor sectional lounge with deep seating, quick-dry foam core cushions, and built-in teak side trays.',
                'stock' => 6,
                'material' => 'Aluminum, Teak Accent, Olefin Fabric',
                'color' => 'Oatmeal & Anthracite',
                'weight' => 85.0,
                'dimensions' => ['length' => 280, 'width' => 210, 'height' => 72],
                'specifications' => ['Cushion Thickness' => '15 cm', 'Configuration' => 'Reversible Left/Right'],
                'is_featured' => true,
            ],

            // SUN LOUNGERS
            [
                'sku' => 'SUN-001',
                'name' => 'Bali Multi-Position Teak Sun Lounger',
                'category' => 'Sun Loungers',
                'short_description' => 'Poolside sunbed with 5 recline positions, slide-out tray, and wheels',
                'description' => 'The quintessential resort sun lounger featuring hidden rear wheels for effortless mobility, a pull-out drinks tray, and 5-stage backrest recline.',
                'stock' => 20,
                'material' => 'Solid Teak Wood, Brass Hardware',
                'color' => 'Natural Teak',
                'weight' => 28.0,
                'dimensions' => ['length' => 200, 'width' => 65, 'height' => 35],
                'specifications' => ['Recline Positions' => '5 Angles (including flat)', 'Hardware' => 'Marine Grade Solid Brass'],
                'is_featured' => true,
            ],

            // COMFORT PRODUCTS
            [
                'sku' => 'CMF-001',
                'name' => 'Ibiza Canopy Daybed',
                'category' => 'Comfort Products',
                'short_description' => 'Luxury double daybed with adjustable sun canopy and plush mattress',
                'description' => 'Create a private oasis with this double round canopy daybed. Provides shade and resort-style relaxation.',
                'stock' => 4,
                'material' => 'Synthetic Wicker, Aluminum Frame, Sunproof',
                'color' => 'Natural Sand',
                'weight' => 65.0,
                'dimensions' => ['length' => 190, 'width' => 190, 'height' => 165],
                'specifications' => ['Canopy' => 'Retractable UV50+', 'Capacity' => '2 Persons'],
                'is_featured' => true,
            ],

            // BAR SETS
            [
                'sku' => 'BAR-001',
                'name' => 'Kyoto Teak High Bar Table & Stools Set',
                'category' => 'Bar Sets',
                'short_description' => 'Bar height table with 4 matching backless bar stools with footrest',
                'description' => 'Perfect for poolside bars, rooftop decks, and outdoor entertainment zones. Features reinforced footrests and solid mortise-and-tenon joinery.',
                'stock' => 12,
                'material' => 'Grade-A Teak Wood',
                'color' => 'Natural Teak',
                'weight' => 48.0,
                'dimensions' => ['length' => 140, 'width' => 70, 'height' => 105],
                'specifications' => ['Set Includes' => '1 Bar Table + 4 Bar Stools', 'Seat Height' => '75 cm'],
            ],

            // NATURAL RATTAN
            [
                'sku' => 'RAT-001',
                'name' => 'Jepara Handwoven Natural Rattan Armchair',
                'category' => 'Natural Rattan',
                'short_description' => 'Traditional artisan crafted natural cane and wicker armchair',
                'description' => 'Intricately handwoven by master craftsmen in Jepara, Central Java. Organic, sustainable, and timelessly stylish for indoor and sheltered veranda living.',
                'stock' => 22,
                'material' => 'Natural Rattan Cane & Peel',
                'color' => 'Honey Natural',
                'weight' => 8.2,
                'dimensions' => ['length' => 72, 'width' => 68, 'height' => 84],
                'specifications' => ['Craft' => '100% Handmade', 'Environment' => 'Indoor / Covered Patio'],
                'is_featured' => true,
            ],

            // COLLECTIONS
            [
                'sku' => 'COL-001',
                'name' => 'The Horizon Teak & Rope Lounge Suite',
                'category' => 'Collections',
                'short_description' => 'Complete signature living suite: 3-seater, 2 armchairs, coffee & side tables',
                'description' => 'Our flagship collection combining teak timber framing with artisan charcoal rope weaving and luxury cloud-comfort cushions.',
                'stock' => 5,
                'material' => 'Teak, Marine Rope, Olefin Cushions',
                'color' => 'Natural Teak & Charcoal',
                'weight' => 110.0,
                'dimensions' => ['length' => 220, 'width' => 85, 'height' => 78],
                'specifications' => ['Set Includes' => '1 3-Seater + 2 Armchairs + 1 Coffee Table + 1 Side Table'],
                'is_featured' => true,
            ],

            // FLOORING
            [
                'sku' => 'FLR-001',
                'name' => 'Interlocking Teak Decking Tiles (Pack of 10)',
                'category' => 'Flooring',
                'short_description' => 'DIY snap-together outdoor solid teak deck tiles for balconies and patios',
                'description' => 'Transform concrete balconies, terraces, or garden paths instantly without tools. Quick-draining PVC grid base with solid teak slats.',
                'stock' => 100,
                'material' => 'Solid Teak Wood, Polypropylene Base',
                'color' => 'Oiled Teak',
                'weight' => 12.0,
                'dimensions' => ['length' => 30, 'width' => 30, 'height' => 2.5],
                'specifications' => ['Coverage' => '0.9 sqm per pack (10 tiles)', 'Installation' => 'Interlocking Click System'],
            ],

            // ACCESSORIES
            [
                'sku' => 'ACC-001',
                'name' => 'Teak Wood Hurricane Lantern Set',
                'category' => 'Accessories',
                'short_description' => 'Set of 2 outdoor architectural candle lanterns with glass panels and stainless handle',
                'description' => 'Ambient lighting accents handcrafted from teak and tempered glass with stainless steel top vents and hanging handles.',
                'stock' => 40,
                'material' => 'Teak Wood, Glass, Stainless Steel',
                'color' => 'Natural Teak & Silver',
                'weight' => 4.5,
                'dimensions' => ['length' => 22, 'width' => 22, 'height' => 50],
                'specifications' => ['Set' => '2 Pieces (Large + Medium)', 'Glass' => 'Tempered Safety Glass'],
            ],
        ];
    }
}

