#!/usr/bin/env python3
"""Fix files that have both 'use client' and 'force-dynamic' — ensure 'use client' is first line, force-dynamic is second. Remove ALL duplicate 'use client' lines."""
import os
import re

root = "/home/z/my-project/src"
fixed_count = 0

for dirpath, _, filenames in os.walk(root):
    for filename in filenames:
        if not filename.endswith(('.tsx', '.ts')):
            continue
        filepath = os.path.join(dirpath, filename)
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        has_use_client = '"use client"' in content or "'use client'" in content
        has_force_dynamic = 'export const dynamic = "force-dynamic"' in content
        
        if not (has_use_client and has_force_dynamic):
            continue
        
        lines = content.split('\n')
        
        # Collect ALL "use client" and "force-dynamic" lines, keep only one of each
        use_client_found = False
        force_dynamic_found = False
        force_dynamic_line = 'export const dynamic = "force-dynamic";'
        remaining_lines = []
        
        for line in lines:
            stripped = line.strip()
            # Match "use client" with optional semicolon and quotes
            if re.match(r'''^['"]use client['"];?$''', stripped):
                if not use_client_found:
                    use_client_found = True
                # Skip ALL "use client" lines — we'll add one at top
                continue
            if stripped.startswith('export const dynamic') and 'force-dynamic' in stripped:
                if not force_dynamic_found:
                    force_dynamic_found = True
                # Skip ALL force-dynamic lines — we'll add one at top
                continue
            remaining_lines.append(line)
        
        # Remove leading empty lines from remaining
        while remaining_lines and remaining_lines[0].strip() == '':
            remaining_lines.pop(0)
        
        # Rebuild file: "use client" first, force-dynamic second, then rest
        new_lines = ['"use client";', '', force_dynamic_line, ''] + remaining_lines
        new_content = '\n'.join(new_lines)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        
        fixed_count += 1
        print(f"  ✅ Fixed: {filepath}")

print(f"\nTotal fixed: {fixed_count} files")
