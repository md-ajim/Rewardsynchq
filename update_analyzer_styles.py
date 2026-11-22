import re

file_path = "/media/md-ajim/Linux_Data/Repo/DealVerse/frontend/app/analyzer/client.tsx"

with open(file_path, "r") as f:
    content = f.read()

replacements = [
    (r'bg-slate-950', r'bg-slate-50 dark:bg-slate-950'),
    (r'text-white', r'text-slate-900 dark:text-white'),
    (r'text-slate-400', r'text-slate-600 dark:text-slate-400'),
    (r'text-slate-300', r'text-slate-700 dark:text-slate-300'),
    (r'bg-slate-900/90', r'bg-white/90 dark:bg-slate-900/90'),
    (r'border-slate-700/80', r'border-slate-200 dark:border-slate-700/80'),
    (r'bg-slate-800/80', r'bg-white dark:bg-slate-800/80'),
    (r'border-slate-700/60', r'border-slate-200 dark:border-slate-700/60'),
    (r'border-slate-800/60', r'border-slate-100 dark:border-slate-800/60'),
    (r'bg-slate-900/80', r'bg-white dark:bg-slate-900/80'),
    (r'border-slate-800/80', r'border-slate-200 dark:border-slate-800/80'),
    (r'shadow-black/30', r'shadow-slate-200/50 dark:shadow-black/30'),
    (r'bg-slate-900/70', r'bg-white/70 dark:bg-slate-900/70'),
    (r'bg-slate-800/60', r'bg-slate-100 dark:bg-slate-800/60'),
    (r'border-slate-700', r'border-slate-200 dark:border-slate-700'),
    (r'bg-slate-700/80', r'bg-slate-200 dark:bg-slate-700/80'),
    (r'text-slate-200', r'text-slate-800 dark:text-slate-200'),
    (r'border-slate-800', r'border-slate-200 dark:border-slate-800'),
    (r'bg-slate-800', r'bg-slate-200 dark:bg-slate-800'),
    (r'text-slate-500', r'text-slate-500 dark:text-slate-400'),
    (r'bg-slate-900', r'bg-white dark:bg-slate-900')
]

# We need to be careful with simple string replacement to avoid double replacements.
# Let's apply them sequentially.
for old, new in replacements:
    content = content.replace(old, new)

# Fix some nested/duplicate classes created by simplistic replacement
content = content.replace("dark:text-slate-600 dark:text-slate-400", "dark:text-slate-400")
content = content.replace("dark:bg-slate-50 dark:bg-slate-950", "dark:bg-slate-950")
content = content.replace("dark:bg-white dark:bg-slate-900", "dark:bg-slate-900")
content = content.replace("dark:bg-white/90 dark:bg-slate-900/90", "dark:bg-slate-900/90")
content = content.replace("dark:border-slate-200 dark:border-slate-700", "dark:border-slate-700")

with open(file_path, "w") as f:
    f.write(content)

print("Styles updated successfully.")
