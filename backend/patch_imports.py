import os
import re

files_and_replacements = [
    {
        "path": "src/application/use-cases/companyUser/challenges/get-challenge-game-data.use-case.ts",
        "patterns": [
            (r'import\s+\{\s*ChallengeGameDTO\s*\}\s+from\s+"[^"]+";', 'import { ChallengeGameDTO } from "../../../DTOs/companyUser/challenge.dto";'),
            (r'import\s+\{\s*mapChallengeGameToDTO\s*\}\s+from\s+"[^"]+";', 'import { mapChallengeGameToDTO } from "../../../mappers/companyUser/challenge.mapper";')
        ]
    },
    {
        "path": "src/application/use-cases/companyUser/challenges/get-challenges.use-case.ts",
        "patterns": [
            (r'import\s+\{\s*ChallengeDTO\s*\}\s+from\s+"[^"]+";', 'import { ChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";'),
            (r'import\s+\{\s*mapChallengeToDTO\s*\}\s+from\s+"[^"]+";', 'import { mapChallengeToDTO } from "../../../mappers/companyUser/challenge.mapper";')
        ]
    },
    {
        "path": "src/application/use-cases/companyUser/challenges/get-sent-challenge.use-case.ts",
        "patterns": [
            (r'import\s+\{\s*SentChallengeDTO\s*\}\s+from\s+"[^"]+";', 'import { SentChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";'),
            (r'import\s+\{\s*mapSentChallengeToDTO\s*\}\s+from\s+"[^"]+";', 'import { mapSentChallengeToDTO } from "../../../mappers/companyUser/challenge.mapper";')
        ]
    },
    {
        "path": "src/application/use-cases/companyUser/challenges/make-challenge.use-case.ts",
        "patterns": [
            (r'import\s+\{\s*ChallengeDTO\s*\}\s+from\s+"[^"]+";', 'import { ChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";'),
            (r'import\s+\{\s*mapChallengeToDTO\s*\}\s+from\s+"[^"]+";', 'import { mapChallengeToDTO } from "../../../mappers/companyUser/challenge.mapper";')
        ]
    }
]

for item in files_and_replacements:
    path = item["path"]
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    with open(path, "r") as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in item["patterns"]:
        new_content, count = re.subn(pattern, replacement, new_content)
        if count == 0:
            print(f"Warning: Pattern {pattern} not found in {path}")
    
    if new_content != content:
        with open(path, "w") as f:
            f.write(new_content)
        print(f"Updated: {path}")
    else:
        print(f"No changes made to {path}")
