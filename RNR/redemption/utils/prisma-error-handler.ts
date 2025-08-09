import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function prismaErrorHandler(error: PrismaClientKnownRequestError){
    switch(error.code){
        default:
            return {
                error: `Unhandled Prisma error: ${error.code}`,
                status: 500
            } 
    }
} 