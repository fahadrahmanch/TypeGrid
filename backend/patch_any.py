import os
import re

files_and_replacements = [
    {
        "path": "src/application/use-cases/user/quick-play/start-quick-play.use-case.ts",
        "patterns": [
            (r'\(competition as any\)', '(competition as ICompetitionDocument)'),
            (r'\(createdCompetition as any\)', '(createdCompetition as ICompetitionDocument)'),
            (r'import \{ CompetitionEntity \} from "\.\./\.\./\.\./\.\./domain/entities/competition\.entity";', 'import { CompetitionEntity } from "../../../../domain/entities/competition.entity";\nimport { ICompetitionDocument } from "../../../../infrastructure/db/types/documents";')
        ]
    },
    {
        "path": "src/application/use-cases/user/solo-play/create-solo-play.use-case.ts",
        "patterns": [
            (r'\(competition as any\)', '(competition as ICompetitionDocument)'),
            (r'\(createdCompetition as any\)', '(createdCompetition as ICompetitionDocument)'),
            (r'return mapCompetitionToDTOSoloPlay\(responseCompetition\)', 'return mapCompetitionToDTOSoloPlay(responseCompetition as unknown as import("../../../mappers/user/competition-solo-play.mapper").PopulatedSoloCompetitionPayload)'),
            (r'import \{ CompetitionEntity \} from "\.\./\.\./\.\./\.\./domain/entities/competition\.entity";', 'import { CompetitionEntity } from "../../../../domain/entities/competition.entity";\nimport { ICompetitionDocument } from "../../../../infrastructure/db/types/documents";')
        ]
    },
    {
        "path": "src/application/use-cases/user/group-play/new-group-play.use-case.ts",
        "patterns": [
            (r'\(compatitionData as any\)', '(compatitionData as ICompetitionDocument)'),
            (r'\(newCompetition as any\)', '(newCompetition as ICompetitionDocument)'),
            (r'\(newCompetitionEntity as any\)', '(newCompetitionEntity as unknown as ICompetitionDocument)'),
            (r'import \{ CompetitionEntity \} from "\.\./\.\./\.\./\.\./domain/entities/competition\.entity";', 'import { CompetitionEntity } from "../../../../domain/entities/competition.entity";\nimport { ICompetitionDocument } from "../../../../infrastructure/db/types/documents";')
        ]
    },
    {
        "path": "src/application/use-cases/user/group-play/start-game-group-play-group.use-case.ts",
        "patterns": [
            (r'\(competition as any\)', '(competition as ICompetitionDocument)'),
            (r'\(competitionEntity as any\)', '(competitionEntity as unknown as ICompetitionDocument)'),
            (r'import \{ CompetitionEntity \} from "\.\./\.\./\.\./\.\./domain/entities/competition\.entity";', 'import { CompetitionEntity } from "../../../../domain/entities/competition.entity";\nimport { ICompetitionDocument } from "../../../../infrastructure/db/types/documents";')
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
