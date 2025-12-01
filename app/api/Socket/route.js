import socketHandler from "@/utils/Socket";


export async function GET(req, res) {
    return socketHandler(req, res);

}