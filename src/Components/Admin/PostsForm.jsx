import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import PostHook from '../StudyContext';
import img1 from '../../Images/AddPosts.png';
import { toast } from 'react-toastify';

const { Option } = Select;

export default function PostsForm() {
    const [dep, setDep] = useState([]);
    const [sem, setSem] = useState([]);
    const [subject, setsubject] = useState([]);
    const [selectedDep, setSelectedDep] = useState('');
    const [selectedSem, setSelectedSem] = useState('');
    const [selectedSub, setSelectedSub] = useState('');
    const [name, setname] = useState("");
    const [file, setFile] = useState(null); // New state for PDF file
    const { posts } = PostHook();
    const server = import.meta.env.VITE_SERVER;

    // Fetch all departments
    const allDep = async () => {
        try {
            const response = await axios.get(`${server}/api/v2/all-dep`);
            setDep(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch semesters based on selected department
    const allSem = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/sem/${selectedDep}`);
            setSem(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch subjects based on selected semester
    const allsub = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/get-sub/${selectedSem}`);
            setsubject(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Handle selection changes
    const handleDepChange = (value) => setSelectedDep(value);
    const handlesemchange = (value) => setSelectedSem(value);
    const handlesubchange = (value) => setSelectedSub(value);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "learning_repo"); 

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dtcg2kqg9/upload`,
                formData
            );
            return res.data.secure_url;
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            toast.error("Failed to upload PDF");
            return null;
        }
    };

    // Handle form submission
    const Postnotes = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        try {
            const pdfUrl = await uploadToCloudinary(file);
            if (!pdfUrl) return;

            const { data } = await axios.post(`${server}/api/v1/create-${posts}`, {
                name,
                link: pdfUrl,
                subject: selectedSub
            });

            if (data?.success) {
                toast.success(`${posts} uploaded successfully`);
                // Reset form
                setname("");
                setFile(null);
                setSelectedDep("");
                setSelectedSem("");
                setSelectedSub("");
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => { allDep(); }, []);
    useEffect(() => { if (selectedDep) allSem(); }, [selectedDep]);
    useEffect(() => { if (selectedSem) allsub(); }, [selectedSem]);

    return (
        <div className="w-100 mt-16 justify-center max-xl:px-2 xl:px-52 md:pb-52 max-md:pb-4">
            <div className="w-[100%] flex md:flex-row max-md:flex-col p-3 bg-white shadow-xl rounded-md">
                <div className="w-[40%] max-md:w-[100%] h-[200px] bg-slate-200">
                    <img src={img1} className="md:h-[100%] w-100 max-md:w-[100%] max-md:h-[100%] rounded-md" alt="Add Posts" />
                </div>
                <div className="w-[60%] max-md:w-[100%] max-md:h-[70%] max-md:pb-16 md:h-auto text-center text-2xl font-semibold p-10 max-md:p-5 bg-white">
                    <h1 className="font underline underline-offset-2">Add New {posts}</h1>
                    <div className="mt-10 text-xl justify-center font-normal">
                        {/* Department Selection */}
                        <div className="flex max-md:flex-col justify-center items-center md:flex-row">
                            <label className='max-md:w-[100%] font-semibold'>Select department:</label>
                            <Select
                                className="max-md:w-[80%] md:w-[57%] h-max font-semibold text-2xl m-0 md:ml-1"
                                onChange={handleDepChange}
                                value={selectedDep}
                            >
                                {dep.map((s) => (
                                    <Option key={s._id} value={s._id}>{s.name}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mt-5 flex max-md:flex-col justify-center items-center md:flex-row">
                            <label htmlFor="semesters" className='font-semibold'>Choose Semester:</label>
                            <Select
                                id="semesters"
                                className="max-md:w-[80%] md:w-[57%] font-semibold md:ml-3 focus:outline-none"
                                value={selectedSem}
                                onChange={handlesemchange}
                            >
                                <Option value="">Select</Option>
                                {sem.sem && Array.isArray(sem.sem) && sem.sem.map((s) => (
                                    <Option key={s._id} value={s._id}>{s.number}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mt-5 flex max-md:flex-col justify-center items-center md:flex-row">
                            <label htmlFor="subjects" className='font-semibold'>Choose Subject:</label>
                            <Select
                                id="subjects"
                                className="max-md:w-[80%] md:w-[57%] font-semibold md:ml-7 focus:outline-none"
                                value={selectedSub}
                                onChange={handlesubchange}
                            >
                                <Option value="">Select</Option>
                                {subject.subject && Array.isArray(subject.subject) && subject.subject.map((sp) => (
                                    <Option key={sp._id} value={sp._id}>{sp.name}</Option>
                                ))}
                            </Select>
                        </div>

                        {/* Form */}
                        <form onSubmit={Postnotes} className="mt-5 flex flex-col items-center">
                            <input
                                type="text"
                                className="w-[100%] max-md:w-[90%] border-b-2 border-yellow-400 text-black focus:outline-none focus:border-yellow-400 text-lg p-1 placeholder:text-slate-500 mt-3"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                            <input
                                type="file"
                                accept="application/pdf"
                                className="w-[100%] max-md:w-[90%] border-b-2 border-yellow-400 text-black focus:outline-none focus:border-yellow-400 text-lg p-1 placeholder:text-slate-500 mt-3"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                            {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                            <button className="w-[100%] max-md:w-[90%] mt-12 p-2 text-lg bg-yellow-400 hover:bg-yellow-300 rounded-lg">
                                Upload
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
