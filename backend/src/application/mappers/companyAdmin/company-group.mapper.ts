import { CompanyGroupEntity } from "../../../domain/entities/company-group.entity";
import { CompanyGroupDetailsDTO, CompanyGroupMemberDTO } from "../../DTOs/companyAdmin/company-group-details.dto";
import { UserEntity } from "../../../domain/entities/user.entity";

export class CompanyGroupMapper {
  static toDetailsDTO(
    group: CompanyGroupEntity,
    members: (UserEntity & { wpm: number; accuracy: number })[]
  ): CompanyGroupDetailsDTO {
    return {
      id: group.getId() || "",
      companyId: group.getCompanyId(),
      name: group.getName(),
      type: group.getType(),
      members: members.map(member => ({
        _id: member._id || "",
        name: member.name,
        email: member.email,
        imageUrl: member.imageUrl,
        CompanyId: member.CompanyId,
        wpm: member.wpm,
        accuracy: member.accuracy,
      })),
    };
  }
}
