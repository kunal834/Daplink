"use client"
import React from 'react'

const Skillstab = ({ skilloffered, setskillsoffered , skillsseek, setskillsseek , newSkillOffered, setNewSkillOffered , newSkillSeek, setNewSkillSeek}) => {


    //  const [skilloffered, setskillsoffered] = useState(["Web Design", "React Development", "UI/UX"]);
    //     const [skillsseek, setskillsseek] = useState(["Backend Development", "Mobile Apps", "DevOps"]);
    //     const [newSkillOffered, setNewSkillOffered] = useState(''); // New input state
    //     const [newSkillSeek, setNewSkillSeek] = useState(''); // New input state


     // Helper function to add a skill
    const addSkill = (skill, setState, newStateValue, setNewStateValue) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !newStateValue.includes(trimmedSkill)) {
            setState([...newStateValue, trimmedSkill]);
            setNewStateValue('');
        }
    };

    // Helper function to remove a skill
    const removeSkill = (index, setState, currentStateValue) => {
        setState(currentStateValue.filter((_, i) => i !== index));
    };
  return (
    <>
    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">Skill Exchange</h2>

            <div className="space-y-8">
                {/* --- Skills I'm Offering Section --- */}
                <div>
                    <label className="text-base font-medium text-gray-700 block mb-3">
                        {`Skills I'm Offering`}
                    </label>

                    {/* Current Skills Chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skilloffered.map((skill, index) => (
                            <span key={`off-${index}`} className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full cursor-pointer"
                                onClick={() => removeSkill(index, setskillsoffered, skilloffered)}>
                                <span>{skill}</span>
                                <span className="text-xs font-bold">×</span>
                            </span>
                        ))}
                    </div>

                    {/* Add Skill Input */}
                    <div className="flex items-center space-x-2">
                        <input
                            value={newSkillOffered}
                            onChange={e => setNewSkillOffered(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill(newSkillOffered, setskillsoffered, skilloffered, setNewSkillOffered);
                                }
                            }}
                            type="text"
                            className='flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='Add a skill...'
                        />
                        <button
                            onClick={() => addSkill(newSkillOffered, setskillsoffered, skilloffered, setNewSkillOffered)}
                            className='bg-black text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition'
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* --- Skills I'm Seeking Section --- */}
                <div>
                    <label className="text-base font-medium text-gray-700 block mb-3">
                        {` Skills I'm Seeking`}
                    </label>

                    {/* Current Skills Chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {skillsseek.map((skill, index) => (
                            <span key={`seek-${index}`} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full cursor-pointer"
                                onClick={() => removeSkill(index, setskillsseek, skillsseek)}>
                                <span>{skill}</span>
                                <span className="text-xs font-bold">×</span>
                            </span>
                        ))}
                    </div>

                    {/* Add Skill Input */}
                    <div className="flex items-center space-x-2">
                        <input
                            value={newSkillSeek}
                            onChange={e => setNewSkillSeek(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSkill(newSkillSeek, setskillsseek, skillsseek, setNewSkillSeek);
                                }
                            }}
                            type="text"
                            className='flex-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='Add a skill...'
                        />
                        <button
                            onClick={() => addSkill(newSkillSeek, setskillsseek, skillsseek, setNewSkillSeek)}
                            className='bg-black text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition'
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Skillstab
