import Navbar from "@/Components/Navbar";
import clientPromise from "@/lib/mongodb";

export default async function BlogPostPage({ params }) {
    const awaitedParams = await params;
  const { handle } = awaitedParams;
  // const { handle } = params;

  const client = await clientPromise;
  const db = client.db("Daplink");
  const collection = db.collection("links");
  const data = await collection.findOne({ handle });

  if (!data) {
    return (
      <>
        <Navbar />
        <p>User not found</p>
      </>
    );
  }

  return (
    <>
      <Navbar />



      <body className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 ">
      <div className="flex flex-col items-center justify-center w-full md:h-screen h-[60vw] md:mt-16 mt-100  bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-6">
  <div className="profile-card flex flex-col items-center bg-white max-w-[90%] w-[22rem]  rounded-2xl shadow-2xl p-8 transition-transform duration-300 hover:scale-105">
    
    {/* Profile Photo */}
    <div className="photo mb-6">
      <img
        className="rounded-full w-32 h-32 object-cover ring-4 ring-amber-200 shadow-md"
        src={data.profile}
        alt="Profile Photo"
      />
    </div>

    {/* Username */}
    <h1 className="text-gray-900 font-extrabold text-2xl mb-2 tracking-wide">
      @{data.handle}  
    </h1>

    {/* Description */}
    <p className="desc text-gray-600 text-center text-base leading-relaxed mb-6">
      {data.script}
    </p>

    {/* Links */}
    <div className="links flex flex-col w-full gap-3">
      {data.links.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
        >
          {item.linktext}
        </a>
      ))}
    </div>
    
  </div>
</div>

      </body>
    </>
  );
}

