
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  const client = await clientPromise;
    const body = await request.json()
    const db = client.db("Daplink")
    const collection = db.collection("links")
    // if handle is already exist u can not created daplink is already present 
    const doc = await collection.findOne({handle: body.handle})
    if(doc){
      return Response.json({success: false, error: true,  message: 'daplink already exists!' , result: null})
    }
    const result = await collection.insertOne(body)
    return Response.json({ success:  true, error:false ,message: 'daplink created', result: result  })
  
}


