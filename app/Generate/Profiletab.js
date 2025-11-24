"use state"
import React from 'react'


const Profiletab = ( { handle , sethandle ,  profile ,setprofile, script , setscript} ) => {

    // --- State Management ---
    // const SearchParams = useSearchParams()
    //  const [handle, sethandle] = useState(SearchParams.get('handle') || "")
    // const [profile, setprofile] = useState("")
    // const [script, setscript] = useState("")
   
   

  return (
    
    <>
    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h2>
            <div className="space-y-6">

                {/* Picture Link */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Picture URL</label>
                    <input
                        value={profile || ""}
                        onChange={e => setprofile(e.target.value)}
                        type="url"
                        placeholder="Enter Link to your Picture"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Handle Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Handle</label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100">{`daplink.com/`}</span>
                        <input
                            value={handle || ""}
                            onChange={e => { sethandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')) }}
                            type="text"
                            className="flex-1 p-3 focus:outline-none"
                            placeholder='Choose a Handle'
                        />
                    </div>
                </div>

                {/* Description/Bio */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{`Bio / Description`}</label>
                    <textarea
                        value={script || ""}
                        onChange={e => { setscript(e.target.value) }}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder='Write about yourself (e.g., Designer & Developer | Building cool stuff)'
                    />
                </div>
            </div>
        </section>
    </>
  )
}

export default Profiletab
