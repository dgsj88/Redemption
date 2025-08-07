import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const target = await prisma.post.findUnique({where: {
        id: (await params).id
    }})
}
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }){

}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

}