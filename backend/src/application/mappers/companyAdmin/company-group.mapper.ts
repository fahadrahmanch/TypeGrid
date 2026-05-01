import { CompanyGroupDTO } from "../../DTOs/companyAdmin/company-group.dto";
import { CompanyGroupEntity } from "../../../domain/entities/company-group.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { CompanyGroupDetailsDTO } from "../../DTOs/companyAdmin/company-group-details.dto";
export const mapCompanyGroupToDTO = (group: CompanyGroupEntity): CompanyGroupDTO => {
  return {
    _id: group.getId(),
    groupName: group.getName(),
    groupType: group.getType(),
    selectedUsers: group.getMembers(),
  };
};

export const mapCompanyGroupToDetailsDTO = (
  group: CompanyGroupEntity,
  members: (UserEntity & { wpm: number; accuracy: number })[]
): CompanyGroupDetailsDTO => {
  return {
    id: group.getId() || "",
    companyId: group.getCompanyId(),
    name: group.getName(),
    type: group.getType(),
    members: members.map((member) => ({
      _id: member._id || "",
      name: member.name,
      email: member.email,
      imageUrl: member.imageUrl,
      CompanyId: member.CompanyId,
      wpm: member.wpm,
      accuracy: member.accuracy,
    })),
  };
};
