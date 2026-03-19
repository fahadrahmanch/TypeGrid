import { ResultEntity } from "../../entities/result.entity";
import { IBaseRepository } from "./base-repository.interface";

// export interface IResultRepository {
//       create(data: any): Promise<ResultEntity>;
//       findById(
//         id: string,
//         options?: {
//           populate?: any;
//         },
//       ): Promise<ResultEntity | null>;
//       update(data: any): Promise<ResultEntity | null>;
//       find(
//         filter?: any,
//         options?: {
//           populate?: { path: string; select?: string };
//         },
//       ): Promise<ResultEntity[]>;
//       findOne(filter?: any): Promise<ResultEntity | null>;
//       delete(_id: string): Promise<ResultEntity | null>;
//       updateById(_id: string, updateQuery: any): Promise<ResultEntity | null>;
// }


export interface IResultRepository extends IBaseRepository<ResultEntity> {}