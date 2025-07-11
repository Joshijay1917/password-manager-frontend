import React, { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordarray, setpasswordarray] = useState([])
    const passref = useRef()
    const passwordinputref = useRef()

    const getpasswords = async () => {
        let req = await fetch('https://password-manager-jay.up.railway.app/')
        let passwords = await req.json();
        if (passwords) {
            setpasswordarray(passwords)
        }
    }

    useEffect(() => {
        getpasswords();
    }, [])

    const showPassword = () => {

        if (passref.current.src.includes("show.jpg")) {
            passwordinputref.current.type = "password"
            passref.current.src = "hide.jpg"
        }
        else {
            passwordinputref.current.type = "text"
            passref.current.src = "show.jpg"
        }
    }

    const savePassword = async() => {
        if (form.site.length >= 3 && form.username.length >= 3 && form.password.length >= 3) {
            let id = uuidv4()
            setpasswordarray([...passwordarray, { ...form, id }])
            // localStorage.setItem("passwords", JSON.stringify([...passwordarray, { ...form, id }]))
            await fetch('https://password-manager-jay.up.railway.app/', {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...form, id })})
            setform({ site: "", username: "", password: "" })
            console.log([...passwordarray, { ...form, id }]);
        }
        else{
            alert("Error:Password not saved!");
        }
    }

    const deletePassword = async(id) => {
        console.log("delete pass with id=" + id);
        let c = confirm("Do you really want to delete?")
        if (c) {
            setpasswordarray(passwordarray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordarray.filter(item => item.id !== id)))
            let res = await fetch('https://password-manager-jay.up.railway.app/', {method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id})})
        }

    }

    const editPassword = async(id) => {
        console.log("edit pass with id=" + id);
        setform(passwordarray.filter(item => item.id === id)[0])
        setpasswordarray(passwordarray.filter(item => item.id !== id))
        let res = await fetch('https://password-manager-jay.up.railway.app/', {method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id})})
    }

    const copytext = (text) => {
        navigator.clipboard.writeText(text);
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    return (
        <>
            <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"></div></div>
            <div className=" custom-scrollbar max-md:bg-gradient-to-t from-gray-400 to-gray-200 h-full pt-[15vh] px-[4vw] md:px-[15vw] mycontainer w-full">
                <h1 className='text-4xl font-bold text-center'>
                    <span className="text-blue-500">&lt;</span>
                    Pass
                    <span className="text-blue-500">OP/&gt;</span>
                </h1>
                <p className='text-blue-400 text-lg text-center'>Your own password manager</p>
                <div className="flex flex-col p-4 text-black gap-5 items-center">
                    <input value={form.site} onChange={handlechange} className='rounded-full border border-blue-500 w-full p-4 py-1' type="text" name='site' placeholder='Enter website URL' />
                    <div className="flex w-full justify-between gap-8 flex-col md:flex-row">
                        <input value={form.username} onChange={handlechange} type="text" className='rounded-full border border-blue-500 w-full p-4 py-1' name='username' placeholder='Enter username' />
                        <div className="relative">
                            <input ref={passwordinputref} value={form.password} onChange={handlechange} type="password" className='rounded-full border border-blue-500 w-full p-4 py-1' name='password' placeholder='Enter password' />
                            <span className='absolute right-2 py-0.5 cursor-pointer' onClick={showPassword}>
                                <img ref={passref} className='w-7 h-7' src="hide.jpg" alt="" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='copybutton flex justify-center items-center rounded-full bg-blue-200 hover:bg-blue-400 hover:cursor-pointer py-2 px-4 w-fit gap-2 border border-blue-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/sbnjyzil.json"
                            trigger="hover">
                        </lord-icon>Save</button>
                </div>
                <div className="passwords pb-[8vh]">
                    <h2 className='font-bold text-2xl py-4'>Your passwords</h2>
                    {passwordarray.length == 0 && <div>No passwords to show</div>}
                    {passwordarray.length != 0 &&
                        <table className='table-auto w-full rounded-md overflow-hidden'>
                            <thead className='bg-blue-800 text-white'>
                                <tr>
                                    <th className='py-3'>Site</th>
                                    <th className='py-3'>Username</th>
                                    <th className='py-3'>Password</th>
                                    <th className='py-3'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-blue-100'>
                                {passwordarray.map(item => {
                                    return <tr key={item.id}>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="copybutton flex justify-center items-center" onClick={() => copytext(item.site)}>
                                                <a className='text-nowrap max-w-[20vw] overflow-clip' href={item.site} target="_blank">{item.site}</a>
                                                <div className="cursor-pointer">
                                                    <img className='w-[25px] h-[25px] pt-[4px] pl-[6px]' src="copy.png" alt="" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="copybutton flex justify-center items-center" onClick={() => copytext(item.username)}>
                                                <span className='text-nowrap w-[50%] overflow-clip'>{item.username}</span>
                                                <div className="cursor-pointer">
                                                    <img className='w-[25px] h-[25px] pt-[4px] pl-[6px]' src="copy.png" alt="" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <div className="copybutton flex justify-center items-center" onClick={() => copytext(item.password)}>
                                                <span className='text-nowrap w-[50%] overflow-clip'>{"*".repeat(item.password.length)}</span>
                                                <div className="cursor-pointer">
                                                    <img className='w-[25px] h-[25px] pt-[4px] pl-[6px]' src="copy.png" alt="" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className='text-center py-2 border border-white'>
                                            <span className='flex justify-center items-center gap-2'>
                                                <img onClick={() => editPassword(item.id)} className='edit w-[25px] h-[25px] pt-[4px] pl-[6px]' src="edit.png" alt="" />
                                                <img onClick={() => deletePassword(item.id)} className='delete w-[25px] h-[25px] pt-[4px] pl-[6px]' src="delete.png" alt="" />
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                </div>
            </div>
        </>
    )
}

export default Manager
