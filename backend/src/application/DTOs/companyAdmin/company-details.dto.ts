export interface CompanyDetailsDTO {
    company: {
        _id: string;
        companyName: string;
        email: string;
        address: string;
        number: string;
        OwnerId: string;
        planId: string;
        status: "active" | "inactive" | "pending" | "reject";
        rejectionReason?: string;
    };
    subscription: {
        id: string;
        name: string;
        price: number;
        duration: number;
        features: string[];
        type: "normal" | "company";
        userLimit?: number;
    };
}
