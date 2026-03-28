import type { Request, Response } from 'express';
export declare const createCase: (req: any, res: Response) => Promise<void>;
export declare const getCases: (req: Request, res: Response) => Promise<void>;
export declare const getCase: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCase: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=caseController.d.ts.map