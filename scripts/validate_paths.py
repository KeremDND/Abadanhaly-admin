#!/usr/bin/env python3
"""
Validate all product image paths exist and are correctly linked.
"""
import os
import re
import sys
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "Images" / "Halylar"
PRODUCTS_FILE = PROJECT_ROOT / "data" / "products.ts"

def extract_image_paths():
    """Extract all image paths from products.ts"""
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all image: '...' patterns
        pattern = r"image:\s*['\"`]([^'\"`]+)['\"`]"
        matches = re.findall(pattern, content)
        return list(set(matches))  # Remove duplicates
    except Exception as e:
        print(f"Error reading products.ts: {e}")
        return []

def get_all_image_files():
    """Get all actual image files in public/Images/Halylar"""
    images = []
    if not PUBLIC_IMAGES.exists():
        print(f"Warning: {PUBLIC_IMAGES} does not exist")
        return images
    
    for root, dirs, files in os.walk(PUBLIC_IMAGES):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')):
                rel_path = Path(root).relative_to(PUBLIC_IMAGES)
                if rel_path == Path('.'):
                    full_path = f"/Images/Halylar/{file}"
                else:
                    full_path = f"/Images/Halylar/{rel_path}/{file}"
                images.append({
                    'path': full_path,
                    'file': file,
                    'full_path': Path(root) / file
                })
    return images

def check_path_exists(image_path):
    """Check if an image path exists"""
    # Remove leading slash
    rel_path = image_path.lstrip('/')
    full_path = PROJECT_ROOT / "public" / rel_path
    return full_path.exists(), full_path

def main():
    print("🔍 Validating image paths...\n")
    
    # Extract all image paths from products.ts
    product_image_paths = extract_image_paths()
    print(f"Found {len(product_image_paths)} unique image paths in products.ts\n")
    
    # Get all actual image files
    all_images = get_all_image_files()
    print(f"Found {len(all_images)} actual image files in public/Images/Halylar\n")
    
    # Check which images exist
    missing_images = []
    existing_images = []
    
    for image_path in product_image_paths:
        exists, full_path = check_path_exists(image_path)
        if exists:
            existing_images.append(image_path)
        else:
            # Try to find similar file
            filename = os.path.basename(image_path)
            similar = [img for img in all_images if img['file'] == filename]
            missing_images.append({
                'path': image_path,
                'expected': full_path,
                'similar': similar[0]['path'] if similar else None
            })
    
    # Find orphaned images (not referenced)
    referenced_paths = {
        img.replace('/Images/Halylar/', '').replace('\\', '/')
        for img in product_image_paths
    }
    
    orphaned_images = [
        img for img in all_images
        if img['path'].replace('/Images/Halylar/', '') not in referenced_paths
    ]
    
    # Report results
    print("=" * 60)
    print("VALIDATION RESULTS")
    print("=" * 60)
    
    print(f"\n✅ Existing images: {len(existing_images)}/{len(product_image_paths)}")
    
    if missing_images:
        print(f"\n❌ Missing images: {len(missing_images)}")
        print("   The following images are referenced but not found:")
        for item in missing_images:
            print(f"   - {item['path']}")
            if item['similar']:
                print(f"     → Similar file exists: {item['similar']}")
            print(f"     Expected at: {item['expected']}")
    
    if orphaned_images:
        print(f"\n⚠️  Orphaned images: {len(orphaned_images)}")
        print("   These images exist but are not referenced in products.ts:")
        for img in orphaned_images[:20]:
            print(f"   - {img['path']}")
        if len(orphaned_images) > 20:
            print(f"   ... and {len(orphaned_images) - 20} more")
    
    print("\n" + "=" * 60)
    if not missing_images:
        print("✅ All product image paths are valid!")
        return 0
    else:
        print(f"❌ {len(missing_images)} image path(s) need to be fixed.")
        return 1

if __name__ == '__main__':
    sys.exit(main())

